import { useState } from 'react'
import { useCart } from '../state/CartContext'
import { Plus } from 'lucide-react'
import ProductDetailModal from './ProductDetailModal'

export default function ProductCard({ product, showViewAll, onViewAll }) {
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
          {Number(product?.descuento_porcentaje || 0) > 0 && (
            <div className="absolute top-2 left-2 z-10 rounded-full bg-red-500 text-white text-sm font-semibold px-3 py-1 shadow">-{Number(product.descuento_porcentaje)}%</div>
          )}
        </div>
      )}
      <div className="p-4">
        <div className="font-semibold text-gray-900 truncate bg-brand-50 rounded-md px-2 py-0.5">{product.nombre}</div>
        <div className="text-sm text-gray-500">
          {product.categoria}
        </div>
        {product?.stock !== undefined && (
          <div className="mt-1 text-xs text-gray-600">Cantidad: {Number(product.stock)}</div>
        )}
        <div className="mt-2">
          {Number(product?.descuento_porcentaje || 0) > 0 ? (
            <div className="flex items-baseline gap-2">
              <div className="text-gray-500 line-through text-sm">$ {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(product.precio))}</div>
              <div className="font-bold text-gray-900">$ {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(Number(product.precio) * (100 - Number(product.descuento_porcentaje || 0)) / 100))}</div>
            </div>
          ) : (
            <div className="font-bold text-gray-900">$ {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(product.precio))}</div>
          )}
        </div>
        {showViewAll && onViewAll ? (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={onViewAll} className="btn-secondary w-auto sm:w-full">Ver todos</button>
            <button onClick={() => addItem(product, 1)} disabled={Number(product?.stock ?? 0) <= 0} className="btn-primary w-auto sm:w-full inline-flex gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><Plus className="w-4 h-4" /> Agregar</button>
          </div>
        ) : (
          <button onClick={() => addItem(product, 1)} disabled={Number(product?.stock ?? 0) <= 0} className="mt-3 btn-primary w-auto sm:w-full inline-flex gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><Plus className="w-4 h-4" /> Agregar</button>
        )}
      </div>
      <ProductDetailModal product={product} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
