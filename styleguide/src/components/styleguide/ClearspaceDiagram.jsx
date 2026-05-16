const layerModules = import.meta.glob('../loaders/graphics/svg/structure/diagram-*-*.svg', { eager: true, query: '?raw', import: 'default' })

const VIEWBOX = /viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/

const DIAGRAMS = Object.entries(layerModules).reduce((acc, [path, raw]) => {
  const match = path.match(/diagram-([^-]+)-(.+)\.svg$/)
  if (!match) return acc
  const [, layer, variant] = match
  acc[variant] = acc[variant] ?? { layers: {} }
  acc[variant].layers[layer] = raw
  if (layer === 'grid') {
    const vb = raw.match(VIEWBOX)
    if (vb) acc[variant].canvas = [Number(vb[1]), Number(vb[2])]
  }
  return acc
}, {})

export const hasFramework = (variant) => {
  const d = DIAGRAMS[variant]
  return Boolean(d?.layers.grid && d?.layers.x)
}

export default function ClearspaceDiagram({ variant, framework = false }) {
  const d = DIAGRAMS[variant]
  if (!d?.layers.logo) return null

  return (
    <div className="relative w-full h-full">
      {framework && d.layers.grid && (
        <span className="absolute inset-0 [&_svg]:w-full [&_svg]:h-full" dangerouslySetInnerHTML={{ __html: d.layers.grid }} />
      )}
      {framework && d.layers.x && (
        <span className="absolute inset-0 [&_svg]:w-full [&_svg]:h-full" dangerouslySetInnerHTML={{ __html: d.layers.x }} />
      )}
      <span className="absolute inset-0 [&_svg]:w-full [&_svg]:h-full" dangerouslySetInnerHTML={{ __html: d.layers.logo }} />
    </div>
  )
}
