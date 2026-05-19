/**
 * Color system — data + reasoning.
 *
 * Single source of truth for the /reference color surface. Two top-level
 * groups:
 *
 *   BRAND_COLORS_SECTIONS  — identity layer: aliases · hue ramps · cream · grey
 *   UI_COLORS_SECTIONS     — chrome layer:    surface · state · absolute ·
 *                            fg-* opacity primitives · fg-* class families
 *
 *
 * Pattern (consumed by src/pages/Reference.jsx, mirrors typography.js):
 *   { id, label, title, intro, reasoning?, tables: [{ caption, columns, rows }] }
 *
 * `columns` is a string key resolved by COLOR_COLUMNS in Reference.jsx
 * (JSX render funcs can't live in pure data files; that's the bridge).
 */

/* ============================================================================
 * BRAND_RAMPS — shared definition consumed by Reference, Styleguide, Demo
 * ============================================================================ */

export const BRAND_RAMPS = [
  {
    id: 'brand-burgundy', label: 'Burgundy', anchor: 200,
    stops: [100, 200, 300, 400, 500],
    note: 'AC brand identity hue. Anchor at 200 — Burgundy. Named identities: 200 = Burgundy · 300 = Dark Maroon · 400 = Deep Wine.',
    rowNotes: {
      100: 'Light burgundy.',
      200: 'Anchor — Burgundy. Brand primary.',
      300: 'Dark Maroon. Ink on cream-300.',
      400: 'Deep Wine.',
      500: 'Deepest burgundy before black.',
    },
  },
  {
    id: 'cream', label: 'Cream',
    stops: [100, 200, 300, 400, 500],
    note: 'Utility neutral, project-flavored. Anchored on Champagne (300) and Sand Gold (400).',
    rowNotes: {
      100: 'Lightest cream — paper, ink-on-burgundy.',
      300: 'Champagne Beige. Brand secondary.',
      400: 'Sand Gold.',
    },
  },
  {
    id: 'grey', label: 'Greyscale',
    stops: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    note: 'Legacy 10-stop neutral. Kept until opacity-hex revival (drift §13).',
    rowNotes: {
      50:  'Paper.',
      900: 'Ink. Page bg in dark mode.',
    },
  },
]

const HUE_RAMPS = BRAND_RAMPS.filter(r => r.id.startsWith('brand-'))
const CREAM_RAMP = BRAND_RAMPS.find(r => r.id === 'cream')
const GREY_RAMP  = BRAND_RAMPS.find(r => r.id === 'grey')

const rampToRows = (ramp) => ramp.stops.map(s => ({
  token: `--${ramp.id}-${s}`,
  note:  ramp.rowNotes?.[s] || (s === ramp.anchor ? 'Anchor.' : ''),
}))

/* ============================================================================
 * Brand · aliases — semantic identity tokens (4 lines that drive the brand)
 * ============================================================================ */

const aliasRows = [
  { token: '--brand-primary',      resolvesTo: '--brand-burgundy-200', use: 'Dominant brand color (kicker, link, brand-tinted text)' },
  { token: '--brand-on-primary',   resolvesTo: '--cream-100',          use: 'Ink that goes on top of brand-primary' },
  { token: '--brand-secondary',    resolvesTo: '--cream-300',          use: 'Secondary brand color' },
  { token: '--brand-on-secondary', resolvesTo: '--brand-burgundy-300', use: 'Ink that goes on top of brand-secondary' },
]

/* ============================================================================
 * UI · surface — page chrome, mode-flipping pairs
 * ============================================================================ */

const surfaceRows = [
  { token: '--ac-surface-primary',    light: '#FAFAFA', dark: '#121215', use: 'Page background' },
  { token: '--ac-surface-on-primary', light: '#121215', dark: '#FAFAFA', use: 'Text on page (text-auto)' },
  { token: '--ac-surface-secondary',  light: '#F2F2F2', dark: '#19191D', use: 'Raised surface (cards, panels)' },
  { token: '--ac-surface-tertiary',   light: '#FFFFFF', dark: '#0E0E11', use: 'Elevated tier' },
  { token: '--ac-surface-inverse',    light: '#0E0E11', dark: '#FCFBF8', use: 'Inverted panel (.bg-surface-inverse)' },
  { token: '--ac-surface-on-inverse', light: '#FCFBF8', dark: '#0E0E11', use: 'Text on inverse panel' },
]

/* ============================================================================
 * UI · state — error / warning / info / success
 * ============================================================================ */

const stateRows = [
  { state: 'error',   sample: 'Submission blocked', token: '--ui-error',   dark: '#B91C1C', light: '#DC2626', use: 'Destructive, blocking, invalid' },
  { state: 'warning', sample: 'Attention needed',   token: '--ui-warning', dark: '#EAB308', light: '#CA8A04', use: 'Caution, attention required' },
  { state: 'info',    sample: 'Heads up',           token: '--ui-info',    dark: '#1D4ED8', light: '#2563EB', use: 'Neutral system message' },
  { state: 'success', sample: 'Confirmed',          token: '--ui-success', dark: '#15803D', light: '#16A34A', use: 'Confirmation, completion' },
]

/* ============================================================================
 * UI · absolute — theme-invariant primitives
 * ============================================================================ */

const absoluteRows = [
  { token: '--ac-color-absolute-black', note: 'Strict black. Sunken role (e.g., marquee bg).' },
  { token: '--ac-color-absolute-white', note: 'Strict white. On-imagery cream button text.' },
]

/* ============================================================================
 * UI · fg-* opacity primitives — 14-stop foreground ramp
 *
 * --ac-fg-NN tokens are color-mix expressions over --ac-surface-on-primary;
 * they auto-flip on .bg-surface-inverse via the surface-context redeclaration
 * in ac-color.css. The ink-hierarchy descriptors (subtle/mute/meta/body/
 * strong/emphasis) live under typography — they alias these primitives.
 * ============================================================================ */

const fgPrimitiveRows = [
  { token: '--ac-fg-01', utility: 'text-fg-01 / bg-fg-01 / border-fg-01', use: 'Barely visible — texture, near-invisible washes' },
  { token: '--ac-fg-02', utility: 'text-fg-02 / bg-fg-02 / border-fg-02', use: 'Faint background tint' },
  { token: '--ac-fg-04', utility: 'text-fg-04 / bg-fg-04 / border-fg-04', use: 'Code block bg, very subtle fill' },
  { token: '--ac-fg-08', utility: 'text-fg-08 / bg-fg-08 / border-fg-08', use: 'Hairlines, dividers, default border (workhorse)' },
  { token: '--ac-fg-12', utility: 'text-fg-12 / bg-fg-12 / border-fg-12', use: 'Soft borders, hover-state bgs' },
  { token: '--ac-fg-16', utility: 'text-fg-16 / bg-fg-16 / border-fg-16', use: 'Faint elements, secondary borders' },
  { token: '--ac-fg-24', utility: 'text-fg-24 / bg-fg-24 / border-fg-24 (≈ text-subtle)', use: 'Disabled hints, lightest descriptor stop' },
  { token: '--ac-fg-32', utility: 'text-fg-32 / bg-fg-32 / border-fg-32',   use: 'Dim labels, quiet UI hints' },
  { token: '--ac-fg-40', utility: 'text-fg-40 / border-fg-40',                            use: 'Outline-button border' },
  { token: '--ac-fg-48', utility: 'text-fg-48 / bg-fg-48 / border-fg-48 (≈ text-meta)',   use: 'Labels, eyebrows, captions' },
  { token: '--ac-fg-64', utility: 'text-fg-64 / bg-fg-64 / border-fg-64 (≈ text-body)',   use: 'Running copy, link default' },
  { token: '--ac-fg-80', utility: 'text-fg-80 / bg-fg-80 / border-fg-80 (≈ text-strong)', use: 'Lede paragraphs, emphasized body, <strong>' },
  { token: '--ac-fg-88', utility: 'text-fg-88 / border-fg-88',                            use: 'Near-emphasis (rarely needed; prefer text-emphasis)' },
  { token: '--ac-fg-96', utility: 'text-fg-96',                                            use: 'Strong text just below full ink' },
]

/* Numeric-suffix class families — same NN suffix, different property prefix. */
const fgFamilyRows = [
  { property: 'text-fg-NN',   example: 'text-fg-08',   hover: 'hover:text-fg-08',   use: 'Foreground ink — paragraph color, link color, currentColor for icons' },
  { property: 'bg-fg-NN',     example: 'bg-fg-12',     hover: 'hover:bg-fg-12',     use: 'Surface tint — panel fills, chip bg, hover overlays' },
  { property: 'border-fg-NN', example: 'border-fg-08', hover: 'hover:border-fg-08', use: 'Borders, dividers, hairlines' },
]

/* ============================================================================
 * Section exports
 * ============================================================================ */

export const BRAND_COLORS_SECTIONS = [
  {
    id: 'brand-aliases',
    label: '03 — brand · aliases',
    title: 'Brand aliases',
    intro:
      "Semantic identity tokens. Pointers to ramp stops; consume these, not the " +
      "raw stops, for brand-tinted surfaces.",
    reasoning:
      "Edit these four lines to rebrand without touching any consumer. Pairs " +
      "(primary + on-primary, secondary + on-secondary) ensure ink-on-fill " +
      "contrast holds across the system.",
    tables: [
      { caption: 'Brand aliases', columns: 'alias', rows: aliasRows },
    ],
  },
  {
    id: 'brand-ramps',
    label: '04 — brand · burgundy',
    title: 'Burgundy ramp',
    intro:
      "AC brand identity hue. 5 stops (100–500). Anchor at 200 — Burgundy. Hex " +
      "values resolve live from ac-brand-color.css — edit a token there, this " +
      "updates on next render.",
    reasoning:
      "Anchor at 200 (light side) matches the source design references rather " +
      "than enforcing a midpoint symmetry. Named identities used in the asset " +
      "register: 200 = Burgundy, 300 = Dark Maroon, 400 = Deep Wine.",
    tables: [{
      caption: 'Burgundy ramp',
      columns: 'ramp',
      rows: HUE_RAMPS.flatMap(rampToRows),
    }],
  },
  {
    id: 'cream',
    label: '05 — brand · cream',
    title: 'Cream ramp',
    intro: "Utility neutral, no anchor. 5 stops (100–500).",
    tables: [
      { caption: 'Cream ramp', columns: 'ramp', rows: rampToRows(CREAM_RAMP) },
    ],
  },
  {
    id: 'grey',
    label: '06 — brand · greyscale',
    title: 'Greyscale',
    intro:
      "Legacy 10-stop neutral, kept until opacity-hex revival (drift §13). " +
      "Carries the canvas (60%) and structural ink (30%) of the 60/30/10 ratio.",
    tables: [
      { caption: 'Greyscale', columns: 'ramp', rows: rampToRows(GREY_RAMP) },
    ],
  },
]

export const UI_COLORS_SECTIONS = [
  {
    id: 'surface',
    label: '05 — ui · surface',
    title: 'Surface',
    intro:
      "Mode-flipping surface tokens. Light/dark columns show the resolved value " +
      "at each theme.",
    reasoning:
      "Four tiers — primary (page), secondary (cards), tertiary (elevated), " +
      "inverse (flipped panel). Each ships with an on-* companion so contrast " +
      "is contractually paired. .bg-surface-inverse cascades the swap so child " +
      "components inherit inverted ink without re-resolving.",
    tables: [
      { caption: 'Surface', columns: 'surface', rows: surfaceRows },
    ],
  },
  {
    id: 'state',
    label: '06 — ui · state',
    title: 'State',
    intro:
      "System state colors. Mode-flipped (light column shows light-mode hex).",
    reasoning:
      "Deliberately disconnected from the brand ramps — UI states carry " +
      "universal semantic meaning (red = error, yellow = warning) external to " +
      "brand identity. Wiring them through brand colors would either " +
      "compromise the brand or produce weird states.",
    tables: [
      { caption: 'State', columns: 'state', rows: stateRows },
    ],
  },
  {
    id: 'absolute',
    label: '07 — ui · absolute',
    title: 'Absolute',
    intro:
      "Mode-invariant primitives. Don't participate in the surface flip contract.",
    tables: [
      { caption: 'Absolute', columns: 'ramp', rows: absoluteRows },
    ],
  },
  {
    id: 'fg-primitives',
    label: '08 — ui · opacity primitives',
    title: 'Opacity primitives (--ac-fg-NN)',
    intro:
      "14-stop numeric foreground ramp. Each token is a color-mix expression " +
      "over --ac-surface-on-primary, so opacity tokens auto-contrast-flip on " +
      ".bg-surface-inverse without re-declaration at consumer sites.",
    reasoning:
      "Numeric stops (01, 02, 04, 08, 12, 16, 24, 32, 40, 48, 64, 80, 88, 96) " +
      "are mechanical infrastructure — pick by precision (text-fg-08 for a " +
      "hairline divider, border-fg-12 for a soft panel edge). The 5-stop " +
      "ink-hierarchy descriptors (subtle / meta / body / strong / emphasis) " +
      "under Typography alias these primitives for text-only — pick those " +
      "when intent matters more than exact percentage. Two tiers ship: " +
      "standard (fg-NN, on primary surface) and inverse (fg-inverse-NN, on " +
      "inverse surface) plus an absolute tier (fg-absolute-NN, theme-" +
      "invariant black) for one-off use.",
    tables: [
      { caption: 'Numeric primitives — 14 stops, standard tier', columns: 'fg-primitives', rows: fgPrimitiveRows },
    ],
  },
  {
    id: 'fg-families',
    label: '09 — ui · opacity classes',
    title: 'Opacity class families',
    intro:
      "Three property prefixes, same numeric suffix. .text-fg-NN / .bg-fg-NN / " +
      ".border-fg-NN cover ink, fill, and stroke. Hover variants exist for all " +
      "three.",
    reasoning:
      "Three property prefixes — text / bg / border. Ring families " +
      "(numeric and descriptor) were retired 2026-04-30 along with the " +
      "broader bg/border descriptor cleanup. By usage audit: text-fg-* " +
      "(594 refs), border-fg-* (188 refs), bg-fg-* (184 refs) — the " +
      "workhorses of the entire chrome system.",
    tables: [
      { caption: 'Numeric class families', columns: 'fg-families', rows: fgFamilyRows },
    ],
  },
]
