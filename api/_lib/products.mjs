/**
 * Server-side cart validation. The client posts a cart; we recompute every
 * total against `printful-products.json` (the committed source of truth) and
 * reject anything that doesn't line up. Client-submitted prices are never
 * trusted.
 */

import productsData from '../../src/brand/data/printful-products.json' with { type: 'json' }

// MVP: flat shipping. Phase 2 swaps for a Printful shipping API call keyed on
// the delivery country / postcode. Keep this value matched with the client-side
// constant in Checkout.jsx so the UI summary matches the server's PayPal order.
export const FLAT_SHIPPING_EUR = 10

export function lookupVariant(slug, size) {
  const product = productsData.find((p) => p.slug === slug)
  if (!product) return null
  const wantedSize = size || 'One size'
  const variant    = product.variants.find((v) => v.size === wantedSize)
  if (!variant) return null
  return { product, variant }
}

export function validateAndPrice(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cart is empty')
  }

  const lines    = []
  let itemTotal  = 0
  let currency   = 'EUR'

  for (const it of items) {
    const found = lookupVariant(it.slug, it.size)
    if (!found) {
      throw new Error(`Unknown product: ${it.slug}${it.size ? ` (${it.size})` : ''}`)
    }
    const qty = Number(it.qty) || 0
    if (qty < 1 || qty > 99 || !Number.isInteger(qty)) {
      throw new Error(`Invalid qty for ${it.slug}: ${it.qty}`)
    }

    const unit      = Number(found.variant.retailPrice)
    const lineTotal = unit * qty
    itemTotal += lineTotal
    currency   = found.variant.currency

    lines.push({
      slug:          it.slug,
      size:          found.variant.size,
      qty,
      name:          found.product.name,
      unitPrice:     unit,
      lineTotal,
      currency:      found.variant.currency,
      syncVariantId: found.variant.syncVariantId,
    })
  }

  const shipping = FLAT_SHIPPING_EUR
  const total    = itemTotal + shipping

  return { lines, itemTotal, shipping, total, currency }
}
