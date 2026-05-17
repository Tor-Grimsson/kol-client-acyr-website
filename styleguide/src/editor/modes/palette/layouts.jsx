/**
 * Combo Lab — layout primitives.
 *
 * Every layout accepts { palette, logo } and renders its geometry with the
 * current palette's 5 role-colors. Structural CSS lives in foundations.css
 * under `.ac-combo-*`. Inline styles here are strictly data-driven
 * (background + color from the palette).
 */
import KolLogo from '@brand/logos/KolLogo'
import { fgOn } from '../../../utils/contrast'

/* LogoSlot — size is a numeric prop, rendered as inline width. */
const LogoSlot = ({ logo, size = 48 }) => {
  if (!logo || logo.id === 'none' || !logo.variant) return null
  return (
    <span className="ac-combo-logo" style={{ width: size }}>
      <KolLogo variant={logo.variant} />
    </span>
  )
}

/* ────────── 60 / 30 / 10 ────────── */
export function RatioBar({ palette, logo }) {
  const { primary, secondary, light } = palette
  return (
    <div className="ac-combo-stage ac-combo-frame ac-combo-stage--fill ac-combo-stage--ratio">
      <div className="ac-combo-slab" style={{ background: primary, color: fgOn(primary) }}>
        <span className="ac-combo-label">Primary</span>
        <LogoSlot logo={logo} size={48} />
        <span className="ac-combo-number">10</span>
      </div>
      <div className="ac-combo-slab" style={{ background: secondary, color: fgOn(secondary) }}>
        <span className="ac-combo-label">Secondary</span>
        <span className="ac-combo-number">30</span>
      </div>
      <div className="ac-combo-slab" style={{ background: light, color: fgOn(light) }}>
        <span className="ac-combo-label">Neutral</span>
        <span className="ac-combo-number">60</span>
      </div>
    </div>
  )
}

/* ────────── Tower — 4-band vertical ────────── */
export function Tower({ palette, logo }) {
  const { primary, secondary, light, dark } = palette
  const band = (bg, label) => (
    <div className="ac-combo-slab ac-combo-slab--end" style={{ background: bg, color: fgOn(bg) }}>
      <span className="ac-combo-label">{label}</span>
    </div>
  )
  return (
    <div className="ac-combo-stage ac-combo-frame ac-combo-stage--tower">
      <div className="ac-combo-slab ac-combo-slab--between" style={{ background: primary, color: fgOn(primary) }}>
        <LogoSlot logo={logo} size={48} />
        <span className="ac-combo-label">Primary</span>
      </div>
      {band(secondary, 'Secondary')}
      {band(light, 'Light')}
      {band(dark, 'Dark')}
    </div>
  )
}

/* ────────── Quad split — 50 / 25 / 25 ────────── */
export function QuadSplit({ palette, logo }) {
  const { primary, light, dark, accent } = palette
  return (
    <div className="ac-combo-stage ac-combo-frame ac-combo-stage--fill ac-combo-stage--quad">
      <div className="ac-combo-slab ac-combo-slab--between" style={{ background: primary, color: fgOn(primary) }}>
        <LogoSlot logo={logo} size={64} />
        <span className="ac-combo-label">Primary · 50</span>
      </div>
      <div className="ac-combo-quad-col">
        <div className="ac-combo-slab ac-combo-slab--end" style={{ background: light, color: fgOn(light) }}>
          <span className="ac-combo-label">Light · 25</span>
        </div>
        <div className="ac-combo-slab ac-combo-slab--between" style={{ background: dark, color: fgOn(dark) }}>
          <span className="ac-combo-label" style={{ color: accent }}>Accent</span>
          <span className="ac-combo-label">Dark · 25</span>
        </div>
      </div>
    </div>
  )
}

/* ────────── Card row — 4 discrete cards ────────── */
export function CardRow({ palette, logo }) {
  const { primary, secondary, light, dark } = palette
  const card = (bg, label, withLogo = false) => (
    <div
      className={`ac-combo-card ac-combo-frame${withLogo ? ' ac-combo-card--between' : ' ac-combo-card--end'}`}
      style={{ background: bg, color: fgOn(bg) }}
    >
      {withLogo && <LogoSlot logo={logo} size={40} />}
      <span className="ac-combo-label">{label}</span>
    </div>
  )
  return (
    <div className="ac-combo-stage ac-combo-stage--card-row">
      {card(primary, 'Primary', true)}
      {card(secondary, 'Secondary')}
      {card(light, 'Light')}
      {card(dark, 'Dark')}
    </div>
  )
}

/* ────────── Stripe row — Method 01 / 02 bars ────────── */
export function StripeRow({ palette }) {
  const { primary, secondary, light, dark, accent } = palette
  /* Rule color derived from dark with alpha suffix. We pass it via a CSS
     custom prop so the class handles border-top/border-bottom declarations. */
  const ruleColor = `${dark}20`
  return (
    <div
      className="ac-combo-stage ac-combo-frame ac-combo-stage--stripe-row"
      style={{
        '--stripe-rule': ruleColor,
        '--stripe-accent': accent,
      }}
    >
      {/* Method 01 — single-row proportion bar */}
      <div className="ac-combo-stripe-row">
        <div className="ac-combo-stripe-bar">
          <div className="ac-combo-stripe-seg ac-combo-stripe-seg--6" style={{ background: primary }} />
          <div className="ac-combo-stripe-seg ac-combo-stripe-seg--3 ac-combo-stripe-neutral" style={{ background: light }} />
          <div className="ac-combo-stripe-seg ac-combo-stripe-seg--1" style={{ background: accent }} />
          <span className="ac-combo-stripe-method">Method 01</span>
        </div>
      </div>
      {/* Method 02 — split-row */}
      <div className="ac-combo-stripe-row">
        <div className="ac-combo-stripe-bar">
          <div className="ac-combo-stripe-group ac-combo-stripe-group--3">
            <div className="ac-combo-stripe-seg ac-combo-stripe-seg--1" style={{ background: primary }} />
            <div className="ac-combo-stripe-seg ac-combo-stripe-seg--1" style={{ background: secondary }} />
          </div>
          <div className="ac-combo-stripe-group ac-combo-stripe-group--3">
            <div className="ac-combo-stripe-seg ac-combo-stripe-seg--1 ac-combo-stripe-neutral" style={{ background: light }} />
            <div className="ac-combo-stripe-seg ac-combo-stripe-seg--1" style={{ background: light }} />
          </div>
          <div className="ac-combo-stripe-group ac-combo-stripe-group--1">
            <div className="ac-combo-stripe-seg ac-combo-stripe-seg--1" style={{ background: accent }} />
            <div className="ac-combo-stripe-seg ac-combo-stripe-seg--1" style={{ background: dark }} />
          </div>
          <span className="ac-combo-stripe-method">Method 02</span>
        </div>
      </div>
    </div>
  )
}

/* ────────── Applied card — brand-applied tile (card + logo + swatches) ────────── */
export function AppliedCard({ palette, logo }) {
  const { primary, secondary, light, dark, accent } = palette
  return (
    <div className="ac-combo-stage ac-combo-frame ac-combo-stage--applied" style={{ background: light }}>
      {/* Main logo plate */}
      <div className="ac-combo-applied-plate" style={{ background: primary, color: fgOn(primary) }}>
        <LogoSlot logo={logo} size={72} />
        <span className="ac-combo-label">Front</span>
      </div>
      {/* Right swatch column */}
      <div className="ac-combo-applied-col">
        <div className="ac-combo-slab ac-combo-slab--between ac-combo-applied-surface" style={{ background: light, color: fgOn(light) }}>
          <span className="ac-combo-label">Surface</span>
          <div className="ac-combo-applied-accent-strip">
            <span className="ac-combo-applied-accent-chip" style={{ background: secondary }} />
            <span className="ac-combo-applied-accent-chip" style={{ background: accent }} />
          </div>
        </div>
        <div className="ac-combo-applied-band ac-combo-applied-band--lg" style={{ background: secondary }} />
        <div className="ac-combo-applied-band ac-combo-applied-band--sm" style={{ background: dark }} />
      </div>
    </div>
  )
}

import { SLIDE_LAYOUT_COMPONENTS } from './slide-layouts'

export const LAYOUT_COMPONENTS = {
  'ratio-603010': RatioBar,
  'tower':        Tower,
  'quad-split':   QuadSplit,
  'card-row':     CardRow,
  'stripe-row':   StripeRow,
  'applied-card': AppliedCard,
  ...SLIDE_LAYOUT_COMPONENTS,
}
