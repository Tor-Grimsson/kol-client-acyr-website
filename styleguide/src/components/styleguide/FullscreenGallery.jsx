import { useState } from 'react'
import AssetFigure from './AssetFigure'
import AssetGrid from './AssetGrid'
import FullscreenOverlay from '@components/primitives/FullscreenOverlay'

export default function FullscreenGallery({ items, layout = 'stack', cols = 4, tileClassName = '' }) {
  const [current, setCurrent] = useState(null)

  const tiles = items.map((item) => (
    <div
      key={item.src}
      className={`kol-fs-tile cursor-zoom-in ${tileClassName}`.trim()}
      onClick={() => setCurrent(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') setCurrent(item) }}
    >
      <AssetFigure src={item.src} alt={item.caption ?? ''} caption={item.caption} />
    </div>
  ))

  return (
    <>
      {layout === 'grid'
        ? <AssetGrid cols={cols}>{tiles}</AssetGrid>
        : <div>{tiles}</div>}
      <FullscreenOverlay open={!!current} onClose={() => setCurrent(null)}>
        {current && <img src={current.src} alt={current.caption ?? ''} />}
      </FullscreenOverlay>
    </>
  )
}
