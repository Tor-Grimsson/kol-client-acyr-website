import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import Divider from '../../components/atoms/Divider'
import Input from '../../components/atoms/Input'
import PropertyInput from '../../components/molecules/PropertyInput'
import Dropdown from '../../components/molecules/Dropdown'
import Icon from '../../components/loaders/icons/Icon'
import { useCart } from '../../components/site/CartContext'
import { formatPrice } from '../../data/shop-data'

const COUNTRIES = [
  { value: 'IS', label: 'Iceland' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'IE', label: 'Ireland' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'DK', label: 'Denmark' },
  { value: 'NO', label: 'Norway' },
  { value: 'SE', label: 'Sweden' },
  { value: 'FI', label: 'Finland' },
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
]

const PAYPAL_OPTS = {
  'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency:    'EUR',
  intent:      'capture',
  components:  'buttons',
}

function SectionHeading({ children }) {
  return (
    <h2 className="ac-helper-xxs uppercase text-emphasis mb-4">{children}</h2>
  )
}

export default function Checkout() {
  usePageTitle(`Checkout · ${BRAND.name}`)
  const navigate              = useNavigate()
  const { items, subtotal, currency, clear } = useCart()

  const [email, setEmail]       = useState('')
  const [newsletter, setNewsletter] = useState(true)
  const [delivery, setDelivery] = useState({
    firstName: '', lastName: '', street: '', city: '', postcode: '', country: 'IS', phone: '',
  })
  const [payError, setPayError]         = useState(null)
  const [paying, setPaying]             = useState(false)
  const [shipping, setShipping]         = useState(null)
  const [shippingError, setShippingError] = useState(null)
  const [shippingLoading, setShippingLoading] = useState(false)

  const tax       = 0
  const shipRate  = shipping?.rate ?? 0
  const total     = subtotal + shipRate

  const emailReady = /\S+@\S+\.\S+/.test(email)
  const deliveryReady = Boolean(
    delivery.firstName && delivery.lastName && delivery.street &&
    delivery.city && delivery.postcode && delivery.country,
  )

  // Auto-fetch shipping rate when delivery is ready. Debounced so we don't
  // hammer the API on every keystroke.
  useEffect(() => {
    if (!deliveryReady || items.length === 0) {
      setShipping(null)
      setShippingError(null)
      return
    }
    setShippingLoading(true)
    setShippingError(null)
    const t = setTimeout(() => {
      fetch('/api/printful/shipping-rates', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          items: cartPayload(),
          delivery,
        }),
      })
        .then(async (r) => {
          const body = await r.json().catch(() => ({}))
          if (!r.ok) throw new Error(body.error ?? 'Could not calculate shipping')
          return body
        })
        .then((rate) => { setShipping(rate); setShippingLoading(false) })
        .catch((err)  => { setShippingError(err.message); setShippingLoading(false) })
    }, 600)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryReady, delivery.street, delivery.city, delivery.postcode, delivery.country, items.length])

  if (items.length === 0) {
    return (
      <main className="bg-surface-primary min-h-dvh max-w-3xl mx-auto px-8 py-24 text-center">
        <p className="ac-helper-xxs uppercase text-meta">Checkout</p>
        <h1 className="ac-prose-display-md">Your bag is empty.</h1>
        <Link to="/shop" className="ac-helper-xxs uppercase text-emphasis underline underline-offset-4 hover:no-underline">← Back to shop</Link>
      </main>
    )
  }

  const cartPayload = () => items.map((it) => ({ slug: it.slug, size: it.size, color: it.color, qty: it.qty }))

  const createOrder = async () => {
    setPayError(null)
    const res = await fetch('/api/paypal/create-order', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ items: cartPayload(), delivery }),
    })
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      throw new Error(errBody.error ?? 'Could not create PayPal order')
    }
    const { orderID } = await res.json()
    return orderID
  }

  const onApprove = async (data) => {
    setPaying(true)
    try {
      const res = await fetch('/api/paypal/capture-order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          orderID: data.orderID,
          items:   cartPayload(),
          delivery,
          email,
        }),
      })
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        setPaying(false)
        setPayError(errBody.error ?? 'Payment captured but order processing failed. Please contact support with this reference.')
        return
      }
      const result = await res.json()

      if (newsletter && email) {
        fetch('/api/newsletter/subscribe', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email }),
        }).catch(() => {})
      }

      const snapshotItems = items.map((it) => ({ ...it }))
      clear()

      navigate('/checkout/confirmation', {
        state: {
          captureId:       result.captureId,
          paypalOrderId:   result.paypalOrderId,
          printfulOrderId: result.printfulOrderId,
          printfulError:   result.printfulError,
          autoConfirmed:   result.autoConfirmed,
          items:           snapshotItems,
          delivery,
          email,
          newsletter,
          subtotal,
          shipping:        shipRate,
          tax,
          total,
          currency,
        },
      })
    } catch (err) {
      setPaying(false)
      setPayError(err.message)
    }
  }

  const paymentReady = emailReady && deliveryReady && !!shipping && !paying

  return (
    <PayPalScriptProvider options={PAYPAL_OPTS}>
      <main className="bg-surface-primary min-h-dvh">
        <section className="lg:pr-[480px]">
          {/* LEFT — single-page form (constrained reading width, makes room for fixed aside on lg) */}
          <div className="px-8 lg:pl-16 lg:pr-12 pt-12 pb-4 lg:pt-16 lg:min-h-dvh flex flex-col justify-center">
            <div className="w-[680px] max-w-full mx-auto flex flex-col gap-8">
              <h1 className="ac-sans-heading-02 m-0">Checkout</h1>
              {/* Contact */}
              <section>
                <div className="flex flex-col gap-3">
                  <PropertyInput
                    size="lg"
                    label="Contact"
                    labelClassName="text-fg-48 ac-helper-xxs uppercase text-emphasis mb-2"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label className="ac-helper-xxs text-meta inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      style={{ accentColor: 'var(--brand-primary)' }}
                    />
                    Sign up to get the latest collections in your inbox.
                  </label>
                </div>
              </section>

              {/* Delivery (country) + Shipping (auto-rate) */}
              <section>
                <div className="grid gap-3 sm:grid-cols-2">
                  <PropertyInput label="Delivery" labelClassName="ac-helper-xxs uppercase text-emphasis mb-2">
                    <Dropdown
                      variant="subtle"
                      className="w-full"
                      options={COUNTRIES}
                      value={delivery.country}
                      onChange={(v) => setDelivery({ ...delivery, country: v })}
                    />
                  </PropertyInput>
                  <PropertyInput label="Shipping" labelClassName="ac-helper-xxs uppercase text-emphasis mb-2">
                    <Input
                      variant="outline"
                      size="lg"
                      disabled
                      value={
                        !deliveryReady ? 'Enter address to see options'
                          : shippingLoading ? 'Calculating…'
                          : shippingError ? shippingError
                          : shipping ? `${shipping.name ?? 'Standard'} · ${formatPrice(shipping.rate, currency)}`
                          : ''
                      }
                      onChange={() => {}}
                      className="w-full"
                    />
                  </PropertyInput>
                </div>
              </section>

              {/* Address */}
              <section>
                <div className="flex flex-col gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <PropertyInput size="lg" label="First name" value={delivery.firstName} onChange={(e) => setDelivery({ ...delivery, firstName: e.target.value })} />
                    <PropertyInput size="lg" label="Last name"  value={delivery.lastName}  onChange={(e) => setDelivery({ ...delivery, lastName:  e.target.value })} />
                  </div>
                  <PropertyInput size="lg" label="Street address" value={delivery.street} onChange={(e) => setDelivery({ ...delivery, street: e.target.value })} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <PropertyInput size="lg" label="Postcode" value={delivery.postcode} onChange={(e) => setDelivery({ ...delivery, postcode: e.target.value })} />
                    <PropertyInput size="lg" label="City"     value={delivery.city}     onChange={(e) => setDelivery({ ...delivery, city:     e.target.value })} />
                  </div>
                  <PropertyInput size="lg" label="Phone (optional)" type="tel" value={delivery.phone} onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })} />
                </div>
              </section>


              {/* Payment */}
              <section>
                <SectionHeading>Payment</SectionHeading>

                {payError && (
                  <div className="p-3 rounded-[4px] bg-fg-04 mb-3">
                    <p className="ac-helper-xs text-emphasis m-0">{payError}</p>
                  </div>
                )}

                {paying ? (
                  <div className="ac-helper-xs text-meta">Processing your order…</div>
                ) : (
                  <div className={paymentReady ? '' : 'opacity-50 pointer-events-none'}>
                    <PayPalButtons
                      style={{ layout: 'vertical', color: 'black', shape: 'rect', label: 'pay', height: 48 }}
                      disabled={!paymentReady}
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={(err) => {
                        console.error('PayPal error:', err)
                        setPayError('Payment could not be completed. Please try again.')
                      }}
                      onCancel={() => setPayError(null)}
                    />
                  </div>
                )}

              </section>
            </div>
          </div>

          {/* RIGHT — drawer-as-permanent-sidebar, fixed to viewport so it covers the nav */}
          <aside className="lg:fixed lg:right-0 lg:top-0 lg:h-dvh lg:w-[480px] lg:z-[60] bg-surface-secondary flex flex-col pb-4">
            <header className="flex items-center px-8 h-14 flex-shrink-0">
              <p className="ac-helper-xs uppercase text-emphasis">
                Your bag {items.length > 0 && <span className="text-meta">· {items.reduce((n, it) => n + it.qty, 0)}</span>}
              </p>
            </header>
            <div className="px-8"><Divider /></div>

            <ul className="flex-1 overflow-y-auto flex flex-col">
              {items.map((it) => (
                <li key={it.id} className="px-8">
                  <div className="grid gap-5 grid-cols-[64px_1fr_auto] items-start py-5">
                    <div className="w-16 h-16 aspect-square rounded-[4px] overflow-hidden bg-surface-primary">
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 pt-1">
                      <p className="ac-helper-xs uppercase text-emphasis m-0">{it.name}</p>
                      <p className="ac-helper-xs text-meta mt-2 mb-0">
                        {[it.size, it.color].filter(Boolean).join(' · ')}
                        {(it.size || it.color) && ' · '}Qty: {it.qty}
                      </p>
                    </div>
                    <p className="ac-helper-xs text-emphasis m-0 pt-1">{formatPrice(it.price * it.qty, it.currency)}</p>
                  </div>
                  <Divider />
                </li>
              ))}
            </ul>

            <footer className="flex-shrink-0 flex flex-col gap-3 px-8 py-5">
              <div className="flex items-center justify-between ac-helper-xs">
                <span className="text-meta uppercase">Subtotal</span>
                <span className="text-emphasis">{formatPrice(subtotal, currency)}</span>
              </div>
              <div className="flex items-center justify-between ac-helper-xs">
                <span className="text-meta uppercase">Shipping</span>
                <span className="text-emphasis">
                  {shipping
                    ? formatPrice(shipping.rate, currency)
                    : shippingLoading
                      ? 'Calculating…'
                      : shippingError
                        ? '—'
                        : 'Enter address'}
                </span>
              </div>
              <Divider />
              <div className="flex items-center justify-between">
                <span className="ac-helper-xs uppercase text-emphasis">Total</span>
                <span className="ac-helper-xs text-emphasis"><strong>{formatPrice(total, currency)}</strong></span>
              </div>
              <p className="ac-helper-xs text-meta inline-flex items-center gap-2 m-0 pt-2">
                <Icon name="lock" size={12} /> Secure checkout via PayPal
              </p>
            </footer>
          </aside>
        </section>
      </main>
    </PayPalScriptProvider>
  )
}
