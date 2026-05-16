import { useMemo } from 'react'
import KolLogo from '@brand/logos/KolLogo'
import TypeBlock from '../components/TypeBlock'
import { buildPatternSvg } from '../modes/pattern/render'
import { getShapeSvg } from '../modes/pattern/shapes'
import { resolveColor, COVER_TYPES, useComposeState } from './state'
import { regularPolygonPoints, starPoints, trianglePoints } from './shape-math'

/**
 * LayerRenderer — renders a single layer as a positioned DOM element inside
 * the 1080-virtual canvas.
 *
 * Cover types (background / pattern / photo) fill the canvas and aren't
 * draggable. Positioned types (shape / text) use explicit {x, y, w, h}
 * virtual coords; pointer events bubble up to CanvasArea which owns the
 * drag state.
 *
 * `data-layer-id` on every interactive element so the canvas's pointer
 * router can identify the target.
 */

export default function LayerRenderer({ layer, palette }) {
  if (!layer.visible) return null

  const layerStyle = {
    opacity:      layer.opacity ?? 1,
    mixBlendMode: layer.blend && layer.blend !== 'normal' ? layer.blend : undefined,
  }

  switch (layer.type) {
    case 'background': return <BackgroundLayer layer={layer} palette={palette} layerStyle={layerStyle} />
    case 'pattern':    return <PatternLayer    layer={layer} palette={palette} layerStyle={layerStyle} />
    case 'photo':      return <PhotoLayer      layer={layer}                    layerStyle={layerStyle} />
    case 'shape':      return <ShapeLayer      layer={layer} palette={palette} layerStyle={layerStyle} />
    case 'text':       return <TextLayer       layer={layer} palette={palette} layerStyle={layerStyle} />
    case 'group':      return <GroupLayer      layer={layer} palette={palette} layerStyle={layerStyle} />
    default:           return null
  }
}

/* Group layer — translates a positioned container; children render at
 * their group-relative coords. data-layer-id on the container so
 * clicking the group selects it (children's own data-layer-id still
 * wins via .closest() bubbling, so clicking a child selects the child). */
function GroupLayer({ layer, palette, layerStyle }) {
  return (
    <div
      data-layer-id={layer.id}
      style={{
        position: 'absolute',
        left: layer.x ?? 0, top: layer.y ?? 0,
        width: layer.w ?? '100%', height: layer.h ?? '100%',
        cursor: 'move',
        ...layerStyle,
      }}
    >
      {(layer.children ?? []).map((child) => (
        <LayerRenderer key={child.id} layer={child} palette={palette} />
      ))}
    </div>
  )
}

function BackgroundLayer({ layer, palette, layerStyle }) {
  const color = resolveColor(layer.color, palette) ?? '#000000'
  return (
    <div
      data-layer-id={layer.id}
      data-layer-cover="true"
      style={{
        position: 'absolute', inset: 0,
        background: color,
        cursor: 'pointer',
        ...layerStyle,
      }}
    />
  )
}

/**
 * Pattern layer — builds a tile SVG via Pattern Lab's `buildPatternSvg` from
 * the layer's authored params (layer is self-contained, no spec snapshot).
 * The SVG is memoized by serialized params so the rules engine doesn't re-run
 * on unrelated re-renders. `currentColor` in the rendered tile resolves to
 * the layer's `color`; bg only renders when `bgOn`.
 *
 * Phase 1b: positioned. Renders at layer.x/y/w/h. Defensive defaults
 * fall back to full-canvas (inset:0 equivalent) for any pre-1b data
 * lacking bounds.
 */
function PatternLayer({ layer, palette, layerStyle }) {
  const color  = resolveColor(layer.color, palette) ?? '#FFFFFF'
  const bg     = layer.bgOn ? (resolveColor(layer.bg, palette) ?? null) : null
  const stroke = resolveColor(layer.stroke, palette)
  const sw     = layer.strokeWidth ?? 0

  const tileSize = layer.scale ?? 256

  const svg = useMemo(() => {
    const shapeSvg = getShapeSvg(layer.shapeId, layer.customSvg)
    if (!shapeSvg) return null
    return buildPatternSvg({
      shapeSvg,
      cols:     layer.cols,
      rows:     layer.rows,
      gap:      layer.gap,
      padding:  layer.padding,
      stretch:  layer.stretch,
      overflow: layer.overflow,
      rules:    layer.rules ?? [],
      color,
      bg,
      stroke:      sw > 0 ? stroke : null,
      strokeWidth: sw,
      size:        tileSize,
    })
  }, [
    layer.shapeId, layer.customSvg, layer.cols, layer.rows, layer.gap,
    layer.padding, layer.stretch, layer.overflow, layer.rules,
    color, bg, stroke, sw, tileSize,
  ])

  const hasBounds = layer.w != null && layer.h != null
  const positionStyle = hasBounds
    ? { left: layer.x, top: layer.y, width: layer.w, height: layer.h }
    : { inset: 0 }

  return (
    <div
      data-layer-id={layer.id}
      style={{
        position: 'absolute',
        ...positionStyle,
        backgroundColor: 'transparent',
        backgroundImage: svg
          ? `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`
          : 'none',
        backgroundSize: `${tileSize}px ${tileSize}px`,
        backgroundRepeat: 'repeat',
        cursor: 'move',
        ...layerStyle,
      }}
    />
  )
}

function PhotoLayer({ layer, layerStyle }) {
  if (!layer.src) return null
  const hasBounds = layer.w != null && layer.h != null
  const positionStyle = hasBounds
    ? { left: layer.x, top: layer.y, width: layer.w, height: layer.h }
    : { inset: 0, width: '100%', height: '100%' }
  return (
    <img
      src={layer.src}
      alt=""
      data-layer-id={layer.id}
      style={{
        position: 'absolute',
        ...positionStyle,
        objectFit: layer.fit ?? 'cover',
        cursor: 'move',
        ...layerStyle,
      }}
    />
  )
}

/* `fit` controls how shape SVG content fills the layer bounds.
 *   - `fill`    — stretch to bounds (preserveAspectRatio="none"). Default.
 *   - `contain` — preserve aspect, letterboxed (preserveAspectRatio default).
 * Applied at render time by regex-replacing the inner SVG's
 * preserveAspectRatio attribute. */
const FIT_PAR = { fill: 'none', contain: 'xMidYMid meet' }
function applySvgFit(svgString, fit) {
  if (!svgString) return svgString
  const par = FIT_PAR[fit] ?? 'none'
  if (/<svg[^>]*preserveAspectRatio=/i.test(svgString)) {
    return svgString.replace(/(<svg[^>]*?)preserveAspectRatio=["'][^"']*["']/i, `$1preserveAspectRatio="${par}"`)
  }
  return svgString.replace(/<svg([^>]*)>/i, `<svg$1 preserveAspectRatio="${par}">`)
}

/* Shape layers render by `kind`:
 *   - `logo`     — brand logo via KolLogo (default for legacy data).
 *   - `flatten`  — raw SVG content stored on the layer (output of pattern
 *                  / text flatten); inlined via dangerouslySetInnerHTML.
 *   - `rect`     — vector rectangle filling the layer bounds.
 *   - `ellipse`  — vector ellipse inscribed in the layer bounds.
 *   - `triangle` — equilateral, apex at top-center.
 *   - `line`     — diagonal from top-left to bottom-right of bbox; stroke-only.
 *   - `polygon`  — regular n-gon, `sides` (3-12, default 5).
 *   - `star`     — n-pointed star, `points` (3-12) + `innerRatio` (default 0.5).
 *
 * Stroke props honored: stroke / strokeWidth / strokeDasharray /
 * strokeLinecap / strokeLinejoin. Stroke is painted INSIDE the layer
 * bounds via a half-stroke inset so the visible bounds match the
 * wireframe. */
function ShapeLayer({ layer, palette, layerStyle }) {
  /* `null` color = explicit "no fill" (cleared via N or the swatch-stack
   * none marker). `undefined` / non-null falsy = default → fall back to
   * white so logos/flatten content remain visible. */
  const hasFill = layer.color !== null
  const color   = hasFill ? (resolveColor(layer.color, palette) ?? '#FFFFFF') : 'transparent'
  const kind    = layer.kind ?? 'logo'
  const renderedSvg = kind === 'flatten' ? applySvgFit(layer.svg, layer.fit ?? 'fill') : null

  const strokeColor = resolveColor(layer.stroke, palette)
  const sw   = layer.strokeWidth ?? 0
  const half = sw > 0 ? sw / 2 : 0

  return (
    <div
      data-layer-id={layer.id}
      style={{
        position: 'absolute',
        left: layer.x, top: layer.y,
        width: layer.w, height: layer.h,
        color,
        cursor: 'move',
        overflow: 'hidden',
        ...layerStyle,
      }}
    >
      {kind === 'logo' && (
        <KolLogo
          variant={layer.variant ?? 'logomark'}
          width={layer.w}
          height={layer.h}
          preserveAspectRatio={layer.fit === 'contain' ? 'xMidYMid meet' : 'none'}
          stroke={sw > 0 ? (strokeColor ?? undefined) : undefined}
          strokeWidth={sw > 0 ? sw : undefined}
          strokeLinejoin={layer.strokeLinejoin ?? undefined}
          strokeLinecap={layer.strokeLinecap ?? undefined}
          style={{
            display: 'block',
            paintOrder: sw > 0 ? 'stroke fill' : undefined,
          }}
        />
      )}
      {kind === 'flatten' && renderedSvg && (
        <div
          className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
          dangerouslySetInnerHTML={{ __html: renderedSvg }}
        />
      )}
      {kind === 'rect' && (
        /* viewBox sized to the layer's intrinsic w/h so we can use plain
         * numeric coords (SVG attributes don't accept CSS calc()).
         * preserveAspectRatio="none" lets the SVG stretch to fill the
         * positioned div. */
        <svg
          width="100%" height="100%"
          viewBox={`0 0 ${Math.max(1, layer.w ?? 1)} ${Math.max(1, layer.h ?? 1)}`}
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <rect
            x={half} y={half}
            width={Math.max(0, (layer.w ?? 0) - sw)}
            height={Math.max(0, (layer.h ?? 0) - sw)}
            fill={hasFill ? 'currentColor' : 'none'}
            stroke={strokeColor ?? 'none'}
            strokeWidth={sw}
            strokeDasharray={layer.strokeDasharray ?? undefined}
            strokeLinecap={layer.strokeLinecap ?? undefined}
            strokeLinejoin={layer.strokeLinejoin ?? undefined}
          />
        </svg>
      )}
      {kind === 'ellipse' && (
        <svg
          width="100%" height="100%"
          viewBox={`0 0 ${Math.max(1, layer.w ?? 1)} ${Math.max(1, layer.h ?? 1)}`}
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <ellipse
            cx={(layer.w ?? 0) / 2}
            cy={(layer.h ?? 0) / 2}
            rx={Math.max(0, (layer.w ?? 0) / 2 - half)}
            ry={Math.max(0, (layer.h ?? 0) / 2 - half)}
            fill={hasFill ? 'currentColor' : 'none'}
            stroke={strokeColor ?? 'none'}
            strokeWidth={sw}
            strokeDasharray={layer.strokeDasharray ?? undefined}
            strokeLinecap={layer.strokeLinecap ?? undefined}
            strokeLinejoin={layer.strokeLinejoin ?? undefined}
          />
        </svg>
      )}
      {kind === 'triangle' && (
        <svg
          width="100%" height="100%"
          viewBox={`0 0 ${Math.max(1, layer.w ?? 1)} ${Math.max(1, layer.h ?? 1)}`}
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <polygon
            points={trianglePoints(layer.w ?? 0, layer.h ?? 0, half)}
            fill={hasFill ? 'currentColor' : 'none'}
            stroke={strokeColor ?? 'none'}
            strokeWidth={sw}
            strokeDasharray={layer.strokeDasharray ?? undefined}
            strokeLinecap={layer.strokeLinecap ?? undefined}
            strokeLinejoin={layer.strokeLinejoin ?? 'round'}
          />
        </svg>
      )}
      {kind === 'line' && (() => {
        /* Line slope picks which bbox diagonal to render. Set by the pen
         * tool from the user's two clicks; preserved through move/resize
         * (bbox is the canonical position store, slope rides along). */
        const slope = layer.slope ?? '\\'
        const w0 = layer.w ?? 0
        const h0 = layer.h ?? 0
        const x1 = slope === '/' ? half             : half
        const y1 = slope === '/' ? h0 - half        : half
        const x2 = slope === '/' ? w0 - half        : w0 - half
        const y2 = slope === '/' ? half             : h0 - half
        return (
          <svg
            width="100%" height="100%"
            viewBox={`0 0 ${Math.max(1, w0)} ${Math.max(1, h0)}`}
            preserveAspectRatio="none"
            style={{ display: 'block' }}
          >
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={strokeColor ?? 'currentColor'}
              strokeWidth={sw > 0 ? sw : 2}
              strokeDasharray={layer.strokeDasharray ?? undefined}
              strokeLinecap={layer.strokeLinecap ?? 'round'}
            />
          </svg>
        )
      })()}
      {kind === 'polygon' && (
        <svg
          width="100%" height="100%"
          viewBox={`0 0 ${Math.max(1, layer.w ?? 1)} ${Math.max(1, layer.h ?? 1)}`}
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <polygon
            points={regularPolygonPoints(layer.w ?? 0, layer.h ?? 0, layer.sides ?? 5, half)}
            fill={hasFill ? 'currentColor' : 'none'}
            stroke={strokeColor ?? 'none'}
            strokeWidth={sw}
            strokeDasharray={layer.strokeDasharray ?? undefined}
            strokeLinecap={layer.strokeLinecap ?? undefined}
            strokeLinejoin={layer.strokeLinejoin ?? 'round'}
          />
        </svg>
      )}
      {kind === 'star' && (
        <svg
          width="100%" height="100%"
          viewBox={`0 0 ${Math.max(1, layer.w ?? 1)} ${Math.max(1, layer.h ?? 1)}`}
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <polygon
            points={starPoints(layer.w ?? 0, layer.h ?? 0, layer.points ?? 5, layer.innerRatio ?? 0.5, half)}
            fill={hasFill ? 'currentColor' : 'none'}
            stroke={strokeColor ?? 'none'}
            strokeWidth={sw}
            strokeDasharray={layer.strokeDasharray ?? undefined}
            strokeLinecap={layer.strokeLinecap ?? undefined}
            strokeLinejoin={layer.strokeLinejoin ?? 'round'}
          />
        </svg>
      )}
    </div>
  )
}

/**
 * TextLayer — wraps <TypeBlock> in a positioned container with
 * `data-layer-id` for the canvas pointer router. The contentEditable + edit
 * commit lives inside TypeBlock; we forward the layer's typography prop bag
 * via the `value` prop and the `text` field gets patched back through
 * `updateLayer` when the user commits.
 *
 * `display: flex` + `alignItems: center` lets short text stay vertically
 * centered inside `layer.h`. The TypeBlock fills the wrapper width so
 * `textAlign` resolves over `layer.w`.
 */
function TextLayer({ layer, palette, layerStyle }) {
  const { selectedId, updateLayer } = useComposeState()
  const color       = resolveColor(layer.color, palette) ?? '#FFFFFF'
  const strokeColor = resolveColor(layer.stroke, palette)
  const sw          = layer.strokeWidth ?? 0
  return (
    <div
      data-layer-id={layer.id}
      style={{
        position: 'absolute',
        left: layer.x, top: layer.y,
        width: layer.w, height: layer.h,
        cursor: 'move',
        display: 'flex', alignItems: 'center',
        ...layerStyle,
      }}
    >
      <TypeBlock
        value={{ ...layer, color, strokeColor: sw > 0 ? strokeColor : null, strokeWidth: sw }}
        selected={selectedId === layer.id}
        onChange={(patch) => updateLayer(layer.id, patch)}
        className="w-full"
      />
    </div>
  )
}

export { COVER_TYPES }
