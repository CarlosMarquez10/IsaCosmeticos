import { Link } from 'react-router-dom'
import heroImg from '../asset/portada.png'

export default function Home() {
  return (
    <div className="relative">
      <section className="container-max py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-brand font-bold text-5xl sm:text-6xl heading-gradient drop-shadow-[0_2px_8px_rgba(233,30,99,0.35)]">ISA Cosméticos</h1>
            <h3 className="mt-3 text-2xl sm:text-3xl font-semibold leading-tight heading-gradient">Belleza que inspira confianza</h3>
            <p className="mt-4 text-lg text-gray-700">Cosméticos y artículos de cuidado para cabello, uñas y piel. Descubre tu mejor versión.</p>
            <div className="mt-8 flex gap-4">
              <Link to="/productos" className="btn-primary">Ver productos</Link>
              <Link to="/carrito" className="btn-secondary">Ver carrito</Link>
            </div>
          </div>
          <div className="relative">
            <div
              className="aspect-[3/2] sm:aspect-[4/3] rounded-3xl overflow-hidden hero-fade-bottom"
              style={{ backgroundImage: `url(${import.meta.env.VITE_HOME_HERO_IMAGE || heroImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            ></div>
          </div>
        </div>
      </section>
    </div>
  )
}
