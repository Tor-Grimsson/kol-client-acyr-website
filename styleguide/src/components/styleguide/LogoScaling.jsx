import { Fragment, useEffect, useRef, useState } from 'react'
import KolLogo from '@brand/logos/KolLogo'

const STEPS = [128, 96, 64, 48, 40, 32, 24, 16, 12, 8]

const COLUMNS = [
  { label: 'Logomark',         variant: 'logomark',    widthMul: 1 },
  { label: 'Vertical lockup',  variant: 'lockup-vert', widthMul: 1 },
  { label: 'Horizontal lockup',variant: 'lockup-hori', widthMul: 2.5 },
  { label: 'Wordmark',         variant: 'wordmark',    widthMul: 2.5 },
]

const CANVAS_W = 1600
const CANVAS_H = 1000

export default function LogoScaling() {
  const outerRef = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / CANVAS_W)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="pt-12" data-reveal>
      <div
        ref={outerRef}
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
      >
        <div
          className="absolute top-0 left-0 inline-grid gap-x-12 gap-y-8 items-center text-emphasis origin-top-left"
          style={{
            gridTemplateColumns: `auto repeat(${COLUMNS.length}, auto)`,
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `scale(${scale})`,
          }}
        >
        <div />
        {COLUMNS.map((c) => (
          <div key={c.variant} className="kol-helper-12 uppercase tracking-widest">
            {c.label}
          </div>
        ))}

        {STEPS.map((px) => (
          <Fragment key={px}>
            <div className="kol-helper-12 text-right font-mono">{px}</div>
            {COLUMNS.map((c) => (
              <div key={c.variant} style={{ width: px * c.widthMul }}>
                <KolLogo variant={c.variant} />
              </div>
            ))}
          </Fragment>
        ))}
        </div>
      </div>
    </div>
  )
}
