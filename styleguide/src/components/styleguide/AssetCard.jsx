/**
 * AssetCard — frame wrapper for stationery / branded asset mocks.
 *
 * Just a backdrop (bg-fg-04) with padding + caption below. Asset child
 * renders at its natural size driven by parent column width and its own
 * aspect-ratio. No scaling — content stays at intended proportions.
 *
 * Group items with similar aspects in the same grid row so heights align.
 * Extreme-aspect items (very tall or very wide) should go in their own row
 * or full-width container.
 */
export default function AssetCard({ caption, children }) {
  return (
    <figure>
      {caption && (
        <figcaption className="ac-helper-12 uppercase tracking-widest text-meta mb-3">
          {caption}
        </figcaption>
      )}
      <div className="bg-fg-04 rounded-sm p-6">
        {children}
      </div>
    </figure>
  )
}
