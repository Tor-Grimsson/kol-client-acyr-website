import { Link } from 'react-router-dom'
import BrandHero from '../components/framework/BrandHero'
import PageSection from '../components/framework/PageSection'
import Table from '@components/organisms/Table'
import Divider from '@components/atoms/Divider'
import Badge from '@components/molecules/Badge'
import usePageTitle from '../components/hooks/usePageTitle'
import { BRAND_INFO } from '@ac/brand-data/info'
import {
  BIO,
  TIMELINE, TIMELINE_KINDS, PRESS, AWARDS, FILMS, PROFILES,
  COMPANIES, COLLABORATIONS, SOCIAL,
  VENDORS, STACK, LIVE_SITE_MAP, MARKETING_PLAYBOOK, OPEN_QUESTIONS,
} from '@ac/brand-data/business-data'
import { PRODUCTS } from '@website-data/shop-data'

/* ── Helpers ── */

const TokenName = ({ children }) => <code className="ac-helper-xs text-emphasis">{children}</code>
const Meta = ({ children }) => <span className="ac-helper-xs text-meta">{children}</span>

const yearAsc  = (a, b) => a.year - b.year
const yearDesc = (a, b) => (b.year ?? 0) - (a.year ?? 0)

/* Coverage badge for live-site map */
const CoverageBadge = ({ coverage }) => {
  const variants = { covered: 'success', partial: 'warning', planned: 'outline' }
  const labels   = { covered: 'covered', partial: 'partial',  planned: 'planned' }
  return <Badge variant={variants[coverage] ?? 'outline'} size="sm">{labels[coverage] ?? coverage}</Badge>
}

const KindBadge = ({ kind }) => {
  const map = {
    education: 'info',
    show:      'success',
    press:     'outline',
    award:     'warning',
    milestone: 'default',
    film:      'info',
    profile:   'outline',
  }
  return <Badge variant={map[kind] ?? 'outline'} size="sm">{kind}</Badge>
}

const StatusBadge = ({ status }) => {
  const map = {
    active: 'success', shipped: 'success', proposed: 'info', planned: 'warning',
    tbd: 'outline', unrelated: 'destructive', archived: 'outline', past: 'outline',
  }
  return <Badge variant={map[status] ?? 'outline'} size="sm">{status}</Badge>
}

/* "year" / "year–endYear" pretty render. */
const formatYear = (r) => {
  if (r.year && r.endYear) return `${r.year}–${r.endYear}`
  if (r.year)              return String(r.year)
  return '—'
}

/* Media-type badge rendered inline next to a title for video / archive / etc. */
const MediaBadge = ({ mediaType }) => {
  if (!mediaType) return null
  const map = { video: 'critical', archive: 'info', 'photo-gallery': 'outline' }
  return <Badge variant={map[mediaType] ?? 'outline'} size="sm" className="ml-2">{mediaType}</Badge>
}

/* ── Tables ── */

const identityRows = [
  { field: 'Founder',       value: BRAND_INFO.identity.founder },
  { field: 'Role',          value: BRAND_INFO.identity.role },
  { field: 'Brand',         value: BRAND_INFO.identity.name },
  { field: 'Established',   value: BRAND_INFO.identity.established },
  { field: 'Studio',        value: `${BRAND_INFO.studio.street}, ${BRAND_INFO.studio.postcode}, ${BRAND_INFO.studio.country}` },
  { field: 'Email',         value: BRAND_INFO.contact.email },
  { field: 'Phone',         value: BRAND_INFO.contact.phone },
  { field: 'Web',           value: BRAND_INFO.contact.web },
  { field: 'Legal entity',  value: BRAND_INFO.legal.entity },
  { field: 'Kennitala',     value: BRAND_INFO.legal.kt },
]

const identityCols = [
  { accessor: 'field', header: 'Field', render: (r) => <Meta>{r.field}</Meta> },
  { accessor: 'value', header: 'Value', render: (r) => <span className="text-emphasis">{r.value}</span> },
]

const timelineCols = [
  { accessor: 'year',  header: 'Year',  render: (r) => <span className="text-emphasis">{formatYear(r)}</span> },
  { accessor: 'kind',  header: 'Kind',  render: (r) => <KindBadge kind={r.kind} /> },
  { accessor: 'title', header: 'Title', render: (r) => (
      <span>
        {r.href
          ? <a href={r.href} target="_blank" rel="noopener noreferrer" className="text-emphasis underline underline-offset-4 decoration-fg-24 hover:decoration-fg-64">{r.title}</a>
          : <span className="text-emphasis">{r.title}</span>}
        <MediaBadge mediaType={r.mediaType} />
      </span>
  ) },
  { accessor: 'org',   header: 'Org / Outlet', render: (r) => <span className="text-body">{r.org}</span> },
  { accessor: 'notes', header: 'Notes',        render: (r) => <Meta>{r.notes ?? '—'}</Meta> },
]

const companyCols = [
  { accessor: 'name',   header: 'Company', render: (r) => <span className="text-emphasis">{r.name}</span> },
  { accessor: 'role',   header: 'Role',    render: (r) => <span className="text-body">{r.role}</span> },
  { accessor: 'years',  header: 'Years',   render: (r) => <Meta>{r.years}</Meta> },
  { accessor: 'status', header: 'Status',  render: (r) => <StatusBadge status={r.status} /> },
  { accessor: 'notes',  header: 'Notes',   render: (r) => <Meta>{r.notes}</Meta> },
]

const collabCols = [
  { accessor: 'client', header: 'Client',  render: (r) => <span className="text-emphasis">{r.client}</span> },
  { accessor: 'type',   header: 'Kind',    render: (r) => <Badge variant="outline" size="sm">{r.type}</Badge> },
  { accessor: 'year',   header: 'Year',    render: (r) => <Meta>{r.year ?? '—'}</Meta> },
  { accessor: 'notes',  header: 'Notes',   render: (r) => <Meta>{r.notes}</Meta> },
]

const socialCols = [
  { accessor: 'platform', header: 'Platform', render: (r) => <span className="text-emphasis">{r.platform}</span> },
  { accessor: 'handle',   header: 'Handle',   render: (r) => <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-emphasis underline underline-offset-4 decoration-fg-24 hover:decoration-fg-64">{r.handle}</a> },
  { accessor: 'notes',    header: 'Notes',    render: (r) => <Meta>{r.notes ?? '—'}</Meta> },
]

const vendorCols = [
  { accessor: 'name',   header: 'Name',  render: (r) => r.url
      ? <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-emphasis underline underline-offset-4 decoration-fg-24 hover:decoration-fg-64">{r.name}</a>
      : <span className="text-emphasis">{r.name}</span> },
  { accessor: 'role',   header: 'Role',   render: (r) => <span className="text-body">{r.role}</span> },
  { accessor: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  { accessor: 'notes',  header: 'Notes',  render: (r) => <Meta>{r.notes}</Meta> },
]

const stackCols = [
  { accessor: 'layer',  header: 'Layer',  render: (r) => <span className="text-emphasis">{r.layer}</span> },
  { accessor: 'choice', header: 'Choice', render: (r) => <span className="text-body">{r.choice}</span> },
  { accessor: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
]

const liveMapCols = [
  { accessor: 'live',     header: 'Her live route',  render: (r) => <TokenName>{r.live}</TokenName> },
  { accessor: 'label',    header: 'Label',           render: (r) => <span className="text-body">{r.label}</span> },
  { accessor: 'ours',     header: 'Our route',       render: (r) => <TokenName>{r.ours}</TokenName> },
  { accessor: 'coverage', header: 'Coverage',        render: (r) => <CoverageBadge coverage={r.coverage} /> },
]

const playbookCols = [
  { accessor: 'step',  header: 'Step',  render: (r) => <span className="text-emphasis">{String(r.step).padStart(2, '0')}</span> },
  { accessor: 'title', header: 'Title', render: (r) => <span className="text-emphasis">{r.title}</span> },
  { accessor: 'body',  header: 'Detail', render: (r) => <span className="text-body">{r.body}</span> },
]

const gapsCols = [
  { accessor: 'topic', header: 'Topic', render: (r) => <span className="text-emphasis">{r.topic}</span> },
  { accessor: 'note',  header: 'Note',  render: (r) => <span className="text-body">{r.note}</span> },
]

/* ── Media inventory ── */
/* Collections + Journal counts now live in Sanity (not derived here).
   See studio.another-creation.xyz for live content. */

const mediaInventoryRows = [
  {
    surface: 'Collections · live in Sanity',
    images: '—',
    video: '—',
    coverType: 'see Studio',
    yearKnown: true,
    creditsKnown: true,
  },
  {
    surface: 'Journal · live in Sanity',
    images: '—',
    video: 0,
    coverType: 'see Studio',
    yearKnown: true,
    creditsKnown: true,
  },
  {
    surface: 'Shop · POD line',
    images: PRODUCTS.filter((p) => p.kind === 'pod').length,
    video: 0,
    coverType: 'image',
    yearKnown: true,
    creditsKnown: true,
  },
  {
    surface: 'Shop · Handmade',
    images: PRODUCTS.filter((p) => p.kind === 'handmade').length,
    video: 0,
    coverType: 'image',
    yearKnown: true,
    creditsKnown: true,
  },
]

const mediaInventoryCols = [
  { accessor: 'surface',      header: 'Surface',          render: (r) => r.to
    ? <Link to={r.to} className="text-emphasis underline decoration-fg-32 hover:decoration-current">{r.surface}</Link>
    : <span className="text-emphasis">{r.surface}</span>
  },
  { accessor: 'images',       header: 'Images',           render: (r) => <span className="text-body">{r.images}</span> },
  { accessor: 'video',        header: 'Video',            render: (r) => <span className="text-body">{r.video}</span> },
  { accessor: 'coverType',    header: 'Cover',            render: (r) => <Meta>{r.coverType}</Meta> },
  { accessor: 'yearKnown',    header: 'Date known?',      render: (r) => r.yearKnown      ? <Badge variant="success" size="sm">yes</Badge> : <Badge variant="warning" size="sm">no</Badge> },
  { accessor: 'creditsKnown', header: 'Credits known?',   render: (r) => r.creditsKnown   ? <Badge variant="success" size="sm">yes</Badge> : <Badge variant="warning" size="sm">no</Badge> },
]

/* ── Page ── */

export default function Acyr() {
  usePageTitle('ACYR · Yr Þrastardóttir · Another Creation')
  const timelineDesc = [...TIMELINE].sort(yearDesc)

  const counts = {
    products:    PRODUCTS.length,
    timeline:    TIMELINE.length,
    press:       PRESS.length,
    awards:      AWARDS.length,
    films:       FILMS.length,
    companies:   COMPANIES.length,
    collaborations: COLLABORATIONS.length,
    social:      SOCIAL.length,
  }

  return (
    <>
      <BrandHero
        label="ACYR · source of truth"
        title="Ýr Þrastardóttir"
        lede="Single-page registry of everything we know about the brand: identity, career timeline, press, collaborators, vendors, live-site mirror, and gaps. All data drawn live from the project's data files — edit once, propagate everywhere."
      >
        <p className="ac-sans-body-03 max-w-[60ch] text-meta">
          <strong>Snapshot.</strong> {counts.products} catalog products ·
          {' '}{counts.companies} companies · {counts.films} films ·
          {' '}{counts.timeline} dated career events · {counts.press} press citations ·
          {' '}{counts.awards} awards · {counts.collaborations} collaborators ·
          {' '}{counts.social} social channels. Collections + journal counts live in Sanity.
        </p>
      </BrandHero>

      <PageSection id="identity" label="01 — identity" title="Identity" body="Pulled live from src/data/brand-info.js.">
        <Table variant="simple" columns={identityCols} rows={identityRows} />
      </PageSection>

      <PageSection id="bio" label="02 — bio" title="Designer & director" body="Two parallel biographies — fashion designer and filmmaker — plus a personal-detail card.">
        <div className="ac-prose">
          <p>
            <strong>Born.</strong> {new Date(BIO.birthDate).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })} in {BIO.birthCity}. Moved to Iceland age {BIO.movedToIcelandAge}; grew up in {BIO.hometown}.
          </p>
          <p>{BIO.designerBio}</p>
          <p style={{ fontStyle: 'italic' }}>{BIO.directorBio}</p>
          <blockquote>
            <p>{BIO.quote}</p>
          </blockquote>
        </div>
      </PageSection>

      <PageSection id="timeline" label="03 — career timeline" title="Career timeline" body="Education, shows, press, awards, milestones, films — sorted newest first.">
        <Table variant="simple" columns={timelineCols} rows={timelineDesc} />
      </PageSection>

      <PageSection id="press" label="04 — press" title="Press archive" body="Articles, interviews, mentions. Items tagged 'video' are interviews; 'archive' is institutional record; 'photo-gallery' is image-only.">
        <Table variant="simple" columns={timelineCols} rows={[...PRESS].sort(yearDesc)} />
      </PageSection>

      <PageSection id="awards" label="05 — awards & education" title="Awards & education" body="Recognition + formal education credentials.">
        <Table variant="simple" columns={timelineCols} rows={[...AWARDS, ...TIMELINE.filter((t) => t.kind === 'education')].sort(yearDesc)} />
      </PageSection>

      <PageSection id="films" label="06 — films" title="Films" body="Director's work. Pivot from fashion-only to filmmaking + multidisciplinary post Icelandic Film School (2022).">
        <Table variant="simple" columns={timelineCols} rows={[...FILMS].sort(yearDesc)} />
      </PageSection>

      <PageSection id="companies" label="07 — companies" title="Companies founded" body="Studios and labels Ýr has founded or co-founded.">
        <Table variant="simple" columns={companyCols} rows={COMPANIES} />
      </PageSection>

      <PageSection id="collaborations" label="08 — collaborations" title="Collaborations & commissions" body="Long-form clients (opera, dance) and short-form credits (music videos, films, co-design).">
        <Table variant="simple" columns={collabCols} rows={COLLABORATIONS} />
      </PageSection>

      <PageSection id="social" label="09 — social" title="Social presence" body="Public channels including the FilmFreeway director profile.">
        <Table variant="simple" columns={socialCols} rows={SOCIAL} />
      </PageSection>

      <PageSection id="vendors" label="10 — vendors" title="Vendors & business contacts" body="Active and TBD vendors. Henson is included for disambiguation only — it is not a partner.">
        <Table variant="simple" columns={vendorCols} rows={VENDORS} />
      </PageSection>

      <PageSection id="stack" label="11 — stack" title="Tech stack & decisions" body="What we ship, what is proposed, what is planned.">
        <Table variant="simple" columns={stackCols} rows={STACK} />
      </PageSection>

      <PageSection id="live-site" label="12 — live-site map" title="Her live site mirrored against ours" body="Cross-reference — every page on anothercreation.com matched against our route table. Coverage shows where we have solved 1:1, where we are partial, where we are still planning.">
        <Table variant="simple" columns={liveMapCols} rows={LIVE_SITE_MAP} />
      </PageSection>

      <PageSection id="media" label="13 — media inventory" title="Media inventory" body="Per-surface counts. Surfaces marked 'no' on Date known / Credits known are gaps to fill.">
        <Table variant="simple" columns={mediaInventoryCols} rows={mediaInventoryRows} />
      </PageSection>

      <PageSection id="marketing" label="14 — marketing infra" title="Instagram / Facebook ads playbook" body="Story-linked product ads — Ýr asked about this. It is admin not engineering. Five steps; total effort half a day.">
        <Table variant="simple" columns={playbookCols} rows={MARKETING_PLAYBOOK} />
      </PageSection>

      <PageSection id="gaps" label="15 — gaps" title="Open questions" body="Things we cannot answer from the data files; need Ýr's input before they can be filled in.">
        <Table variant="simple" columns={gapsCols} rows={OPEN_QUESTIONS} />
      </PageSection>
    </>
  )
}
