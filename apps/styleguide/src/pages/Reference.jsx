import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BrandHero from '../components/framework/BrandHero'
import PageSection from '../components/framework/PageSection'
import Table from '@components/organisms/Table'
import AssetTable, { markRows, graphicRows, markWidthFor, graphicWidthFor } from '../components/styleguide/AssetTable'
import usePageTitle from '../components/hooks/usePageTitle'
import { resolveCssVar, LiveValue } from '../components/sections/ColorRamp'
import { TYPOGRAPHY_SECTIONS } from '../data/typography'
import { BRAND_COLORS_SECTIONS } from '../data/color'
import { GENERATOR_ROWS, generatorCols } from '../data/generators'
import { graphicUrl } from '../components/loaders/graphics'
import Icon from '@components/loaders/icons/Icon'
import { ASSET_SPECS } from '@ac/brand-data/branded-assets'

const Chip = ({ value }) => (
  <span
    className="inline-block w-6 h-6 rounded-sm border border-fg-08 align-middle"
    style={{ background: value }}
  />
)

const TokenName = ({ children }) => (
  <code className="ac-helper-12 text-emphasis">{children}</code>
)

/** LiveHex — reads the resolved hex of a CSS custom property. Single source of
 *  truth: ac-color.css. Edit a token there, this column updates on next render. */
function LiveHex({ token }) {
  const [hex, setHex] = useState('')
  useEffect(() => { setHex(resolveCssVar(token)) }, [token])
  return <TokenName>{hex}</TokenName>
}

// ─── Routes ──────────────────────────────────────────────────────

const isNavigable = (p) => p && !p.includes(':') && p !== '*'

const routeCols = [
  { accessor: 'path',    header: 'Path',    render: (r) => <TokenName>{r.path}</TokenName> },
  { accessor: 'page',    header: 'Page',    render: (r) => isNavigable(r.path)
      ? <Link to={r.path} className="text-emphasis underline underline-offset-4 decoration-fg-24 hover:decoration-fg-64">{r.page}</Link>
      : r.page },
  { accessor: 'layout',  header: 'Layout' },
  { accessor: 'file',    header: 'File',    render: (r) => <code className="ac-helper-12 text-meta">{r.file}</code> },
]

const routeRows = [
  { path: '/',                          page: 'Landing',                  layout: 'Layout',           file: 'src/pages/Landing.jsx' },
  { path: '/styleguide',                page: 'Client guidelines',        layout: 'Layout · BrandLayout', file: 'src/pages/Styleguide.jsx' },
  { path: '/reference',                 page: 'Token + asset reference',  layout: 'Layout · BrandLayout', file: 'src/pages/Reference.jsx' },
  { path: '/generators',                page: 'Interactive tools (Combo Lab, Social Generator)', layout: 'Layout · BrandLayout', file: 'src/pages/Generators.jsx' },
  { path: '/site',                      page: 'Marketing home',           layout: 'Layout · SiteLayout',  file: 'src/pages/site/Home.jsx' },
  { path: '/site/contact',              page: 'Contact',                  layout: 'Layout · SiteLayout',  file: 'src/pages/site/Contact.jsx' },
  { path: '/site/blog',                 page: 'Blog index',               layout: 'Layout · SiteLayout',  file: 'src/pages/site/Blog.jsx' },
  { path: '/site/blog/:slug',           page: 'Blog article',             layout: 'Layout · SiteLayout',  file: 'src/pages/site/BlogArticle.jsx' },
  { path: '/site/blog/author/:slug',    page: 'Blog author',              layout: 'Layout · SiteLayout',  file: 'src/pages/site/BlogAuthor.jsx' },
  { path: '/gallery',                   page: 'Photo lookup (dev tool)',  layout: '— (no chrome)',        file: 'src/components/tools/Gallery.jsx' },
  { path: '*',                          page: '404',                      layout: 'Layout',           file: 'src/pages/NotFound.jsx' },
]

// ─── Color column factories ─────────────────────────────────────
// Bridge from string keys in src/data/color.js to JSX render funcs.

const COLOR_COLUMNS = {
  alias: [
    { accessor: 'token',      header: 'Token',       render: (r) => <TokenName>{r.token}</TokenName> },
    { accessor: 'swatch',     header: 'Swatch',      render: (r) => <Chip value={`var(${r.token})`} /> },
    { accessor: 'resolvesTo', header: 'Resolves to', render: (r) => <TokenName>{r.resolvesTo}</TokenName> },
    { accessor: 'use',        header: 'Use' },
  ],
  ramp: [
    { accessor: 'token',  header: 'Token',  style: { width: 220 }, render: (r) => <TokenName>{r.token}</TokenName> },
    { accessor: 'swatch', header: 'Swatch', style: { width: 80 },  render: (r) => <Chip value={`var(${r.token})`} /> },
    { accessor: 'hex',    header: 'Hex',    style: { width: 120 }, render: (r) => <LiveHex token={r.token} /> },
    { accessor: 'note',   header: 'Note' },
  ],
  surface: [
    { accessor: 'token', header: 'Token', render: (r) => <TokenName>{r.token}</TokenName> },
    { accessor: 'light', header: 'Light', render: (r) => <span className="inline-flex items-center gap-2"><Chip value={r.light} /><TokenName>{r.light}</TokenName></span> },
    { accessor: 'dark',  header: 'Dark',  render: (r) => <span className="inline-flex items-center gap-2"><Chip value={r.dark} /><TokenName>{r.dark}</TokenName></span> },
    { accessor: 'use',   header: 'Use' },
  ],
  state: [
    { accessor: 'state',  header: 'State',  render: (r) => <TokenName>{r.state}</TokenName> },
    { accessor: 'sample', header: 'Sample', render: (r) => (
      <span style={{ color: `var(${r.token})`, fontWeight: 600 }}>{r.sample}</span>
    ) },
    { accessor: 'token',  header: 'Token',  render: (r) => <TokenName>{r.token}</TokenName> },
    { accessor: 'dark',   header: 'Dark',   render: (r) => <TokenName>{r.dark}</TokenName> },
    { accessor: 'light',  header: 'Light',  render: (r) => <TokenName>{r.light}</TokenName> },
    { accessor: 'use',    header: 'Use' },
  ],
  'fg-primitives': [
    { accessor: 'token',   header: 'Token',           render: (r) => <TokenName>{r.token}</TokenName> },
    { accessor: 'swatch',  header: 'Swatch',          render: (r) => <Chip value={`var(${r.token})`} /> },
    { accessor: 'utility', header: 'Utility classes', render: (r) => <code className="ac-helper-12 text-meta">{r.utility}</code> },
    { accessor: 'use',     header: 'Use' },
  ],
  'fg-families': [
    { accessor: 'property', header: 'Family',        render: (r) => <TokenName>.{r.property}</TokenName> },
    { accessor: 'example',  header: 'Example',       render: (r) => <TokenName>.{r.example}</TokenName> },
    { accessor: 'hover',    header: 'Hover variant', render: (r) => r.hover === '—' ? <span className="text-subtle">—</span> : <TokenName>.{r.hover}</TokenName> },
    { accessor: 'use',      header: 'Use' },
  ],
}

// ─── Typography column factories ─────────────────────────────────
// Keyed by name. Data file (src/data/typography.js) references these
// via string keys on each table's `columns` field. JSX render funcs can't live
// in pure data files; this is the bridge.

const TYPE_COLUMNS = {
  family: [
    { accessor: 'token', header: 'Token', render: (r) => <TokenName>{r.token}</TokenName> },
    { accessor: 'role',  header: 'Role' },
    { accessor: 'cut',   header: 'Cut (live)', render: (r) => <span><LiveValue token={r.token} /></span> },
  ],
  sans: [
    { accessor: 'cls',    header: 'Class',  render: (r) => <TokenName>{r.cls}</TokenName> },
    { accessor: 'sample', header: 'Sample',
      render: (r) => <span className={r.cls.replace(/^\./, '')}>Sample {r.cls.split('-').slice(-2).join('-')}</span> },
    { accessor: 'size',   header: 'Size',   render: (r) => r.tokenName ? <LiveValue token={r.tokenName} /> : '—' },
    { accessor: 'family', header: 'Family' },
    { accessor: 'weight', header: 'Weight' },
  ],
  prose: [
    { accessor: 'role',   header: 'Role',  render: (r) => <TokenName>{r.role}</TokenName> },
    { accessor: 'class',  header: 'Class', render: (r) => <TokenName>{r.class}</TokenName> },
    { accessor: 'family', header: 'Family' },
    { accessor: 'weight', header: 'Weight' },
    { accessor: 'size',   header: 'Size (live)', render: (r) => r.tokenName ? <LiveValue token={r.tokenName} /> : '—' },
  ],
  mono: [
    { accessor: 'cls',    header: 'Class',  render: (r) => <TokenName>{r.cls}</TokenName> },
    { accessor: 'sample', header: 'Sample',
      render: (r) => <span className={r.cls.replace(/^\./, '')}>{r.cls.replace(/^\./, '')}</span> },
    { accessor: 'size',   header: 'Size',   render: (r) => `${r.size}px` },
    { accessor: 'weight', header: 'Weight' },
    { accessor: 'lh',     header: 'LH',     render: (r) => typeof r.lh === 'number' ? `${r.lh}px` : r.lh },
    { accessor: 'ls',     header: 'LS' },
  ],
  descriptors: [
    { accessor: 'name',   header: 'Name',   render: (r) => <TokenName>.text-{r.name}</TokenName> },
    { accessor: 'pct',    header: '%',      render: (r) => `${r.pct}%` },
    { accessor: 'sample', header: 'Sample',
      render: (r) => <span className={`text-${r.name} font-mono`}>The quick brown fox</span> },
    { accessor: 'token',  header: 'Token',  render: (r) => <TokenName>{r.token}</TokenName> },
    { accessor: 'role',   header: 'Use' },
  ],
  cuts: [
    { accessor: 'family',  header: 'Family',  render: (r) => <TokenName>{r.family}</TokenName> },
    { accessor: 'weights', header: 'Weights' },
    { accessor: 'use',     header: 'Use' },
  ],
}

// ─── Assets: branded-asset placeholder ───────────────────────────

const brandedAssetCols = [
  { accessor: 'item',     header: 'Item',     render: (r) => <TokenName>{r.item}</TokenName> },
  { accessor: 'aspect',   header: 'Aspect' },
  { accessor: 'category', header: 'Category', render: (r) => {
    const display = r.category === 'labels' ? 'tags & labels' : r.category === 'garment-bags' ? 'packaging' : r.category
    return <span className="ac-helper-12 text-meta uppercase tracking-widest">{display}</span>
  } },
  { accessor: 'status',   header: 'Status',   render: (r) => <span className="ac-helper-12 text-meta uppercase tracking-widest">{r.status}</span> },
  {
    accessor: 'download',
    header: 'Download',
    style: { width: 96 },
    render: (r) => {
      const url = r.category && r.name ? graphicUrl(r.category, r.name) : null
      if (!url) return null
      return (
        <a
          href={url}
          download={`${r.name}.svg`}
          className="inline-flex items-center text-meta hover:text-[var(--brand-primary)]"
          aria-label={`Download ${r.name}.svg`}
          title="Download"
        >
          <Icon name="download" size={16} />
        </a>
      )
    },
  },
]

/* Branded-asset row source — pairs an ASSET_SPECS entry with its category +
 * SVG location for download. `item` + `aspect` are derived from the spec so
 * this table stays in sync with src/brand/data/branded-assets.js. */
const BRANDED_ASSET_SOURCES = [
  { specId: 'business-card',      category: 'stationery',   name: 'business-card-front' },
  { specId: 'business-card-back', category: 'stationery',   name: 'business-card-back' },
  { specId: 'envelope',           category: 'stationery',   name: 'envelope' },
  { specId: 'letterhead',         category: 'stationery',   name: 'letterhead-a4-mock' },
  { specId: 'email-signature',    category: 'stationery',   name: 'email-signature' },
  { specId: 'neck-label',         category: 'labels',       name: 'neck-label' },
  { specId: 'size-label',         category: 'labels',       name: 'size-label-01' },
  { specId: 'hangtag',            category: 'labels',       name: 'hang-label-01' },
  { specId: 'hangtag',            category: 'labels',       name: 'hang-label-02', itemSuffix: '· back' },
  { specId: 'swing-tag',          category: 'labels',       name: 'slim-label' },
  { specId: 'edition-card',       category: 'labels',       name: 'certificate-of-authenticity-01' },
  { specId: 'care-label',         category: 'labels',       name: 'care-label-01' },
  { specId: 'dust-bag',           category: 'garment-bags', name: 'dust-bag-01' },
  { specId: 'garment-bag',        category: 'garment-bags', name: 'garment-bag-01' },
  { specId: 'packaging',          category: 'packaging',    name: 'package' },
]

/* Greatest common divisor — used to simplify (w, h) trim pairs into a clean
 * aspect ratio. e.g. (85, 55) → (17, 11), (220, 110) → (2, 1). */
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b)
}

function simplifyAspect([w, h]) {
  const d = gcd(w, h)
  return [w / d, h / d]
}

/* Specs whose aspect column shows the raw mm dimensions (paper standards —
 * ID-1 / DL / A4) rather than the simplified ratio. */
const RAW_DIMS_SPEC_IDS = new Set(['business-card', 'business-card-back', 'envelope', 'letterhead'])

const brandedAssetRows = BRANDED_ASSET_SOURCES.map(({ specId, category, name, itemSuffix }) => {
  const spec = ASSET_SPECS[specId]
  const item = spec ? `${spec.name}${itemSuffix ? ` ${itemSuffix}` : ''}` : specId
  const aspect = spec?.trim
    ? (() => {
        const raw = RAW_DIMS_SPEC_IDS.has(specId)
        const [w, h] = raw ? spec.trim : simplifyAspect(spec.trim)
        return raw ? `${w} / ${h} (mm)` : `${w} / ${h}`
      })()
    : 'free'
  return { item, aspect, category, status: 'mocked', name }
})

// ─── Section renderer ────────────────────────────────────────────
// Shared by color + typography sections — same shape, same renderer.

function SystemSection({ section, columnsDict }) {
  return (
    <PageSection
      key={section.id}
      id={section.id}
      label={section.label}
      title={section.title}
      body={section.intro}
      divider={section.divider === true}
    >
      {section.reasoning && (
        <div className="ac-prose">
          <p className="text-meta">{section.reasoning}</p>
        </div>
      )}
      {section.tables.map((t, i) => (
        <Table
          key={`${section.id}-${i}`}
          caption={t.caption}
          columns={typeof t.columns === 'string' ? columnsDict[t.columns] : t.columns}
          rows={t.rows}
          variant="simple"
        />
      ))}
    </PageSection>
  )
}

// ─── Page ────────────────────────────────────────────────────────

export default function Reference() {
  usePageTitle('Reference')

  /* photoIndexPlugin emits /__photos.json at dev/build time. Same source
   * Gallery uses — fetched once on mount and surfaced as a row-per-group
   * table. Folder is derived from the first file URL. */
  const [photoGroups, setPhotoGroups] = useState([])
  useEffect(() => {
    fetch('/__photos.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.groups) setPhotoGroups(d.groups) })
      .catch(() => {})
  }, [])

  const photoRows = photoGroups.map((g) => ({
    name:   g.name,
    folder: `/brand/${g.name}`,
    count:  g.count,
  }))

  const photoCols = [
    { accessor: 'name', header: 'Group', render: (r) => (
      <Link to={`/gallery#${encodeURIComponent(r.name)}`} className="text-emphasis underline underline-offset-4 decoration-fg-24 hover:decoration-fg-64">{r.name}</Link>
    ) },
    { accessor: 'folder', header: 'Folder', render: (r) => <code className="ac-helper-12 text-meta">{r.folder}</code> },
    { accessor: 'count',  header: 'Count',  render: (r) => <span className="text-emphasis">{r.count}</span> },
  ]

  return (
    <>
      <BrandHero
        label="developer reference"
        title="Token + asset reference"
        lede="Every color token, type role, asset path, and route the project ships. Authored from data files; tables render live values where they can."
      />

      <PageSection
        id="routes"
        label="01 — routes"
        title="Routes"
        body="Every URL the app serves. Wired in src/App.jsx via react-router."
      >
        <Table variant="simple" caption="Routes" columns={routeCols} rows={routeRows} />
      </PageSection>

      <PageSection
        id="generators"
        label="02 — generators"
        title="Generators"
        body="Interactive tools available at /generators. Each opens in its own full-viewport workspace; click the arrow column to launch in a new tab."
      >
        <Table variant="simple" caption="Generators" columns={generatorCols} rows={GENERATOR_ROWS} />
      </PageSection>

      {/* Brand colors — identity layer (aliases · hue ramps · cream · grey) */}
      {BRAND_COLORS_SECTIONS.map((section) => (
        <SystemSection key={section.id} section={section} columnsDict={COLOR_COLUMNS} />
      ))}

      {/* Typography — data-driven from src/data/typography.js. Each
       * section carries its own label, intro, reasoning prose, and tables
       * (with a string `columns` key that resolves to TYPE_COLUMNS above).
       * `sans-families` + `sans-atomic` are filtered out — kept for the
       * styleguide but not surfaced here. */}
      {TYPOGRAPHY_SECTIONS
        .filter((s) => s.id !== 'sans-families' && s.id !== 'sans-atomic')
        .map((section) => (
          <SystemSection key={section.id} section={section} columnsDict={TYPE_COLUMNS} />
        ))}

      <PageSection
        id="logos"
        label="11 — assets · logos"
        title="Logos"
        body="Every mark in src/brand/logos/svg/. Click a row to open the overlay; toggle the color dot to swap ink vs surface; download recolored on the fly."
      >
        <AssetTable caption="Logos" rows={markRows()} previewWidthFor={markWidthFor} />
      </PageSection>

      <PageSection
        id="graphics"
        label="12 — assets · graphics"
        title="Graphics"
        body="Abstract forms in src/components/loaders/graphics/svg/abstract/. Same overlay + recolor + download behavior as the logo table."
      >
        <AssetTable caption="Graphics" rows={graphicRows('abstract')} previewWidthFor={graphicWidthFor} />
      </PageSection>

      <PageSection
        id="patterns"
        label="13 — assets · patterns"
        title="Patterns"
        body="Tileable patterns in src/components/loaders/graphics/svg/patterns/."
      >
        <AssetTable caption="Patterns" rows={graphicRows('patterns')} previewWidthFor={graphicWidthFor} />
      </PageSection>

      <PageSection
        id="branded-assets"
        label="14 — assets · branded"
        title="Branded assets"
        body="Stationery, garment-attached labels, soft goods and packaging. Mocks live in src/components/styleguide/StationeryMocks.jsx and render in /styleguide chapter 6."
      >
        <Table variant="simple" caption="Branded assets" columns={brandedAssetCols} rows={brandedAssetRows} />
      </PageSection>

      <PageSection
        id="photos"
        label="15 — assets · photos"
        title="Photos"
        body="Every group surfaced by photoIndexPlugin (scans public/brand/). Click a group name to jump to its panel in /gallery."
      >
        <Table variant="simple" caption="Photos" columns={photoCols} rows={photoRows} />
      </PageSection>
    </>
  )
}
