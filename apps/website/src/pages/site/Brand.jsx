import { Link } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import KolLogo from '@ac/brand-data/logos/KolLogo'
import { BRAND } from '@ac/brand-data/config'
import { BRAND_INFO } from '@ac/brand-data/info'

const SWATCHES = [
  { name: 'Burgundy 200', hex: '#750E20', role: 'Brand primary' },
  { name: 'Burgundy 300', hex: '#5A0816', role: 'Brand secondary ink' },
  { name: 'Cream 100',    hex: '#FBF7EE', role: 'Surface' },
  { name: 'Cream 300',    hex: '#F2E5CB', role: 'Champagne' },
]

export default function Brand() {
  usePageTitle(`Brand · ${BRAND.name}`)

  return (
    <main className="bg-surface-primary pb-24">
      <section className="max-w-3xl mx-auto px-8 pt-20">
        <Link
          to="/"
          className="ac-back-link ac-helper-xs uppercase tracking-widest text-body hover:text-emphasis no-underline inline-flex items-center gap-1.5"
          style={{ marginBottom: '32px' }}
        >
          ← Back
        </Link>

        <p className="ac-prose-label">Brand</p>
        <h1 className="ac-prose-display-md">Brand</h1>
        <p className="ac-prose-tagline" style={{ marginTop: '8px' }}>
          The mark, palette, and type — at a glance.
        </p>

        <div className="ac-prose">
          <p>Another Creation is a womenswear label from Reykjavík, founded in 2013 by Ýr Þrastardóttir. Garments are made by hand in small numbers. This page is the short version — full assets and the press kit are available on request.</p>

          <h2>The mark</h2>
          <p>A wordmark and a signature. Used alone, or together as a lockup.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">
            <div className="aspect-square bg-fg-04 rounded flex items-center justify-center p-12">
              <KolLogo variant="logomark" className="max-h-full max-w-full" />
            </div>
            <div className="aspect-square bg-fg-04 rounded flex items-center justify-center p-12">
              <KolLogo variant="wordmark" className="max-h-full max-w-full" />
            </div>
          </div>

          <h2>Palette</h2>
          <p>Burgundy and cream — anchored. Greyscale carries structure; brand colour is applied with restraint.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-8 not-prose">
            {SWATCHES.map((s) => (
              <div key={s.name}>
                <div className="aspect-square rounded" style={{ backgroundColor: s.hex }} />
                <p className="ac-helper-xs text-emphasis mt-2">{s.name}</p>
                <p className="ac-helper-xs text-meta">{s.hex}</p>
                <p className="ac-helper-xs text-meta">{s.role}</p>
              </div>
            ))}
          </div>

          <h2>Type</h2>
          <p>Right Grotesk across the system — one family carrying display, headings, body, and labels through its cuts. Designed for editorial set, quiet by default.</p>

          <h2>Assets on request</h2>
          <p>For high-resolution logos, the asset register, or the press kit, write to <a href={`mailto:${BRAND_INFO.contact.email}`}>{BRAND_INFO.contact.email}</a>.</p>
        </div>
      </section>
    </main>
  )
}
