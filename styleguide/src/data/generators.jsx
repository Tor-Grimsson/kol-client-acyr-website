/**
 * Editor mode reference table — rows + columns for the styleguide and
 * reference pages. Formerly exported from `pages/Generators.jsx` (deleted
 * after the labs folded into the unified editor; see roadmap §4).
 *
 * Each row points at an `/editor/:mode` route. Social + Compositor
 * collapsed into Compose mode and are surfaced via starter presets in
 * `editor/library/starters.js`.
 */

export const GENERATOR_ROWS = [
  {
    id:          'compose',
    label:       '01',
    to:          '/editor/compose',
    title:       'Compose',
    status:      'live',
    description: 'Layered Figma-style editor. Background / pattern / photo / shape / text + group, with multi-select, flatten, and SVG/PNG export. The unified editing surface — Social and Compositor folded in here as starter presets.',
  },
  {
    id:          'palette',
    label:       '02',
    to:          '/editor/palette',
    title:       'Palette',
    status:      'live',
    description: 'Layout × palette × logo. Swap any input, watch the output. Scratchpad for deciding how identity elements co-exist on a shared composition. (Was Combo lab.)',
  },
  {
    id:          'pattern',
    label:       '03',
    to:          '/editor/pattern',
    title:       'Pattern',
    status:      'live',
    description: 'Shape × grid × color → tileable SVG. Pick a shape (or paste your own), set columns/rows/gap, choose colors, save to library or drag onto the compose canvas. (Was Pattern lab.)',
  },
  {
    id:          'type',
    label:       '04',
    to:          '/editor/type',
    title:       'Type',
    status:      'live',
    description: 'Pick any cut from the full 98-cut Right Grotesk family. Live preview, axis morph between cuts, opentype outline export. (Was Type lab.)',
  },
]

export const generatorCols = [
  { accessor: 'label',  header: '#',           className: 'kol-table-cell-meta',  style: { width: 56 } },
  { accessor: 'title',  header: 'Mode',        className: 'kol-table-cell-text' },
  { accessor: 'status', header: 'Status',      className: 'kol-table-cell-meta',  style: { width: 96 } },
  {
    accessor: 'route',
    header:   'Route',
    className: 'kol-table-cell-meta',
    style: { width: 180 },
    render:   (row) => <code className="kol-helper-10 text-meta">{row.to}</code>,
  },
  { accessor: 'description', header: 'Description', className: 'kol-table-cell-text' },
]
