import { useNavigate } from 'react-router-dom'
import KolLogo from '@brand/logos/KolLogo'
import Button from '@components/atoms/Button'
import usePageTitle from '../components/hooks/usePageTitle'
import { BRAND } from '@brand/config'
import { ACImages } from '@brand/data/images'

const HERO_IMAGE = ACImages.hero

export default function Landing() {
  usePageTitle()
  const navigate = useNavigate()

  return (
    <section
      className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-absolute-black text-absolute-white"
      style={{
        backgroundImage: `url(${HERO_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-fg-absolute-48" aria-hidden="true" />

      <div className="relative z-[1] flex flex-col items-center gap-10 px-8 text-center">
        <div className="w-[clamp(140px,16vw,220px)]">
          <KolLogo variant="logomark" title={BRAND.name} className="w-full h-auto" />
        </div>

        <h1 className="kol-prose-display uppercase">{BRAND.name}</h1>

        <p className="kol-prose-tagline">
          A Central European atelier crafting timeless womenswear by hand.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <Button variant="primary" size="md" onClick={() => navigate('/site')}>Enter site</Button>
          <Button variant="outline" size="md" onClick={() => navigate('/styleguide')}>Styleguide</Button>
        </div>
      </div>
    </section>
  )
}
