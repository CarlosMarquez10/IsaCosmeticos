import { useState, useMemo } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Home, Package, ShoppingCart, ShieldCheck, Menu, X } from 'lucide-react'
import { useCart } from '../state/CartContext'
import CartDrawer from './CartDrawer'

export default function Header({ openCart, setOpenCart }) {
  const { items } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const count = useMemo(() => items.reduce((n, i) => n + Number(i.quantity), 0), [items])

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-gray-200">
      <div className="container-max flex items-center justify-between h-16">
        <Link to="/" className="font-bold text-xl heading-gradient">ISA Cosméticos</Link>
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={({ isActive }) => `flex items-center gap-2 hover:text-brand-600 transition-colors ${isActive ? 'text-brand-600' : 'text-gray-700'}`}><Home className="w-4 h-4" /> Inicio</NavLink>
          <NavLink to="/productos" className={({ isActive }) => `flex items-center gap-2 hover:text-brand-600 transition-colors ${isActive ? 'text-brand-600' : 'text-gray-700'}`}><Package className="w-4 h-4" /> Productos</NavLink>
          <NavLink to="/admin/login" className={({ isActive }) => `flex items-center gap-2 hover:text-brand-600 transition-colors ${isActive ? 'text-brand-600' : 'text-gray-700'}`}><ShieldCheck className="w-4 h-4" /> Admin</NavLink>
          <button aria-label="Abrir carrito" onClick={() => setOpenCart(true)} className="relative p-2 rounded-lg hover:bg-gray-100 transition">
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs rounded-full px-1.5 py-0.5">{count}</span>
            )}
          </button>
        </nav>
        <div className="flex md:hidden items-center gap-2">
          <button aria-label="Abrir carrito" onClick={() => setOpenCart(true)} className="relative p-2 rounded-lg hover:bg-gray-100 transition">
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs rounded-full px-1.5 py-0.5">{count}</span>
            )}
          </button>
          <button aria-label="Abrir menú" onClick={() => setMenuOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition"><Menu className="w-5 h-5" /></button>
        </div>
      </div>
      <div className={`fixed inset-0 z-50 ${menuOpen ? '' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMenuOpen(false)}></div>
        <div className={`absolute left-0 top-0 h-full w-full sm:w-[320px] bg-white/60 backdrop-blur-md shadow-2xl ring-1 ring-white/50 rounded-r-2xl transform transition-transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-brand-200 bg-brand-50 text-brand-700">
            <div className="font-semibold">Menú</div>
            <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-brand-100 transition"><X className="w-5 h-5" /></button>
          </div>
          <div className="px-4 py-3 space-y-2">
            <NavLink
              to="/admin/login"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 ring-1 ${isActive ? 'bg-white/60 backdrop-blur-sm text-brand-700 ring-white/60' : 'bg-white/40 backdrop-blur-sm hover:bg-white/50 text-gray-800 ring-white/50'}`}
            >
              <ShieldCheck className="w-5 h-5" /> Admin
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  )
}