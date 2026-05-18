/**
 * Shared rich-text specimen — H1–H4, paragraph, quote, indented, code, pullout, lists.
 * Only the brand-specific slots vary.
 */
export default function ProsePreview({ h1, paragraph, code, pullout, quote = 'Above as below — justice is a starfield.' }) {
  return (
    <div className="ac-prose">
      <h1>H1 — {h1}</h1>
      <h2>H2 — Section title</h2>
      <h3>H3 — Subsection</h3>
      <h4>H4 — Block title</h4>
      <p className="ac-sans-body-01 text-strong mb-6">
        Section lede — a larger paragraph used to introduce a section and
        establish tone before the body copy begins.
      </p>
      <p>{paragraph}</p>
      <blockquote><p>{quote}</p></blockquote>
      <div className="ac-prose-indented">
        <p>
          Indented passage. Used for tangential copy, contextual notes, or
          nested argument that supports the main line.
        </p>
      </div>
      <pre className="bg-fg-04 border border-fg-08"><code>{code}</code></pre>
      <p className="ac-prose-pullout ac-helper-12 uppercase tracking-widest text-body">
        Pullout — {pullout}
      </p>
      <ul>
        <li>Unordered list — item one</li>
        <li>Item two</li>
        <li>Item three</li>
      </ul>
      <ol>
        <li>Ordered list — item one</li>
        <li>Item two</li>
        <li>Item three</li>
      </ol>
    </div>
  )
}
