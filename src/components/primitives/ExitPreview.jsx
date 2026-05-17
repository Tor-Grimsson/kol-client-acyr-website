import { Link, useLocation } from 'react-router-dom'

export default function ExitPreview() {
  const { pathname: _pathname } = useLocation()

  return (
    <Link to="/" className="ac-exit-preview" aria-label="Exit preview">
      <span className="ac-exit-preview-icon" aria-hidden="true">×</span>
      <span className="ac-exit-preview-label">Exit</span>
    </Link>
  )
}
