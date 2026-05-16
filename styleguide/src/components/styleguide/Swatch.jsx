export default function Swatch({ hex, name, anchor = false }) {
  return (
    <div className="kol-swatch">
      <div className="kol-swatch-chip relative border border-fg-08" style={{ background: hex }}>
        {anchor && (
          <span
            aria-label="Canonical anchor"
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span
              className="block rounded-full"
              style={{ width: 10, height: 10, background: 'white', mixBlendMode: 'difference' }}
            />
          </span>
        )}
      </div>
      <div className="kol-swatch-meta kol-helper-10">
        {name && <span className="text-meta">{name}</span>}
        <span className="text-strong font-semibold">{hex.toUpperCase()}</span>
      </div>
    </div>
  )
}
