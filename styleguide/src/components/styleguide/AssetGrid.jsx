export default function AssetGrid({ cols = 3, children, className = '' }) {
  return (
    <div className={`ac-asset-grid ac-asset-grid-${cols}col grid gap-4 mt-8 ${className}`.trim()}>
      {children}
    </div>
  )
}
