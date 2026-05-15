/**
 * Printful API helper. v1 endpoints — stable and well-documented; switch to
 * v2 if/when needed. Token never reaches the client.
 */

const PF_BASE = 'https://api.printful.com'

export async function printfulFetch(path, init = {}) {
  const token = process.env.PRINTFUL_TOKEN
  if (!token) throw new Error('PRINTFUL_TOKEN not set')

  const res = await fetch(`${PF_BASE}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  const body = await res.text()
  if (!res.ok) {
    const err  = new Error(`Printful ${path} ${res.status}: ${body.slice(0, 500)}`)
    err.status = res.status
    err.body   = body
    throw err
  }
  return body ? JSON.parse(body) : null
}
