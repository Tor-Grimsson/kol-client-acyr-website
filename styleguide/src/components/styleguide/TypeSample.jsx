export default function TypeSample({
  family = 'Right Grotesk',
  weight = 400,
  italic = false,
  size = 32,
  lineHeight,
  label,
  children,
}) {
  return (
    <div className="kol-type-sample py-6">
      {label && (
        <p className="kol-helper-12 uppercase tracking-wider text-meta m-0 mb-3">
          {label}
        </p>
      )}
      <p
        className="kol-type-sample-body m-0 text-auto"
        style={{
          fontFamily: `"${family}", sans-serif`,
          fontWeight: weight,
          fontStyle: italic ? 'italic' : 'normal',
          fontSize: `${size}px`,
          lineHeight: lineHeight ? `${lineHeight}px` : '1.2',
        }}
      >
        {children}
      </p>
    </div>
  )
}
