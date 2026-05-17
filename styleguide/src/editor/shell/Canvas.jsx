import { useEffect, useRef, useState } from 'react'
import { ASPECTS } from './aspects'

export const CANVAS_DEFAULTS = {
  bgColor:    '#0E0E11',
  guideColor: '#F5F3EF',
}

/* Fixed virtual canvas width — children render in this pixel space and the
 * outer rect scales to fit the viewport via CSS transform. Means a 168px
 * element is always 168/1080 of the canvas width regardless of zoom or
 * viewport size. Height is derived from the active aspect ratio. */
export const CANVAS_VIRTUAL_W = 1080

function resolveAspect(aspect, customRatio) {
  const found = ASPECTS.find((x) => x.id === aspect) ?? ASPECTS[0]
  const ratio = aspect === 'custom' && customRatio ? customRatio : found.ratio
  const label = aspect === 'custom' && customRatio
    ? `Custom · ${Number(customRatio).toFixed(2)}`
    : found.label
  return { ratio, label }
}

/**
 * Bare aspect frame — dashed guide border + label + virtual-pixel scale layer.
 * No outer letterbox. Sizes to its parent (`width: 100%; aspect-ratio: ratio`)
 * so the parent decides the frame's width/height.
 */
export function CanvasFrame({
  aspect,
  customRatio,
  bgColor,
  guideColor = CANVAS_DEFAULTS.guideColor,
  children,
}) {
  const { ratio, label } = resolveAspect(aspect, customRatio)
  const virtualH = CANVAS_VIRTUAL_W / ratio

  const rectRef = useRef(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const node = rectRef.current
    if (!node) return
    const compute = () => {
      const w = node.getBoundingClientRect().width
      if (w > 0) setScale(w / CANVAS_VIRTUAL_W)
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(node)
    return () => ro.disconnect()
  }, [ratio])

  return (
    <div
      ref={rectRef}
      className="relative w-full"
      style={{
        aspectRatio: ratio,
        background:  bgColor ?? 'transparent',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          border:      '1px solid',
          borderColor: `color-mix(in srgb, ${guideColor} 24%, transparent)`,
        }}
      />
      <span
        className="z-[2]"
        style={{
          position:      'absolute',
          top:           6,
          left:          8,
          fontSize:      10,
          fontFamily:    'var(--ac-font-family-mono)',
          letterSpacing: '0.1em',
          color:         `color-mix(in srgb, ${guideColor} 70%, transparent)`,
          pointerEvents: 'none',
        }}
      >
        {label}
      </span>
      {scale > 0 && (
        <div
          className="absolute top-0 left-0 z-[1]"
          style={{
            width:           `${CANVAS_VIRTUAL_W}px`,
            height:          `${virtualH}px`,
            transformOrigin: 'top left',
            transform:       `scale(${scale})`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

/**
 * Shared canvas region for generator tools.
 *
 * The OUTER wrapper letterboxes the inner `<CanvasFrame>` (rect carries the
 * optional `bgColor`, dashed border, label, and virtual-pixel scale layer).
 *
 * `panEnabled` opts into Space-key + drag panning. When held, the cursor
 * flips to grab/grabbing and the canvas frame translates with the cursor;
 * pointer events on the frame are suppressed while Space is held so layer
 * handlers don't fire mid-pan. Decorative chrome (grid bg / dark bg / inset
 * borders) is the consumer's responsibility — Canvas only provides the
 * letterbox + pan viewport.
 */
export default function Canvas({
  aspect,
  customRatio,
  bgColor,
  guideColor = CANVAS_DEFAULTS.guideColor,
  align = 'center',
  panEnabled = false,
  children,
}) {
  const { ratio } = resolveAspect(aspect, customRatio)

  const letterbox = (
    <div
      className={`flex ${align === 'start' ? 'items-start' : 'items-center'} justify-center w-full h-full`}
      style={{ containerType: 'size' }}
    >
      <div
        style={{
          width:       `min(calc(100cqw - 48px), calc((100cqh - 48px) * ${ratio}))`,
        }}
      >
        <CanvasFrame
          aspect={aspect}
          customRatio={customRatio}
          bgColor={bgColor}
          guideColor={guideColor}
        >
          {children}
        </CanvasFrame>
      </div>
    </div>
  )

  if (!panEnabled) return letterbox
  return <PanViewport>{letterbox}</PanViewport>
}

/**
 * PanViewport — Space + drag pan wrapper.
 *
 * Hold Space → cursor `grab`. Mousedown while held → drag-pan, cursor
 * `grabbing`. Pan transform applies to the child div that holds the
 * canvas frame; the viewport itself stays fixed so the consumer's grid
 * background / letterbox doesn't translate. Pointer events on the
 * transform layer disable while Space is held so layer-level mousedowns
 * don't fire mid-pan.
 */
function PanViewport({ children }) {
  const [spaceHeld, setSpaceHeld] = useState(false)
  const [pan, setPan]             = useState({ x: 0, y: 0 })
  const [dragging, setDragging]   = useState(false)
  const dragStart                 = useRef(null)

  useEffect(() => {
    const isInputTarget = (el) =>
      el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
    const onKeyDown = (e) => {
      if (e.code === 'Space' && !isInputTarget(e.target)) {
        e.preventDefault()
        setSpaceHeld(true)
      }
    }
    const onKeyUp = (e) => {
      if (e.code === 'Space') {
        setSpaceHeld(false)
        setDragging(false)
        dragStart.current = null
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e) => {
      if (!dragStart.current) return
      setPan({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      })
    }
    const onUp = () => {
      setDragging(false)
      dragStart.current = null
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging])

  const onMouseDown = (e) => {
    if (!spaceHeld) return
    e.preventDefault()
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
    setDragging(true)
  }

  /* Only override the cursor while actively panning (Space-held / dragging).
   * At rest, leave it unset so consumers above can apply their own cursor
   * (e.g. CanvasArea's tool-driven cursor) and have it visible across the
   * dark backdrop AND the canvas frame, not just the frame area. */
  const cursor = dragging ? 'grabbing' : spaceHeld ? 'grab' : undefined

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={cursor ? { cursor } : undefined}
      onMouseDown={onMouseDown}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px)`,
          transition: dragging ? 'none' : 'transform 120ms ease-out',
          pointerEvents: spaceHeld ? 'none' : 'auto',
        }}
      >
        {/* Oversized grid behind the letterbox — extends 2 viewport sizes
            in each direction so practical panning never reveals an edge. */}
        <div
          className="ac-grid-bg absolute"
          style={{ left: '-200%', top: '-200%', width: '500%', height: '500%' }}
        />
        <div className="relative w-full h-full">{children}</div>
      </div>
    </div>
  )
}
