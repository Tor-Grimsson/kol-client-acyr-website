export default function BrandHero({ id = 'hero', label, title, lede, mark, children }) {
  return (
    <section id={id} className="ac-page-hero flex flex-col gap-8">
      {label && <p className="ac-prose-label">{label}</p>}
      <div className="flex items-center gap-12 flex-wrap">
        {mark}
        <div className="flex-1 min-w-[280px]">
          <h1 className="ac-prose-display">{title}</h1>
          {lede && <p className="ac-prose-lede max-w-[60ch]">{lede}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}
