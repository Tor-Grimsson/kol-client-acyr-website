/**
 * Another Creation — business / career / vendor metadata.
 *
 * Source data for the ACYR registry page (/acyr). This file
 * complements brand-info.js (identity), shop-data.js (catalog),
 * collections-data.js (lookbooks) and blog-data.js (journal) — it carries
 * everything else: bio, timeline, films, companies, press, awards,
 * collaborators, social, vendors, live-site map, marketing infrastructure.
 *
 * Items marked TBD need confirmation from Ýr.
 *
 * Last enriched 2026-04-28 from a bio dossier (`_tmp/bing.md`) — added film-school
 * education, BA essay archive link, films, residencies, and additional press
 * citations (DV, Heimildin, Iceland Monitor, Mbl, Midpoint Institute).
 *
 * Updated 2026-05-16 — added 2011/2013/2018/2020 press from Ýr (Vísir, Mannlíf,
 * Mbl) and LinkedIn social profile; resolved Address open question (Vatnsstígur 3).
 */

/* ── Personal / bio facts (private — surface only what's appropriate per page). ── */

export const BIO = {
  fullName:    'Ýr Þrastardóttir',
  birthDate:   '1984-04-09',
  birthCity:   'Oslo, Norway',
  hometown:    'Reykjavík, Iceland',
  currentCity: 'Reykjavík, Iceland',
  movedToIcelandAge: 5,
  height:      173,
  /* Director's biography (canonical, from bio dossier). */
  directorBio:
    'Ýr Þrastardóttir is an Icelandic filmmaker and multidisciplinary artist with a background in fashion design, costume design, and visual storytelling. A graduate of the Icelandic Academy of the Arts with a BA in fashion design, Ýr has spent over a decade pushing creative boundaries in multiple artistic fields. Her transition into filmmaking was a natural evolution of her passion for visual narratives, culminating in her recent graduation from the Icelandic Film School with a focus on Creative Technology.\n\nHer directorial work explores themes of identity, technology, and the human experience, often incorporating elements of artificial intelligence and digital aesthetics. Ýr\'s keen eye for composition, combined with her expertise in costume and production design, lends a distinct, immersive quality to her films. Her short film Agnes Iwaz won the Best Movie award in Creative Technology, solidifying her as a rising talent in Icelandic cinema.\n\nIn addition to directing, Ýr excels in editing, sound design, and color grading, crafting visually and emotionally compelling stories. With a strong foundation in both artistic and commercial projects, she continues to bridge the gap between technology and storytelling, creating innovative and thought-provoking cinematic experiences.',
  designerBio:
    'Fashion designer Ýr Þrastardóttir was born in Oslo, Norway, in 1984 where her parents were both graduate students. She moved to Iceland at the age of five and grew up in Reykjavík. After graduating high school she entered the Icelandic Academy of the Arts and graduated with a bachelor degree from the design department in 2011. Her graduation project attracted significant media attention; she went on to found her own fashion design company, YR Collections, before co-founding Another Creation in 2013.',
  quote: '"The essence of cinema is editing. It\'s the combination of what can be extraordinary images of people during emotional moments, or images in a general sense, put together in a kind of alchemy."',
}

/* ── Career timeline ────────────────────────────────────────────────
   `year` is the start year (or single year). `endYear` is optional for
   ranges (e.g. degree programmes). The page renders newest-first and
   formats `2007–2010` when both are present. Each row may carry an `href`
   for a link target and a `mediaType` to mark videos / archives etc. ── */

export const TIMELINE = [
  /* ── Education ─────────────────────────────────────────────────── */
  {
    year: 2007, endYear: 2010, kind: 'education',
    title: 'BA in Fashion Design',
    org:   'Icelandic Academy of the Arts',
    notes: 'Bachelor degree, design department. Formal graduation 2011.',
  },
  {
    year: 2010, kind: 'education',
    title: 'BA essay archive',
    org:   'Skemman (Iceland\'s institutional repository)',
    href:  'https://skemman.is/handle/1946/8872',
    mediaType: 'archive',
    notes: 'Public-facing record of the BA fashion graduation work.',
  },
  {
    year: 2020, endYear: 2022, kind: 'education',
    title: 'Creative Technology — Icelandic Film School',
    org:   'Icelandic Film School',
    notes: 'Graduate; pivot from fashion-only to filmmaking + multidisciplinary work.',
  },

  /* ── Shows ─────────────────────────────────────────────────────── */
  { year: 2011, kind: 'show', title: "Designer's Nest, Copenhagen Fashion Week", org: 'CPH Fashion Week',  notes: 'Represented Iceland.' },
  { year: 2011, kind: 'show', title: 'Reykjavík Fashion Festival 2011',          org: 'RFF',               notes: '1st RFF appearance — graduation collection.' },
  { year: 2012, kind: 'show', title: 'Reykjavík Fashion Festival 2012',          org: 'RFF',               notes: '2nd RFF appearance.' },
  { year: 2015, kind: 'show', title: 'Creation 1 — RFF 2015 (Another Creation debut)', org: 'Harpa, Reykjavík', notes: '3rd RFF appearance · runway video archived.' },
  { year: 2016, kind: 'show', title: 'Tískusýning Geysi í Iðnó', org: 'Iðnó, Reykjavík',  href: 'https://www.mbl.is/smartland/samkvaemislifid/2016/09/19/tiskusyning_geysi_i_idno/', notes: 'Group fashion show at Iðnó, September 2016.' },
  { year: 2017, kind: 'show', title: 'Reykjavík Fashion Festival 2017',          org: 'RFF',               notes: '4th RFF appearance.' },
  { year: 2018, kind: 'show', title: 'Creation 3 — DesignMarch 2018',            org: 'Canopý Hotel, Reykjavík', notes: '16 March · collaboration with MYRKA.' },

  /* ── Awards ────────────────────────────────────────────────────── */
  { year: 2013, kind: 'award', title: 'Selected — StartupReykjavík',                    org: 'StartupReykjavík',     notes: 'From 200+ applicants.' },
  { year: 2013, kind: 'award', title: 'Special award — Creative Business Cup',           org: 'Creative Business Cup', notes: 'Creative power × commercial sensibility.' },
  { year: 2025, kind: 'award', title: 'Best Movie in Creative Technology — Agnez Iwaz', org: 'Icelandic Film School', href: 'https://independentshortsawards.com/2025/03/31/agnez-iwaz/', notes: "Short-film award for Ýr's directorial debut." },

  /* ── Milestones ────────────────────────────────────────────────── */
  { year: 2011, kind: 'milestone', title: 'Founded YR Collections',          org: 'Reykjavík',                notes: 'First fashion company, post-BA.' },
  { year: 2011, kind: 'milestone', title: 'Kiosk design store opening',      org: 'Laugavegur, Reykjavík',    notes: 'Co-founder collective with eight young Icelandic fashion designers — Iceland-only retail.' },
  { year: 2013, kind: 'milestone', title: 'Founded Another Creation',        org: 'Reykjavík',                notes: 'Co-founded with two colleagues. Studio established.' },
  { year: 2015, kind: 'milestone', title: 'Artist residency — Xiamen, China', org: 'Chinese-European Art Centre, Xiamen', notes: 'Pattern making, fashion drawing, illustration. Per Iceland Monitor article (2015-09-08).' },

  /* ── Films (her director's work; surfaced separately too via FILMS export). ── */
  { year: 2025, kind: 'film', title: 'Agnez Iwaz', org: 'Director / Writer / Producer', href: 'https://independentshortsawards.com/2025/03/31/agnez-iwaz/', notes: 'Experimental short. Best Movie in Creative Technology.' },
  { year: 2023, kind: 'film', title: 'Portret Orri Finn', org: 'Director', notes: 'Documentary.' },

  /* ── Press / interviews / mentions ─────────────────────────────── */
  { year: 2011, kind: 'press', title: "Ýr fundaði með Barney's",                                       org: 'Vísir.is',                     href: 'https://www.visir.is/g/2011809758d/yr-fundadi-med-barney-s' },
  { year: 2013, kind: 'press', title: 'Ýr og Harpa Einars sameina krafta sína',                        org: 'Vísir.is',                     href: 'https://www.visir.is/g/20131228946d/yr-og-harpa-einars-sameina-krafta-sina', notes: 'On the Another Creation co-founding partnership.' },
  { year: 2013, kind: 'press', title: 'Yfirhöfn sem nota má á 112 mismunandi vegu',                    org: 'Vísir.is',                     href: 'https://www.visir.is/g/2013410483d/yfirhofn-sem-nota-ma-a-112-mismunandi-vegu', notes: 'On the multi-use cape.' },
  { year: 2018, kind: 'press', title: 'Fjölnota kápan í mestu uppáhaldi',                              org: 'Mannlíf',                      href: 'https://gamla.mannlif.is/vikan/fjolnota-kapan-i-mestu-uppahaldi/' },
  { year: 2020, kind: 'press', title: 'Lilja Pálma mætti í tískuteiti til Áslaugar',                   org: 'Mbl.is',                       href: 'https://www.mbl.is/smartland/samkvaemislifid/2020/05/11/lilja_palma_maetti_i_tiskuteiti_til_aslaugar/', mediaType: 'photo-gallery' },
  { year: 2015, kind: 'press', title: 'RFF 15: Another Creation changes up with the times',            org: 'Icelandmag',                  href: 'https://icelandmag.is/article/rff-15-another-creation-changes-times' },
  { year: 2015, kind: 'press', title: 'Í beinni: Another Creation — RFF',                              org: 'Trendnet.is',                  href: 'http://trendnet.is/rff/i-beinni-another-creation/', notes: 'RFF live coverage, 2015-03-14.' },
  { year: 2015, kind: 'press', title: 'Reykjavík Fashion Festival 2015 — featured',                    org: 'Interview Magazine',          href: 'https://www.interviewmagazine.com/fashion/reykjavik-fashion-festival-2015' },
  { year: 2015, kind: 'press', title: 'Icelandic designer learns ancient techniques in China',         org: 'Iceland Monitor',             href: 'https://icelandmonitor.mbl.is/news/culture_and_living/2015/09/08/icelandic_designer_learns_ancient_techniques_in_chi/', notes: 'Coverage of the Xiamen residency.' },
  { year: 2016, kind: 'press', title: 'Tískusýning Geysi í Iðnó — photo coverage',                     org: 'Mbl.is',                       href: 'https://www.mbl.is/smartland/samkvaemislifid/2016/09/19/tiskusyning_geysi_i_idno/' },
  { year: 2022, kind: 'press', title: 'Photo gallery — mbl.is myndasafn 405496',                       org: 'Mbl.is',                       href: 'https://www.mbl.is/myndasafn/mynd/405496/', mediaType: 'photo-gallery' },
  { year: 2017, kind: 'press', title: 'Fær að skapa ákveðinn heim í bland við tónlist og grafík',      org: 'DV.is (Fókus / Stjörnufréttir)', href: 'https://www.dv.is/fokus/stjornufrettir/2017/03/20/fae-ad-skapa-akvedinn-heim-i-bland-vid-tonlist-og-grafik-yr-thrastardottir-verdur-a-rff/', notes: 'RFF 2017 preview interview.' },
  { year: 2018, kind: 'press', title: 'From Fabric To Fruition: The Structural Designs Of Another Creation', org: 'Reykjavík Grapevine', href: 'https://grapevine.is/icelandic-culture/design/2018/03/15/from-fabric-to-fruition-the-structural-designs-of-another-creation/' },
  { year: 2021, kind: 'press', title: 'Designer Ýr Þrastardóttir is upcycling sweatpants into hikingboots', org: 'Iceland Design & Architecture', href: 'https://www.honnunarmidstod.is/en/ha-frettir/designer-yr-thrastardottir-is-upcycling-sweatpants-into-hikingboots', notes: 'Business Iceland campaign feature.' },
  { year: 2022, kind: 'press', title: 'Í vöku og draumi',                                              org: 'Heimildin',                    href: 'https://heimildin.is/grein/15551/i-voku-og-draumi/', mediaType: 'video', notes: 'Video interview / feature.' },
  { year: 2021, kind: 'press', title: 'Apotek Atelier opnar í miðbænum',                               org: 'Iceland Design & Architecture', href: 'https://www.honnunarmidstod.is/ha-frettir/apotek-atelier-opnar-i-midbaenum' },
  { year: 2021, kind: 'press', title: 'Photo gallery — mbl.is myndasafn 447350',                       org: 'Mbl.is',                       href: 'https://www.mbl.is/myndasafn/mynd/447350/', mediaType: 'photo-gallery' },
  { year: 2022, kind: 'press', title: 'Við erum öll ólík en það er mjög hvetjandi að vinna saman',     org: 'Vísir.is',                     href: 'https://www.visir.is/g/20222254010d/-vid-erum-oll-olik-en-thad-er-mjog-hvetjandi-ad-vinna-saman-' },
  { year: 2025, kind: 'press', title: 'April 2025 award winners — gallery',                            org: 'Independent Shorts Awards',     href: 'https://independentshortsawards.com/award-winners-april-2025/', mediaType: 'photo-gallery', notes: 'Includes images from the Agnez Iwaz award.' },

  /* ── Profiles ──────────────────────────────────────────────────── */
  { year: null, kind: 'profile', title: 'FilmFreeway — Ýr Þrastardóttir', org: 'FilmFreeway', href: 'https://filmfreeway.com/YrThrastardottir', notes: 'Director profile for festival submissions.' },
  { year: null, kind: 'profile', title: 'Midpoint Institute — Ýr Þrastardóttir', org: 'Midpoint Institute', href: 'https://www.midpoint-institute.eu/sk/person/yr-6fzHdy', notes: 'Person page on the European film-development institute (Feature Launch 2024 participant).' },
]

export const TIMELINE_KINDS = [
  { key: 'education',  label: 'Education' },
  { key: 'show',       label: 'Shows' },
  { key: 'press',      label: 'Press' },
  { key: 'award',      label: 'Awards' },
  { key: 'milestone',  label: 'Milestones' },
  { key: 'film',       label: 'Films' },
  { key: 'profile',    label: 'Profiles' },
]

/* ── Filtered selectors ──────────────────────────────────────────── */

export const PRESS    = TIMELINE.filter((t) => t.kind === 'press')
export const AWARDS   = TIMELINE.filter((t) => t.kind === 'award')
export const FILMS    = TIMELINE.filter((t) => t.kind === 'film')
export const PROFILES = TIMELINE.filter((t) => t.kind === 'profile')

/* ── Companies founded (cross-cuts the timeline; keeping a flat list for the registry). ── */

export const COMPANIES = [
  { name: 'Another Creation',  role: 'Co-founder',  years: '2013–present',  status: 'active',    notes: 'Current label. Co-founded with two colleagues.' },
  { name: 'Kiosk',             role: 'Co-founder',  years: '2011',          status: 'archived',  notes: 'Retail collective with eight young Icelandic fashion designers — Iceland-only retail. Laugavegur, Reykjavík.' },
  { name: 'YR Collections',    role: 'Founder',     years: '2011',          status: 'archived',  notes: 'First fashion company; founded post-BA.' },
]

/* ── Collaborators / commissions (broad reference; collection-specific
   credits live on each collection entry). ── */

export const COLLABORATIONS = [
  { client: 'Icelandic Opera',        type: 'opera',       year: null, notes: 'Costume design + styling — award-winning.' },
  { client: 'Iceland Dance Company',  type: 'dance',       year: null, notes: 'Costume design + styling — award-winning.' },
  { client: 'Zebra Katz',             type: 'music-video', year: null, notes: 'Costume design.' },
  { client: 'Mammút',                 type: 'music-video', year: null, notes: 'Costume design.' },
  { client: 'Berndsen',               type: 'music-video', year: null, notes: 'Costume design.' },
  { client: 'MYRKA',                  type: 'co-design',   year: 2018, notes: 'Co-designer on Creation 3 (DesignMarch 2018).' },
  { client: 'Film productions',       type: 'film',        year: null, notes: 'Icelandic and international productions — specifics TBD.' },
]

/* ── Social presence. ── */

export const SOCIAL = [
  { platform: 'Instagram',   handle: '@anothercreation_yr', url: 'https://www.instagram.com/anothercreation_yr/', notes: 'Primary brand account.' },
  { platform: 'Instagram',   handle: '@xyrx',               url: 'https://www.instagram.com/xyrx/',               notes: "Ýr's secondary handle." },
  { platform: 'Facebook',    handle: '@anothercreationyr',  url: 'https://www.facebook.com/anothercreationyr/',   notes: null },
  { platform: 'LinkedIn',    handle: 'creatoryr',           url: 'https://www.linkedin.com/in/creatoryr/',        notes: "Ýr's professional profile." },
  { platform: 'FilmFreeway', handle: 'YrThrastardottir',    url: 'https://filmfreeway.com/YrThrastardottir',      notes: 'Director profile.' },
  { platform: 'TikTok',      handle: '@yr_another_creation', url: 'https://www.tiktok.com/@yr_another_creation',  notes: null },
  { platform: 'X',           handle: '@xYrx',               url: 'https://x.com/xYrx',                           notes: "Ýr's secondary handle." },
]

/* ── Vendors / business contacts. ── */

export const VENDORS = [
  {
    name: 'Printful',
    role: 'Print-on-demand fulfilment',
    notes: 'All-over-print catalog backing the activewear/swim line. Latvia warehouse handles EU shipping. Public Catalog API; OAuth-bearer Store API for sync.',
    url: 'https://www.printful.com/',
    status: 'active',
  },
  {
    name: 'Squarespace',
    role: 'E-commerce host (current)',
    notes: 'Storefront + cart + checkout for the live shop. Recommended migration path → Stripe + Printful API once we want to consolidate.',
    url: 'https://www.squarespace.com/',
    status: 'active',
  },
  {
    name: 'Henson',
    role: 'Unrelated Iceland sportswear brand',
    notes: 'Initially flagged as a possible "partner" — research found no connection. Henson (henson.is, est. 1969) is unrelated to Another Creation. Disambiguating here so it is not re-introduced as a sub-brand.',
    url: 'https://henson.is/',
    status: 'unrelated',
  },
  {
    name: 'Italian production',
    role: 'Manufacturing partner',
    notes: 'Per the bio dossier: "Production of the [SS 2015] collection is done in Italy." TBD which atelier / mill / specific contact.',
    url: null,
    status: 'tbd',
  },
  {
    name: 'Chinese-European Art Centre, Xiamen',
    role: 'Past artist residency',
    notes: 'Hosted Ýr in 2015 for pattern making / fashion drawing / illustration residency.',
    url: null,
    status: 'past',
  },
  {
    name: 'Photographer',
    role: 'Editorial / lookbook',
    notes: 'TBD — current site uses model photography credited to multiple sources. Verify with Ýr.',
    url: null,
    status: 'tbd',
  },
]

/* ── Tech stack / decisions. ── */

export const STACK = [
  { layer: 'Frontend',       choice: 'React 19 + Vite 8 + Tailwind 4',                                 status: 'shipped'  },
  { layer: 'Design system',  choice: 'KOL (Kolkrabbi) — local single-tier',                            status: 'shipped'  },
  { layer: 'Hosting',        choice: 'Vercel (deploy) · Squarespace (legacy storefront)',              status: 'shipped'  },
  { layer: 'CMS (proposed)', choice: 'Sanity (cloud free tier) — block-typed body matches',           status: 'proposed' },
  { layer: 'Payments',       choice: 'Squarespace today · Stripe + Printful API on migration',         status: 'planned' },
  { layer: 'Analytics',      choice: 'Meta Pixel for ad attribution · plausible/umami for general',    status: 'planned' },
  { layer: 'Image CDN',      choice: 'Squarespace CDN (legacy) · → Sanity CDN on migration',           status: 'planned' },
]

/* ── Live-site map: anothercreation.com → our /site/* routes. ── */

export const LIVE_SITE_MAP = [
  { live: '/',                       label: 'Home',                 ours: '/site',                                coverage: 'partial' },
  { live: '/shop-now',               label: 'Shop',                 ours: '/site/shop',                           coverage: 'covered' },
  { live: '/shop-now/p/:slug',       label: 'Product detail',       ours: '/site/shop/:slug',                     coverage: 'covered' },
  { live: '/handmade',               label: 'Handmade',             ours: '/site/handmade',                       coverage: 'covered' },
  { live: '/handmade/p/:slug',       label: 'Handmade detail',      ours: '/site/handmade/:slug',                 coverage: 'covered' },
  { live: '/creation-i',             label: 'Creation 1',           ours: '/site/collections/creation-1',         coverage: 'covered' },
  { live: '/creation-ii',            label: 'Creation 2',           ours: '/site/collections/creation-2',         coverage: 'covered' },
  { live: '/creation-iii',           label: 'Creation 3',           ours: '/site/collections/creation-3',         coverage: 'covered' },
  { live: '/creation-iiii',          label: 'Creation 4',           ours: '/site/collections/creation-4',         coverage: 'covered' },
  { live: '/creation-x',             label: 'Creation 5',           ours: '/site/collections/creation-5',         coverage: 'covered' },
  { live: '/creation-xi',            label: 'Creation 6',           ours: '/site/collections/creation-6',         coverage: 'covered' },
  { live: '/cycle-7',                label: 'Creation 7',           ours: '/site/collections/creation-7',         coverage: 'covered' },
  { live: '/contact',                label: 'Contact',              ours: '/site/contact',                        coverage: 'covered' },
  { live: '/about',                  label: 'About',                ours: '/site/about',                          coverage: 'planned' },
  { live: '/shipping-and-returns',   label: 'Shipping & returns',   ours: '/site/shipping-returns',               coverage: 'covered' },
  { live: '/terms-of-service',       label: 'Terms',                ours: '/site/terms',                          coverage: 'covered' },
  { live: '/privacy-policy',         label: 'Privacy',              ours: '/site/privacy',                        coverage: 'covered' },
  { live: '/cart',                   label: 'Cart',                 ours: '/site/cart',                           coverage: 'covered' },
  { live: '/checkout',               label: 'Checkout',             ours: '/site/checkout',                       coverage: 'covered' },
]

/* ── Marketing infrastructure (Meta ads + Instagram Shopping playbook). ── */

export const MARKETING_PLAYBOOK = [
  { step: 1, title: 'Set up Meta Business Suite',     body: 'Free. ~30 min. Connect Instagram Business + Facebook Page. Required to run any ads or shop tags.' },
  { step: 2, title: 'Connect product catalog',         body: 'Squarespace has one-click sync to Meta Catalog. Printful also has a direct Meta integration. Either path puts the SKUs in Meta automatically — no manual work.' },
  { step: 3, title: 'Tag products in stories / posts', body: 'Once a catalog is linked, the link sticker in stories and the product-tag sticker in posts work. Taps go to the product URL — either external (her site) or native Instagram Shopping checkout.' },
  { step: 4, title: 'Install Meta Pixel',              body: 'One JS snippet on the site. Tracks page views + add-to-cart + checkout for ad attribution. Free.' },
  { step: 5, title: 'Run ads',                          body: 'Boosted post or full Ads Manager campaign — pay for reach + conversions. Pixel + catalog supply the targeting + creative automatically.' },
]

/* ── Open gaps. ── */

export const OPEN_QUESTIONS = [
  { topic: 'Collection dates',    note: 'Confirm year + venue for Creations 4, 5, 6, 7.' },
  { topic: 'Collection credits',  note: 'Photographer / stylist / model / MUA per collection.' },
  { topic: 'Runway videos',       note: 'Footage exists for RFF 2015 only. Other shows TBD.' },
  { topic: 'Italian production',  note: 'Atelier / mill name + contact for the Italian production partner mentioned in 2015 bio.' },
  { topic: 'Stockists',           note: 'Confirm whether retail stockists exist; drives whether /stockists ships.' },
  { topic: 'Films — Portret Orri Finn', note: 'Festival circuit for the documentary.' },
]
