import Swatch from './Swatch'

export default function Ramp({ name, stops }) {
  return (
    <div className="mb-8">
      <h4 className="kol-helper-12 uppercase tracking-widest text-body m-0 mb-2">
        {name}
      </h4>
      <div className="kol-ramp-chips">
        {stops.map(([stopName, hex]) => (
          <Swatch key={hex} hex={hex} name={stopName} />
        ))}
      </div>
    </div>
  )
}
