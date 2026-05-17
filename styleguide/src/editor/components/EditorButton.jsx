import EditorIcon from '../icons/EditorIcon'

/**
 * EditorButton — editor-side button atom that mirrors the KOL `Button` API
 * but resolves icon names against the editor's own icon registry
 * (`src/editor/icons/svg/`) via `EditorIcon`.
 *
 * Lives outside `ac-component` syncing — KOL Button is unmodified. Shared
 * `ac-btn-*` CSS classes still come from `ac-components-atoms.css` so
 * the visual treatment stays consistent.
 *
 * Supports the prop subset the editor actually uses:
 *   variant, size, iconLeft, iconRight, iconLeftHover, iconRightHover,
 *   iconOnly, iconOnlyHover, iconSize, animateIcon, quiet, onClick,
 *   disabled, type, className, style, children + arbitrary aria/data attrs.
 *
 * Skips the `href` / `<a>` branch — editor buttons never render as links.
 */
export default function EditorButton({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  iconLeftHover,
  iconRightHover,
  iconOnly,
  iconOnlyHover,
  animateIcon = false,
  quiet = false,
  iconSize = 16,
  onClick,
  className = '',
  style = {},
  type = 'button',
  disabled = false,
  ...props
}) {
  const variantClass =
    variant === 'primary'  ? 'ac-btn-primary'
    : variant === 'accent' ? 'ac-btn-accent'
    : variant === 'outline' ? 'ac-btn-outline'
    : variant === 'ghost'  ? 'ac-btn-ghost'
    : 'ac-btn-secondary'

  const sizeClass =
    size === 'sm' ? 'ac-btn-sm ac-mono-12'
    : size === 'lg' ? 'ac-btn-lg ac-mono-16'
    : 'ac-btn-md ac-mono-14'

  const animateClass = animateIcon ? 'ac-btn-animate' : ''
  const quietClass   = quiet ? 'ac-btn-quiet' : ''
  const combinedClass = `ac-btn ${variantClass} ${sizeClass} ${animateClass} ${quietClass} ${className}`.trim()

  const renderIcon = (name, hoverName) => {
    if (!name && !hoverName) return null
    if (!hoverName) {
      return <EditorIcon name={name} size={iconSize} />
    }
    return (
      <span
        className="ac-icon-swap-container"
        style={{ position: 'relative', display: 'inline-flex', width: iconSize, height: iconSize, overflow: 'hidden' }}
      >
        <EditorIcon name={name}      size={iconSize} className="ac-icon-default" style={{ position: 'absolute' }} />
        <EditorIcon name={hoverName} size={iconSize} className="ac-icon-hover"   style={{ position: 'absolute' }} />
      </span>
    )
  }

  const content = iconOnly
    ? renderIcon(iconOnly, iconOnlyHover)
    : (iconLeft || iconRight || iconLeftHover || iconRightHover)
      ? (
        <span className="flex items-center gap-2">
          {(iconLeft || iconLeftHover) && renderIcon(iconLeft, iconLeftHover)}
          {children}
          {(iconRight || iconRightHover) && renderIcon(iconRight, iconRightHover)}
        </span>
      )
      : children

  const mergedStyle = iconOnly
    ? { lineHeight: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }
    : style

  return (
    <button
      onClick={onClick}
      type={type}
      className={combinedClass}
      style={mergedStyle}
      disabled={disabled}
      aria-label={iconOnly ? (props['aria-label'] || 'Button') : undefined}
      {...props}
    >
      {content}
    </button>
  )
}
