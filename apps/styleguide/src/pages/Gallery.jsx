import { useEffect, useState } from 'react'

export default function Gallery() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [focused, setFocused] = useState(null)

  useEffect(() => {
    document.title = 'Gallery'
    fetch('/__photos.json')
      .then(r => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then(setData)
      .catch(setError)
  }, [])

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setFocused(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const shell = {
    minHeight: '100vh',
    background: '#0b0b0b',
    color: '#ddd',
    fontFamily: 'var(--ac-font-family-mono)',
  }

  if (error) {
    return (
      <div style={{ ...shell, padding: 24 }}>
        Gallery unavailable: {String(error)}. Is the dev server running and the{' '}
        <code>photoIndexPlugin</code> registered in <code>vite.config.js</code>?
      </div>
    )
  }

  if (!data) return <div style={{ ...shell, padding: 24 }}>Loading…</div>

  if (!data.groups.length) {
    return (
      <div style={{ ...shell, padding: 24 }}>
        No media found. Drop folders into <code>public/brand/&lt;group&gt;/</code> and reload.
      </div>
    )
  }

  const total = data.groups.reduce((n, g) => n + g.count, 0)
  const totalVideo = data.groups.reduce(
    (n, g) => n + g.files.filter(f => f.type === 'video').length, 0,
  )

  const onThumbClick = src => e => {
    // let cmd/ctrl/shift/middle-click open in new tab as before
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    setFocused(prev => (prev === src ? null : src))
  }

  return (
    <div style={shell}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          background: 'rgba(11,11,11,0.92)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #222',
          padding: '12px 20px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'baseline',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <strong style={{ fontSize: 14, letterSpacing: 0.5, textTransform: 'uppercase' }}>
          Gallery
        </strong>
        <span style={{ fontSize: 12, opacity: 0.5 }}>
          {total} {total === 1 ? 'item' : 'items'}
          {totalVideo > 0 && ` (${totalVideo} video)`} · {data.groups.length}{' '}
          {data.groups.length === 1 ? 'group' : 'groups'}
        </span>
        <nav style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginLeft: 'auto' }}>
          {data.groups.map(g => (
            <a
              key={g.name}
              href={`#${encodeURIComponent(g.name)}`}
              style={{ color: '#bbb', textDecoration: 'none', fontSize: 13 }}
            >
              {g.name} <span style={{ opacity: 0.5 }}>{g.count}</span>
            </a>
          ))}
        </nav>
      </header>

      {data.groups.map(g => (
        <section key={g.name} id={g.name} style={{ padding: '24px 16px' }}>
          <h2
            style={{
              fontSize: 12,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              opacity: 0.55,
              margin: '0 0 10px',
              paddingLeft: 4,
            }}
          >
            {g.name} <span style={{ opacity: 0.55 }}>· {g.count}</span>
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 2,
              gridAutoFlow: 'dense',
            }}
          >
            {g.files.map(entry => {
              const { type, src } = entry
              const isFocused = focused === src
              return (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  title={src.split('/').pop()}
                  onClick={onThumbClick(src)}
                  style={{
                    display: 'block',
                    aspectRatio: '1',
                    overflow: 'hidden',
                    background: isFocused ? '#000' : '#1a1a1a',
                    gridColumn: isFocused ? 'span 3' : 'auto',
                    gridRow: isFocused ? 'span 3' : 'auto',
                    cursor: isFocused ? 'zoom-out' : 'zoom-in',
                    transition: 'background 120ms ease',
                    position: 'relative',
                  }}
                >
                  {type === 'video' ? (
                    <video
                      src={src}
                      muted
                      loop
                      playsInline
                      autoPlay={isFocused}
                      controls={isFocused}
                      preload="metadata"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: isFocused ? 'contain' : 'cover',
                        objectPosition: 'center top',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <img
                      src={src}
                      loading="lazy"
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: isFocused ? 'contain' : 'cover',
                        objectPosition: 'center top',
                        display: 'block',
                      }}
                    />
                  )}
                  {type === 'video' && !isFocused && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        fontSize: 10,
                        letterSpacing: 0.6,
                        padding: '2px 6px',
                        background: 'rgba(0,0,0,0.6)',
                        color: '#ddd',
                        borderRadius: 2,
                        textTransform: 'uppercase',
                      }}
                    >
                      video
                    </span>
                  )}
                </a>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
