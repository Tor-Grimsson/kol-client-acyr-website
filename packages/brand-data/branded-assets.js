/**
 * Branded asset specs — mm dimensions + print/digital production data.
 *
 * Frame is the outer mm box (bleed-box for printed assets, clearspace-
 * box for logos). Trim is the inner artwork. Rows feed AssetSpecTable.
 *
 * Source: docs/styleguide/branded-assets.md.
 */

export const ASSET_SPECS = {
  // ── Stationery ─────────────────────────────────────────────────
  'business-card': {
    name: 'Business card',
    frame: [91, 61],
    trim:  [85, 55],
    bleed: 3,
    safe:  [79, 49],
    rows: [
      { property: 'Trim',  print: '85 × 55 mm',              digital: '1004 × 650 px @ 300 dpi' },
      { property: 'Bleed', print: '+3 mm → 91 × 61 mm',      digital: '—' },
      { property: 'Safe',  print: '79 × 49 mm',              digital: '932 × 578 px' },
      { property: 'Color', print: 'CMYK · FOGRA39',          digital: 'sRGB' },
      { property: 'Stock', print: '350 gsm uncoated, cream', digital: '—' },
    ],
  },
  'business-card-back': {
    name: 'Business card · back',
    frame: [91, 61],
    trim:  [85, 55],
    bleed: 3,
    safe:  [79, 49],
    rows: [
      { property: 'Trim',  print: '85 × 55 mm',         digital: '1004 × 650 px @ 300 dpi' },
      { property: 'Bleed', print: '+3 mm → 91 × 61 mm', digital: '—' },
    ],
  },
  envelope: {
    name: 'Envelope · DL',
    frame: [226, 116],
    trim:  [220, 110],
    bleed: 3,
    safe:  [210, 100],
    rows: [
      { property: 'Trim',  print: '220 × 110 mm (DL)',        digital: '2598 × 1299 px @ 300 dpi' },
      { property: 'Bleed', print: '+3 mm',                    digital: '—' },
      { property: 'Safe',  print: '5 mm inset',               digital: '—' },
      { property: 'Stock', print: '120 gsm uncoated cream',   digital: '—' },
      { property: 'Print', print: '1-color K · litho',        digital: '—' },
    ],
  },
  letterhead: {
    name: 'Letterhead · A4',
    frame: [216, 303],
    trim:  [210, 297],
    bleed: 3,
    safe:  [190, 277],
    rows: [
      { property: 'Trim',   print: '210 × 297 mm (A4)',         digital: '2480 × 3508 px @ 300 dpi' },
      { property: 'Bleed',  print: '+3 mm',                     digital: '—' },
      { property: 'Margin', print: '10 mm safe / 20 mm body',   digital: '—' },
      { property: 'Stock',  print: '100 gsm uncoated cream',    digital: '—' },
      { property: 'Print',  print: '1-color K (or digital)',    digital: 'PDF/A for archival' },
    ],
  },
  'email-signature': {
    name: 'Email signature',
    trim: [15, 4],
    rows: [
      { property: 'Format', print: 'HTML <table>',            digital: 'Gmail · Outlook · Apple Mail safe' },
      { property: 'Width',  print: '600 px max',              digital: 'Mobile-safe' },
      { property: 'Mark',   print: 'PNG @ 2× · 128 × 128 px', digital: 'CDN-hosted, not inline base64' },
      { property: 'Type',   print: 'System fallback stack',   digital: 'No webfonts in email' },
      { property: 'Color',  print: 'sRGB',                    digital: '#5A0816 mark on #FBF7EE bg' },
    ],
  },

  // ── Labels & tags ──────────────────────────────────────────────
  hangtag: {
    name: 'Hangtag',
    frame: [66, 106],
    trim:  [60, 100],
    bleed: 3,
    safe:  [54, 94],
    rows: [
      { property: 'Trim',     print: '60 × 100 mm',                              digital: '709 × 1181 px @ 300 dpi' },
      { property: 'Bleed',    print: '+3 mm',                                    digital: '—' },
      { property: 'Punch',    print: '⌀ 4 mm · centered, 8 mm from top',         digital: '—' },
      { property: 'Stock',    print: '400 gsm uncoated cream + back: burgundy',  digital: '—' },
      { property: 'String',   print: 'Natural cotton, 0.8 mm × 200 mm',          digital: '—' },
    ],
  },
  'swing-tag': {
    name: 'Swing tag',
    frame: [66, 101],
    trim:  [60, 95],
    bleed: 3,
    safe:  [54, 89],
    rows: [
      { property: 'Trim',  print: '60 × 95 mm',           digital: '709 × 1122 px @ 300 dpi' },
      { property: 'Bleed', print: '+3 mm',                digital: '—' },
      { property: 'Punch', print: '⌀ 4 mm · 8 mm from top', digital: '—' },
      { property: 'Stock', print: '400 gsm coated burgundy', digital: '—' },
      { property: 'Die',   print: 'Rounded rectangle',    digital: '—' },
    ],
  },
  'edition-card': {
    name: 'Edition card',
    frame: [106, 154],
    trim:  [100, 148],
    bleed: 3,
    safe:  [90, 138],
    rows: [
      { property: 'Trim',      print: '100 × 148 mm (A6)',           digital: '1181 × 1748 px @ 300 dpi' },
      { property: 'Bleed',     print: '+3 mm',                       digital: '—' },
      { property: 'Stock',     print: '300 gsm uncoated cream',      digital: '—' },
      { property: 'Numbering', print: 'Hand-written or letterpress', digital: 'Variable data' },
      { property: 'Print',     print: '1-color K · letterpress preferred', digital: '—' },
    ],
  },
  'neck-label': {
    name: 'Neck label · woven',
    frame: [50, 30],
    trim:  [50, 30],
    safe:  [46, 26],
    rows: [
      { property: 'Format',       print: '50 × 30 mm centre-fold',       digital: '100 × 30 mm flat' },
      { property: 'Construction', print: 'Damask weave',                 digital: 'High thread count for fine type' },
      { property: 'Yarns',        print: '2 colours: cream / burgundy',  digital: 'Polyester or rayon' },
      { property: 'Edges',        print: 'Heat-cut, all sides',          digital: '—' },
      { property: 'Attach',       print: 'Stitched at top fold to neck', digital: '—' },
    ],
  },
  'size-label': {
    name: 'Size label · seam',
    frame: [25, 40],
    trim:  [25, 40],
    safe:  [21, 36],
    rows: [
      { property: 'Format',       print: '25 × 40 mm flat',               digital: 'Folded into seam' },
      { property: 'Construction', print: 'Printed satin',                 digital: 'Soft-hand, low irritation' },
      { property: 'Print',        print: '1-colour K on cream satin',     digital: '—' },
      { property: 'Attach',       print: 'Caught in side seam, top fold', digital: '8 mm tail into seam' },
      { property: 'Variants',     print: 'S / M / L · EU / UK / US',      digital: 'See markdown for size mappings' },
    ],
  },
  'care-label': {
    name: 'Care label',
    frame: [40, 80],
    trim:  [40, 80],
    safe:  [34, 74],
    rows: [
      { property: 'Format',       print: '40 × 80 mm folded once',           digital: 'Sewn at top' },
      { property: 'Construction', print: 'Printed nylon taffeta',            digital: 'Heat-resistant, low-irritation' },
      { property: 'Content',      print: 'ISO/GINETEX symbols + composition', digital: 'EN / FR / DE / IS / 中文' },
      { property: 'Compliance',   print: 'EU 1007/2011 textile labelling',   digital: 'Country of origin required' },
      { property: 'Tiers',        print: 'A · Minimal 30×50 / B · Standard 40×80 / C · Long 30×120', digital: '—' },
    ],
  },

  // ── Garment bags & packaging ───────────────────────────────────
  'dust-bag': {
    name: 'Dust bag',
    frame: [410, 510],
    trim:  [400, 500],
    bleed: 5,
    safe:  [360, 430],
    rows: [
      { property: 'Format',   print: '400 × 500 mm flat',          digital: '35 mm drawstring channel at top' },
      { property: 'Material', print: '200 gsm natural cotton calico', digital: 'Undyed, GOTS preferred' },
      { property: 'Print',    print: '1-color screen print, K only', digital: 'Centred at 28% from top' },
      { property: 'Closure',  print: 'Cotton drawstring, 4 mm ⌀',   digital: 'Natural, unwaxed' },
      { property: 'Stitch',   print: 'Double-stitched edges',       digital: 'Burgundy thread on cream' },
    ],
  },
  'garment-bag': {
    name: 'Garment bag (dress bag)',
    frame: [610, 1510],
    trim:  [600, 1500],
    bleed: 5,
    safe:  [530, 1430],
    rows: [
      { property: 'Format',      print: '600 × 1500 mm',                      digital: 'Hanger loop 30 mm clearance at top' },
      { property: 'Material',    print: 'Recycled polyester non-woven, 80 gsm', digital: 'Or natural unbleached canvas' },
      { property: 'Closure',     print: 'Centre zip, full-length',            digital: 'Burgundy YKK or equivalent' },
      { property: 'Print panel', print: '240 × 340 mm cream patch · screen-printed', digital: 'Sewn-on; not direct-printed' },
      { property: 'Print',       print: '1-colour K on cream patch',          digital: '—' },
    ],
  },
  packaging: {
    name: 'Gift box',
    frame: [326, 246],
    trim:  [320, 240],
    bleed: 3,
    safe:  [280, 200],
    rows: [
      { property: 'Format',       print: '320 × 240 × 60 mm',                  digital: 'Two-piece: lid 30 mm depth, base 60 mm' },
      { property: 'Construction', print: 'Rigid grey board, 1500 gsm core',    digital: 'Wrapped in cream uncoated paper, 140 gsm' },
      { property: 'Lid finish',   print: 'Blind deboss · AC mark',             digital: '0.6 mm depth · 28 mm tall' },
      { property: 'Interior',     print: 'Cream tissue lining, 17 gsm',        digital: 'One AC pattern stamp at centre' },
      { property: 'Closure',      print: 'Burgundy satin band, 25 mm',         digital: 'Wrapped lengthwise, no bow' },
      { property: 'Print',        print: 'No external print',                  digital: 'Identity carried by deboss + ribbon only' },
    ],
  },
}
