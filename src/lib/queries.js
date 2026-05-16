import {sanity} from './sanity'

const ARTICLE_CARD_PROJECTION = `
  _id,
  "slug": slug.current,
  title,
  excerpt,
  publishedAt,
  readingMinutes,
  tag,
  cover,
  "author": author->{
    "slug": slug.current,
    name,
    role,
    avatarInitial,
    avatar
  }
`

const ARTICLE_FULL_PROJECTION = `
  _id,
  "slug": slug.current,
  title,
  excerpt,
  publishedAt,
  readingMinutes,
  tag,
  cover,
  body,
  "author": author->{
    "slug": slug.current,
    name,
    role,
    bio,
    avatarInitial,
    avatar,
    links
  }
`

const COLLECTION_CARD_PROJECTION = `
  _id,
  "slug": slug.current,
  number,
  title,
  subtitle,
  year,
  excerpt,
  publishedAt,
  cover,
  "looksCount": count(looks)
`

const COLLECTION_FULL_PROJECTION = `
  _id,
  "slug": slug.current,
  number,
  title,
  subtitle,
  year,
  excerpt,
  publishedAt,
  cover,
  heroImage,
  heroVideo{
    asset->{url, mimeType}
  },
  heroVideoPoster,
  show,
  collaborators,
  notes,
  looks[]{
    number,
    name,
    image,
    family,
    fabric
  },
  press,
  videos
`

export const sortedArticles = () =>
  sanity.fetch(
    `*[_type == "article" && defined(slug.current)] | order(publishedAt desc) { ${ARTICLE_CARD_PROJECTION} }`,
  )

export const findArticle = (slug) =>
  sanity.fetch(
    `*[_type == "article" && slug.current == $slug][0] { ${ARTICLE_FULL_PROJECTION} }`,
    {slug},
  )

export const articlesByAuthor = (slug) =>
  sanity.fetch(
    `*[_type == "article" && author->slug.current == $slug] | order(publishedAt desc) { ${ARTICLE_CARD_PROJECTION} }`,
    {slug},
  )

export const findAuthor = (slug) =>
  sanity.fetch(
    `*[_type == "author" && slug.current == $slug][0] {
      _id,
      "slug": slug.current,
      name,
      role,
      bio,
      avatarInitial,
      avatar,
      links
    }`,
    {slug},
  )

export const sortedCollections = () =>
  sanity.fetch(
    `*[_type == "collection" && defined(slug.current)] | order(publishedAt desc) { ${COLLECTION_CARD_PROJECTION} }`,
  )

export const findCollection = (slug) =>
  sanity.fetch(
    `*[_type == "collection" && slug.current == $slug][0] { ${COLLECTION_FULL_PROJECTION} }`,
    {slug},
  )

export const adjacentCollections = async (slug) => {
  const sorted = await sanity.fetch(
    `*[_type == "collection" && defined(slug.current)] | order(publishedAt desc) {
      "slug": slug.current,
      title,
      year
    }`,
  )
  const i = sorted.findIndex((c) => c.slug === slug)
  if (i === -1) return {prev: null, next: null}
  return {
    prev: i > 0 ? sorted[i - 1] : null,
    next: i < sorted.length - 1 ? sorted[i + 1] : null,
  }
}

export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en', {day: 'numeric', month: 'long', year: 'numeric'}) : null

export const formatShowDate = (iso) => {
  if (!iso) return null
  const d = new Date(iso)
  const datePart = d.toLocaleDateString('en', {day: 'numeric', month: 'long', year: 'numeric'})
  if (iso.length <= 10) return datePart
  const timePart = d.toLocaleTimeString('en', {hour: '2-digit', minute: '2-digit', hour12: false})
  return `${datePart} · ${timePart}`
}
