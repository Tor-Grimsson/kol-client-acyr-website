import Divider from '@components/atoms/Divider'

export default function PageSection({ id, label, title, body, children, className = '', fullbleed = false, divider = false }) {
  const hasHead = label || title || body
  const cls = [
    'ac-page',
    'ac-page-section',
    fullbleed && 'ac-page--fullbleed',
    className,
  ].filter(Boolean).join(' ')
  return (
    <section id={id} className={cls}>
      {divider && <Divider className="ac-page-section-divider" />}
      {hasHead && (
        <header className={fullbleed ? 'max-w-[960px]' : 'max-w-[720px]'}>
          {label && <p  className="ac-prose-label">{label}</p>}
          {title && <h2 className="ac-prose-title">{title}</h2>}
          {body  && <p  className="ac-prose-lede">{body}</p>}
        </header>
      )}
      {children}
    </section>
  )
}
