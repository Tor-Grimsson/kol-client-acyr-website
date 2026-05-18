import './styles/editor.css'
import { panelsForSlot } from './state/panels'
import MenuTop from './shell/MenuTop'
import ShortcutsOverlay from './shell/ShortcutsOverlay'

/**
 * EditorShell — topbar + two-rail + canvas host.
 *
 *   ┌──────────────── EditorTopbar ────────────────┐
 *   │ Frame title       File ▼ Canvas ▼ Templates ▼ │
 *   └──────────────────────────────────────────────┘
 *   ┌─ left ─┬───── canvas ─────┬─ right ─┐
 *   │ Layers │                  │ Palette │
 *   │        │                  │ Tool    │
 *   └────────┴──────────────────┴─────────┘
 *
 * Topbar holds the file/canvas/templates menus that used to be the
 * left.header FrameHeaderPanel + AspectInspector frame slot + left.body
 * LibraryTab. Rails now host only context-for-selection panels.
 */

function Rail({ side, panels }) {
  const header = panelsForSlot(panels, `${side}.header`)
  const body   = panelsForSlot(panels, `${side}.body`)
  return (
    <aside className={`ac-editor-${side}`}>
      {header.length > 0 && (
        <div className="ac-editor-rail-header">
          {header.map(({ Component }, i) => <Component key={i} />)}
        </div>
      )}
      <div className="ac-editor-rail-body">
        {body.map(({ Component }, i) => <Component key={i} />)}
      </div>
    </aside>
  )
}

export default function EditorShell({ registry }) {
  const Canvas = registry?.canvas ?? null
  const canvasHeader = panelsForSlot(registry?.panels, 'canvas.header')
  /* `data-editor-keep-selection` is the single marker the document-level
   * click-away handler in CanvasArea checks. Anything inside the shell
   * keeps selection on click; anything outside (sidenav, browser chrome)
   * deselects. New rails / panels don't need to update CanvasArea — being
   * inside the shell is sufficient. */
  return (
    <div className="ac-editor-shell" data-editor-keep-selection>
      <MenuTop />
      <div className="ac-editor-grid">
        <Rail side="left"  panels={registry?.panels} />
        <div className="ac-editor-canvas-column">
          {canvasHeader.length > 0 && (
            <div className="ac-editor-canvas-header">
              {canvasHeader.map(({ Component }, i) => <Component key={i} />)}
            </div>
          )}
          <main className="ac-editor-canvas">
            {Canvas ? <Canvas /> : null}
          </main>
        </div>
        <Rail side="right" panels={registry?.panels} />
      </div>
      <ShortcutsOverlay />
    </div>
  )
}
