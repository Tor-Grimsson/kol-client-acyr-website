/**
 * SpectrumGrid — matrix view of the full ramp system.
 *
 * Rows = ramps. Columns = stops (50 → 900). Each cell is a small color tile
 * with the stop number visible (contrast-corrected) and the hex printed below.
 * Scannable overview of the entire color system in one grid.
 *
 * Hex values are read from CSS custom properties at mount so the theme file
 * stays the single source of truth. Change a ramp value in ac-color.css,
 * the grid picks it up automatically.
 */
import { useEffect, useState } from 'react'

const DEFAULT_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

export default function SpectrumGrid({ ramps, stops = DEFAULT_STOPS, brandAnchors = [] }) {
  const [resolved, setResolved] = useState(null)

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement)
    const out = {}
    for (const ramp of ramps) {
      out[ramp] = {}
      for (const stop of stops) {
        const hex = styles.getPropertyValue(`--${ramp}-${stop}`).trim()
        out[ramp][stop] = hex || '#000'
      }
    }
    setResolved(out)
  }, [ramps, stops])

  if (!resolved) return <div className="ac-spectrum-grid ac-spectrum-grid--loading" aria-busy="true" />

  const isBrandAnchor = (ramp, stop) =>
    brandAnchors.some((a) => a.ramp === ramp && a.stop === stop)

  return (
    <div className="ac-spectrum-grid">
      <div className="ac-spectrum-grid-head">
        <span className="ac-spectrum-grid-corner" aria-hidden="true" />
        {stops.map((s) => (
          <span key={s} className="ac-spectrum-grid-stop-label">{s}</span>
        ))}
      </div>
      {ramps.map((ramp) => (
        <div key={ramp} className="ac-spectrum-grid-row">
          <span className="ac-spectrum-grid-row-label">{ramp}</span>
          {stops.map((stop) => {
            const hex = resolved[ramp][stop]
            const textColor = isLight(hex) ? '#000' : '#fff'
            const brand = isBrandAnchor(ramp, stop)
            return (
              <div
                key={stop}
                className="ac-spectrum-grid-cell"
                style={{ background: hex, color: textColor }}
                title={`${ramp}-${stop}  ${hex}${brand ? '  · brand anchor' : ''}`}
              >
                <span className="ac-spectrum-grid-cell-stop">{stop}</span>
                {brand && <span className="ac-spectrum-grid-cell-marker" aria-hidden="true" />}
                <span className="ac-spectrum-grid-cell-hex">{hex}</span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/* Relative luminance check — returns true if the background is light enough
   that dark text reads better than light text. Simple perceptual weight
   (not full WCAG); plenty accurate for tile labels. */
function isLight(hex) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const lum = 0.299 * r + 0.587 * g + 0.114 * b
  return lum > 0.6
}
