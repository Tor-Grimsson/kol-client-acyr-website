/**
 * Badge — status / categorization indicator
 *
 * Converted from Badge.tsx (shadcn/CVA) → plain JSX with ac- CSS variables.
 * CSS classes live in components.css under 2-LABELS → Badges.
 */

const VARIANT_MAP = {
  default: 'ac-badge-default',
  secondary: 'ac-badge-secondary',
  destructive: 'ac-badge-destructive',
  outline: 'ac-badge-outline',
  success: 'ac-badge-success',
  warning: 'ac-badge-warning',
  critical: 'ac-badge-critical',
  info: 'ac-badge-info'
}

const SIZE_MAP = {
  sm: 'ac-badge-sm',
  md: 'ac-badge-md',
  lg: 'ac-badge-lg'
}

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const variantClass = VARIANT_MAP[variant] || VARIANT_MAP.default
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md

  return (
    <div
      className={`ac-badge ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}

export default Badge
