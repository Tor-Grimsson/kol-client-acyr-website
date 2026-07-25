import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../../lib/gsap'
import ProductCard from './ProductCard'
import { PRODUCTS, formatPrice } from '../../data/shop-data'

/**
 * Collection — featured products in a 2×4 grid, revealed on scroll-into-view.
 *
 * An explicit, ordered pick of real products (3 handmade + 5 POD); imagery is
 * each product's CDN hero.
 */

const FEATURED_SLUGS = [
  'modular-leather-jacket',
  'vigdis-coat',
  'nepal-cashmere-coat',
  'art-deco-printed-high-waist-bikini',
  'earth-print-leggings-with-pockets',
  'metal-printed-crop-top',
  'metal-print-windbreaker',
  'art-deco-printed-yoga-leggings',
]

export default function Collection() {
  const sectionRef = useRef(null)
  const gridRef = useRef(null)
  const featured = FEATURED_SLUGS.map((s) => PRODUCTS.find((p) => p.slug === s)).filter(Boolean)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const cards = gridRef.current?.children
    if (!cards || cards.length === 0) return

    // Timed reveal (NOT scrub) — cards rise in over a fixed duration when the
    // section enters view. Opacity is NOT animated here (CSS owns it: cards
    // rest at 70%, hover 100%) — animating it would leave an inline opacity
    // that overrides the hover.
    gsap.set(cards, { y: 40, scale: 0.96 })
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power2.out',
        })
      },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="bg-surface-primary px-8 py-12">
      <div className="flex items-baseline justify-between mb-10">
        <h2 className="site-meta-editorial text-emphasis">Collection</h2>
        <span className="site-meta-editorial">SS 2026</span>
      </div>

      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {featured.map((p) => (
          <div key={p.slug} className="opacity-70 hover:opacity-100 transition-opacity duration-300">
            <ProductCard
              to={p.kind === 'pod' ? `/shop/${p.slug}` : `/handmade/${p.slug}`}
              src={p.image}
              name={p.name}
              price={formatPrice(p.price, p.currency)}
              overlay={false}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
