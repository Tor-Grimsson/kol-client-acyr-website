import { Link } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '../../brand/config'
import { BRAND_INFO } from '../../brand/data/info'

export default function Press() {
  usePageTitle(`Press · ${BRAND.name}`)

  return (
    <main className="bg-surface-primary pb-24">
      <section className="max-w-3xl mx-auto px-8 pt-20">
        <Link
          to="/"
          className="kol-back-link kol-helper-xs uppercase tracking-widest text-body hover:text-emphasis no-underline inline-flex items-center gap-1.5"
          style={{ marginBottom: '32px' }}
        >
          ← Back
        </Link>

        <p className="kol-prose-label">Press</p>
        <h1 className="kol-prose-display-md">Press</h1>
        <p className="kol-prose-tagline" style={{ marginTop: '8px' }}>
          For journalists, editors, and writers.
        </p>

        <div className="kol-prose">
          <h2>About</h2>
          <p>Another Creation is a womenswear label founded in Reykjavík in 2013 by Ýr Þrastardóttir. Garments are made by hand in small numbers — cut and stitched in the studio, sourced and finished to last.</p>

          <h2>Quick facts</h2>
          <ul>
            <li><strong>Founded:</strong> {BRAND_INFO.identity.established}, Reykjavík</li>
            <li><strong>Designer:</strong> {BRAND_INFO.identity.founder}</li>
            <li><strong>Studio:</strong> {BRAND_INFO.studio.street}, {BRAND_INFO.studio.postcode}, {BRAND_INFO.studio.country}</li>
            <li><strong>Legal entity:</strong> {BRAND_INFO.legal.entity} · kt {BRAND_INFO.legal.kt}</li>
          </ul>

          <h2>Press contact</h2>
          <p>
            <a href={`mailto:${BRAND_INFO.contact.email}`}>{BRAND_INFO.contact.email}</a><br />
            {BRAND_INFO.contact.phone}
          </p>

          <h2>Press kit</h2>
          <p>For high-resolution imagery, logos, the slide deck (vector PDF, in progress), and the longer designer bio, write to <a href={`mailto:${BRAND_INFO.contact.email}`}>{BRAND_INFO.contact.email}</a>. Most requests turn around within 48 hours.</p>

          <h2>Brand assets</h2>
          <p>Logos, palette, and typeface are summarised at <Link to="/brand">/brand</Link>.</p>
        </div>
      </section>
    </main>
  )
}
