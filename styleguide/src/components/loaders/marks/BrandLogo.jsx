const svgModules = import.meta.glob('./svg/*.svg', { eager: true, query: '?raw', import: 'default' })

const MARK_CACHE = Object.entries(svgModules).reduce((acc, [path, svg]) => {
  const name = path.replace('./svg/', '').replace('.svg', '')
  acc[name] = svg
  return acc
}, {})

export const MARKS = Object.keys(MARK_CACHE).sort()

/**
 * Renders a brand mark from client/marks/svg/. Source SVGs use
 * currentColor — control color by setting CSS `color` on the wrapper
 * (via className or style), or let it cascade from the parent.
 */
export default function BrandLogo({ name = 'logomark-uncontained', className = '', style, title }) {
  const markup = MARK_CACHE[name]
  if (!markup) {
    if (import.meta.env.DEV) console.warn(`BrandLogo: ${name} not found`)
    return null
  }
  return (
    <span
      className={`ac-brand-logo ${className}`.trim()}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  )
}
