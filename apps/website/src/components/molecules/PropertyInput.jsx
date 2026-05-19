/**
 * PropertyInput — stacked label + control for inspector / form panels.
 *
 *   children       → any custom control (Dropdown, Toggle, custom block, etc.)
 *   type="number"  → Stepper (chevron buttons)
 *   type="text"... → Input (filled variant)
 *
 *   size           → forwarded to Input (sm / md / lg). Default md.
 *   labelClassName → override the default Label styling
 *                    default: 'ac-helper-10 text-fg-48'
 *                    e.g.   : 'ac-helper-xxs uppercase text-emphasis mb-4'
 *
 * Use in a `grid grid-cols-2 gap-4` for x/y/width/height/rotation row pairs.
 */
import Label from '../atoms/Label'
import Input from '../atoms/Input'
import Stepper from '../atoms/Stepper'

export default function PropertyInput({
  label,
  value,
  onChange,
  type = 'text',
  size = 'md',
  min,
  max,
  step,
  placeholder,
  children,
  className = '',
  labelClassName = 'ac-helper-10 text-fg-48',
}) {
  const control = children
    ?? (type === 'number'
      ? <Stepper value={value} onChange={onChange} min={min} max={max} step={step} />
      : <Input type={type} size={size} value={value} onChange={onChange} placeholder={placeholder} className="w-full" />
    )
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Label className={labelClassName}>{label}</Label>
      {control}
    </div>
  )
}
