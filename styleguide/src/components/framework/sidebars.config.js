/**
 * Single navigation tree.
 *
 * Each top-level entry is a page (icon + label + route). Pages may have
 * `children`. Children may have `children` (grandchildren) for further grouping.
 *
 * Leaf shape:
 *   { id: 'about',                 label: 'About'            }   — page section anchor (#about)
 *   { to: '/generators/combo-lab', label: 'Combo lab'        }   — sub-route link
 *
 * Group shape (no id, no to):
 *   { label: 'Color', children: [...] }                          — grandchild group
 */

export const NAV_TREE = [
  { id: 'home', label: 'Home', to: '/', icon: 'signature-thick' },

  {
    id: 'styleguide',
    label: 'Styleguide',
    to: '/styleguide',
    icon: 'book-open',
    children: [
      {
        label: 'Brand overview',
        children: [
          { id: 'about', label: 'About' },
          { id: 'voice', label: 'Voice' },
          { id: 'look',  label: 'Look' },
        ],
      },
      {
        label: 'Logos',
        children: [
          { id: 'logos-concept',   label: 'Concept' },
          { id: 'logos-types',     label: 'Types' },
        ],
      },
      {
        label: 'Foundations',
        children: [
          { id: 'color',      label: 'Color' },
          { id: 'typography', label: 'Typography' },
        ],
      },
      {
        label: 'Asset register',
        children: [
          { id: 'assets-stationery',   label: 'Stationery' },
          { id: 'assets-labels-tags',  label: 'Labels & tags' },
          { id: 'assets-garment-bags', label: 'Garment bags' },
          { id: 'assets-packaging',    label: 'Packaging' },
        ],
      },
      {
        label: 'Social',
        children: [
          { id: 'social-sizes',      label: 'Sizes' },
          { id: 'social-profile',    label: 'Profile' },
          { id: 'social-generators', label: 'Generators' },
        ],
      },
      {
        label: 'Graphics',
        children: [
          { id: 'graphics-slide-deck', label: 'Slide deck' },
          { id: 'graphics-patterns',   label: 'Patterns' },
        ],
      },
    ],
  },

  { id: 'gallery', label: 'Gallery', to: '/gallery', icon: 'image' },

  {
    id: 'acyr',
    label: 'Another Creation',
    to: '/acyr',
    icon: 'journal',
    children: [
      {
        label: 'Profile',
        children: [
          { id: 'identity', label: 'Identity' },
          { id: 'bio',      label: 'Bio' },
        ],
      },
      {
        label: 'Career',
        children: [
          { id: 'timeline', label: 'Timeline' },
          { id: 'press',    label: 'Press' },
          { id: 'awards',   label: 'Awards' },
          { id: 'films',    label: 'Films' },
        ],
      },
      {
        label: 'Network',
        children: [
          { id: 'companies',      label: 'Companies' },
          { id: 'collaborations', label: 'Collaborations' },
          { id: 'social',         label: 'Social' },
          { id: 'vendors',        label: 'Vendors' },
        ],
      },
      {
        label: 'Site',
        children: [
          { id: 'stack',     label: 'Stack' },
          { id: 'live-site', label: 'Live-site map' },
          { id: 'media',     label: 'Media inventory' },
          { id: 'marketing', label: 'Marketing infra' },
          { id: 'gaps',      label: 'Gaps' },
        ],
      },
    ],
  },

  {
    id: 'reference',
    label: 'Reference',
    to: '/reference',
    icon: 'list-01',
    children: [
      {
        label: 'Routes',
        children: [
          { id: 'routes',     label: 'Pages' },
          { id: 'generators', label: 'Generators' },
        ],
      },
      {
        label: 'Color · Brand',
        children: [
          { id: 'brand-aliases', label: 'Aliases' },
          { id: 'brand-ramps',   label: 'Ramps' },
          { id: 'cream',         label: 'Cream' },
          { id: 'grey',          label: 'Greyscale' },
        ],
      },
      {
        label: 'Typography',
        children: [
          { id: 'prose',  label: 'Prose elements' },
          { id: 'mono',   label: 'Mono' },
          { id: 'opacity', label: 'Reading hierarchy' },
          { id: 'cuts',   label: 'Cuts loaded' },
        ],
      },
      {
        label: 'Assets',
        children: [
          { id: 'logos',          label: 'Logos' },
          { id: 'graphics',       label: 'Graphics' },
          { id: 'patterns',       label: 'Patterns' },
          { id: 'branded-assets', label: 'Branded assets' },
          { id: 'photos',         label: 'Photos' },
        ],
      },
    ],
  },

  { id: 'editor', label: 'Editor', to: '/editor/compose', icon: 'pencil' },

  {
    id: 'site',
    label: 'Live site',
    to: import.meta.env.DEV ? 'http://localhost:5173' : 'https://another-creation.xyz',
    icon: 'shopping-bag',
    external: true,
  },

]

/* Find the active top-level page given a pathname. */
export function getActivePage(pathname) {
  if (pathname === '/') return NAV_TREE.find((n) => n.to === '/')
  return NAV_TREE.find((n) => n.to !== '/' && pathname.startsWith(n.to))
}
