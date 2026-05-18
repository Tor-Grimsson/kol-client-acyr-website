/**
 * Graphic — SVG illustration loader.
 *
 * Globs ./svg/<category>/<name>.svg at build time. Usage:
 *   <Graphic category="patterns" name="pattern-05" />
 *
 * When an asset is missing, renders an AssetPlaceholder with the
 * category/name labeled — missing graphics are visible rather than silently
 * empty. Matches the BrandLogo loader pattern (loader lives with assets).
 */
import AssetPlaceholder from '@components/primitives/AssetPlaceholder'

const svgModules = import.meta.glob('./svg/**/*.svg', { eager: true, query: '?raw', import: 'default' })
const svgUrlModules = import.meta.glob('./svg/**/*.svg', { eager: true, query: '?url', import: 'default' })

const GRAPHIC_CACHE = Object.entries(svgModules).reduce((acc, [path, svg]) => {
  const [category, file] = path.replace('./svg/', '').split('/')
  const name = file.replace('.svg', '')
  if (!acc[category]) acc[category] = {}
  acc[category][name] = svg
  return acc
}, {})

const GRAPHIC_URLS = Object.entries(svgUrlModules).reduce((acc, [path, url]) => {
  const [category, file] = path.replace('./svg/', '').split('/')
  const name = file.replace('.svg', '')
  if (!acc[category]) acc[category] = {}
  acc[category][name] = url
  return acc
}, {})

export const GRAPHICS = Object.fromEntries(
  Object.entries(GRAPHIC_CACHE).map(([category, items]) => [category, Object.keys(items).sort()])
)

/** Resolve a (category, name) pair to a Vite-hashed URL, or null if missing. */
export const graphicUrl = (category, name) => GRAPHIC_URLS[category]?.[name] ?? null

export default function Graphic({
  category,
  name,
  className = '',
  style,
  title,
  aspectRatio = '1 / 1',
}) {
  const raw = GRAPHIC_CACHE[category]?.[name]
  if (!raw) {
    if (import.meta.env.DEV) console.warn(`Graphic: ${category}/${name} not found`)
    return <AssetPlaceholder category={category} name={name} aspectRatio={aspectRatio} note="pending" className={className} />
  }
  return (
    <span
      className={`ac-graphic inline-flex w-full h-auto [&>svg]:w-full [&>svg]:h-auto [&>svg]:block ${className}`.trim()}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: raw }}
    />
  )
}
