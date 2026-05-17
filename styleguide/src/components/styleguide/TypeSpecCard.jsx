/**
 * TypeSpecCard — meta panel on the left, live sample on the right.
 * Sample is rendered inline-styled so the typography values are driven by data.
 */
export default function TypeSpecCard({ label, meta = [], children }) {
  return (
    <div className="ac-type-spec relative py-12 border-t border-fg-08">
      {label && (
        <span className="ac-type-spec-label ac-helper-12 uppercase tracking-widest text-meta absolute top-4 left-0">
          {label}
        </span>
      )}
      <div className="ac-type-spec-row grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 items-start pt-6">
        <div className="ac-type-spec-meta flex flex-col">
          {meta.map(([key, value]) => (
            <div
              key={key}
              className="ac-type-spec-meta-row grid grid-cols-[auto_minmax(0,1fr)] gap-4 items-baseline py-2 border-b border-[var(--ac-fg-04)] last:border-b-0"
            >
              <span className="ac-helper-10 text-meta">{key}</span>
              <span className="ac-helper-10 text-strong text-right [overflow-wrap:anywhere]">{value}</span>
            </div>
          ))}
        </div>
        <div className="ac-type-spec-sample min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}
