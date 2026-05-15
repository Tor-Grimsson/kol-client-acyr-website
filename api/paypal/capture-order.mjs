/**
 * POST /api/paypal/capture-order
 *
 * Body: { orderID, items, delivery, email }
 *
 * Captures the approved PayPal order, then creates a Printful order using the
 * PayPal capture ID as `external_id` so retries are idempotent (Printful rejects
 * duplicate external_ids). Returns the capture + Printful IDs for the
 * confirmation page.
 *
 * Auto-confirm policy: in `live` mode we confirm the Printful draft immediately
 * (it goes to production). In `sandbox` mode we leave it as a draft so test
 * runs don't deduct from your Printful balance.
 */

import { paypalFetch } from '../_lib/paypal.mjs'
import { printfulFetch } from '../_lib/printful.mjs'
import { lookupVariant } from '../_lib/products.mjs'

const AUTO_CONFIRM_PRINTFUL = process.env.PAYPAL_ENV === 'live'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const body     = req.body ?? {}
    const orderID  = body.orderID
    const items    = body.items ?? []
    const delivery = body.delivery ?? {}
    const email    = body.email ?? ''

    if (!orderID) {
      res.status(400).json({ error: 'Missing orderID' })
      return
    }

    // Step 1 — capture PayPal payment.
    const captured  = await paypalFetch(`/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
    })
    const captureId = captured?.purchase_units?.[0]?.payments?.captures?.[0]?.id
    if (!captureId) {
      throw new Error('PayPal capture succeeded but no capture ID was returned')
    }

    // Step 2 — submit fulfillment to Printful. If this fails, the customer has
    // already paid; we return the captureId regardless so the confirmation page
    // can show success, and we surface `printfulError` for the operator.
    let printfulOrderId = null
    let printfulError   = null

    try {
      const orderItems = items.map((it) => {
        const found = lookupVariant(it.slug, it.size)
        if (!found) throw new Error(`Cannot map ${it.slug} to a Printful sync variant`)
        return {
          sync_variant_id: found.variant.syncVariantId,
          quantity:        Number(it.qty) || 1,
        }
      })

      const path = AUTO_CONFIRM_PRINTFUL ? '/orders?confirm=true' : '/orders'

      const printfulRes = await printfulFetch(path, {
        method: 'POST',
        body: JSON.stringify({
          external_id: captureId,
          recipient: {
            name:         `${delivery.firstName ?? ''} ${delivery.lastName ?? ''}`.trim(),
            address1:     delivery.street   ?? '',
            city:         delivery.city     ?? '',
            country_code: delivery.country  ?? '',
            zip:          delivery.postcode ?? '',
            phone:        delivery.phone    ?? '',
            email,
          },
          items: orderItems,
        }),
      })
      printfulOrderId = printfulRes?.result?.id ?? null
    } catch (err) {
      console.error('Printful order creation failed (PayPal already captured):', err.message)
      printfulError = err.message
    }

    res.status(200).json({
      captureId,
      paypalOrderId:  orderID,
      printfulOrderId,
      printfulError,
      autoConfirmed:  AUTO_CONFIRM_PRINTFUL,
    })
  } catch (err) {
    console.error('capture-order error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
