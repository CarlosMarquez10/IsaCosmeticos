import { Link } from 'react-router-dom'
import { Home, Package, ShoppingCart } from 'lucide-react'
import { useCart } from '../state/CartContext'

export default function MobileBottomNav({ setOpenCart }) {
  const { items } = useCart()
  const count = items.reduce((n, i) => n + Number(i.quantity), 0)
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur border-t border-gray-200">
      <div className="container-max">
        <div className="grid grid-cols-3">
          <Link to="/" className="flex flex-col items-center justify-center py-3 text-gray-700 hover:text-brand-600 transition-colors">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Inicio</span>
          </Link>
          <Link to="/productos" className="flex flex-col items-center justify-center py-3 text-gray-700 hover:text-brand-600 transition-colors">
            <Package className="w-6 h-6" />
            <span className="text-xs mt-1">Productos</span>
          </Link>
          <button onClick={() => setOpenCart(true)} className="relative flex flex-col items-center justify-center py-3 text-gray-700 hover:text-brand-600 transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {count > 0 && <span className="absolute top-1 right-8 bg-brand-500 text-white text-[10px] rounded-full px-1.5 py-0.5">{count}</span>}
            <span className="text-xs mt-1">Carrito</span>
          </button>
        </div>
      </div>
    </div>
  )
}