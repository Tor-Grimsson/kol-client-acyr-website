import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../atoms/Button'
import Icon from '../loaders/icons/Icon'
import { useCart } from './CartContext'
import { formatPrice } from '../../data/shop-data'

function QtyControl({ qty, onChange, onDelete }) {
  const atMin = qty === 1
  const [hover, setHover] = useState(false)
  const showTrash = atMin && hover
  return (
    <div className="inline-flex items-center gap-3">
      <button
        type="button"
        aria-label={atMin ? 'Remove item' : 'Decrease quantity'}
        onClick={() => (atMin ? onDelete() : onChange(qty - 1))}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="w-7 h-7 inline-flex items-center justify-center bg-fg-04 hover:bg-fg-08 transition-colors rounded-full"
        style={{ border: 'none', cursor: 'pointer', color: 'inherit' }}
      >
        <Icon name={showTrash ? 'trash' : 'minus'} size={12} />
      </button>
      <span className="ac-helper-xs" style={{ minWidth: '1.5em', textAlign: 'center' }}>{qty}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(qty + 1)}
        className="w-7 h-7 inline-flex items-center justify-center bg-fg-04 hover:bg-fg-08 transition-colors rounded-full"
        style={{ border: 'none', cursor: 'pointer', color: 'inherit' }}
      >
        <Icon name="plus" size={12} />
      </button>
    </div>
  )
}

export default function CartDrawer() {
  const { items, updateQty, removeItem, subtotal, currency, itemCount, isOpen, closeCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  const onCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <div className="fixed inset-0 z-[1000]" aria-modal="true" role="dialog" aria-label="Shopping bag">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        onClick={closeCart}
      />
      <aside
        className="absolute top-0 right-0 h-dvh w-[min(480px,100vw)] bg-surface-primary border-l border-fg-08 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-6 h-14 border-b border-fg-08 flex-shrink-0">
          <p className="ac-helper-xxs uppercase text-emphasis">
            Your bag {itemCount > 0 && <span className="text-meta">· {itemCount}</span>}
          </p>
          <button
            type="button"
            aria-label="Close bag"
            onClick={closeCart}
            className="text-meta hover:text-emphasis transition-colors"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <Icon name="x" size={14} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
            <p className="ac-helper-xxs text-meta">Your bag is empty.</p>
            <div className="flex gap-4 ac-helper-xxs">
              <Link to="/shop" onClick={closeCart} className="text-emphasis underline underline-offset-4 hover:no-underline">Shop</Link>
              <Link to="/handmade" onClick={closeCart} className="text-emphasis underline underline-offset-4 hover:no-underline">Handmade</Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto flex flex-col">
              {items.map((it) => (
                <li key={it.id} className="px-6 py-5 border-b border-fg-08">
                  <div className="grid gap-4 grid-cols-[80px_1fr_auto] items-start">
                    <Link to={`/${it.kind === 'pod' ? 'shop' : 'handmade'}/${it.slug}`} onClick={closeCart} className="block">
                      <div className="w-20 h-20 aspect-square rounded-[4px] overflow-hidden bg-surface-secondary">
                        <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                      </div>
                    </Link>
                    <div className="flex flex-col min-w-0">
                      <Link
                        to={`/${it.kind === 'pod' ? 'shop' : 'handmade'}/${it.slug}`}
                        onClick={closeCart}
                        className="ac-helper-xxs uppercase text-emphasis no-underline hover:text-emphasis mb-2"
                      >
                        {it.name}
                      </Link>
                      {(it.size || it.color) && (
                        <p className="ac-helper-xxs text-meta mb-2">
                          {[it.size, it.color].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      <QtyControl
                        qty={it.qty}
                        onChange={(q) => updateQty(it.id, q)}
                        onDelete={() => removeItem(it.id)}
                      />
                    </div>
                    <p className="ac-helper-xxs text-emphasis">{formatPrice(it.price * it.qty, it.currency)}</p>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="px-6 py-5 border-t border-fg-08 flex-shrink-0 flex flex-col gap-4">
              <div className="flex items-center justify-between ac-helper-xxs">
                <span className="text-meta uppercase">Subtotal</span>
                <span className="text-emphasis">{formatPrice(subtotal, currency)}</span>
              </div>
              <p className="ac-helper-xxs text-meta">Shipping + tax calculated at checkout.</p>
              <Button variant="primary" size="lg" className="w-full" onClick={onCheckout}>
                Checkout · {formatPrice(subtotal, currency)}
              </Button>
              <button
                type="button"
                onClick={closeCart}
                className="ac-helper-xxs text-meta hover:text-emphasis self-center"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Continue shopping
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
