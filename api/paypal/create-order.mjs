/**
 * POST /api/paypal/create-order
 *
 * Body: { items: [{ slug, size, qty }], delivery? }
 *
 * Validates the cart against printful-products.json, creates a PayPal order
 * (intent=CAPTURE), returns { orderID } for the Smart Buttons SDK to approve.
 */

import { paypalFetch } from '../_lib/paypal.mjs'
import { validateAndPrice } from '../_lib/products.mjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const body  = req.body ?? {}
    const items = body.items ?? []

    const priced = validateAndPrice(items)

    const order = await paypalFetch('/v2/checkout/orders', {
      method: 'POST',
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: priced.currency,
            value:         priced.total.toFixed(2),
            breakdown: {
              item_total: { currency_code: priced.currency, value: priced.itemTotal.toFixed(2) },
              shipping:   { currency_code: priced.currency, value: priced.shipping.toFixed(2) },
            },
          },
          items: priced.lines.map((l) => ({
            name:        l.size && l.size !== 'One size' ? `${l.name} (${l.size})` : l.name,
            quantity:    String(l.qty),
            unit_amount: { currency_code: l.currency, value: l.unitPrice.toFixed(2) },
          })),
        }],
      }),
    })

    res.status(200).json({ orderID: order.id })
  } catch (err) {
    console.error('create-order error:', err.message)
    res.status(400).json({ error: err.message })
  }
}
