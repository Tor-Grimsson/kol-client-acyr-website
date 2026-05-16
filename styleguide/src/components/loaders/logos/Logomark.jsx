/**
 * Logomark — Kolkrabbi DS brand-marks loader.
 *
 * Globs ./svg/*.svg at build time. Usage:
 *   <Logomark name="logomark" />
 *   <Logomark name="wordmark" />
 *   <Logomark name="lockup-01" />
 *
 * DS-tier — used in DS chrome (TopNav, system surfaces). For client brand
 * marks, see src/components/client/marks/BrandLogo.
 */

const svgModules = import.meta.glob('./svg/*.svg', { eager: true, query: '?raw', import: 'default' })

const LOGO_CACHE = Object.entries(svgModules).reduce((acc, [path, svg]) => {
  const name = path.replace('./svg/', '').replace('.svg', '')
  acc[name] = svg
  return acc
}, {})

export const LOGOS = Object.keys(LOGO_CACHE).sort()

export default function Logomark({ name = 'logomark', className = '', style, title }) {
  const raw = LOGO_CACHE[name]
  if (!raw) {
    if (import.meta.env.DEV) console.warn(`Logomark: ${name} not found`)
    return null
  }
  return (
    <span
      className={`kol-logomark ${className}`.trim()}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: raw }}
    />
  )
}
