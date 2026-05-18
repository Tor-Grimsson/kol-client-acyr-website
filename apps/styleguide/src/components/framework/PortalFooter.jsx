export default function PortalFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="ac-portal-footer">
      <a
        href="https://kolkrabbi.io"
        target="_blank"
        rel="noopener"
        aria-label="Kolkrabbi Vinnustofa"
      >
        <img src="/favicon.svg" alt="" width="32" height="32" />
      </a>
      <p className="ac-helper-12 text-meta">
        <a href="https://kolkrabbi.io" target="_blank" rel="noopener" className="hover:text-strong">
          Kolkrabbi Vinnustofa
        </a>
        {' · '}
        {year}
      </p>
    </footer>
  )
}
