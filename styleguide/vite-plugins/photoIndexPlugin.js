/**
 * Vite plugin — walks a public directory and exposes a JSON index of media
 * (images + video) at `/__photos.json`. Used by tools/Gallery.jsx.
 *
 * Output shape: { groups: [{ name, count, files: [{ type, src }, ...] }] }
 *   type: 'image' | 'video'
 *   src:  '/relative/path/from/public'
 *
 * Dev: served via middleware (live, reflects current filesystem).
 * Build: emitted as a static asset so the same path resolves in production.
 */

import { readdirSync, statSync } from 'node:fs'
import { join, relative, sep, posix } from 'node:path'

const IMG_RE   = /\.(jpe?g|png|webp|avif|gif)$/i
const VIDEO_RE = /\.(mp4|webm|mov|ogv)$/i

function entryType(filename) {
  if (IMG_RE.test(filename)) return 'image'
  if (VIDEO_RE.test(filename)) return 'video'
  return null
}

function toRelSrc(abs, publicRoot) {
  const rel = relative(publicRoot, abs).split(sep).join(posix.sep)
  return '/' + rel
}

function walkMedia(dir, publicRoot) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry)
    const stat = statSync(abs)
    if (stat.isDirectory()) {
      out.push(...walkMedia(abs, publicRoot))
    } else {
      const type = entryType(entry)
      if (type) out.push({ type, src: toRelSrc(abs, publicRoot) })
    }
  }
  return out
}

function buildIndex(publicRoot, photosDir) {
  let entries = []
  try {
    entries = readdirSync(photosDir)
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
  }

  const groups = []
  const loose = []

  for (const entry of entries) {
    const abs = join(photosDir, entry)
    const stat = statSync(abs)
    if (stat.isDirectory()) {
      const files = walkMedia(abs, publicRoot).sort((a, b) => a.src.localeCompare(b.src))
      groups.push({ name: entry, count: files.length, files })
    } else {
      const type = entryType(entry)
      if (type) loose.push({ type, src: toRelSrc(abs, publicRoot) })
    }
  }

  groups.sort((a, b) => a.name.localeCompare(b.name))
  if (loose.length) {
    groups.unshift({
      name: '(root)',
      count: loose.length,
      files: loose.sort((a, b) => a.src.localeCompare(b.src)),
    })
  }

  return { groups }
}

export function photoIndexPlugin({
  publicRoot = 'public',
  photosDir = 'public/photos',
  endpoint = '/__photos.json',
} = {}) {
  const fileName = endpoint.replace(/^\//, '')
  return {
    name: 'kol-framework-photo-index',
    configureServer(server) {
      server.middlewares.use(endpoint, (req, res) => {
        try {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store')
          res.end(JSON.stringify(buildIndex(publicRoot, photosDir)))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName,
        source: JSON.stringify(buildIndex(publicRoot, photosDir)),
      })
    },
  }
}
