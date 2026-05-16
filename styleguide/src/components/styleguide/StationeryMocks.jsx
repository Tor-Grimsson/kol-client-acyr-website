import KolLogo from '@brand/logos/KolLogo'
import { BRAND_INFO } from '@brand/data/info'

// Brand palette hexes — hardcoded until Layer 2 token migration.
const PAL = {
  champagne: '#F2E5CB',
  sand:      '#F2D9A9',
  burgundy:  '#750E20',
  maroon:    '#5A0816',
  wine:      '#3A0008',
  paper:     '#FCFBFB',
  ink:       '#131316',
}

const MONO    = "'Right Grotesk Mono', monospace"
const NARROW  = "'Right Grotesk Narrow', 'Right Grotesk', sans-serif"
const COMPACT = "'Right Grotesk Compact', sans-serif"
const TEXT    = "'Right Grotesk', sans-serif"

const monoCaps = { fontFamily: MONO, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }

const { identity, contact, studio, legal, labels: brandLabels } = BRAND_INFO

// ─── Business card ────────────────────────────────────────────────

export function BusinessCardFront() {
  return (
    <div
      className="w-full h-full flex items-center justify-center p-8 [&_svg]:w-auto [&_svg]:h-full"
      style={{ background: PAL.paper, color: PAL.ink }}
    >
      <KolLogo variant="lockup-hori" className="max-h-[70%]" />
    </div>
  )
}

export function BusinessCardBack() {
  return (
    <div
      className="w-full h-full flex flex-col justify-between p-8 border border-fg-08"
      style={{ background: PAL.ink, color: PAL.paper }}
    >
      <div>
        <p style={{ ...monoCaps, fontSize: 9, opacity: 0.6 }}>{identity.role}</p>
        <p style={{ fontFamily: NARROW, fontSize: 18, fontWeight: 500, marginTop: 4 }}>{identity.founder}</p>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 9, lineHeight: 1.6, letterSpacing: '0.05em' }}>
        <p>{contact.email}</p>
        <p>{contact.phone}</p>
        <p>{studio.city}, {studio.country}</p>
      </div>
    </div>
  )
}

// ─── Envelope (DL, 220×110) ──────────────────────────────────────

export function Envelope() {
  return (
    <div
      className="w-full h-full relative p-8 [&_svg]:w-auto [&_svg]:h-full"
      style={{ background: PAL.paper, color: PAL.ink }}
    >
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed" style={{ borderColor: 'rgba(0,0,0,0.08)' }} />
      <div className="absolute top-8 left-8 h-8">
        <KolLogo variant="logomark" />
      </div>
      <div className="absolute bottom-8 right-8 text-right" style={{ fontFamily: TEXT, fontSize: 11, lineHeight: 1.5, color: PAL.ink, opacity: 0.8 }}>
        <p>{identity.name}</p>
        <p>{studio.street}</p>
        <p>{studio.postcode}</p>
        <p>{studio.country}</p>
      </div>
    </div>
  )
}

// ─── Letterhead (A4 — 210×297) ───────────────────────────────────

export function Letterhead() {
  return (
    <div
      className="w-full h-full flex flex-col p-12 [&_svg]:w-auto [&_svg]:h-auto"
      style={{ background: PAL.paper, color: PAL.ink }}
    >
      <div className="h-10 mb-12">
        <KolLogo variant="wordmark" className="h-full" />
      </div>
      <div style={{ fontFamily: TEXT, fontSize: 10, lineHeight: 1.7, color: PAL.ink, fontWeight: 300, letterSpacing: '0.02em' }}>
        <p style={{ ...monoCaps, fontSize: 8, marginBottom: 16, color: PAL.burgundy }}>26 April 2026</p>
        <p style={{ marginBottom: 12 }}>Dear collaborator,</p>
        <p style={{ marginBottom: 12 }}>This is a letterhead — a quiet surface for considered correspondence. The mark sits at the top, the body holds the message, and the footer carries the contact line. Nothing more.</p>
        <p style={{ marginBottom: 12 }}>Letters from the atelier are short by design. The work speaks at greater length than the page does.</p>
        <p>Warmly,</p>
        <p style={{ fontFamily: NARROW, fontSize: 12, fontWeight: 500, marginTop: 16 }}>{identity.founder}</p>
      </div>
      <div className="mt-auto pt-8 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)', fontFamily: MONO, fontSize: 8, letterSpacing: '0.06em', color: PAL.ink, opacity: 0.6 }}>
        <p>{contact.web}  ·  {studio.city}, {studio.country}  ·  {contact.phone}</p>
      </div>
    </div>
  )
}

// ─── Letterhead B (richer — date/ref grid, body, signoff, footer) ─

export function LetterheadB() {
  return (
    <div
      className="w-full h-full flex flex-col p-7 [&_svg]:w-auto [&_svg]:h-auto"
      style={{ background: PAL.paper, color: PAL.ink }}
    >
      <div className="flex justify-between items-start">
        <KolLogo variant="lockup-vert" className="h-12" />
        <div style={{ fontFamily: MONO, fontSize: 6.5, lineHeight: 1.7, color: 'rgba(19,19,22,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'right' }}>
          {studio.street}<br/>
          {studio.locShort}<br/>
          {contact.email}<br/>
          {contact.phone}
        </div>
      </div>

      <div className="grid mt-6" style={{ gridTemplateColumns: 'auto 1fr', columnGap: 16, rowGap: 3, fontFamily: MONO, fontSize: 6.5, letterSpacing: '0.04em', color: 'rgba(19,19,22,0.85)' }}>
        <span style={{ color: 'rgba(19,19,22,0.45)', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: 6 }}>Date</span><span>27 March 2026</span>
        <span style={{ color: 'rgba(19,19,22,0.45)', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: 6 }}>Ref</span><span>AC–26–014 · Linen Coat, edition 14 / 24</span>
        <span style={{ color: 'rgba(19,19,22,0.45)', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: 6 }}>To</span><span>Hólmfríður Jónsdóttir · Hverfisgata 4 · 101 Reykjavík</span>
      </div>

      <div className="mt-5 flex-1" style={{ fontFamily: TEXT, fontSize: 7.5, lineHeight: 1.6, color: 'rgba(19,19,22,0.88)', letterSpacing: '0.005em' }}>
        <p style={{ marginBottom: 9 }}>Dear Hólmfríður,</p>
        <p style={{ margin: '0 0 7px 0' }}>Thank you for choosing the Linen Coat. Your piece is hand-cut and stitched in the studio in Reykjavík, finished with horn buttons and the woven AC neck label. It is part of an edition of twenty-four, numbered 14 of 24.</p>
        <p style={{ margin: '0 0 7px 0' }}>The coat takes roughly five working days to complete from the day cutting begins. We will write again with a tracking reference once it leaves the studio. The packaging — dust bag, gift box and edition card — is made by hand and is yours to keep.</p>
        <p style={{ margin: '0 0 7px 0' }}>Linen softens with use. Wash inside out at thirty degrees, line dry, iron damp. The piece is intended to age, mark and remain in service.</p>
        <p style={{ margin: '0 0 7px 0' }}>If anything about the fit or the timing needs to change, write directly to this address. We will reply within one working day.</p>
        <p style={{ margin: '0 0 7px 0' }}>With thanks,</p>
        <div style={{ marginTop: 12 }}>
          <KolLogo variant="logomark" className="block" style={{ height: 22, width: 'auto', margin: '6px 0 4px' }} />
          <div style={{ fontFamily: NARROW, fontSize: 8, fontWeight: 600, letterSpacing: '0.02em' }}>{identity.founder}</div>
          <div style={{ fontFamily: MONO, fontSize: 6, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(19,19,22,0.55)', marginTop: 2 }}>{identity.role}</div>
        </div>
      </div>

      <div className="mt-auto pt-2 flex justify-between" style={{ fontFamily: MONO, fontSize: 5.5, letterSpacing: '0.18em', color: 'rgba(19,19,22,0.45)', textTransform: 'uppercase', borderTop: '0.5px solid rgba(19,19,22,0.18)' }}>
        <span>{legal.entity} · Kt. {legal.kt}</span>
        <span>{contact.web}</span>
        <span>Page 01 / 01</span>
      </div>
    </div>
  )
}

// ─── Email signature ─────────────────────────────────────────────

export function EmailSignature() {
  return (
    <div
      className="flex items-center gap-6 p-6 rounded-sm"
      style={{ background: PAL.paper, color: PAL.ink }}
    >
      <div className="h-16 w-16 flex items-center justify-center [&_svg]:w-auto [&_svg]:h-full">
        <KolLogo variant="logomark" />
      </div>
      <div className="border-l h-16" style={{ borderColor: 'rgba(0,0,0,0.12)' }} />
      <div style={{ color: PAL.ink }}>
        <p style={{ fontFamily: NARROW, fontSize: 16, fontWeight: 500, lineHeight: 1.2 }}>{identity.founder}</p>
        <p style={{ ...monoCaps, fontSize: 9, opacity: 0.6, marginTop: 2 }}>Founder · {identity.name}</p>
        <p style={{ fontFamily: MONO, fontSize: 10, marginTop: 8, lineHeight: 1.5, letterSpacing: '0.04em' }}>
          <span style={{ opacity: 0.6 }}>{contact.email}</span>
          <span style={{ margin: '0 8px', opacity: 0.3 }}>·</span>
          <span style={{ opacity: 0.6 }}>{contact.web}</span>
        </p>
      </div>
    </div>
  )
}

// ─── Hangtag (3:5, with hole) ─────────────────────────────────────

export function Hangtag({ side = 'front' }) {
  if (side === 'front') {
    return (
      <div
        className="w-full h-full relative flex items-center justify-center p-6 [&_svg]:w-auto [&_svg]:h-full"
        style={{ background: PAL.champagne, color: PAL.ink }}
      >
        <span className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ background: PAL.paper, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)' }} />
        <KolLogo variant="logomark" className="max-h-[40%]" />
      </div>
    )
  }
  return (
    <div
      className="w-full h-full relative flex flex-col justify-between p-6"
      style={{ background: PAL.burgundy, color: PAL.champagne }}
    >
      <span className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ background: PAL.paper }} />
      <div className="mt-6 text-center">
        <p style={{ ...monoCaps, fontSize: 8, opacity: 0.6 }}>Style</p>
        <p style={{ fontFamily: NARROW, fontSize: 16, fontWeight: 500, marginTop: 4 }}>Edda Coat</p>
      </div>
      <div className="text-center" style={{ fontFamily: MONO, fontSize: 9, lineHeight: 1.6, letterSpacing: '0.05em' }}>
        <p style={{ opacity: 0.6 }}>Size 38</p>
        <p style={{ marginTop: 4, fontSize: 14, fontFamily: COMPACT, fontWeight: 400, opacity: 1 }}>€ 1,250</p>
      </div>
    </div>
  )
}

// ─── Swing tag (3:5, decorative) ──────────────────────────────────

export function SwingTag() {
  return (
    <div
      className="w-full h-full relative flex flex-col items-center justify-center p-6 gap-4 [&_svg]:w-auto [&_svg]:h-full"
      style={{ background: PAL.sand, color: PAL.ink }}
    >
      <span className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ background: PAL.paper, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)' }} />
      <div className="h-10 mt-6 flex items-center justify-center">
        <KolLogo variant="wordmark" />
      </div>
      <div className="w-12 h-px" style={{ background: PAL.burgundy }} />
      <p style={{ ...monoCaps, fontSize: 8, color: PAL.burgundy }}>{brandLabels.madeIn}</p>
      <p style={{ fontFamily: NARROW, fontSize: 14, fontWeight: 500, color: PAL.ink, textAlign: 'center', lineHeight: 1.2 }}>
        Autumn / Winter<br/>Collection
      </p>
    </div>
  )
}

// ─── Care label (narrow strip) ────────────────────────────────────

export function CareLabel() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-between p-4"
      style={{ background: PAL.paper, color: PAL.ink }}
    >
      <div className="text-center">
        <p style={{ ...monoCaps, fontSize: 7, opacity: 0.5 }}>{identity.name}</p>
        <p style={{ ...monoCaps, fontSize: 7, opacity: 0.5, marginTop: 2 }}>{brandLabels.madeIn}</p>
      </div>
      <div className="text-center" style={{ fontFamily: MONO, fontSize: 8, lineHeight: 1.5, letterSpacing: '0.04em', opacity: 0.7 }}>
        <p>95% wool</p>
        <p>5% linen</p>
      </div>
      <div className="flex gap-2 text-base opacity-60">
        <span>◯</span>
        <span>△</span>
        <span>□</span>
        <span>▽</span>
        <span>◇</span>
      </div>
      <p style={{ ...monoCaps, fontSize: 7, opacity: 0.4 }}>Style 1042</p>
    </div>
  )
}

// ─── Neck label (woven, in collar) ────────────────────────────────

export function NeckLabel() {
  return (
    <div
      className="w-full h-full flex items-center justify-center p-3 [&_svg]:w-auto [&_svg]:h-full"
      style={{ background: PAL.paper, color: PAL.ink }}
    >
      <KolLogo variant="wordmark" className="max-h-[55%]" />
    </div>
  )
}

// ─── Size label (seam, narrow strip) ──────────────────────────────

export function SizeLabel() {
  return (
    <div
      className="w-full h-full flex items-center justify-center p-2"
      style={{ background: PAL.paper }}
    >
      <span style={{ fontFamily: NARROW, fontSize: 18, fontWeight: 500, color: PAL.ink, letterSpacing: '0.05em' }}>38</span>
    </div>
  )
}

// ─── Edition card (printed, bundled with garment) ─────────────────

export function EditionCard() {
  return (
    <div
      className="w-full h-full flex flex-col p-6"
      style={{ background: PAL.paper, color: PAL.ink }}
    >
      <p style={{ ...monoCaps, fontSize: 8, opacity: 0.5 }}>Edition</p>
      <p style={{ fontFamily: NARROW, fontSize: 28, fontWeight: 500, marginTop: 4 }}>14 / 24</p>
      <p style={{ ...monoCaps, fontSize: 8, opacity: 0.5, marginTop: 16 }}>Year</p>
      <p style={{ fontFamily: NARROW, fontSize: 18, fontWeight: 500, marginTop: 4 }}>2026</p>
      <div className="mt-auto" style={{ fontFamily: TEXT, fontSize: 10, lineHeight: 1.6, fontWeight: 300, letterSpacing: '0.02em', opacity: 0.7 }}>
        <p>{brandLabels.handBy}</p>
        <p>in {studio.city}.</p>
      </div>
    </div>
  )
}

// ─── Dust bag (drawstring pouch) ──────────────────────────────────

export function DustBag() {
  return (
    <div
      className="w-full h-full relative flex items-center justify-center [&_svg]:w-auto [&_svg]:h-full"
      style={{ background: PAL.paper, color: PAL.ink }}
    >
      <div className="absolute top-3 inset-x-6 h-px" style={{ background: 'rgba(0,0,0,0.12)' }} />
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ background: 'rgba(0,0,0,0.25)' }} />
      <KolLogo variant="wordmark" className="max-h-[14%]" />
    </div>
  )
}

// ─── Garment bag (long fabric carrier) ────────────────────────────

export function GarmentBag() {
  return (
    <div
      className="w-full h-full relative flex items-center justify-center [&_svg]:w-auto [&_svg]:h-full"
      style={{ background: PAL.paper, color: PAL.ink }}
    >
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-7 h-3 rounded-t-full border-2 border-b-0" style={{ borderColor: 'rgba(0,0,0,0.25)' }} />
      <KolLogo variant="logomark" className="max-h-[8%]" />
    </div>
  )
}

// ─── Long hangtag (ribbon-style, 1:6) ─────────────────────────────

export function HangtagLong() {
  return (
    <div
      className="aspect-[1/6] relative flex items-end justify-center pb-6 rounded-sm"
      style={{ background: PAL.champagne }}
    >
      <span className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ background: PAL.paper, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)' }} />
      <p style={{ fontFamily: NARROW, fontSize: 11, fontWeight: 500, color: PAL.ink, letterSpacing: '0.04em', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
        {identity.name}
      </p>
    </div>
  )
}

// ─── Packaging (square box face) ──────────────────────────────────

export function Packaging() {
  return (
    <div
      className="w-full h-full relative flex flex-col items-center justify-center p-6 gap-3 overflow-hidden"
      style={{ background: '#fff', color: '#000' }}
    >
      <KolLogo variant="wordmark" className="w-2/3" />
      <div className="w-10 h-px" style={{ background: '#000', opacity: 0.4 }} />
      <KolLogo variant="logomark" className="w-2/5" />
      <p style={{ ...monoCaps, fontSize: 7, opacity: 0.6, position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center' }}>
        {brandLabels.handmade}
      </p>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
//  TYPE B variants — ported from _tmp/acyr branded assets/Asset Register.html
//  Richer, more illustrated mocks for visual comparison alongside A.
// ════════════════════════════════════════════════════════════════

// ─── Hangtag B (front + back via `side`) ─────────────────────────

export function HangtagB({ side = 'front' }) {
  const isBack = side === 'back'
  return (
    <div
      className="w-full h-full relative flex flex-col items-center"
      style={{
        background: isBack ? PAL.maroon : PAL.paper,
        color: isBack ? PAL.paper : PAL.ink,
        padding: '22px 18px',
        aspectRatio: '60 / 100',
      }}
    >
      <div
        style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          width: 8, height: 8, borderRadius: '50%', background: '#1B1B1E',
        }}
      />
      {isBack ? (
        <>
          <div style={{ ...monoCaps, fontSize: 7, letterSpacing: '0.2em', color: 'rgba(251,247,238,0.5)', marginTop: 32 }}>Manifesto</div>
          <div style={{ fontFamily: TEXT, fontSize: 8, lineHeight: 1.7, color: 'rgba(251,247,238,0.85)', marginTop: 8, textAlign: 'left', fontStyle: 'italic' }}>
            Garments cut for slow living.<br/><br/>
            Each piece is patterned, sewn and finished in our Reykjavík atelier.
          </div>
          <div style={{ marginTop: 'auto', fontFamily: MONO, fontSize: 7.5, letterSpacing: '0.16em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.6, color: 'rgba(251,247,238,0.7)' }}>
            Style · 014<br/>SS&nbsp;26
          </div>
        </>
      ) : (
        <>
          <div style={{ marginTop: 28, textAlign: 'center', width: '100%' }}>
            <KolLogo variant="lockup-vert" className="w-full" />
          </div>
          <div style={{ marginTop: 'auto', fontFamily: MONO, fontSize: 7.5, letterSpacing: '0.16em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.6, color: 'rgba(19,19,22,0.6)' }}>
            Hand-finished<br/>in Reykjavík
          </div>
        </>
      )}
    </div>
  )
}

// ─── Swing tag B ──────────────────────────────────────────────────

export function SwingTagB() {
  return (
    <div
      className="w-full h-full relative flex flex-col items-center justify-center text-center"
      style={{ background: PAL.champagne, color: PAL.ink, padding: '28px 22px', aspectRatio: '60 / 95' }}
    >
      <div
        style={{
          position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
          width: 10, height: 10, borderRadius: '50%', background: '#1B1B1E',
          boxShadow: '0 0 0 2px rgba(0,0,0,0.4)',
        }}
      />
      <div style={{ fontFamily: NARROW, fontSize: 18, fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.1, color: PAL.ink }}>ANOTHER CREATION</div>
      <div style={{ width: 36, height: 1, background: PAL.maroon, margin: '14px auto' }} />
      <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.24em', textTransform: 'uppercase', color: PAL.maroon, marginBottom: 22 }}>MADE IN ICELAND</div>
      <div style={{ fontFamily: NARROW, fontSize: 13, fontWeight: 500, lineHeight: 1.25, color: PAL.ink }}>
        Autumn / Winter<br/>Collection
      </div>
    </div>
  )
}

// ─── Edition card B ──────────────────────────────────────────────

export function EditionCardB() {
  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ background: PAL.paper, color: PAL.ink, padding: '32px 28px', gap: 24, aspectRatio: '100 / 148' }}
    >
      <div>
        <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(19,19,22,0.55)', marginBottom: 8 }}>Edition</div>
        <div style={{ fontFamily: NARROW, fontSize: 38, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.01em' }}>14 / 24</div>
      </div>
      <div>
        <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(19,19,22,0.55)', marginBottom: 8 }}>Year</div>
        <div style={{ fontFamily: NARROW, fontSize: 38, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.01em' }}>2026</div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ fontFamily: TEXT, fontSize: 11, lineHeight: 1.45, color: 'rgba(19,19,22,0.7)' }}>
        Made by hand by Ýr<br/>in Reykjavík.
      </div>
    </div>
  )
}

// ─── Neck label B (woven, cream + dark variants) ─────────────────

export function NeckLabelB({ variant = 'cream' }) {
  const isDark = variant === 'dark'
  return (
    <div
      className="w-full h-full relative flex flex-col items-center justify-center"
      style={{
        background: isDark ? PAL.maroon : PAL.champagne,
        color: isDark ? PAL.paper : PAL.ink,
        padding: '12px 14px', gap: 5, aspectRatio: '50 / 30',
      }}
    >
      <KolLogo variant="lockup-vert" style={{ display: 'block', height: '38%', width: 'auto' }} />
      <div style={{ width: '22%', height: 0.5, background: isDark ? 'rgba(251,247,238,0.4)' : 'rgba(0,0,0,0.3)' }} />
      <div style={{ fontFamily: MONO, fontSize: 7, letterSpacing: '0.32em', textTransform: 'uppercase', lineHeight: 1, opacity: 0.7 }}>Reykjavík</div>
      <div style={{ position: 'absolute', inset: 4, border: `0.5px dashed ${isDark ? 'rgba(251,247,238,0.22)' : 'rgba(0,0,0,0.18)'}`, pointerEvents: 'none' }} />
    </div>
  )
}

// ─── Size label B (printed satin, S/M/L) ─────────────────────────

const SIZE_DATA = {
  S: { eu: 'EU 36', meta: 'UK 8 · US 4',  alt: 'FR 36 · IT 40' },
  M: { eu: 'EU 38', meta: 'UK 10 · US 6', alt: 'FR 38 · IT 42' },
  L: { eu: 'EU 40', meta: 'UK 12 · US 8', alt: 'FR 40 · IT 44' },
}

export function SizeLabelB({ size = 'S' }) {
  const d = SIZE_DATA[size]
  return (
    <div
      className="w-full h-full relative flex flex-col items-center"
      style={{
        background: 'linear-gradient(180deg, #faf2e0 0%, #FCFBFB 30%, #FCFBFB 70%, #f3e8d0 100%)',
        color: PAL.ink, padding: '12px 6px 10px', aspectRatio: '25 / 40',
        boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.12)',
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: 7, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(19,19,22,0.45)', marginTop: 4 }}>Size</div>
      <div style={{ width: 18, height: 0.5, background: 'rgba(19,19,22,0.3)', margin: '6px 0' }} />
      <div style={{ fontFamily: NARROW, fontSize: 36, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.02em' }}>{size}</div>
      <div style={{ fontFamily: MONO, fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(19,19,22,0.65)', marginTop: 'auto', marginBottom: 4, textAlign: 'center', lineHeight: 1.5 }}>
        <b style={{ display: 'block', color: PAL.ink, fontWeight: 600 }}>{d.eu}</b>
        {d.meta}<br/>
        {d.alt}
      </div>
    </div>
  )
}

// ─── Care label B (A minimal / B standard / C long) ──────────────

const CARE_ICONS = (
  <>
    <div style={{ aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
        <path d="M3 8 C3 5, 5 4, 8 4 L16 4 C19 4, 21 5, 21 8 L21 18 C21 19, 20 20, 19 20 L5 20 C4 20, 3 19, 3 18 Z"/>
        <text x="12" y="15" fontFamily="sans-serif" fontSize="7" fontWeight="600" textAnchor="middle" fill="currentColor" stroke="none">30</text>
      </svg>
    </div>
    <div style={{ aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" style={{ width: '100%', height: '100%' }}>
        <path d="M3 6 L21 6 L17 18 L7 18 Z"/>
        <line x1="4" y1="4" x2="20" y2="20"/>
      </svg>
    </div>
    <div style={{ aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
        <circle cx="12" cy="12" r="8"/>
        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
      </svg>
    </div>
    <div style={{ aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
        <path d="M4 18 L12 4 L20 18 Z"/>
        <line x1="6" y1="14" x2="18" y2="14"/>
      </svg>
    </div>
    <div style={{ aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
        <rect x="3" y="7" width="18" height="12"/>
        <line x1="3" y1="11" x2="21" y2="11"/>
        <circle cx="12" cy="15" r="1.2" fill="currentColor"/>
      </svg>
    </div>
  </>
)

export function CareLabelB({ tier = 'B' }) {
  const aspect = tier === 'A' ? '30 / 50' : tier === 'C' ? '30 / 120' : '40 / 80'
  return (
    <div
      className="w-full h-full relative flex flex-col"
      style={{
        background: PAL.paper, color: PAL.ink,
        padding: tier === 'A' ? '12px 8px 10px' : tier === 'C' ? '14px 10px 10px' : '14px 12px 12px',
        aspectRatio: aspect,
        boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.12)',
      }}
    >
      <div style={{ fontFamily: NARROW, fontSize: tier === 'A' ? 7 : tier === 'C' ? 7.5 : 9, fontWeight: 700, letterSpacing: '0.18em', lineHeight: 1, textAlign: 'center', paddingBottom: tier === 'A' ? 6 : 8, borderBottom: '0.5px solid rgba(19,19,22,0.3)', marginTop: 4 }}>
        ANOTHER&nbsp;CREATION
      </div>
      {tier === 'B' && (
        <div style={{ fontFamily: MONO, fontSize: 6.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(19,19,22,0.5)', marginTop: 9, marginBottom: 5 }}>Care · Pflege · Entretien</div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: tier === 'B' ? 4 : 3, marginTop: tier === 'A' ? 8 : 0 }}>
        {CARE_ICONS}
      </div>
      <div style={{ fontFamily: MONO, fontSize: tier === 'A' ? 6 : tier === 'C' ? 6.2 : 7, lineHeight: 1.6, letterSpacing: '0.06em', color: 'rgba(19,19,22,0.78)', marginTop: tier === 'A' ? 8 : tier === 'C' ? 6 : 8, textAlign: tier === 'A' || tier === 'C' ? 'center' : 'left' }}>
        <b style={{ display: tier === 'A' || tier === 'C' ? 'block' : 'inline', fontSize: tier === 'A' ? 5.5 : tier === 'C' ? 5.5 : 7, letterSpacing: tier === 'A' || tier === 'C' ? '0.18em' : '0.06em', textTransform: tier === 'A' || tier === 'C' ? 'uppercase' : 'none', color: tier === 'A' || tier === 'C' ? 'rgba(19,19,22,0.5)' : PAL.ink, fontWeight: tier === 'A' || tier === 'C' ? 500 : 600, marginBottom: tier === 'A' || tier === 'C' ? 2 : 0 }}>Composition</b>
        {tier === 'A' && '100% Linen'}
        {tier === 'B' && ' 100% Linen / Lin / Leinen'}
        {tier === 'C' && '100% Linen'}
      </div>
      {tier === 'B' && (
        <div style={{ fontFamily: MONO, fontSize: 6, lineHeight: 1.65, letterSpacing: '0.06em', color: 'rgba(19,19,22,0.55)', marginTop: 6 }}>
          Wash inside out · Iron damp<br/>
          Lavage à l'envers · Repasser humide<br/>
          Auf links waschen · Feucht bügeln
        </div>
      )}
      {tier === 'C' && (
        <div style={{ fontFamily: MONO, fontSize: 5.5, lineHeight: 1.65, letterSpacing: '0.06em', color: 'rgba(19,19,22,0.55)', marginTop: 7 }}>
          {[
            ['EN', "Wash inside out at 30°. Line dry. Iron damp."],
            ['FR', "Laver à l'envers à 30°. Sécher à l'air. Repasser humide."],
            ['DE', "Auf links bei 30° waschen. Liegend trocknen. Feucht bügeln."],
            ['IS', "Þvoið á rönguna við 30°. Þurrkið hangandi. Strjúkið rakt."],
            ['中文', "反面 30°C 洗。阴干。半湿熨烫。"],
          ].map(([k, v]) => (
            <span key={k} style={{ display: 'block', marginBottom: 4 }}>
              <b style={{ display: 'block', fontSize: 5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(19,19,22,0.42)', fontWeight: 500, marginBottom: 1 }}>{k}</b>
              {v}
            </span>
          ))}
        </div>
      )}
      <div style={{ marginTop: 'auto', paddingTop: tier === 'C' ? 6 : 8, borderTop: '0.5px solid rgba(19,19,22,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: MONO, fontSize: tier === 'A' ? 5 : tier === 'C' ? 5 : 6, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(19,19,22,0.6)' }}>
        <span>{tier === 'A' ? 'Iceland' : 'Made in Iceland'}</span>
        <span style={{ fontFeatureSettings: "'tnum'" }}>{tier === 'A' ? 'AC–26–014' : 'Lot AC–26–014'}</span>
      </div>
    </div>
  )
}

// ─── Dust bag B (cotton drawstring, 400×500) ──────────────────────

export function DustBagB() {
  return (
    <div
      className="w-full h-full relative flex flex-col items-center"
      style={{
        background: `radial-gradient(ellipse 100% 60% at 50% 0%, rgba(0,0,0,0.04), transparent 50%), repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,0.018) 2px 3px), repeating-linear-gradient(90deg, transparent 0 2px, rgba(0,0,0,0.018) 2px 3px), ${PAL.champagne}`,
        color: PAL.ink, padding: '70px 36px 48px', aspectRatio: '400 / 500',
        boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.1)',
      }}
    >
      {/* drawstring channel */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 18, height: 22, borderTop: '0.5px dashed rgba(0,0,0,0.22)', borderBottom: '0.5px dashed rgba(0,0,0,0.22)' }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '70%', height: 3, background: 'linear-gradient(90deg, transparent 0%, #FCFBFB 8%, #d9c8a8 50%, #FCFBFB 92%, transparent 100%)', borderRadius: 3 }} />
      </div>
      {/* grommets */}
      <div style={{ position: 'absolute', top: 8, left: 'calc(50% - 22px)', width: 9, height: 9, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #d9c8a8, #8a7a5a)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.3)' }} />
      <div style={{ position: 'absolute', top: 8, right: 'calc(50% - 22px)', width: 9, height: 9, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #d9c8a8, #8a7a5a)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.3)' }} />
      {/* seams */}
      <div style={{ position: 'absolute', top: 4, bottom: 4, left: 6, borderLeft: '0.5px dashed rgba(0,0,0,0.18)' }} />
      <div style={{ position: 'absolute', top: 4, bottom: 4, right: 6, borderLeft: '0.5px dashed rgba(0,0,0,0.18)' }} />
      <div style={{ position: 'absolute', left: 6, right: 6, bottom: 8, borderTop: '0.5px dashed rgba(0,0,0,0.18)' }} />

      <div style={{ marginTop: '18%', textAlign: 'center', width: '58%' }}>
        <KolLogo variant="lockup-vert" className="w-full" style={{ opacity: 0.9 }} />
      </div>
      <div style={{ width: 70, height: 0.5, background: 'rgba(19,19,22,0.3)', margin: '28px auto' }} />
      <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(19,19,22,0.55)' }}>Reykjavík</div>
      <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 24, fontFamily: MONO, fontSize: 7.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(19,19,22,0.42)' }}>
        <span>Made in Iceland</span>
        <span>· 100% Cotton</span>
        <span>· Reusable</span>
      </div>
    </div>
  )
}

// ─── Dress bag B (hanging zip-front, 600×1500) ────────────────────

export function DressBagB() {
  return (
    <div
      className="w-full h-full relative"
      style={{
        background: `radial-gradient(ellipse 80% 30% at 50% 0%, rgba(0,0,0,0.18), transparent 60%), repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,0.014) 3px 4px), #1B1B1E`,
        color: PAL.paper, padding: '52px 0 44px', aspectRatio: '600 / 1500',
        boxShadow: 'inset 0 0 0 0.5px rgba(251,247,238,0.1)',
      }}
    >
      {/* hook */}
      <div style={{ position: 'absolute', left: '50%', top: -22, transform: 'translateX(-50%)', width: 18, height: 36, border: '1.5px solid rgba(251,247,238,0.55)', borderRadius: '50% 50% 0 0 / 100% 100% 0 0', borderBottom: 'none' }} />
      {/* hook slot */}
      <div style={{ position: 'absolute', left: '50%', top: 18, transform: 'translateX(-50%)', width: 36, height: 4, borderRadius: 4, background: 'rgba(0,0,0,0.6)', boxShadow: 'inset 0 0 0 0.5px rgba(251,247,238,0.25)' }} />
      {/* seams */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 5, borderLeft: '0.5px dashed rgba(251,247,238,0.18)' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 5, borderLeft: '0.5px dashed rgba(251,247,238,0.18)' }} />
      {/* zip */}
      <div style={{ position: 'absolute', left: '50%', top: 32, bottom: 32, transform: 'translateX(-50%)', width: 5, background: 'linear-gradient(90deg, rgba(0,0,0,0.4), rgba(0,0,0,0.5), rgba(0,0,0,0.4))', borderRadius: 1, boxShadow: 'inset 0 0 0 0.5px rgba(251,247,238,0.2)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(251,247,238,0.45) 0 1px, transparent 1px 3px)' }} />
      </div>
      {/* zip pull */}
      <div style={{ position: 'absolute', left: '50%', top: '28%', transform: 'translateX(-50%)', width: 16, height: 22 }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', width: 9, height: 14, background: 'linear-gradient(180deg, #f1ddc8, #c4a87e)', borderRadius: 1 }} />
        <div style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)', width: 14, height: 4, background: PAL.maroon, borderRadius: 1 }} />
      </div>
      {/* identity panel */}
      <div style={{ position: 'absolute', left: '50%', top: '38%', transform: 'translateX(-50%)', width: '56%', aspectRatio: '1 / 1.25', background: PAL.paper, color: PAL.ink, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '18px 14px' }}>
        <div style={{ position: 'absolute', inset: 6, border: '1px dashed rgba(19,19,22,0.28)', pointerEvents: 'none' }} />
        <KolLogo variant="lockup-vert" style={{ width: '76%', height: 'auto' }} />
        <div style={{ width: '32%', height: 0.5, background: PAL.maroon, margin: '14px 0 10px' }} />
        <div style={{ fontFamily: MONO, fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(19,19,22,0.6)' }}>Reykjavík</div>
      </div>
      <div style={{ position: 'absolute', bottom: 18, left: 0, right: 0, textAlign: 'center', fontFamily: MONO, fontSize: 8, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(251,247,238,0.42)' }}>
        Another Creation
      </div>
    </div>
  )
}

// ─── Gift box B (rigid two-piece, top-down view) ──────────────────

export function GiftBoxB() {
  return (
    <div
      className="w-full h-full relative"
      style={{
        background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,0,0,0.06), transparent 70%), repeating-linear-gradient(0deg, transparent 0 4px, rgba(0,0,0,0.012) 4px 5px), ${PAL.champagne}`,
        color: PAL.ink, aspectRatio: '320 / 240',
        boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.18), 0 0 0 4px #FCFBFB, 0 0 0 5px rgba(0,0,0,0.18)',
      }}
    >
      {/* ribbon */}
      <div style={{ position: 'absolute', left: '22%', top: -6, bottom: -6, width: '11%', background: `linear-gradient(90deg, rgba(0,0,0,0.05), ${PAL.maroon} 18%, #5e2a36 50%, ${PAL.maroon} 82%, rgba(0,0,0,0.05))`, boxShadow: 'inset 1px 0 0 rgba(0,0,0,0.2), inset -1px 0 0 rgba(0,0,0,0.2)' }} />
      {/* corners */}
      <div style={{ position: 'absolute', inset: 12, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 18, height: 18, borderTop: '0.5px solid rgba(19,19,22,0.18)', borderLeft: '0.5px solid rgba(19,19,22,0.18)' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 18, height: 18, borderTop: '0.5px solid rgba(19,19,22,0.18)', borderRight: '0.5px solid rgba(19,19,22,0.18)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 18, height: 18, borderBottom: '0.5px solid rgba(19,19,22,0.18)', borderLeft: '0.5px solid rgba(19,19,22,0.18)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderBottom: '0.5px solid rgba(19,19,22,0.18)', borderRight: '0.5px solid rgba(19,19,22,0.18)' }} />
      </div>
      {/* center mark + place */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 36, textAlign: 'center' }}>
        <KolLogo variant="lockup-vert" style={{ width: '22%', height: 'auto', opacity: 0.85, filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.5)) drop-shadow(0 -0.5px 0 rgba(0,0,0,0.18))' }} />
        <div style={{ width: 60, height: 0.5, background: PAL.maroon, margin: '20px 0 14px' }} />
        <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.36em', textTransform: 'uppercase', color: 'rgba(19,19,22,0.45)' }}>Reykjavík · Iceland</div>
      </div>
    </div>
  )
}
