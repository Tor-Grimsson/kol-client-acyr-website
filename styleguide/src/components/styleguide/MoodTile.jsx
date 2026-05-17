import KolLogo from '@brand/logos/KolLogo'

export default function MoodTile({ src, alt = '', logo = 'logomark', overlay = true, caption }) {
  return (
    <figure className="ac-mood-tile">
      <div className="ac-mood-tile-frame relative rounded-[4px] overflow-hidden aspect-[4/3]">
        <img src={src} alt={alt} loading="lazy" />
        {overlay && (
          <div className="ac-mood-tile-overlay text-emphasis absolute inset-0 flex items-center justify-center pointer-events-none">
            <KolLogo variant={logo} />
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="ac-helper-12 uppercase tracking-wider text-meta mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
