export default function AssetFigure({ src, alt, caption, dark = false, backdrop, className = '' }) {
  const frameStyle = backdrop ? { background: backdrop, borderColor: 'transparent' } : undefined
  const darkFrame = dark && !backdrop
  const frameBase = 'kol-asset-figure-frame rounded-[4px] overflow-hidden'
  const frameCls = darkFrame
    ? `${frameBase} bg-surface-inverse`
    : backdrop
      ? frameBase
      : `${frameBase} bg-fg-04 border border-fg-08`

  return (
    <figure className={`kol-asset-figure ${className}`.trim()}>
      <div className={frameCls} style={frameStyle}>
        <img src={src} alt={alt || ''} loading="lazy" />
      </div>
      {caption && (
        <figcaption className="kol-helper-12 uppercase tracking-wider text-meta mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
