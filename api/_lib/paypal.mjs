/**
 * PayPal Orders API helpers. Run from Vercel serverless functions only —
 * never bundled to the client. Uses OAuth2 client_credentials with token
 * caching at the module level so warm containers reuse it.
 */

const PP_BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

let cachedToken  = null
let tokenExpiry  = 0

export async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken

  const id     = process.env.PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_SECRET
  if (!id || !secret) throw new Error('PAYPAL_CLIENT_ID / PAYPAL_SECRET not set')

  const auth = Buffer.from(`${id}:${secret}`).toString('base64')
  const res  = await fetch(`${PP_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization:  `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const body = await res.text()
  if (!res.ok) throw new Error(`PayPal token ${res.status}: ${body.slice(0, 300)}`)
  const data  = JSON.parse(body)
  cachedToken = data.access_token
  // 60s safety margin so we don't get caught with an expiring token mid-request.
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  return cachedToken
}

export async function paypalFetch(path, init = {}) {
  const token = await getAccessToken()
  const res   = await fetch(`${PP_BASE}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  const body = await res.text()
  if (!res.ok) throw new Error(`PayPal ${path} ${res.status}: ${body.slice(0, 500)}`)
  return body ? JSON.parse(body) : null
}

export { PP_BASE }
