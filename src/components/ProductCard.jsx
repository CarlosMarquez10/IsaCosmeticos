import { useState } from 'react'
import { useCart } from '../state/CartContext'
import { Plus } from 'lucide-react'
import ProductDetailModal from './ProductDetailModal'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [open, setOpen] = useState(false)
  return (
    <div className="card group overflow-hidden">
      {product.imagen_url && (
        <div className="relative h-40 bg-white flex items-center justify-center cursor-pointer" onClick={() => setOpen(true)}>
          <img
            src={(import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL) : 'http://localhost:4000').replace(/\/+$/, '') + String(product.imagen_url)}
            alt={product.nombre}
            className="max-h-36 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      )}
      <div className="p-4">
        <div className="font-semibold text-gray-900 truncate">{product.nombre}</div>
        <div className="text-sm text-gray-500">{product.categoria}</div>
        {product?.stock !== undefined && (
          <div className="mt-1 text-xs text-gray-600">Cantidad: {Number(product.stock)}</div>
        )}
        <div className="mt-2 font-bold text-gray-900">$ {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(product.precio))}</div>
        <button onClick={() => addItem(product, 1)} disabled={Number(product?.stock ?? 0) <= 0} className="mt-3 btn-primary w-full inline-flex gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><Plus className="w-4 h-4" /> Agregar</button>
      </div>
      <ProductDetailModal product={product} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}