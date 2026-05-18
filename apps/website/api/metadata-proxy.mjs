import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  DEFAULT_META,
  lookupMeta,
  escapeHtml,
  SITE_URL,
} from '../src/data/seo-metadata.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Candidate paths, tried in order. Vercel's function bundler places included
// files at different roots depending on Node runtime + Root Directory config,
// so we search rather than guess.
const TEMPLATE_CANDIDATES = [
  path.resolve(__dirname, '..', 'dist', 'app.html'),     // function-relative (apps/website/api/.. → apps/website/dist)
  path.resolve(process.cwd(), 'dist', 'app.html'),       // cwd-relative (worked pre-Phase-2 layout)
  path.resolve(__dirname, '..', '..', 'dist', 'app.html'), // one-up fallback if function lives nested deeper
]

let cachedTemplate = null
let lastError = null

async function getTemplate() {
  if (cachedTemplate) return cachedTemplate
  const attempts = []
  for (const candidate of TEMPLATE_CANDIDATES) {
    try {
      cachedTemplate = await readFile(candidate, 'utf8')
      return cachedTemplate
    } catch (err) {
      attempts.push(`${candidate}: ${err.code || err.message}`)
    }
  }
  lastError = `dist/app.html not found. Tried:\n  ${attempts.join('\n  ')}`
  throw new Error(lastError)
}

export default async function handler(req, res) {
  let pathname = '/'
  try {
    pathname = new URL(req.url, SITE_URL).pathname
  } catch {
    /* fall through with default */
  }

  const resolved = lookupMeta(pathname)
  const meta = resolved ?? DEFAULT_META
  const status = resolved ? 200 : 404
  const fullUrl = SITE_URL + pathname

  let template
  try {
    template = await getTemplate()
  } catch (err) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.status(500).send(`Metadata proxy: ${err.message}`)
    return
  }

  const html = template
    .replace(/__TITLE__/g, escapeHtml(meta.title))
    .replace(/__DESCRIPTION__/g, escapeHtml(meta.description))
    .replace(/__IMAGE__/g, escapeHtml(meta.image))
    .replace(/__URL__/g, escapeHtml(fullUrl))
    .replace(/__ROBOTS__/g, escapeHtml(meta.robots ?? 'index, follow'))

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  res.status(status).send(html)
}
