// Foreground chooser — pick text color with best contrast against background.
export function fgOn(bg) {
  const hex = bg.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  // relative luminance
  const L = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return L > 0.55 ? '#0E0E11' : '#FAFAFA'
}
