/**
 * One-shot migration: ARTICLES + AUTHORS + COLLECTIONS  →  Sanity dataset.
 *
 * Idempotent: doc IDs are deterministic (author-<slug>, article-<slug>,
 * collection-<slug>), assets are deduped by SHA-1 of file content. Safe to
 * re-run after a schema tweak.
 *
 * Run:  pnpm migrate-sanity
 * Env:  reads .env.local for SANITY_PROJECT_ID, SANITY_DATASET, SANITY_WRITE_TOKEN.
 */

import {createClient} from '@sanity/client'
import {createReadStream, statSync} from 'node:fs'
import {readFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {basename, join, dirname, resolve} from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const PUBLIC_DIR = join(REPO_ROOT, 'public')

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing SANITY_PROJECT_ID / SANITY_DATASET / SANITY_WRITE_TOKEN in env.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-01',
  token,
  useCdn: false,
})

/* ─────────────────────────────────────────────────────────────────────────
 * Asset upload — dedup by SHA-1 of file content. Sanity stores assets with
 * a hash-suffixed _id, but we maintain our own in-memory cache to avoid
 * uploading the same file twice within a single run.
 * ──────────────────────────────────────────────────────────────────────── */

const assetCache = new Map() // sha1 → asset._id

const sha1OfFile = async (absPath) => {
  const buf = await readFile(absPath)
  return createHash('sha1').update(buf).digest('hex')
}

const resolveAsset = (publicPath) => {
  // publicPath looks like '/brand/photoshoot/33a4402.jpg'
  const rel = publicPath.replace(/^\//, '')
  return join(PUBLIC_DIR, rel)
}

const uploadImage = async (publicPath) => {
  const absPath = resolveAsset(publicPath)
  try {
    statSync(absPath)
  } catch {
    console.warn(`  ⚠ missing image, skipping: ${publicPath}`)
    return null
  }
  const hash = await sha1OfFile(absPath)
  if (assetCache.has(hash)) {
    return {_type: 'image', asset: {_type: 'reference', _ref: assetCache.get(hash)}}
  }
  const asset = await client.assets.upload('image', createReadStream(absPath), {
    filename: basename(absPath),
  })
  assetCache.set(hash, asset._id)
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

const uploadFile = async (publicPath) => {
  const absPath = resolveAsset(publicPath)
  try {
    statSync(absPath)
  } catch {
    console.warn(`  ⚠ missing file, skipping: ${publicPath}`)
    return null
  }
  const hash = await sha1OfFile(absPath)
  const cacheKey = `file:${hash}`
  if (assetCache.has(cacheKey)) {
    return {_type: 'file', asset: {_type: 'reference', _ref: assetCache.get(cacheKey)}}
  }
  const asset = await client.assets.upload('file', createReadStream(absPath), {
    filename: basename(absPath),
  })
  assetCache.set(cacheKey, asset._id)
  return {_type: 'file', asset: {_type: 'reference', _ref: asset._id}}
}

/* ─────────────────────────────────────────────────────────────────────────
 * Custom block format → Portable Text.
 *   { type: 'p',     text }            → block, style: 'normal'
 *   { type: 'h2',    text }            → block, style: 'h2'
 *   { type: 'h3',    text }            → block, style: 'h3'
 *   { type: 'quote', text, cite? }     → block, style: 'blockquote' (+ cite markDef)
 *   { type: 'ul',    items: [string] } → blocks with listItem: 'bullet'
 *   { type: 'ol',    items: [string] } → blocks with listItem: 'number'
 * ──────────────────────────────────────────────────────────────────────── */

let keySeq = 0
const k = () => `k${(++keySeq).toString(36)}`

const span = (text, marks = []) => ({_type: 'span', _key: k(), text, marks})

const toPortableText = (blocks = []) => {
  const out = []
  for (const b of blocks) {
    if (b.type === 'p') {
      out.push({_type: 'block', _key: k(), style: 'normal', markDefs: [], children: [span(b.text)]})
    } else if (b.type === 'h2' || b.type === 'h3') {
      out.push({_type: 'block', _key: k(), style: b.type, markDefs: [], children: [span(b.text)]})
    } else if (b.type === 'quote') {
      const markDefs = []
      const marks = []
      if (b.cite) {
        const markKey = k()
        markDefs.push({_type: 'cite', _key: markKey, source: b.cite})
        marks.push(markKey)
      }
      out.push({
        _type: 'block',
        _key: k(),
        style: 'blockquote',
        markDefs,
        children: [span(b.text, marks)],
      })
    } else if (b.type === 'ul' || b.type === 'ol') {
      const listItem = b.type === 'ul' ? 'bullet' : 'number'
      for (const item of b.items || []) {
        out.push({
          _type: 'block',
          _key: k(),
          style: 'normal',
          listItem,
          level: 1,
          markDefs: [],
          children: [span(item)],
        })
      }
    } else {
      console.warn(`  ⚠ unknown block type "${b.type}", skipping`)
    }
  }
  return out
}

/* ─────────────────────────────────────────────────────────────────────────
 * Migration
 * ──────────────────────────────────────────────────────────────────────── */

const main = async () => {
  console.log(`Migrating to ${projectId}/${dataset} ...`)

  const {AUTHORS, ARTICLES} = await import(
    pathToFileURL(join(REPO_ROOT, 'src/brand/data/blog-data.js')).href,
  )
  const {COLLECTIONS} = await import(
    pathToFileURL(join(REPO_ROOT, 'src/brand/data/collections-data.js')).href,
  )

  /* Authors ----------------------------------------------------------- */
  console.log(`\nAuthors (${AUTHORS.length}):`)
  for (const a of AUTHORS) {
    console.log(`  • ${a.slug}`)
    const doc = {
      _id: `author-${a.slug}`,
      _type: 'author',
      name: a.name,
      slug: {_type: 'slug', current: a.slug},
      role: a.role,
      bio: a.bio,
      avatarInitial: a.avatarInitial,
      links: (a.links || []).map((l) => ({
        _type: 'link',
        _key: k(),
        label: l.label,
        href: l.href,
      })),
    }
    await client.createOrReplace(doc)
  }

  /* Articles ---------------------------------------------------------- */
  console.log(`\nArticles (${ARTICLES.length}):`)
  for (const a of ARTICLES) {
    console.log(`  • ${a.slug}`)
    const cover = a.cover ? await uploadImage(a.cover) : null
    const doc = {
      _id: `article-${a.slug}`,
      _type: 'article',
      title: a.title,
      slug: {_type: 'slug', current: a.slug},
      excerpt: a.excerpt,
      author: {_type: 'reference', _ref: `author-${a.authorSlug}`},
      publishedAt: new Date(a.publishedAt).toISOString(),
      readingMinutes: a.readingMinutes,
      tag: a.tag,
      ...(cover ? {cover} : {}),
      body: toPortableText(a.body),
    }
    await client.createOrReplace(doc)
  }

  /* Collections ------------------------------------------------------- */
  console.log(`\nCollections (${COLLECTIONS.length}):`)
  for (const c of COLLECTIONS) {
    console.log(`  • ${c.slug} (${(c.looks || []).length} looks)`)
    const cover = c.cover ? await uploadImage(c.cover) : null
    let heroImage = null
    let heroVideo = null
    let heroVideoPoster = null
    if (c.hero?.type === 'image' && c.hero.src) {
      heroImage = await uploadImage(c.hero.src)
    } else if (c.hero?.type === 'video' && c.hero.src) {
      heroVideo = await uploadFile(c.hero.src)
      if (c.hero.poster) heroVideoPoster = await uploadImage(c.hero.poster)
    }

    const looks = []
    for (const look of c.looks || []) {
      const img = look.image ? await uploadImage(look.image) : null
      if (!img) continue
      looks.push({
        _type: 'look',
        _key: k(),
        number: look.number,
        name: look.name || null,
        image: img,
        family: look.family || null,
        fabric: look.fabric || null,
      })
    }

    const doc = {
      _id: `collection-${c.slug}`,
      _type: 'collection',
      title: c.title,
      slug: {_type: 'slug', current: c.slug},
      number: c.number,
      subtitle: c.subtitle || null,
      year: c.year,
      excerpt: c.excerpt,
      publishedAt: new Date(c.publishedAt).toISOString(),
      ...(cover ? {cover} : {}),
      ...(heroImage ? {heroImage} : {}),
      ...(heroVideo ? {heroVideo} : {}),
      ...(heroVideoPoster ? {heroVideoPoster} : {}),
      show: c.show
        ? {
            venue: c.show.venue || null,
            event: c.show.event || null,
            date: c.show.date ? new Date(c.show.date).toISOString() : null,
            music: c.show.music || null,
            film: c.show.film || null,
            lighting: c.show.lighting || null,
          }
        : null,
      collaborators: (c.collaborators || []).map((x) => ({
        _type: 'collaborator',
        _key: k(),
        name: x.name || null,
        role: x.role || null,
        href: x.href || null,
      })),
      notes: toPortableText(c.notes || []),
      looks,
      press: (c.press || []).map((p) => ({
        _type: 'pressItem',
        _key: k(),
        outlet: p.outlet || null,
        date: p.date || null,
        quote: p.quote || null,
        href: p.href || null,
      })),
    }
    await client.createOrReplace(doc)
  }

  console.log('\nDone.')
  console.log(`  assets uploaded: ${assetCache.size}`)
}

main().catch((err) => {
  console.error('\nMigration failed:', err)
  process.exit(1)
})
