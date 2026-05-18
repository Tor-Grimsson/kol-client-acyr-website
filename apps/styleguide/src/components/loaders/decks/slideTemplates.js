/**
 * Slide layer templates — full-frame presets that load into /compose as
 * editable layer stacks. Each entry is an array of *partial* layer specs
 * (no `id`, `visible`, `opacity`, `blend` — the instantiator generates
 * those). Used by `/slide-deck` and as starter presets in compose.
 *
 * Coordinates are designed for the 1080×1080 (1:1) compose canvas. Other
 * aspects render the same x positions but more vertical space below; the
 * user adjusts y after loading if they want the layout snug on a taller
 * canvas. Future: aspect-aware templates.
 *
 * Color refs use `palette:*` so the layers respond to the active palette.
 * Cover maps `bg=primary, fg=light-derived, accent=light` (matches
 * SlideDeck's `coverVars`); Manifesto maps `bg=light, fg=dark, accent=accent`;
 * End maps `bg=dark, fg=light-derived, accent=accent`.
 */

import { BRAND } from '@ac/brand-data/config'
import { BRAND_INFO } from '@ac/brand-data/info'

const [BRAND_LINE_1, BRAND_LINE_2 = ''] = BRAND.name.split(' ')

/* Shared text-layer defaults — match Type Lab's newFrame() defaults so the
 * exploded layers feel native to the rest of compose's text editing. */
const T = {
  italic:     false,
  case:       'original',
  textAlign:  'center',
  tracking:   0,
  lineHeight: 1.0,
}

/* Cover — large stacked title + topbar L/M/R + bottom meta-l/r. */
export const COVER_TEMPLATE = [
  { type: 'background', color: 'palette:primary' },

  /* Topbar — mono 14px, three slots across the top. */
  { type: 'text', text: BRAND.name, color: 'palette:light',
    x: 50, y: 50, w: 300, h: 24,
    width: 'mono', weight: 500, size: 14, ...T,
    case: 'upper', tracking: 0.1, textAlign: 'left' },

  { type: 'text', text: BRAND_INFO.identity.nameShort, color: 'palette:light',
    x: 520, y: 50, w: 40, h: 40,
    width: 'mono', weight: 500, size: 14, ...T,
    case: 'upper', tracking: 0 },

  { type: 'text', text: 'Reykjavík · 2026', color: 'palette:light',
    x: 730, y: 50, w: 300, h: 24,
    width: 'mono', weight: 500, size: 14, ...T,
    case: 'upper', tracking: 0.1, textAlign: 'right' },

  /* Stack — large display titles, l1 + l2 + l3 (italic). */
  { type: 'text', text: BRAND_LINE_1, color: 'palette:light',
    x: 60, y: 320, w: 960, h: 130,
    width: 'Narrow', weight: 800, size: 130, ...T,
    case: 'upper', tracking: -0.035, lineHeight: 0.84 },

  { type: 'text', text: BRAND_LINE_2, color: 'palette:light',
    x: 60, y: 460, w: 960, h: 200,
    width: 'Narrow', weight: 800, size: 200, ...T,
    case: 'upper', tracking: -0.035, lineHeight: 0.84 },

  { type: 'text', text: 'no. one', color: 'palette:light',
    x: 60, y: 680, w: 960, h: 130,
    width: 'Narrow', weight: 500, size: 130, ...T,
    italic: true, case: 'upper', tracking: -0.035, lineHeight: 0.84 },

  /* Meta — bottom-left and bottom-right, 2-line mono helpers. */
  { type: 'text', text: 'Spring · Summer\nTwenty Twenty-Six', color: 'palette:light',
    x: 50, y: 940, w: 300, h: 80,
    width: 'mono', weight: 500, size: 14, ...T,
    case: 'upper', tracking: 0.1, lineHeight: 1.6, textAlign: 'left' },

  { type: 'text', text: 'A Collection\nIn Twenty-Four Editions', color: 'palette:light',
    x: 730, y: 940, w: 300, h: 80,
    width: 'mono', weight: 500, size: 14, ...T,
    case: 'upper', tracking: 0.1, lineHeight: 1.6, textAlign: 'right' },
]

/* Manifesto — eyebrow chrome + centered lead body + foot. */
export const MANIFESTO_TEMPLATE = [
  { type: 'background', color: 'palette:light' },

  /* Eyebrow — 2-slot top chrome. */
  { type: 'text', text: 'Chapter IV · A Position', color: 'palette:dark',
    x: 80, y: 60, w: 460, h: 24,
    width: 'mono', weight: 500, size: 14, ...T,
    case: 'upper', tracking: 0.1, textAlign: 'left' },

  { type: 'text', text: 'The Line We Keep', color: 'palette:dark',
    x: 540, y: 60, w: 460, h: 24,
    width: 'mono', weight: 500, size: 14, ...T,
    case: 'upper', tracking: 0.1, textAlign: 'right' },

  /* Body — centered lead. Author the styled words plain — user can split
   * into separate layers if they want per-word styling. */
  { type: 'text', text: 'We make few things, slowly, and we sign every one. Mass is not a method we know.',
    color: 'palette:dark',
    x: 120, y: 380, w: 840, h: 320,
    width: 'Narrow', weight: 500, size: 64, ...T,
    case: 'original', tracking: -0.02, lineHeight: 1.15 },

  /* Foot. */
  { type: 'text', text: BRAND.name, color: 'palette:dark',
    x: 80, y: 980, w: 300, h: 24,
    width: 'mono', weight: 500, size: 14, ...T,
    case: 'upper', tracking: 0.1, textAlign: 'left' },

  { type: 'text', text: '05 / 14', color: 'palette:dark',
    x: 720, y: 980, w: 300, h: 24,
    width: 'mono', weight: 500, size: 14, ...T,
    case: 'upper', tracking: 0.1, textAlign: 'right' },
]

/* End — eyebrow + small lead-in + huge KV monogram + URL. */
export const END_TEMPLATE = [
  { type: 'background', color: 'palette:dark' },

  /* Eyebrow. */
  { type: 'text', text: 'End · Thank You', color: 'palette:light',
    x: 80, y: 60, w: 460, h: 24,
    width: 'mono', weight: 500, size: 14, ...T,
    case: 'upper', tracking: 0.1, textAlign: 'left' },

  { type: 'text', text: 'Reykjavík · 2026', color: 'palette:light',
    x: 540, y: 60, w: 460, h: 24,
    width: 'mono', weight: 500, size: 14, ...T,
    case: 'upper', tracking: 0.1, textAlign: 'right' },

  /* Center stack — small caption, big KV mark, URL. */
  { type: 'text', text: 'Made by Hand · Signed by Name', color: 'palette:light',
    x: 60, y: 380, w: 960, h: 24,
    width: 'mono', weight: 500, size: 14, ...T,
    case: 'upper', tracking: 0.2 },

  { type: 'text', text: BRAND_INFO.identity.nameShort, color: 'palette:light',
    x: 60, y: 440, w: 960, h: 280,
    width: 'Narrow', weight: 800, size: 280, ...T,
    case: 'upper', tracking: -0.04, lineHeight: 1.0 },

  { type: 'text', text: BRAND_INFO.contact.web, color: 'palette:accent',
    x: 60, y: 760, w: 960, h: 24,
    width: 'mono', weight: 500, size: 14, ...T,
    case: 'upper', tracking: 0.2 },

  /* Foot. */
  { type: 'text', text: BRAND.name, color: 'palette:light',
    x: 80, y: 980, w: 300, h: 24,
    width: 'mono', weight: 500, size: 14, ...T,
    case: 'upper', tracking: 0.1, textAlign: 'left' },

  { type: 'text', text: '14 / 14', color: 'palette:light',
    x: 720, y: 980, w: 300, h: 24,
    width: 'mono', weight: 500, size: 14, ...T,
    case: 'upper', tracking: 0.1, textAlign: 'right' },
]

export const SLIDE_TEMPLATES = {
  'slide-cover':     COVER_TEMPLATE,
  'slide-manifesto': MANIFESTO_TEMPLATE,
  'slide-end':       END_TEMPLATE,
}

export const SLIDE_TEMPLATE_IDS = Object.keys(SLIDE_TEMPLATES)
