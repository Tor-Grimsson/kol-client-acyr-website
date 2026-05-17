import { PortableText } from '@portabletext/react'

const components = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children, value }) => {
      const cite = value.markDefs?.find((m) => m._type === 'cite')
      return (
        <blockquote>
          <p>{children}</p>
          {cite?.source && <cite>{cite.source}</cite>}
        </blockquote>
      )
    },
  },
  marks: {
    cite: ({ children }) => <>{children}</>,
    link: ({ children, value }) => (
      <a
        href={value.href}
        target={value.href?.startsWith('http') ? '_blank' : undefined}
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    em: ({ children }) => <em>{children}</em>,
    strong: ({ children }) => <strong>{children}</strong>,
  },
}

export default function BlogBody({ blocks = [] }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null
  return (
    <div className="ac-prose">
      <PortableText value={blocks} components={components} />
    </div>
  )
}
