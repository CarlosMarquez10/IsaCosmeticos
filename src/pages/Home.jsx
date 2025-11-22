import { Link } from 'react-router-dom'
import heroImg from '../asset/portada.png'

export default function Home() {
  return (
    <div className="relative">
      <section className="container-max py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight heading-gradient">Belleza que inspira confianza</h1>
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