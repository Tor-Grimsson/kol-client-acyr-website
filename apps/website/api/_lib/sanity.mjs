/**
 * Server-side Sanity helpers for the metadata proxy.
 *
 * Mirrors `apps/website/src/lib/sanity.js` but reads env via `process.env`
 * (serverless function context) instead of `import.meta.env` (Vite client).
 */

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const sanity = createClient({
  projectId:  process.env.VITE_SANITY_PROJECT_ID,
  dataset:    process.env.VITE_SANITY_DATASET,
  apiVersion: '2024-10-01',
  useCdn:     true,
  perspective: 'published',
})

const builder = imageUrlBuilder(sanity)

function ogUrl(image) {
  if (!image) return null
  // Crop to 1.91:1 at retina (2400×1260). Hotspot honored automatically.
  return builder.image(image).width(2400).height(1260).fit('crop').auto('format').url()
}

export async function fetchArticleMeta(slug) {
  const doc = await sanity.fetch(
    `*[_type == "article" && slug.current == $slug][0]{
      title, excerpt, cover, seo
    }`,
    { slug },
  )
  if (!doc) return null
  return {
    title:       doc.seo?.seoTitle       ?? `${doc.title} — Another Creation`,
    description: doc.seo?.seoDescription ?? doc.excerpt ?? null,
    image:       ogUrl(doc.seo?.ogImage ?? doc.cover),
  }
}

export async function fetchCollectionMeta(slug) {
  const doc = await sanity.fetch(
    `*[_type == "collection" && slug.current == $slug][0]{
      title, excerpt, cover, seo
    }`,
    { slug },
  )
  if (!doc) return null
  return {
    title:       doc.seo?.seoTitle       ?? `${doc.title} — Another Creation`,
    description: doc.seo?.seoDescription ?? doc.excerpt ?? null,
    image:       ogUrl(doc.seo?.ogImage ?? doc.cover),
  }
}

export async function fetchAuthorMeta(slug) {
  const doc = await sanity.fetch(
    `*[_type == "author" && slug.current == $slug][0]{
      name, role, bio, avatar
    }`,
    { slug },
  )
  if (!doc) return null
  return {
    title:       `${doc.name} — Another Creation`,
    description: doc.bio ?? `${doc.role ?? 'Author'} at Another Creation.`,
    image:       ogUrl(doc.avatar),
  }
}
