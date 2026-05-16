import { useState } from 'react'
import EditorIcon from '../../icons/EditorIcon'
import { PopoverPanel, usePopover } from '@components/molecules/Popover'
import { TOOL_META, useTool } from '../../state/tools'

/**
 * ToolPalette — horizontal tool bar mounted in `canvas.header` for Compose
 * mode. Renders above the main canvas, between the rails:
 *
 *   Select · Text · [Shape ▾] · Pattern
 *
 * The Shape entry is a popover dropdown that swaps between `rect` and
 * `ellipse`. Trigger icon reflects the last-picked variant. Clicking the
 * trigger arms the last-picked variant; opening the dropdown lets the
 * user switch.
 *
 * All buttons use `kol-btn-quiet` (dimmed at rest, brightens on hover) —
 * matches the LayerStack `+`/trash idiom. The active tool drops the
 * quiet class so it stays at full opacity, making it the only fully-lit
 * button at rest. No background fill, no brand color. Icons come from
 * the editor-scoped icon loader (`src/editor/icons/`).
 */

const SHAPE_VARIANTS = [
  { id: 'rect',     label: 'Rectangle', icon: 'tool-rect',     shortcut: 'R' },
  { id: 'ellipse',  label: 'Ellipse',   icon: 'tool-ellipse',  shortcut: 'O' },
  { id: 'triangle', label: 'Triangle',  icon: 'tool-triangle', shortcut: '' },
  { id: 'line',     label: 'Line',      icon: 'tool-line',     shortcut: '' },
  { id: 'polygon',  label: 'Polygon',   icon: 'tool-polygon',  shortcut: '' },
  { id: 'star',     label: 'Star',      icon: 'tool-star',     shortcut: '' },
]
const SHAPE_IDS = new Set(SHAPE_VARIANTS.map((v) => v.id))

function ToolButton({ id, active, onClick }) {
  const meta = TOOL_META[id]
  return (
    <button
      type="button"
      onClick={(e) => {
        onClick()
        /* Drop focus so the canvas regains it. Some browsers don't refresh
         * the canvas cursor while a button (with its own cursor:pointer)
         * holds focus. */
        e.currentTarget.blur()
      }}
      aria-label={meta.label}
      aria-pressed={active}
      title={`${meta.label} (${meta.shortcut})`}
      className={`inline-flex items-center justify-center rounded text-emphasis ${active ? '' : 'kol-btn-quiet'}`}
      style={{ width: 28, height: 28, padding: 6 }}
    >
      <EditorIcon name={meta.icon} size={14} />
    </button>
  )
}

function ShapeDropdown({ tool, setTool }) {
  const [open, setOpen] = useState(false)
  const [lastPicked, setLastPicked] = useState('rect')
  const popover = usePopover({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    offset: 4,
    role: 'menu',
  })
  const active = SHAPE_IDS.has(tool)
  const triggerVariant = SHAPE_VARIANTS.find((v) => v.id === (active ? tool : lastPicked)) ?? SHAPE_VARIANTS[0]

  return (
    <>
      <button
        ref={popover.refs.setReference}
        {...popover.getReferenceProps({
          onClick: (e) => {
            /* Clicking the trigger always arms the last-picked variant.
             * Floating-ui's click handler also toggles the dropdown so
             * the user can immediately switch — both intents fire on
             * the same click. Blur after so the canvas cursor refreshes. */
            if (!active) setTool(triggerVariant.id)
            e.currentTarget.blur()
          },
        })}
        aria-label={`Shape: ${triggerVariant.label}`}
        aria-pressed={active}
        title={`Shape: ${triggerVariant.label} (${triggerVariant.shortcut})`}
        className={`relative inline-flex items-center justify-center rounded text-emphasis ${active ? '' : 'kol-btn-quiet'}`}
        style={{ width: 28, height: 28, padding: 6 }}
      >
        <EditorIcon name={triggerVariant.icon} size={14} />
        <EditorIcon
          name="tool-fold-indicator"
          size={4}
          className="absolute opacity-70"
          style={{ right: 2, bottom: 2 }}
        />
      </button>
      <PopoverPanel popover={popover} panel={false} focus={false} className="bg-surface-secondary border border-fg-08 rounded shadow-lg">
        {SHAPE_VARIANTS.map((v) => {
          const isActive = tool === v.id
          return (
            <button
              key={v.id}
              type="button"
              onClick={(e) => {
                setTool(v.id)
                setLastPicked(v.id)
                setOpen(false)
                e.currentTarget.blur()
              }}
              className="w-full kol-helper-12 px-3 h-8 inline-flex items-center gap-2 text-body hover:text-emphasis text-left"
            >
              <span className="shrink-0 w-4 inline-flex items-center justify-center">
                <EditorIcon name={v.icon} size={14} />
              </span>
              <span className="flex-1 truncate">{v.label}</span>
              <span className="kol-helper-10 text-emphasis shrink-0">{isActive ? '✓' : v.shortcut}</span>
            </button>
          )
        })}
      </PopoverPanel>
    </>
  )
}

export default function ToolPalette() {
  const { tool, setTool } = useTool()
  return (
    <div className="flex items-center gap-1 px-3 h-10">
      <ToolButton id="select"  active={tool === 'select'}  onClick={() => setTool('select')} />
      <ToolButton id="text"    active={tool === 'text'}    onClick={() => setTool('text')} />
      <ShapeDropdown tool={tool} setTool={setTool} />
      <ToolButton id="pattern" active={tool === 'pattern'} onClick={() => setTool('pattern')} />
    </div>
  )
}
