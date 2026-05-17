import { useCallback, useEffect, useRef, useState } from 'react'
import Canvas, { CANVAS_VIRTUAL_W } from '../shell/Canvas'
import { useComposeState, resolveColor, COVER_TYPES, CANVAS_W, CANVAS_H } from './state'
import LayerRenderer from './LayerRenderer'
import SelectionOverlay from './SelectionOverlay'
import { matchAny } from '../state/keymap'
import { useTool } from '../state/tools'
import { useColorTarget } from '../color/useColorTarget'
import { computeSnapTargets, findSnap } from './snap'

/* Per-tool cursor on the canvas stage. Using system cursors directly —
 * `crosshair` for shape-creation tools (Photoshop/Figma convention),
 * `cell` for pattern (suggests grid drag-fill), `text` for the text
 * insertion I-beam. Custom SVG cursors were attempted but Vite's `?url`
 * + browser SVG-cursor support is fragile across environments; the
 * system cursors are universally reliable and read instantly. */
const CURSOR_FOR_TOOL = {
  rect:    'crosshair',
  ellipse: 'crosshair',
  pattern: 'cell',
  text:    'text',
}

/**
 * CanvasArea — rendered composition + Figma-style pointer router.
 *
 * Mouse routing (mousedown):
 *   • [data-handle] inside the selected overlay  → start a resize drag.
 *   • [data-layer-id] non-cover layer            → select + start a move drag.
 *   • [data-layer-id] cover layer                → select only.
 *   • empty stage                                → deselect.
 *
 * Drag state lives in a ref-backed scratch object so listeners attached to
 * window don't have to rebind on every render. Pixel deltas are divided by
 * the live scale (screen-px / virtual-px) to keep movement 1:1 with the
 * cursor regardless of viewport zoom.
 *
 * Keyboard (when a positioned layer is selected):
 *   • Arrow keys   — nudge ±1 virtual px (±10 with Shift)
 *   • Backspace/Del— remove layer
 *   • Escape       — deselect
 */
const SOCIAL_ASPECTS = ['1:1', '4:5', '9:16']

/* hex (#RRGGBB) + alpha (0..1) → rgba() string. Used to apply canvas fill
 * opacity at render time without storing alpha in the color value. */
function hexWithAlpha(hex, alpha) {
  if (!hex || typeof hex !== 'string') return hex
  const m = hex.replace('#', '')
  if (m.length !== 6) return hex
  const r = parseInt(m.slice(0, 2), 16)
  const g = parseInt(m.slice(2, 4), 16)
  const b = parseInt(m.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function CanvasArea() {
  const {
    aspect, view, layers, palette,
    canvasFill, canvasFillOpacity,
    selectedId, selectedIds, select, toggleSelection, selectMany,
    addLayer,
    updateLayer, removeLayer, deleteSelected, duplicateLayer, toggleLayer, toggleLayerLock,
    groupLayers, ungroupLayer,
    insertFromLibrary,
    activePaint, setActivePaint,
    snapEnabled,
    undo, redo, canUndo, canRedo,
    beginTransaction, commitTransaction,
  } = useComposeState()
  const { tool, setTool } = useTool()
  /* Paint shortcuts (D / X / Shift+X / N) write through useColorTarget so
   * the inspector, the picker, and the keymap share one writer. */
  const colorTarget = useColorTarget()

  const selectedLayer  = layers.find((l) => l.id === selectedId) ?? null
  const isPositionedSel = selectedLayer && !COVER_TYPES.includes(selectedLayer.type)

  /* All selected positioned layers — drives multi-wireframe rendering. */
  const selectedPositionedLayers = selectedIds
    .map((id) => layers.find((l) => l.id === id))
    .filter((l) => l && !COVER_TYPES.includes(l.type))
  const isMultiSel = selectedPositionedLayers.length > 1

  /* Canvas fill is now a frame-level property (was: background-typed layer).
   * Falls back to a legacy background layer's color if present, for in-flight
   * drafts that haven't been migrated. */
  const legacyBg     = layers.find((l) => l.type === 'background' && l.visible)
  const legacyBgHex  = legacyBg ? resolveColor(legacyBg.color, palette) : null
  const fillHex      = resolveColor(canvasFill, palette) ?? legacyBgHex
  const bgColor      = fillHex
    ? (canvasFillOpacity < 1 ? hexWithAlpha(fillHex, canvasFillOpacity) : fillHex)
    : null

  const visibleLayers = layers

  /* ─── stage ref + on-demand scale ───────────────────────────────────
   * Scale (screen-px / virtual-px) is computed fresh from the stage rect
   * on every coord conversion. Caching it via ResizeObserver was unsafe
   * because RO does NOT fire on CSS-transform changes (CanvasFrame applies
   * `transform: scale()` to a parent), so the cached value went stale on
   * window resize and silently broke drag-create position. */
  const stageRef = useRef(null)

  const getScale = useCallback(() => {
    const node = stageRef.current
    if (!node) return 1
    const w = node.getBoundingClientRect().width
    return w > 0 ? w / CANVAS_VIRTUAL_W : 1
  }, [])

  /* ─── drag state ─── */
  const [drag, setDrag] = useState(null)
  /* drag = { mode: 'move' | 'resize-NW|N|NE|E|SE|S|SW|W',
              layerId, startX, startY, startBox: {x,y,w,h} }
   *  | { mode: 'create', tool, startVX, startVY, vx, vy, vw, vh }
   *  | { mode: 'marquee', additive, startVX, startVY, vx, vy, vw, vh } */

  /* Snap guides — {h, v} positions in virtual px while a move-drag is
   * actively snapping to a target. Cleared on pointerup. */
  const [snapGuides, setSnapGuides] = useState(null)

  /* Line tool — pen-style placement. First click sets P1; second click
   * commits a line layer between P1 and P2. linePreview tracks the cursor
   * for the preview line that follows between clicks. Esc cancels.
   * Switching tools also cancels (effect below). */
  const [linePlacement, setLinePlacement] = useState(null) /* { x1, y1 } | null */
  const [linePreview, setLinePreview]     = useState(null) /* { vx, vy } | null */

  /* Convert a clientX/Y point to virtual canvas coords. Scale read fresh
   * each call so the math is self-consistent with the rect we just took. */
  const clientToVirtual = useCallback((clientX, clientY) => {
    const node = stageRef.current
    if (!node) return { vx: 0, vy: 0 }
    const rect = node.getBoundingClientRect()
    const s = (rect.width / CANVAS_VIRTUAL_W) || 1
    return {
      vx: (clientX - rect.left) / s,
      vy: (clientY - rect.top)  / s,
    }
  }, [])

  const onStageMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    /* Prevent the document-level click-away listener from clobbering this
     * canvas selection. */
    e.nativeEvent.stopPropagation()

    /* Line is a pen tool — click-click instead of drag. First click sets
     * P1; second click commits the layer between the two endpoints. */
    if (tool === 'line') {
      e.preventDefault()
      const { vx, vy } = clientToVirtual(e.clientX, e.clientY)
      if (!linePlacement) {
        setLinePlacement({ x1: vx, y1: vy })
        setLinePreview({ vx, vy })
        return
      }
      const x1 = linePlacement.x1
      const y1 = linePlacement.y1
      const x2 = vx
      const y2 = vy
      const x  = Math.min(x1, x2)
      const y  = Math.min(y1, y2)
      const w  = Math.max(1, Math.abs(x2 - x1))
      const h  = Math.max(1, Math.abs(y2 - y1))
      /* Slope picks which bbox diagonal renders. '\' → ↘ from top-left,
       * '/' → ↙ from bottom-left. Derived from the sign of (P2 - P1). */
      const slope = ((x2 >= x1) === (y2 >= y1)) ? '\\' : '/'
      addLayer('shape', {
        x, y, w, h,
        kind: 'line',
        slope,
        color: null,
        stroke: 'palette:dark',
        strokeWidth: 2,
      })
      setLinePlacement(null)
      setLinePreview(null)
      setTool('select')
      return
    }

    /* Non-Select tools enter create mode — ignore handles/layers underneath
     * and start drawing transient bounds. */
    if (tool !== 'select') {
      e.preventDefault()
      const { vx, vy } = clientToVirtual(e.clientX, e.clientY)
      setDrag({ mode: 'create', tool, startVX: vx, startVY: vy, vx, vy, vw: 0, vh: 0 })
      return
    }

    const handleEl = e.target.closest('[data-handle]')
    /* Walk up to the OUTERMOST [data-layer-id] so clicking inside a group
     * selects the group itself, not the inner child. */
    let layerEl = e.target.closest('[data-layer-id]')
    while (layerEl?.parentElement) {
      const outer = layerEl.parentElement.closest?.('[data-layer-id]')
      if (!outer) break
      layerEl = outer
    }

    /* Resize handle wins. Locked layers ignore resize. */
    if (handleEl && selectedLayer && !COVER_TYPES.includes(selectedLayer.type) && !selectedLayer.locked) {
      const dir = handleEl.getAttribute('data-handle')
      e.preventDefault()
      beginTransaction()
      setDrag({
        mode: `resize-${dir}`,
        layerId: selectedLayer.id,
        startX: e.clientX, startY: e.clientY,
        startBox: {
          x: selectedLayer.x, y: selectedLayer.y, w: selectedLayer.w, h: selectedLayer.h,
          /* Aspect lock snapshot — read once at drag start so the user can
           * toggle it via the inspector mid-drag without breaking the
           * in-flight resize. null/undefined = unlocked. */
          aspectLocked: selectedLayer.aspectLocked,
        },
      })
      return
    }

    if (layerEl) {
      const id = layerEl.getAttribute('data-layer-id')
      const layer = layers.find((l) => l.id === id)
      if (!layer) return
      if (e.shiftKey) {
        toggleSelection(id)
        return
      }
      select(id)
      if (!COVER_TYPES.includes(layer.type) && !layer.locked) {
        e.preventDefault()
        beginTransaction()
        setDrag({
          mode: 'move',
          layerId: id,
          startX: e.clientX, startY: e.clientY,
          startBox: { x: layer.x, y: layer.y, w: layer.w, h: layer.h },
        })
      }
      return
    }

    /* Empty stage with the Select tool — start a marquee. Tiny drags
     * (≤ 4 vpx) commit as a click-deselect on pointerup. Shift-marquee
     * adds to the existing selection. */
    e.preventDefault()
    const { vx, vy } = clientToVirtual(e.clientX, e.clientY)
    setDrag({
      mode: 'marquee',
      additive: e.shiftKey,
      startVX: vx, startVY: vy,
      vx, vy, vw: 0, vh: 0,
    })
  }, [tool, layers, selectedLayer, select, toggleSelection, beginTransaction, clientToVirtual, linePlacement, addLayer, setTool])

  /* Window listeners while dragging. */
  useEffect(() => {
    if (!drag) return
    const onMove = (e) => {
      const s = getScale()

      if (drag.mode === 'create' || drag.mode === 'marquee') {
        const { vx, vy } = clientToVirtual(e.clientX, e.clientY)
        const x = Math.min(drag.startVX, vx)
        const y = Math.min(drag.startVY, vy)
        const w = Math.abs(vx - drag.startVX)
        const h = Math.abs(vy - drag.startVY)
        setDrag((d) => d && (d.mode === 'create' || d.mode === 'marquee') ? { ...d, vx: x, vy: y, vw: w, vh: h } : d)
        return
      }

      const dx = (e.clientX - drag.startX) / s
      const dy = (e.clientY - drag.startY) / s
      const { startBox, mode, layerId } = drag

      if (mode === 'move') {
        const cand = { x: startBox.x + dx, y: startBox.y + dy, w: startBox.w, h: startBox.h }
        if (!snapEnabled) {
          updateLayer(layerId, { x: cand.x, y: cand.y })
          return
        }
        const targets = computeSnapTargets(layers, layerId, CANVAS_W, CANVAS_H)
        const snap = findSnap(cand, targets)
        updateLayer(layerId, { x: cand.x + snap.dx, y: cand.y + snap.dy })
        setSnapGuides(snap.hGuide != null || snap.vGuide != null ? { h: snap.hGuide, v: snap.vGuide } : null)
        return
      }

      let { x, y, w, h } = startBox
      const dir = mode.slice('resize-'.length)
      if (dir.includes('E')) w = Math.max(8, startBox.w + dx)
      if (dir.includes('S')) h = Math.max(8, startBox.h + dy)
      if (dir.includes('W')) {
        const nw = Math.max(8, startBox.w - dx)
        x = startBox.x + (startBox.w - nw)
        w = nw
      }
      if (dir.includes('N')) {
        const nh = Math.max(8, startBox.h - dy)
        y = startBox.y + (startBox.h - nh)
        h = nh
      }
      /* Aspect lock — constrain w/h to the snapshot ratio. Corners pick
       * the driving axis by larger absolute change; edges drive on their
       * own axis. When N/W edges are involved, x/y get re-anchored so the
       * far corner stays put. */
      const ar = startBox.aspectLocked
      if (Number.isFinite(ar) && ar > 0) {
        const isCorner = dir.length === 2
        const driveW = isCorner
          ? Math.abs(w - startBox.w) >= Math.abs(h - startBox.h)
          : (dir === 'E' || dir === 'W')
        if (driveW) {
          h = Math.max(8, Math.round(w / ar))
          if (dir.includes('N')) y = startBox.y + startBox.h - h
        } else {
          w = Math.max(8, Math.round(h * ar))
          if (dir.includes('W')) x = startBox.x + startBox.w - w
        }
      }
      updateLayer(layerId, { x, y, w, h })
    }
    const onUp = () => {
      if (drag.mode === 'create') {
        commitCreateDrag(drag)
        setDrag(null)
        return
      }
      if (drag.mode === 'marquee') {
        commitMarqueeDrag(drag)
        setDrag(null)
        return
      }
      commitTransaction()
      setDrag(null)
      setSnapGuides(null)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    // commitCreateDrag is closed over below; re-include via deps would force
    // the listener to rebind every render. Stable enough for v1.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag, updateLayer, commitTransaction, clientToVirtual, getScale])

  /* Pen-tool live preview — tracks the cursor between the two clicks so
   * the user sees a dashed preview line snapping with their pointer. */
  useEffect(() => {
    if (!linePlacement) return
    const onMove = (e) => {
      const { vx, vy } = clientToVirtual(e.clientX, e.clientY)
      setLinePreview({ vx, vy })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [linePlacement, clientToVirtual])

  /* Esc cancels an in-progress line placement. Capture phase so we beat
   * the editor-level deselect handler. */
  useEffect(() => {
    if (!linePlacement) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        setLinePlacement(null)
        setLinePreview(null)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [linePlacement])

  /* Switching to a different tool while line placement is in flight
   * cancels the placement. */
  useEffect(() => {
    if (tool !== 'line' && linePlacement) {
      setLinePlacement(null)
      setLinePreview(null)
    }
  }, [tool, linePlacement])

  /* Commit a marquee-drag — find every layer whose AABB intersects the
   * marquee rect and select them. Tiny drags (≤ 4 vpx in either axis) fall
   * through as a plain click-deselect (or no-op when shift-additive). */
  const commitMarqueeDrag = useCallback((d) => {
    if (d.mode !== 'marquee') return
    if (d.vw < 4 && d.vh < 4) {
      if (!d.additive) select(null)
      return
    }
    const matched = layers
      .filter((l) => typeof l.x === 'number' && typeof l.y === 'number')
      .filter((l) => {
        const lw = l.w ?? 0
        const lh = l.h ?? 0
        return l.x < d.vx + d.vw && l.x + lw > d.vx && l.y < d.vy + d.vh && l.y + lh > d.vy
      })
      .map((l) => l.id)
    selectMany(matched, { additive: d.additive })
  }, [layers, select, selectMany])

  /* Commit a create-drag — instantiate the matching layer at the dragged
   * bounds and revert to the Select tool. Tiny drags (likely a mis-click)
   * fall through to a default-sized insert at the click point. */
  const commitCreateDrag = useCallback((d) => {
    if (d.mode !== 'create') return
    const tooSmall = d.vw < 8 || d.vh < 8
    let x = Math.max(0, Math.min(CANVAS_W - 8, d.vx))
    let y = Math.max(0, Math.min(CANVAS_H - 8, d.vy))
    let w = d.vw
    let h = d.vh
    if (tooSmall) {
      /* Default sizes per tool when the user just clicks. */
      const defaults = {
        text:     { w: 600, h: 120 },
        rect:     { w: 240, h: 240 },
        ellipse:  { w: 240, h: 240 },
        triangle: { w: 240, h: 240 },
        polygon:  { w: 240, h: 240 },
        star:     { w: 240, h: 240 },
        pattern:  { w: CANVAS_W, h: CANVAS_H },
      }
      const def = defaults[d.tool] ?? { w: 200, h: 200 }
      w = def.w; h = def.h
      x = Math.max(0, Math.min(CANVAS_W - w, d.startVX - w / 2))
      y = Math.max(0, Math.min(CANVAS_H - h, d.startVY - h / 2))
    }

    const extras = { x, y, w, h }
    switch (d.tool) {
      case 'text':     addLayer('text',    extras); break
      case 'rect':     addLayer('shape',   { ...extras, kind: 'rect',     color: 'palette:dark' }); break
      case 'ellipse':  addLayer('shape',   { ...extras, kind: 'ellipse',  color: 'palette:dark' }); break
      case 'triangle': addLayer('shape',   { ...extras, kind: 'triangle', color: 'palette:dark' }); break
      /* line is pen-tool only — never reaches commitCreateDrag (the
       * tool === 'line' branch in onStageMouseDown short-circuits). */
      case 'polygon':  addLayer('shape',   { ...extras, kind: 'polygon',  sides: 5, color: 'palette:dark' }); break
      case 'star':     addLayer('shape',   { ...extras, kind: 'star',     points: 5, innerRatio: 0.5, color: 'palette:dark' }); break
      case 'pattern':  addLayer('pattern', extras); break
      default: return
    }
    setTool('select')
  }, [addLayer, setTool])

  /* Click-away to deselect.
   *
   *  - When 'canvas' is selected and the click is INSIDE the Layers panel
   *    (`[data-layer-stack]`) but NOT on the Canvas row, deselect. Lets the
   *    user click empty space in the layer stack to drop canvas selection.
   *    Inspector / color wheel / opacity slider / rails outside the stack
   *    keep the selection so canvas properties can be edited.
   *  - Otherwise (regular layer selected), clicks inside any layer row, the
   *    canvas surface, or either rail are kept. Clicks elsewhere deselect. */
  useEffect(() => {
    const onDocDown = (e) => {
      if (e.button !== 0) return

      if (selectedIds.includes('canvas')) {
        const insideStack = e.target.closest?.('[data-layer-stack]')
        if (insideStack) {
          const onCanvasRow  = e.target.closest?.('[data-layer-id="canvas"]')
          const onAnyRow     = e.target.closest?.('.ac-compose-layer-row')
          const onButton     = e.target.closest?.('button')
          /* Buttons inside the stack (Add layer [+], Trash, Group, lock/eye)
           * never deselect canvas on click — they perform actions on the
           * current selection or open menus. The [+] dropdown then commits
           * a new layer via addLayer which replaces selection naturally. */
          if (!onCanvasRow && !onAnyRow && !onButton) select(null)
          return
        }
        /* outside the stack: fall through to default rules — keep selection
         * for inspector / wheel / canvas / rails */
      }

      /* Single attr check — anything inside the editor shell keeps
       * selection. New rails / panels are covered automatically by being
       * mounted inside `<EditorShell data-editor-keep-selection>`. */
      if (e.target.closest?.('[data-editor-keep-selection]')) return
      select(null)
    }
    document.addEventListener('mousedown', onDocDown)
    return () => document.removeEventListener('mousedown', onDocDown)
  }, [select, selectedIds])

  /* Keyboard handler — dispatches matched shortcuts from `state/keymap.js`.
   * Skips when typing into an input. */
  useEffect(() => {
    const layerOnlyIds = () => selectedIds.filter((id) => id !== 'canvas')

    const onKey = (e) => {
      const t = e.target
      const editable = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
      if (editable) return

      const shortcut = matchAny(e)
      if (!shortcut) return

      const layer = selectedLayer

      switch (shortcut.id) {
        /* undo / redo / deselect are handled by useGlobalShortcuts at the
         * Editor.jsx level so they work in every mode. Don't double-handle
         * here. */
        case 'undo':
        case 'redo':
        case 'redo-alt':
        case 'deselect':
          return

        case 'duplicate':   if (layer) { e.preventDefault(); duplicateLayer(layer.id) }; return

        case 'delete-back':
        case 'delete-fwd': {
          if (layerOnlyIds().length === 0) return
          e.preventDefault()
          deleteSelected()
          return
        }

        case 'group': {
          const ids = layerOnlyIds()
          if (ids.length >= 2) { e.preventDefault(); groupLayers(ids) }
          return
        }
        case 'ungroup': {
          if (layer && layer.type === 'group') { e.preventDefault(); ungroupLayer(layer.id) }
          return
        }

        case 'toggle-lock':       if (layer) { e.preventDefault(); toggleLayerLock(layer.id) }; return
        case 'toggle-visibility': if (layer) { e.preventDefault(); toggleLayer(layer.id) }; return

        case 'nudge-left':
        case 'nudge-right':
        case 'nudge-up':
        case 'nudge-down':
        case 'nudge-left-10':
        case 'nudge-right-10':
        case 'nudge-up-10':
        case 'nudge-down-10': {
          if (!layer || !isPositionedSel) return
          e.preventDefault()
          const step = shortcut.id.endsWith('-10') ? 10 : 1
          const axis = shortcut.id.includes('left') ? [-1, 0]
                     : shortcut.id.includes('right') ? [1, 0]
                     : shortcut.id.includes('up') ? [0, -1]
                     : [0, 1]
          updateLayer(layer.id, { x: layer.x + axis[0] * step, y: layer.y + axis[1] * step })
          return
        }

        case 'show-shortcuts':
          e.preventDefault()
          window.dispatchEvent(new CustomEvent('kol:show-shortcuts'))
          return

        case 'tool-select':  e.preventDefault(); setTool('select');  return
        case 'tool-text':    e.preventDefault(); setTool('text');    return
        case 'tool-rect':    e.preventDefault(); setTool('rect');    return
        case 'tool-ellipse': e.preventDefault(); setTool('ellipse'); return
        case 'tool-pattern': e.preventDefault(); setTool('pattern'); return

        /* Color shortcuts always fire — no selection-dependent gates.
         * SwatchStack is canonical app-level state; writes propagate to
         * selection when applicable but never depend on it. */
        case 'paint-default': {
          e.preventDefault()
          beginTransaction()
          colorTarget.setFill('#FFFFFF')
          colorTarget.setStroke('#000000')
          commitTransaction()
          return
        }
        case 'paint-toggle': {
          e.preventDefault()
          colorTarget.swap()
          return
        }
        case 'paint-swap': {
          e.preventDefault()
          const f = colorTarget.fillRaw
          const s = colorTarget.strokeRaw
          beginTransaction()
          colorTarget.setFill(s)
          colorTarget.setStroke(f)
          commitTransaction()
          return
        }
        case 'paint-clear': {
          e.preventDefault()
          colorTarget.onChange(null)
          return
        }

        default: return
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    selectedLayer, selectedIds, isPositionedSel,
    select, removeLayer, deleteSelected, updateLayer, duplicateLayer, toggleLayer, toggleLayerLock,
    groupLayers, ungroupLayer,
    colorTarget, beginTransaction, commitTransaction,
    undo, redo, canUndo, canRedo, setTool,
  ])

  if (view === 'social') {
    /* Multi-aspect preview — same composition rendered at 1:1 / 4:5 / 9:16
     * side by side. Read-only: drag/resize/select live in single view.
     * Each frame has its own letterbox; they share width by flex-1. */
    return (
      <div className="w-full h-full p-4 flex items-center justify-center gap-3 overflow-auto">
        {SOCIAL_ASPECTS.map((a) => (
          <div key={a} className="flex-1 min-w-0 h-full">
            <Canvas aspect={a} bgColor={bgColor ?? undefined}>
              <div className="relative w-full h-full">
                {visibleLayers.map((layer) => (
                  <LayerRenderer key={layer.id} layer={layer} palette={palette} />
                ))}
              </div>
            </Canvas>
          </div>
        ))}
      </div>
    )
  }

  /* Tool cursor lives on the OUTER wrapper so it covers the dark backdrop
   * around the canvas frame too — not just the bright frame area. Layers
   * inherit via the ac-editor.css rule
   * `[data-tool]:not([data-tool="select"]) [data-layer-id]`, which
   * overrides their inline `cursor: 'move'`. Cursor is an inherited CSS
   * property, so the stage and its descendants pick up the wrapper's
   * declaration without a redundant inline style. */
  const wrapperCursor =
    drag?.mode === 'move' ? 'grabbing'
      : tool !== 'select'  ? (CURSOR_FOR_TOOL[tool] ?? 'crosshair')
      : 'default'
  return (
    <div className="w-full h-full" style={{ cursor: wrapperCursor }}>
      <Canvas aspect={aspect} bgColor={bgColor ?? undefined} panEnabled>
        <div
          ref={stageRef}
          data-tool={tool}
          className="relative w-full h-full"
          onMouseDown={onStageMouseDown}
          onDragOver={(e) => {
            if (e.dataTransfer.types.includes('application/x-kol-library')) {
              e.preventDefault()
              e.dataTransfer.dropEffect = 'copy'
            }
          }}
          onDrop={(e) => {
            const raw = e.dataTransfer.getData('application/x-kol-library')
            if (!raw) return
            e.preventDefault()
            try {
              const { slot, item } = JSON.parse(raw)
              const at = clientToVirtual(e.clientX, e.clientY)
              insertFromLibrary(slot, item, at)
            } catch { /* malformed payload: ignore */ }
          }}
        >
          {visibleLayers.map((layer) => (
            <LayerRenderer key={layer.id} layer={layer} palette={palette} />
          ))}
          {selectedPositionedLayers.map((l) => (
            <SelectionOverlay
              key={l.id}
              layer={l}
              showHandles={!isMultiSel}
              showLabel={!isMultiSel}
            />
          ))}
          {drag?.mode === 'create' && drag.vw > 0 && drag.vh > 0 && (
            <div
              style={{
                position: 'absolute',
                left: drag.vx, top: drag.vy,
                width: drag.vw, height: drag.vh,
                outline: '1px dashed var(--ac-accent-primary)',
                pointerEvents: 'none',
                background: 'color-mix(in srgb, var(--ac-accent-primary) 12%, transparent)',
              }}
            />
          )}
          {drag?.mode === 'marquee' && drag.vw > 0 && drag.vh > 0 && (
            <div
              style={{
                position: 'absolute',
                left: drag.vx, top: drag.vy,
                width: drag.vw, height: drag.vh,
                outline: '1px solid var(--ac-accent-primary)',
                pointerEvents: 'none',
                background: 'color-mix(in srgb, var(--ac-accent-primary) 8%, transparent)',
              }}
            />
          )}
          {linePlacement && linePreview && (
            <svg
              width="100%" height="100%"
              viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
              preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            >
              <line
                x1={linePlacement.x1} y1={linePlacement.y1}
                x2={linePreview.vx}   y2={linePreview.vy}
                stroke="var(--ac-accent-primary)"
                strokeWidth={2}
                strokeDasharray="6 4"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={linePlacement.x1} cy={linePlacement.y1} r="4" fill="var(--ac-accent-primary)" />
            </svg>
          )}
          {snapGuides?.h != null && (
            <div
              style={{
                position: 'absolute',
                left: snapGuides.h, top: 0,
                width: 1, height: '100%',
                background: '#FF00C8',
                pointerEvents: 'none',
              }}
            />
          )}
          {snapGuides?.v != null && (
            <div
              style={{
                position: 'absolute',
                left: 0, top: snapGuides.v,
                width: '100%', height: 1,
                background: '#FF00C8',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </Canvas>
    </div>
  )
}
