import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const KEY = 'kol.ac.cart.v2'
const Ctx = createContext(null)

const safeRead = () => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const safeWrite = (items) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    /* no-op */
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => safeRead())
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    safeWrite(items)
  }, [items])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY && e.newValue) {
        try { setItems(JSON.parse(e.newValue) ?? []) } catch { /* no-op */ }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(() => {
    const lineId = (slug, size, color) => `${slug}::${size ?? '-'}::${color ?? '-'}`

    const addItem = (product, { size = null, color = null, qty = 1, price, image } = {}) => {
      setItems((prev) => {
        const id = lineId(product.slug, size, color)
        const existing = prev.find((it) => it.id === id)
        if (existing) {
          return prev.map((it) => (it.id === id ? { ...it, qty: it.qty + qty } : it))
        }
        return [
          ...prev,
          {
            id,
            slug:     product.slug,
            name:     product.name,
            image:    image ?? product.image,
            kind:     product.kind,
            price:    price ?? product.price,
            currency: product.currency,
            size,
            color,
            qty,
          },
        ]
      })
      setIsOpen(true)
    }

    const updateQty = (id, qty) => {
      setItems((prev) =>
        prev
          .map((it) => (it.id === id ? { ...it, qty: Math.max(1, qty) } : it))
          .filter((it) => it.qty > 0),
      )
    }

    const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id))
    const clear      = () => setItems([])

    const openCart  = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)
    const toggleCart = () => setIsOpen((v) => !v)

    const itemCount = items.reduce((acc, it) => acc + it.qty, 0)
    const subtotal  = items.reduce((acc, it) => acc + it.price * it.qty, 0)
    const currency  = items[0]?.currency ?? 'EUR'

    return {
      items, addItem, updateQty, removeItem, clear,
      itemCount, subtotal, currency,
      isOpen, openCart, closeCart, toggleCart,
    }
  }, [items, isOpen])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
