import Carousel from '@components/primitives/Carousel'
import LogoCard from './LogoCard'

export default function LogoCarousel({ logos, light = false, backdrop }) {
  return (
    <Carousel>
      {logos.map((l) => (
        <LogoCard
          key={l.name}
          name={l.name}
          caption={l.caption}
          backdrop={l.backdrop ?? backdrop}
          light={light}
        />
      ))}
    </Carousel>
  )
}
