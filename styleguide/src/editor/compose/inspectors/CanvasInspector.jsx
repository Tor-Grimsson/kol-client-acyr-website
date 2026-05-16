import Slider from '@components/atoms/Slider'
import LabeledControl from '@components/molecules/LabeledControl'
import { useComposeState } from '../state'
import { ColorField } from './LayerInspector'

/**
 * CanvasInspector — properties for the canvas/frame "layer".
 *
 * The canvas itself is the bottom-most selectable item in the layer stack.
 * Owns its fill (replaces the former `background` layer type) + fill
 * opacity. Aspect + view live in the topbar Canvas menu (same control
 * shouldn't have two surfaces).
 */
export default function CanvasInspector() {
  const {
    canvasFill, setCanvasFill,
    canvasFillOpacity, setCanvasFillOpacity,
    palette,
  } = useComposeState()

  return (
    <div className="flex flex-col gap-4">
      <ColorField
        label="Fill"
        value={canvasFill}
        onChange={setCanvasFill}
        palette={palette}
      />
      <LabeledControl label="Fill opacity">
        <Slider
          min={0}
          max={100}
          value={Math.round((canvasFillOpacity ?? 1) * 100)}
          onChange={(v) => setCanvasFillOpacity(v / 100)}
        />
      </LabeledControl>
    </div>
  )
}
