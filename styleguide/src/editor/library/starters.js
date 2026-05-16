/**
 * Starter presets — predefined Compose frames the user can load to begin a
 * new piece. Surfaced in the topbar Templates menu above the user-saved slots.
 *
 * These replace the former Social and Compositor labs (folded into Compose
 * with starter presets per roadmap §4). Each starter is a `whole`-intent
 * preset shape; `loadPreset` in compose/state.jsx assigns fresh layer ids
 * at load time so the same starter can be loaded repeatedly without id
 * collision.
 *
 * Layers omit `id` (assigned at load) but otherwise carry the full layer
 * spec (visible / opacity / blend + per-type fields). Coordinates use the
 * 1080-virtual canvas; non-1:1 aspects render with the same x positions
 * but more vertical space below.
 */

const baseLayer = (rest) => ({ visible: true, opacity: 1, blend: 'normal', ...rest })

/* Social square — bg + centered logomark + bottom headline. */
const socialSquare = {
  intent: 'whole',
  aspect: '1:1',
  layers: [
    baseLayer({ type: 'background', color: 'palette:primary' }),
    baseLayer({
      type: 'shape', kind: 'logo', variant: 'logomark', color: 'palette:dark',
      x: 380, y: 280, w: 320, h: 320,
    }),
    baseLayer({
      type: 'text', text: 'Headline',
      x: 80, y: 820, w: 920, h: 100,
      width: 'Narrow', weight: 800, italic: false,
      size: 80, tracking: -0.02, lineHeight: 1.0,
      case: 'upper', textAlign: 'center', color: 'palette:dark',
    }),
  ],
}

/* Social portrait — 4:5. bg + small top mark + middle text. */
const socialPortrait = {
  intent: 'whole',
  aspect: '4:5',
  layers: [
    baseLayer({ type: 'background', color: 'palette:primary' }),
    baseLayer({
      type: 'shape', kind: 'logo', variant: 'wordmark', color: 'palette:dark',
      x: 80, y: 80, w: 280, h: 70,
    }),
    baseLayer({
      type: 'text', text: 'Tagline\nover two lines',
      x: 80, y: 480, w: 920, h: 240,
      width: 'Narrow', weight: 800, italic: false,
      size: 110, tracking: -0.03, lineHeight: 0.95,
      case: 'upper', textAlign: 'left', color: 'palette:dark',
    }),
  ],
}

/* Social story — 9:16. bg + top mark + middle headline. */
const socialStory = {
  intent: 'whole',
  aspect: '9:16',
  layers: [
    baseLayer({ type: 'background', color: 'palette:primary' }),
    baseLayer({
      type: 'shape', kind: 'logo', variant: 'logomark', color: 'palette:dark',
      x: 440, y: 200, w: 200, h: 200,
    }),
    baseLayer({
      type: 'text', text: 'Story',
      x: 80, y: 800, w: 920, h: 140,
      width: 'Narrow', weight: 800, italic: false,
      size: 130, tracking: -0.03, lineHeight: 1.0,
      case: 'upper', textAlign: 'center', color: 'palette:dark',
    }),
  ],
}

/* Compositor base — bg + pattern overlay + logo + text. Aggregates the
 * Compositor lab's typical output shape (palette + pattern + mark + text). */
const compositorBase = {
  intent: 'whole',
  aspect: '1:1',
  layers: [
    baseLayer({ type: 'background', color: 'palette:primary' }),
    baseLayer({
      type: 'pattern',
      shapeId: 'circle', customSvg: '',
      cols: 6, rows: 6, gap: 0, padding: 0,
      stretch: false, overflow: false,
      bgOn: false, bg: null,
      color: 'palette:secondary',
      rules: [],
      scale: 256,
      x: 0, y: 0, w: 1080, h: 1080,
      opacity: 0.5,
    }),
    baseLayer({
      type: 'shape', kind: 'logo', variant: 'logomark', color: 'palette:light',
      x: 380, y: 320, w: 320, h: 320,
    }),
    baseLayer({
      type: 'text', text: 'Composition',
      x: 80, y: 800, w: 920, h: 100,
      width: 'Tight', weight: 600, italic: false,
      size: 80, tracking: -0.02, lineHeight: 1.0,
      case: 'upper', textAlign: 'center', color: 'palette:light',
    }),
  ],
}

/* Hero lockup — 1:1. bg + centered horizontal lockup. */
const heroLockup = {
  intent: 'whole',
  aspect: '1:1',
  layers: [
    baseLayer({ type: 'background', color: 'palette:primary' }),
    baseLayer({
      type: 'shape', kind: 'logo', variant: 'lockup-hori', color: 'palette:dark',
      x: 140, y: 460, w: 800, h: 160,
    }),
  ],
}

export const STARTERS = [
  { id: 'social-square',   name: 'Social square (1:1)',  preset: socialSquare },
  { id: 'social-portrait', name: 'Social portrait (4:5)', preset: socialPortrait },
  { id: 'social-story',    name: 'Social story (9:16)',  preset: socialStory },
  { id: 'compositor',      name: 'Compositor base',      preset: compositorBase },
  { id: 'hero-lockup',     name: 'Hero lockup',          preset: heroLockup },
]

export const STARTER_BY_ID = STARTERS.reduce((acc, s) => { acc[s.id] = s; return acc }, {})

/* ========================================================================
 * Per-slot starters — surfaced in Templates menu above user-saved items.
 * Same shape as library items (LibraryProvider validators); skip the
 * envelope fields (`v`, `savedAt`, `updatedAt`) — only `id` + `name`.
 * ======================================================================== */

/* AC palette starters — 5 curated combos using burgundy / cream / grey. */
export const STARTER_PALETTES = [
  {
    id: 'pal-brand',
    name: 'Brand',
    colors: ['#750E20', '#F2E5CB', '#FBF7EE', '#290006', '#943143', '#F2D9A9'],
    bgEnabled: true,
    poolId: 'brand',
    modeId: 'random',
  },
  {
    id: 'pal-mono-burgundy',
    name: 'Mono burgundy',
    colors: ['#943143', '#750E20', '#5A0816', '#3A0008', '#290006', '#FBF7EE'],
    bgEnabled: true,
    poolId: 'brand',
    modeId: 'monochromatic',
  },
  {
    id: 'pal-cream-dominant',
    name: 'Cream dominant',
    colors: ['#F2E5CB', '#5A0816', '#FBF7EE', '#290006', '#943143', '#F2D9A9'],
    bgEnabled: true,
    poolId: 'brand',
    modeId: 'random',
  },
  {
    id: 'pal-burgundy-pop',
    name: 'Burgundy pop',
    colors: ['#131316', '#1B1B1E', '#FCFBFB', '#290006', '#750E20', '#F8F1E0'],
    bgEnabled: true,
    poolId: 'all-light',
    modeId: 'random',
  },
  {
    id: 'pal-grey-restrained',
    name: 'Grey restrained',
    colors: ['#EBEBEB', '#A3A3A4', '#FCFBFB', '#131316', '#750E20', '#FBF7EE'],
    bgEnabled: true,
    poolId: 'all-light',
    modeId: 'random',
  },
]

/* Pattern starters — built from the 4 abstract SVGs + 1 grid variant. */
const patternBase = {
  customSvg: '',
  cols: 6,
  rows: 6,
  gap: 0,
  padding: 0,
  stretch: false,
  overflow: false,
  bg: null,
  color: 'palette:secondary',
  rules: [],
  scale: 256,
}

export const STARTER_PATTERNS = [
  { id: 'pat-abs-01',  name: 'Abstract 01', shapeId: 'abstract:abstract-01', ...patternBase },
  { id: 'pat-abs-02',  name: 'Abstract 02', shapeId: 'abstract:abstract-02', ...patternBase },
  { id: 'pat-abs-03',  name: 'Abstract 03', shapeId: 'abstract:abstract-03', ...patternBase },
  { id: 'pat-abs-06',  name: 'Abstract 06', shapeId: 'abstract:abstract-06', ...patternBase },
  { id: 'pat-grid-4',  name: 'Grid 4×4',    shapeId: 'abstract:abstract-01', ...patternBase, cols: 4, rows: 4 },
]

/* Type starters — 5 brand-flavored compositions across the cut family. */
const typeBase = {
  italic:     false,
  case:       'original',
  textAlign:  'center',
  axisOn:     false,
  axisMode:   'morph',
  width2:     'Spatial',
  weight2:    900,
  blend:      0.5,
}

export const STARTER_TYPES = [
  {
    id: 'typ-display', name: 'Display',
    text: 'Another\nCreation', width: 'Narrow', weight: 800,
    size: 140, tracking: -0.04, lineHeight: 0.95, case: 'upper',
    color: '#5A0816', ...typeBase,
  },
  {
    id: 'typ-lede', name: 'Lede',
    text: 'Garments cut for slow living.', width: 'Compact', weight: 500,
    size: 64, tracking: -0.02, lineHeight: 1.15,
    color: '#5A0816', ...typeBase,
  },
  {
    id: 'typ-italic', name: 'Italic accent',
    text: 'no. one', width: 'Narrow', weight: 500, italic: true,
    size: 130, tracking: -0.035, lineHeight: 0.84, case: 'upper',
    color: '#943143', ...typeBase, italic: true,
  },
  {
    id: 'typ-mono', name: 'Mono label',
    text: 'Made in Iceland', width: 'mono', weight: 500,
    size: 18, tracking: 0.1, lineHeight: 1.0, case: 'upper',
    color: '#5A0816', ...typeBase,
  },
  {
    id: 'typ-tagline', name: 'Tagline',
    text: 'Reykjavík · Iceland', width: 'mono', weight: 500,
    size: 14, tracking: 0.2, lineHeight: 1.0, case: 'upper',
    color: '#5A0816', ...typeBase,
  },
]

/* Preset starters — surface the 5 STARTERS under the Presets nest too,
 * so the slot count reads "Presets · 5" instead of "0". */
export const STARTER_PRESETS = STARTERS.map((s) => ({
  id:     s.id,
  name:   s.name,
  ...s.preset,
}))

export const STARTERS_BY_SLOT = {
  palette: STARTER_PALETTES,
  pattern: STARTER_PATTERNS,
  type:    STARTER_TYPES,
  preset:  STARTER_PRESETS,
}
