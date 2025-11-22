import { useState, useMemo, useEffect } from 'react'
import { X, Plus, Minus } from 'lucide-react'
import { useCart } from '../state/CartContext'
import { getProduct } from '../services/api'

export default function ProductDetailModal({ product, open, onClose }) {
  const { addItem } = useCart()
  const [current, setCurrent] = useState(0)
  const [qty, setQty] = useState(1)
  const [info, setInfo] = useState(product)
  const base = (import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL) : 'http://localhost:4002').replace(/\/+$/, '')
  useEffect(() => { setInfo(product) }, [product])
  useEffect(() => {
    let active = true
    const load = async () => {
      if (!open || !product?.id) return
      try { const data = await getProduct(product.id); if (active) setInfo(data) } catch {}
    }
    load()
    return () => { active = false }
  }, [open, product])
  const images = useMemo(() => {
    const arr = Array.isArray(info?.imagenes) ? info.imagenes : [info?.imagen_url].filter(Boolean)
    return arr.map(p => (p?.startsWith('http') ? p : `${base}${p}`))
  }, [info, base])
  const price = Number(info?.precio || info?.price || 0)

  const inc = () => setQty(q => Math.min(Number(info?.stock ?? 999), q + 1))
  const dec = () => setQty(q => Math.max(1, q - 1))
  const add = () => addItem(product, qty)

  if (!open) return null

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>
      <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 my-6 w-[95%] sm:w-[800px] bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200 flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-brand-200 bg-brand-50">
          <div className="font-semibold truncate">{info?.nombre || info?.name}</div>
          <button onClick={onClose} className="p-2 rounded-lg border border-brand-300 hover:bg-brand-100 transition drop-shadow-[0_2px_6px_rgba(239,68,68,0.35)]"><X className="w-5 h-5" /></button>
        </div>
        <div className="grid sm:grid-cols-2 gap-0 overflow-y-auto scrollbar-rose">
          <div className="bg-white p-4 sm:p-6">
            <div className="aspect-square w-full bg-brand-50 rounded-xl flex items-center justify-center overflow-hidden drop-shadow-[0_4px_10px_rgba(233,30,99,0.25)] p-4 sm:p-6">
              {images[current] && (
                <img src={images[current]} alt={info?.nombre} className="max-h-full max-w-full object-contain img-soft-edges-md" />
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {images.map((src, idx) => (
                  <button key={idx} onClick={() => setCurrent(idx)} className={`h-16 rounded-lg border ${current === idx ? 'border-brand-500 ring-2 ring-brand-200' : 'border-gray-200'} bg-white flex items-center justify-center overflow-hidden`}>
                    <img src={src} alt="thumb" className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="p-4 sm:p-6 space-y-4 bg-brand-50/40">
            <div className="text-sm text-gray-500">{info?.categoria}</div>
            {info?.stock !== undefined && (
              <div className="text-xs text-gray-600">Cantidad: {Number(info.stock)}</div>
            )}
            <div className="text-2xl font-bold text-gray-900">$ {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(price)}</div>
            {info?.descripcion && <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">{info.descripcion}</div>}
            <div className="flex items-center gap-2">
              <button onClick={dec} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"><Minus className="w-4 h-4" /></button>
              <input type="number" min="1" max={Number(info?.stock ?? 999)} value={qty} onChange={e => setQty(Math.max(1, Math.min(Number(info?.stock ?? 999), Number(e.target.value))))} className="w-16 text-center rounded-lg border border-gray-300 px-2 py-1" />
              <button onClick={inc} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={add} disabled={Number(info?.stock ?? 0) <= 0} className="inline-flex items-center justify-center rounded-lg bg-brand-500 text-white px-4 py-2 font-medium shadow hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Agregar al carrito</button>
              <button onClick={onClose} className="rounded-lg border border-brand-300 px-4 py-2 hover:bg-brand-100 hover:border-brand-400 transition">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}