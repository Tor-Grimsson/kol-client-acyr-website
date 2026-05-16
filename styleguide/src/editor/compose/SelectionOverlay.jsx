/**
 * SelectionOverlay — chrome for the selected layer.
 *
 * Renders a dashed outline + 8 resize handles + dimension label, all
 * positioned in the same 1080-virtual coord space the layer lives in.
 * Each handle has a `data-handle` attribute so the canvas's pointer
 * router knows which resize mode to start.
 */
const HANDLE_SIZE = 10  /* virtual px */

const HANDLE_DIRS = [
  { dir: 'NW', cursor: 'nwse-resize', x: 0,    y: 0    },
  { dir: 'N',  cursor: 'ns-resize',   x: 0.5,  y: 0    },
  { dir: 'NE', cursor: 'nesw-resize', x: 1,    y: 0    },
  { dir: 'E',  cursor: 'ew-resize',   x: 1,    y: 0.5  },
  { dir: 'SE', cursor: 'nwse-resize', x: 1,    y: 1    },
  { dir: 'S',  cursor: 'ns-resize',   x: 0.5,  y: 1    },
  { dir: 'SW', cursor: 'nesw-resize', x: 0,    y: 1    },
  { dir: 'W',  cursor: 'ew-resize',   x: 0,    y: 0.5  },
]

export default function SelectionOverlay({ layer, showHandles = true, showLabel = true }) {
  if (!layer || layer.x == null) return null  /* cover-type layers have no chrome */

  const { x, y, w, h } = layer

  return (
    <div
      style={{
        position: 'absolute',
        left: x, top: y,
        width: w, height: h,
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          outline: '1px dashed var(--kol-accent-primary)',
          outlineOffset: 0,
        }}
      />
      {showHandles && HANDLE_DIRS.map(({ dir, cursor, x: hx, y: hy }) => (
        <div
          key={dir}
          data-handle={dir}
          style={{
            position: 'absolute',
            left:   `calc(${hx * 100}% - ${HANDLE_SIZE / 2}px)`,
            top:    `calc(${hy * 100}% - ${HANDLE_SIZE / 2}px)`,
            width:  HANDLE_SIZE,
            height: HANDLE_SIZE,
            background: 'white',
            border: '1px solid var(--kol-accent-primary)',
            cursor,
            pointerEvents: 'auto',
          }}
        />
      ))}
      {showLabel && (
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: '100%',
            marginTop: 6,
            fontFamily: 'var(--kol-font-family-mono)',
            fontSize: 10,
            letterSpacing: '0.04em',
            color: 'var(--kol-accent-primary)',
            background: 'rgba(0,0,0,0.6)',
            padding: '2px 6px',
            borderRadius: 2,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {Math.round(w)} × {Math.round(h)}
        </span>
      )}
    </div>
  )
}
