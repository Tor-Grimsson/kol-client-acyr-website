import { useState } from 'react'
import Carousel from '@components/primitives/Carousel'
import FullscreenOverlay from '@components/primitives/FullscreenOverlay'
import Image from '@components/primitives/Image'
import KolLogo from '@brand/logos/KolLogo'

export default function AssetCarousel({ items, className = '', options, category }) {
  const [current, setCurrent] = useState(null)

  return (
    <>
      <Carousel className={`ac-asset-carousel ${className}`.trim()} {...(options ? { options } : {})}>
        {items.map((item, i) => (
          <AssetCard key={item.src ?? i} item={item} category={category} onOpen={() => setCurrent(item)} />
        ))}
      </Carousel>
      <FullscreenOverlay open={!!current} onClose={() => setCurrent(null)}>
        {current && <Image src={current.src} alt={current.caption ?? current.alt ?? ''} category={category} name={current.caption ?? current.alt} />}
      </FullscreenOverlay>
    </>
  )
}

function AssetCard({ item, category, onOpen }) {
  const { src, alt, caption, logo, fit = 'contain' } = item
  return (
    <figure className="ac-asset-card">
      <button
        type="button"
        className={`ac-asset-card-frame${fit === 'cover' ? ' is-cover' : ''}`}
        onClick={onOpen}
        aria-label={caption ? `Open ${caption} fullscreen` : 'Open fullscreen'}
      >
        <Image src={src} alt={alt ?? ''} category={category} name={caption ?? alt} />
        {logo && (
          <span className="ac-asset-card-overlay text-emphasis" aria-hidden="true">
            <KolLogo variant={logo} />
          </span>
        )}
      </button>
      {caption && (
        <figcaption className="ac-helper-12 uppercase tracking-wider text-meta mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
