#!/usr/bin/env node
/**
 * Pull sync products from the Printful API store and write them to
 * src/brand/data/printful-products.json (+ download primary mockups into
 * public/brand/shop/pod/<slug>.jpg).
 *
 * Run via `pnpm sync-printful`. Token is loaded from .env.local at runtime
 * via Node's --env-file flag — it never reaches the bundle.
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const TOKEN = process.env.PRINTFUL_TOKEN
if (!TOKEN) {
  console.error('Missing PRINTFUL_TOKEN. Add it to .env.local.')
  process.exit(1)
}

const API         = 'https://api.printful.com'
const IMG_DIR     = resolve('public/brand/shop/pod')
const IMG_URL_DIR = '/brand/shop/pod'
const OUTPUT_JSON = resolve('src/brand/data/printful-products.json')

const slugify = (s) =>
  s.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Printful auto-fills external_id with a hex hash when none is set. Only
// trust the field when it looks deliberate — i.e. has a hyphen.
const slugFromProduct = (sp) => {
  const ext = sp.external_id?.trim()
  if (ext && /-/.test(ext)) return ext
  return slugify(sp.name)
}

const extFromUrl = (url) => {
  const m = url.split('?')[0].match(/\.(png|jpe?g|webp|gif)$/i)
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'png'
}

async function pf(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  const body = await res.text()
  if (!res.ok) throw new Error(`Printful ${path} → ${res.status}: ${body.slice(0, 300)}`)
  return JSON.parse(body).result
}

async function downloadImage(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Image ${url} → ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(dest, buf)
}

async function main() {
  await mkdir(IMG_DIR, { recursive: true })

  const list = await pf('/sync/products')
  console.log(`Printful → ${list.length} sync product(s)`)

  const products = []

  for (const summary of list) {
    if (summary.is_ignored) {
      console.log(`  skip ${summary.name} (ignored)`)
      continue
    }

    const detail   = await pf(`/sync/products/${summary.id}`)
    const sp       = detail.sync_product
    const variants = detail.sync_variants.filter((v) => !v.is_ignored)

    if (variants.length === 0) {
      console.warn(`  skip ${sp.name}: no active variants`)
      continue
    }

    const slug          = slugFromProduct(sp)
    const firstVariant  = variants[0]
    const previewFile   = firstVariant.files.find((f) => f.type === 'preview')
    const previewUrl    = previewFile?.preview_url
    const imageExt      = previewUrl ? extFromUrl(previewUrl) : 'png'
    const imageRelPath  = `${IMG_URL_DIR}/${slug}.${imageExt}`

    if (previewUrl) {
      await downloadImage(previewUrl, resolve(`public${imageRelPath}`))
      console.log(`  ${slug} ← image (.${imageExt})`)
    } else {
      console.warn(`  ${slug}: no preview image, skipping image download`)
    }

    const prices     = new Set(variants.map((v) => v.retail_price))
    const currencies = new Set(variants.map((v) => v.currency))
    if (prices.size > 1)     console.warn(`  ⚠ ${slug}: variants have different prices: ${[...prices].join(', ')}`)
    if (currencies.size > 1) console.warn(`  ⚠ ${slug}: variants have different currencies: ${[...currencies].join(', ')}`)

    const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))]

    products.push({
      source:            'printful',
      printfulProductId: sp.id,
      slug,
      name:              sp.name,
      price:             Number(firstVariant.retail_price),
      currency:          firstVariant.currency,
      image:             imageRelPath,
      sizes:             sizes.length > 0 ? sizes : ['One size'],
      variants: variants.map((v) => ({
        syncVariantId:    v.id,
        catalogVariantId: v.variant_id,
        size:             v.size || 'One size',
        color:            v.color || null,
        retailPrice:      Number(v.retail_price),
        currency:         v.currency,
        sku:              v.sku,
      })),
    })
  }

  await writeFile(OUTPUT_JSON, JSON.stringify(products, null, 2) + '\n')
  console.log(`✓ Wrote ${products.length} product(s) → ${OUTPUT_JSON.replace(resolve('.'), '.')}`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
