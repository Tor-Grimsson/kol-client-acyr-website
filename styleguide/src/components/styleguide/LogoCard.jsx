import { useState } from 'react'
import KolLogo from '@brand/logos/KolLogo'
import ClearspaceDiagram, { hasFramework } from './ClearspaceDiagram'
import ToggleSwitch from '@components/atoms/ToggleSwitch'

export default function LogoCard({ variant, caption, backdrop, className = '', clearspace = true, aspect = '2 / 1', frame = true }) {
  const [showFramework, setShowFramework] = useState(true)
  const canFramework = clearspace && hasFramework(variant)

  const figureStyle = aspect ? { aspectRatio: aspect } : undefined
  const frameStyle = frame && backdrop ? { background: backdrop } : undefined
  const frameChrome = frame
    ? `rounded-[4px] overflow-hidden p-8 ${backdrop ? '' : 'bg-fg-02 border border-fg-04'}`
    : ''
  const figureSizing = aspect ? '' : 'h-full'

  return (
    <figure
      className={`kol-logo-card flex flex-col ${figureSizing} ${className}`.trim()}
      style={figureStyle}
    >
      <div
        className={`kol-logo-card-frame flex-1 min-h-0 flex items-center justify-center ${frameChrome}`.trim()}
        style={frameStyle}
      >
        {clearspace ? (
          <ClearspaceDiagram variant={variant} framework={showFramework && canFramework} />
        ) : (
          <KolLogo variant={variant} className="block w-full h-full [&_svg]:w-full [&_svg]:h-full" />
        )}
      </div>
      <div className="flex items-center justify-between mt-2">
        {caption && (
          <figcaption className="kol-helper-12 uppercase tracking-wider text-meta">
            {caption}
          </figcaption>
        )}
        {canFramework && (
          <ToggleSwitch
            variant="plain"
            label="Clearspace"
            checked={showFramework}
            onToggle={setShowFramework}
          />
        )}
      </div>
    </figure>
  )
}
