/**
 * Dynamic-route metadata resolver. Wraps the static `lookupMeta` from
 * `src/data/seo-metadata.js` with Tier 1 (Sanity-driven) and Tier 2
 * (shop-data) lookups.
 *
 * Flow per request:
 *   1. Try the dynamic lookup matching the route prefix.
 *   2. If the specific doc / product is found, return its meta.
 *   3. Otherwise fall through to `lookupMeta` (static map + prefix fallback).
 */

import {
  DEFAULT_META,
  STATIC_META,
  SITE_URL,
  lookupMeta,
} from '../../src/data/seo-metadata.js'
import { PRODUCTS } from '../../src/data/shop-data.js'
import {
  fetchArticleMeta,
  fetchCollectionMeta,
  fetchAuthorMeta,
} from './sanity.mjs'

const ROBOTS = 'index, follow'

function fromShop(slug, kind, parentKey) {
  const product = PRODUCTS.find((p) => p.slug === slug && p.kind === kind)
  if (!product) return null
  const parent = STATIC_META[parentKey]
  return {
    title:       `${product.name} — Another Creation`,
    description: product.excerpt || parent?.description || DEFAULT_META.description,
    image:       product.image?.startsWith('http')
      ? product.image
      : SITE_URL + (product.image ?? ''),
    robots:      ROBOTS,
  }
}

function withFallback(meta, parentKey) {
  const parent = STATIC_META[parentKey] ?? DEFAULT_META
  return {
    title:       meta.title       || parent.title,
    description: meta.description || parent.description,
    image:       meta.image       || parent.image,
    robots:      ROBOTS,
  }
}

function slugFrom(pathname, prefix) {
  return pathname.slice(prefix.length).replace(/\/$/, '')
}

export async function resolveMeta(pathname) {
  // Tier 1 — Sanity
  if (pathname.startsWith('/journal/author/')) {
    const slug = slugFrom(pathname, '/journal/author/')
    if (slug) {
      const meta = await fetchAuthorMeta(slug).catch(() => null)
      if (meta) return withFallback(meta, '/journal')
    }
  } else if (pathname.startsWith('/journal/')) {
    const slug = slugFrom(pathname, '/journal/')
    if (slug) {
      const meta = await fetchArticleMeta(slug).catch(() => null)
      if (meta) return withFallback(meta, '/journal')
    }
  } else if (pathname.startsWith('/collections/')) {
    const slug = slugFrom(pathname, '/collections/')
    if (slug) {
      const meta = await fetchCollectionMeta(slug).catch(() => null)
      if (meta) return withFallback(meta, '/collections')
    }
  }

  // Tier 2 — shop-data
  if (pathname.startsWith('/shop/')) {
    const slug = slugFrom(pathname, '/shop/')
    if (slug) {
      const meta = fromShop(slug, 'pod', '/shop')
      if (meta) return meta
    }
  } else if (pathname.startsWith('/handmade/')) {
    const slug = slugFrom(pathname, '/handmade/')
    if (slug) {
      const meta = fromShop(slug, 'handmade', '/handmade')
      if (meta) return meta
    }
  }

  // Tier 3 — static map + prefix fallback
  return lookupMeta(pathname)
}
