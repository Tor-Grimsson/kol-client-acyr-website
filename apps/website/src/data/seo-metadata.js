/**
 * SEO metadata — static map for non-CMS routes.
 *
 * Shared by:
 * - api/metadata-proxy.mjs (server-side, fills index.html placeholders)
 * - any client-side consumer that wants to read the same titles/descriptions
 *
 * Keep free of browser-only APIs.
 */

export const SITE_URL = 'https://another-creation.xyz'

const OG = '/og'

// Named image constants. Mapped to three sets dropped into public/og/:
//   logo-* → brand-forward routes (default, home, contact, brand, legal)
//   ps-*   → product / editorial routes (shop, journal, collections)
//   yr-*   → personal routes (handmade, about, press)
// All images are 2400x1260 (2x retina 1200x630, 1.91:1).
const OG_DEFAULT     = `${OG}/open-graph-logo-01.jpg`
const OG_HOME        = OG_DEFAULT
const OG_SHOP        = `${OG}/open-graph-ps-01.jpg`
const OG_HANDMADE    = `${OG}/open-graph-yr-01.jpg`
const OG_JOURNAL     = `${OG}/open-graph-ps-02.jpg`
const OG_COLLECTIONS = `${OG}/open-graph-ps-03.jpg`
const OG_ABOUT       = `${OG}/open-graph-yr-02.jpg`
const OG_CONTACT     = `${OG}/open-graph-logo-02.jpg`
const OG_BRAND       = `${OG}/open-graph-logo-03.jpg`
const OG_PRESS       = `${OG}/open-graph-yr-03.jpg`
const OG_LEGAL       = `${OG}/open-graph-logo-04.jpg`
const OG_COMMERCE    = OG_DEFAULT

export const DEFAULT_META = {
  title: 'Another Creation',
  description: 'Reykjavík atelier by Ýr Þrastardóttir. Garments cut for slow living. Made in Iceland since 2013.',
  image: SITE_URL + OG_DEFAULT,
  robots: 'index, follow',
}

export const STATIC_META = {
  '/': {
    title: 'Another Creation',
    description: 'Reykjavík atelier by Ýr Þrastardóttir. Garments cut for slow living. Made in Iceland since 2013.',
    image: SITE_URL + OG_HOME,
    robots: 'index, follow',
  },
  '/about': {
    title: 'About — Another Creation',
    description: 'The studio, the maker, the practice. Ýr Þrastardóttir cuts garments by hand in Reykjavík.',
    image: SITE_URL + OG_ABOUT,
    robots: 'index, follow',
  },
  '/contact': {
    title: 'Contact — Another Creation',
    description: 'Studio enquiries, press, commissions. Vatnsstígur 3, Reykjavík.',
    image: SITE_URL + OG_CONTACT,
    robots: 'index, follow',
  },
  '/journal': {
    title: 'Journal — Another Creation',
    description: 'Notes from the atelier. Process, material, and what gets made between collections.',
    image: SITE_URL + OG_JOURNAL,
    robots: 'index, follow',
  },
  '/collections': {
    title: 'Collections — Another Creation',
    description: 'The body of work. Each collection a record of where the practice was at the time.',
    image: SITE_URL + OG_COLLECTIONS,
    robots: 'index, follow',
  },
  '/shop': {
    title: 'Shop — Another Creation',
    description: 'Made-to-order pieces designed by Ýr in Reykjavík. Shipped worldwide.',
    image: SITE_URL + OG_SHOP,
    robots: 'index, follow',
  },
  '/handmade': {
    title: 'Handmade — Another Creation',
    description: 'One-of-one pieces cut by hand in Reykjavík. Enquire by email.',
    image: SITE_URL + OG_HANDMADE,
    robots: 'index, follow',
  },
  '/brand': {
    title: 'Brand — Another Creation',
    description: 'Visual identity, palette, type, and assets for press and partners.',
    image: SITE_URL + OG_BRAND,
    robots: 'index, follow',
  },
  '/press': {
    title: 'Press — Another Creation',
    description: 'About, facts, contact, and press kit on request.',
    image: SITE_URL + OG_PRESS,
    robots: 'index, follow',
  },
  '/shipping-returns': {
    title: 'Shipping & returns — Another Creation',
    description: 'Where we ship, when it arrives, and how returns work.',
    image: SITE_URL + OG_LEGAL,
    robots: 'index, follow',
  },
  '/privacy': {
    title: 'Privacy — Another Creation',
    description: 'What we collect, how we store it, and how to reach us about your data.',
    image: SITE_URL + OG_LEGAL,
    robots: 'index, follow',
  },
  '/terms': {
    title: 'Terms — Another Creation',
    description: 'Terms of sale, returns, and intellectual property.',
    image: SITE_URL + OG_LEGAL,
    robots: 'index, follow',
  },
  '/cart': {
    title: 'Cart — Another Creation',
    description: 'Your selected pieces.',
    image: SITE_URL + OG_COMMERCE,
    robots: 'noindex, nofollow',
  },
  '/checkout': {
    title: 'Checkout — Another Creation',
    description: 'Complete your order.',
    image: SITE_URL + OG_COMMERCE,
    robots: 'noindex, nofollow',
  },
  '/checkout/confirmation': {
    title: 'Order confirmed — Another Creation',
    description: 'Thank you for your order.',
    image: SITE_URL + OG_COMMERCE,
    robots: 'noindex, nofollow',
  },
}

/**
 * Resolve metadata for any pathname.
 * Pass 1 — static map + parent-listing fallback for dynamic routes.
 * Pass 2 will add Sanity lookups for /journal/:slug, /collections/:slug.
 * Pass 3 will add shop-data lookups for /shop/:slug, /handmade/:slug.
 */
export function lookupMeta(pathname) {
  if (STATIC_META[pathname]) return STATIC_META[pathname]

  if (pathname.startsWith('/journal/author/')) return STATIC_META['/journal']
  if (pathname.startsWith('/journal/'))        return STATIC_META['/journal']
  if (pathname.startsWith('/collections/'))    return STATIC_META['/collections']
  if (pathname.startsWith('/shop/'))           return STATIC_META['/shop']
  if (pathname.startsWith('/handmade/'))       return STATIC_META['/handmade']

  return null
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
