import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { listCategories } from '../services/api'

export default function Footer() {
  const [categories, setCategories] = useState([])
  useEffect(() => { let m=true; listCategories().then(cs=>{ if(m) setCategories(cs) }).catch(()=>{}); return ()=>{ m=false } }, [])
  return (
    <footer className="mt-10 border-t border-gray-200 bg-white/70">
      <div className="container-max py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="font-bold text-xl heading-gradient">ISA Cosméticos</div>
          <p className="mt-2 text-sm text-gray-600">Belleza y cuidado personal. Explora nuestras categorías y encuentra tus productos favoritos.</p>
        </div>
        <div className="hidden md:block">
          <div className="font-semibold mb-3">Navegación</div>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="hover:text-brand-700">Inicio</Link>
            <Link to="/productos" className="hover:text-brand-700">Productos</Link>
            <Link to="/carrito" className="hover:text-brand-700">Carrito</Link>
            <Link to="/admin/login" className="hover:text-brand-700">Admin</Link>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="font-semibold mb-3">Categorías</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {categories.map(c => (
              <Link key={c.id} to={`/productos?categoria=${encodeURIComponent(c.nombre)}`} className="hover:text-brand-700">{c.nombre}</Link>
            ))}
          </div>
        </div>
        <div className="hidden md:block">
          <div className="font-semibold mb-3">Contacto</div>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +57 321 615 4603</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> carlos27marquez10@gmail.com</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Cucuta Norte de Santander</div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="container-max py-4 text-xs text-gray-600 text-center">© {new Date().getFullYear()} ISA Cosméticos. Todos los derechos reservados.</div>
      </div>
    </footer>
  )
}