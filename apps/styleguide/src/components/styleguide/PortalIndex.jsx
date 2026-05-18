import { Link } from 'react-router-dom'
import KolLogo from '@ac/brand-data/logos/KolLogo'

/**
 * PortalIndex — editorial anchor + 6-card numbered grid.
 * Each item: { num, label, sub, to?, mark?, isClient? }
 * Styled by `.site-anchor*` in ac-site.css.
 */
export default function PortalIndex({ kicker, title, body, items = [] }) {
  return (
    <section className="site-anchor">
      <div className="max-w-[1200px] mx-auto">
        {kicker && (
          <span className="ac-helper-12 uppercase tracking-widest text-meta">{kicker}</span>
        )}
        {title && <h2 className="site-anchor-pull">{title}</h2>}
        {body && <p className="site-anchor-body">{body}</p>}
        <nav className="site-anchor-nav grid grid-cols-1 min-[561px]:grid-cols-2 min-[961px]:grid-cols-3 gap-px rounded-[4px] overflow-hidden">
          {items.map((item, i) => {
            const cls = `site-anchor-link${item.isClient ? ' site-anchor-link--client' : ''}`
            const inner = (
              <>
                <span className="site-anchor-link-num">{item.num}</span>
                {item.mark && (
                  <span className="site-anchor-link-mark" aria-hidden="true">
                    <KolLogo variant={item.mark.variant} />
                  </span>
                )}
                <span className="site-anchor-link-label">{item.label}</span>
                {item.sub && <span className="site-anchor-link-sub">{item.sub}</span>}
              </>
            )
            return item.to ? (
              <Link key={i} to={item.to} className={cls}>{inner}</Link>
            ) : (
              <div key={i} className={cls}>{inner}</div>
            )
          })}
        </nav>
      </div>
    </section>
  )
}
