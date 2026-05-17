/**
 * Typography system — data + reasoning.
 *
 * Single source of truth for the /reference typography surface. Each section
 * carries its own table data, reasoning prose, and any token paths needed for
 * live CSS reads.
 *
 * Architecture: docs/kol-migration/locked/typography-system.md
 *
 * Pattern (consumed by src/pages/Reference.jsx):
 *   TYPOGRAPHY_SECTIONS = [
 *     {
 *       id: 'anchor-id',                  // PageSection id (must match sidebar)
 *       label: 'NN — type · subsection',  // PageSection label
 *       title: 'Section title',           // PageSection title
 *       intro: 'One-paragraph intro',     // PageSection body
 *       reasoning: 'Why we did it this way',  // optional rendered as ac-prose paragraph
 *       tables: [
 *         { caption, cols, rows }
 *       ],
 *     }
 *   ]
 *
 * Cells that render live CSS values use a `tokenName` field on the row + a
 * render function that calls resolveCssVar / resolveCssVarRaw at render time.
 * No hex / px values are duplicated here — only token paths.
 */

/* ============================================================================
 * Family tokens
 * ============================================================================ */

const familyCols = [
  { accessor: 'token',  header: 'Token' },
  { accessor: 'role',   header: 'Role' },
  { accessor: 'cut',    header: 'Cut' },
]

const familyRows = [
  { token: '--ac-font-family-sans',         role: 'Sans body',                       cut: 'Right Grotesk (base)' },
  { token: '--ac-font-family-sans-narrow',  role: 'Sans top-of-scale (display, H1)', cut: 'Right Grotesk Narrow' },
  { token: '--ac-font-family-sans-compact', role: 'Sans mid (H2–H6, prose lede)',    cut: 'Right Grotesk Compact' },
  { token: '--ac-font-family-mono',         role: 'Mono everything',                 cut: 'JetBrains Mono' },
]

/* ============================================================================
 * Sans atomic — display / heading / body
 * ============================================================================ */

const sansDisplayRows = [
  { cls: '.ac-sans-display-01', tokenName: '--ac-text-display-01', family: 'sans-narrow', weight: 600 },
  { cls: '.ac-sans-display-02', tokenName: '--ac-text-display-02', family: 'sans-narrow', weight: 600 },
]

const sansHeadingRows = [
  { cls: '.ac-sans-heading-01', tokenName: '--ac-text-heading-01', family: 'sans-narrow',  weight: 500 },
  { cls: '.ac-sans-heading-02', tokenName: '--ac-text-heading-02', family: 'sans-compact', weight: 500 },
  { cls: '.ac-sans-heading-03', tokenName: '--ac-text-heading-03', family: 'sans-compact', weight: 500 },
  { cls: '.ac-sans-heading-04', tokenName: '--ac-text-heading-04', family: 'sans-compact', weight: 500 },
  { cls: '.ac-sans-heading-05', tokenName: '--ac-text-heading-05', family: 'sans-compact', weight: 500 },
]

const sansBodyRows = [
  { cls: '.ac-sans-body-01', tokenName: '--ac-text-body-01', family: 'sans (base)', weight: 400 },
  { cls: '.ac-sans-body-02', tokenName: '--ac-text-body-02', family: 'sans (base)', weight: 400 },
  { cls: '.ac-sans-body-03', tokenName: '--ac-text-body-03', family: 'sans (base)', weight: 400 },
]

/* ============================================================================
 * Prose elements
 * ============================================================================ */

const proseRows = [
  { role: 'Display',     class: '.ac-prose-display',        family: 'sans-narrow',  weight: 500 },
  { role: 'Display (md)',class: '.ac-prose-display-md',     family: 'sans-narrow',  weight: 500 },
  { role: 'Title',       class: '.ac-prose-title',          family: 'sans-narrow',  weight: 500 },
  { role: 'H1',          class: '.ac-prose h1',             family: 'sans-narrow',  weight: 500, tokenName: '--ac-text-heading-01' },
  { role: 'H2',          class: '.ac-prose h2',             family: 'sans-compact', weight: 400, tokenName: '--ac-text-heading-03' },
  { role: 'H3',          class: '.ac-prose h3',             family: 'sans-compact', weight: 400, tokenName: '--ac-text-heading-04' },
  { role: 'H4',          class: '.ac-prose h4',             family: 'sans-compact', weight: 400, tokenName: '--ac-text-heading-05' },
  { role: 'H5',          class: '.ac-prose h5',             family: 'sans-compact', weight: 500, tokenName: '--ac-text-heading-06' },
  { role: 'H6',          class: '.ac-prose h6',             family: 'sans-compact', weight: 500, tokenName: '--ac-text-heading-06' },
  { role: 'Lede',        class: '.ac-prose-lede',           family: 'sans-compact', weight: 400 },
  { role: 'Tagline',     class: '.ac-prose-tagline',        family: 'sans-narrow',  weight: 500 },
  { role: 'Body',        class: '.ac-prose p',              family: 'sans (base)',  weight: 300 },
  { role: 'Quote',       class: '.ac-prose blockquote p',   family: 'sans (base)',  weight: 600 },
  { role: 'Cite',        class: '.ac-prose blockquote cite',family: 'sans (base)',  weight: 500 },
  { role: 'Label',       class: '.ac-prose-label',          family: 'mono',         weight: 500 },
  { role: 'Code (inline)',class: '.ac-prose code',          family: 'mono',         weight: 400 },
  { role: 'Code (block)', class: '.ac-prose pre',           family: 'mono',         weight: 400 },
]

/* ============================================================================
 * Mono — ac-mono-N + ac-helper-N
 * ============================================================================ */

const monoRows = [
  { cls: '.ac-mono-20', size: 20, lh: 26, weight: 400, ls: 'normal' },
  { cls: '.ac-mono-16', size: 16, lh: 22, weight: 400, ls: 'normal' },
  { cls: '.ac-mono-14', size: 14, lh: 18, weight: 400, ls: 'normal' },
  { cls: '.ac-mono-12', size: 12, lh: 16, weight: 400, ls: 'normal' },
  { cls: '.ac-mono-10', size: 10, lh: 14, weight: 400, ls: 'normal' },
  { cls: '.ac-mono-8',  size:  8, lh: 12, weight: 400, ls: 'normal' },
]

const helperRows = [
  { cls: '.ac-helper-20', size: 20, lh: '1', weight: 500, ls: '0.06em' },
  { cls: '.ac-helper-16', size: 16, lh: '1', weight: 500, ls: '0.06em' },
  { cls: '.ac-helper-14', size: 14, lh: '1', weight: 500, ls: '0.06em' },
  { cls: '.ac-helper-12', size: 12, lh: '1', weight: 500, ls: '0.06em' },
  { cls: '.ac-helper-10', size: 10, lh: '1', weight: 500, ls: '0.10em' },
  { cls: '.ac-helper-8',  size:  8, lh: '1', weight: 500, ls: '0.10em' },
]

/* ============================================================================
 * Cuts loaded (Right Grotesk family)
 * ============================================================================ */

const cutsRows = [
  { family: 'Right Grotesk',         weights: '300 / 500 / 500i / 700 / 700i', use: 'Body, prose container' },
  { family: 'Right Grotesk Compact', weights: '100i / 400 / 400i / 500 / 700', use: 'Mid headings, prose lede' },
  { family: 'Right Grotesk Tall',    weights: '400 / 500 / 700 / 900',         use: 'Expressive (Type Lab)' },
  { family: 'Right Grotesk Wide',    weights: '400 / 500 / 700 / 900',         use: 'Expressive (Type Lab)' },
  { family: 'Right Grotesk Narrow',  weights: '500 / 700',                     use: 'Display, H1' },
  { family: 'Right Grotesk Spatial', weights: '300 / 400 / 500 / 700 / 900',   use: 'Expressive (Type Lab)' },
  { family: 'Right Grotesk Tight',   weights: '400 / 700',                     use: 'Expressive (Type Lab)' },
  { family: 'Right Grotesk Text',    weights: '400 / 500',                     use: 'Optical-grade body (reserved)' },
  { family: 'JetBrains Mono',        weights: '400 / 500 / 500i / 600',        use: 'Mono — body, helpers, prose code' },
]

/* ============================================================================
 * Reading-importance descriptors — 6-stop ink hierarchy
 *
 * Aliases over the numeric --ac-fg-NN primitives (those live under
 * UI Colors / Opacity primitives). Descriptor names stay here because they're
 * a typography concern: subtle/mute/meta de-emphasize, body anchors running
 * copy, strong/emphasis amplify.
 * ============================================================================ */

const opacityDescriptorRows = [
  { name: 'subtle',   pct: 24,  token: '--ac-fg-subtle',   role: 'Dividers, disabled hints, faintest visible' },
  { name: 'meta',     pct: 48,  token: '--ac-fg-meta',     role: 'Labels, eyebrows, captions' },
  { name: 'body',     pct: 64,  token: '--ac-fg-body',     role: 'Running copy, links' },
  { name: 'strong',   pct: 80,  token: '--ac-fg-strong',   role: 'Emphasized body, <strong>' },
  { name: 'emphasis', pct: 100, token: '--ac-fg-emphasis', role: 'Headings, max ink' },
]

/* Descriptors are text-only as of 2026-04-30. The bg-* / border-* / ring-*
 * descriptor families were dropped — consumers reach for numeric --ac-fg-NN
 * classes (bg-fg-08, border-fg-12, etc.) instead. */

/* ============================================================================
 * Sections export (consumed by Reference.jsx)
 * ============================================================================ */

export const TYPOGRAPHY_SECTIONS = [
  {
    id: 'sans-families',
    label: '10 — type · families',
    title: 'Family tokens',
    intro:
      "Three sans cuts and one mono. Edit a family token to swap any cut " +
      "without touching consumers.",
    reasoning:
      "Right Grotesk ships many cuts (Tall, Wide, Spatial, Tight, Text-grade, etc.) " +
      "but daily-use anchors on three: base for body, Narrow for top-of-scale, " +
      "Compact for mid. Other cuts remain available via direct CSS for " +
      "expressive one-offs (Type Lab, hero compositions) but aren't tier-canonical. " +
      "Mono is single-cut by design — JetBrains Mono is the entire mono surface.",
    tables: [
      { caption: 'Family tokens', columns: familyCols, rows: familyRows },
    ],
  },

  {
    id: 'sans-atomic',
    label: '11 — type · sans atomic',
    title: 'Sans atomic classes',
    intro:
      "Display, heading, body — explicit per-element classes for chrome / " +
      "page sections. Distinct from .ac-prose, which cascades into HTML " +
      "elements for rich-text containers.",
    reasoning:
      "Numbered tokens (01–06), not t-shirt sizes. Numbers describe a fixed " +
      "position in the scale (01 = anchor, ascending = smaller); t-shirt names " +
      "carry no ordering, you have to remember which is bigger. 01 = largest " +
      "follows HTML's H1 = biggest convention. Class prefix is family-first " +
      "(.ac-sans-) to mirror mono naming and read naturally — \"the sans " +
      "system, display role, stop 01\". H1 uses Narrow (condensed for impact); " +
      "H2–H5 use Compact (slightly wider, mid-tier); body uses base. Atomic body " +
      "weight is 400 (regular) for chrome; prose body is 300 (light) for " +
      "editorial reading copy — different defaults per context.",
    tables: [
      { caption: 'Display', columns: 'sans', rows: sansDisplayRows },
      { caption: 'Heading', columns: 'sans', rows: sansHeadingRows },
      { caption: 'Body',    columns: 'sans', rows: sansBodyRows },
    ],
  },

  {
    id: 'prose',
    label: '06 — type · prose',
    title: 'Prose container',
    intro:
      ".ac-prose is a rich-text container that cascades to native HTML " +
      "elements (h1–h6, p, ul, blockquote, code, pre). Wrap CMS / blog / " +
      "markdown output in it; the container styles every element via " +
      "descendant selectors.",
    reasoning:
      "H2 intentionally skips heading-02 (40px) and uses heading-03 (32px). " +
      "48 → 40 reads as \"same family\"; 48 → 32 reads as \"structural break\" " +
      "— better visual rhythm at H1 → H2. H6 ships uppercase with tracking " +
      "by default since H6 is rare and benefits from a label-like rendering. " +
      "Code (inline + block) consumes the mono token so a future swap cascades " +
      "into prose code automatically.",
    tables: [
      { caption: 'Prose elements', columns: 'prose', rows: proseRows },
    ],
  },

  {
    id: 'mono',
    label: '07 — type · mono',
    title: 'Mono',
    intro:
      "JetBrains Mono. Two scales at the same px stops, distinguished by " +
      "intent + visual weight. .ac-mono-N for multi-line body / values " +
      "(weight 400, with leading). .ac-helper-N for single-line labels " +
      "(weight 500, line-height 1, letter-spaced).",
    reasoning:
      "Same px size, different weight = visible hierarchy without size-jumps. " +
      "Common pattern: a label sits above a control or value at the same stop " +
      "— label is helper (medium), control text is mono (regular). Both 12px, " +
      "but the label \"reads first\" by weight. Tight UI grids stay compact " +
      "without further compressing sizes. Px-literal suffixes (10/12/14/16/20) " +
      "instead of numbered indices because mono is utility chrome where exact " +
      "px matters — the number IS the value, no decoder ring. Wider letter-" +
      "spacing (0.10em) on the smallest two stops is a typographic principle: " +
      "sub-12px mono needs more tracking to stay legible.",
    tables: [
      { caption: '.ac-mono-N — body / values, weight 400, with leading', columns: 'mono', rows: monoRows },
      { caption: '.ac-helper-N — labels, weight 500, line-height 1, letter-spaced', columns: 'mono', rows: helperRows },
    ],
  },

  {
    id: 'opacity',
    label: '08 — type · reading hierarchy',
    title: 'Reading hierarchy (descriptors)',
    intro:
      "Five-stop ink hierarchy: subtle / meta / body / strong / emphasis. " +
      "Aliases over the numeric --ac-fg-NN ramp (UI Colors / Opacity " +
      "primitives). Pick descriptors when intent matters; pick numeric stops " +
      "when exact percentage matters. Text-only — bg / border / ring " +
      "descriptor families retired 2026-04-30 (consumers used numeric stops).",
    reasoning:
      "Five stops anchor the typography reading hierarchy. The retired " +
      "`mute` (32%) sat awkwardly between subtle (24%, dividers) and meta " +
      "(48%, labels) and had zero component consumers. Descriptors are now " +
      "text-only — for surface tints, borders, and rings, reach for the " +
      "numeric --ac-fg-NN family (bg-fg-08, border-fg-12, etc.).",
    tables: [
      { caption: '5-stop semantic descriptors', columns: 'descriptors', rows: opacityDescriptorRows },
    ],
  },

  {
    id: 'cuts',
    label: '09 — type · cuts loaded',
    title: 'Cuts loaded',
    intro:
      "Font families currently @font-face declared. Right Grotesk variants " +
      "live in ac-typography.css; JetBrains Mono lives in ac-typography-mono.css.",
    reasoning:
      "Tier-canonical cuts (sans base, sans-narrow, sans-compact, mono) drive " +
      "the daily atomic + prose surface. Other Right Grotesk variants " +
      "(Tall, Wide, Spatial, Tight, Text-grade) load alongside but are reserved " +
      "for expressive use (Type Lab compositions, hero variants, one-off " +
      "branding moments). Loading them all up-front is cheap (woff2, font-display: " +
      "swap, browsers fetch lazily); the cost is at use-time decision, not load-time.",
    tables: [
      { caption: 'Cuts loaded', columns: 'cuts', rows: cutsRows },
    ],
  },
]
