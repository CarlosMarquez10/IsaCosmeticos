import { useState, useEffect } from 'react'
import { useCart } from '../state/CartContext'
import { whatsappCheckout } from '../services/api'
import { X, Trash2, Plus, Minus } from 'lucide-react'

export default function CartDrawer({ open, onClose }) {
  const { items, updateQuantity, removeItem, clear, total } = useCart()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try { document.body.style.overflow = open ? 'hidden' : 'auto' } catch {}
    return () => { try { document.body.style.overflow = 'auto' } catch {} }
  }, [open])

  const checkout = async () => {
    if (!items.length) return
    setLoading(true)
    try {
      const payload = { items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })) }
      const { url } = await whatsappCheckout(payload)
      window.open(url, '_blank')
    } catch {}
    setLoading(false)
  }

  if (!open) return null

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>
      <div className={`absolute right-0 top-0 h-full w-full sm:w-[440px] bg-white shadow-2xl ring-1 ring-gray-200 rounded-l-2xl transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-200 bg-gradient-to-r from-brand-200/80 via-brand-100/60 to-[#FAF7F2] flex-shrink-0 text-brand-800">
          <div className="font-semibold">Tu carrito</div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-brand-100 transition"><X className="w-5 h-5" /></button>
        </div>
        {!items.length ? (
          <div className="p-6 text-gray-600">Tu carrito está vacío.</div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 space-y-3 min-h-[220px] max-h-[60vh] bg-gradient-to-b from-brand-50/30 via-brand-50/20 to-[#FAF7F2]">
              {items.map(i => (
                <div key={i.id} className="py-3 px-4 rounded-xl border border-brand-200 bg-white/80">
                  <div className="flex items-start gap-3">
                    {i.image && (
                      <img
                        src={import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${i.image}` : `http://localhost:4000${i.image}`}
                        alt={i.name}
                        className="w-16 h-16 object-contain rounded-xl bg-brand-50/30 p-1 drop-shadow-[0_4px_10px_rgba(233,30,99,0.25)] img-soft-edges"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium truncate">{i.name}</div>
                      <div className="text-sm text-gray-600">$ {Number(i.price).toFixed(2)}</div>
                      {i?.stock !== undefined && (
                        <div className="mt-1 text-xs text-gray-600">Cantidad: {Number(i.stock)}</div>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <button onClick={() => updateQuantity(i.id, Math.max(1, Number(i.quantity) - 1))} disabled={Number(i.quantity) <= 1} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"><Minus className="w-4 h-4" /></button>
                        <input type="number" min="1" max={Number(i?.stock ?? 999)} value={i.quantity} onChange={e => updateQuantity(i.id, Math.max(1, Math.min(Number(i?.stock ?? 999), Number(e.target.value))))} className="w-16 text-center rounded-lg border border-gray-300 px-2 py-1" />
                        <button onClick={() => updateQuantity(i.id, Number(i.quantity) + 1)} disabled={Number(i?.stock ?? 999) <= Number(i.quantity)} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button onClick={() => removeItem(i.id)} className="p-2 rounded-lg hover:bg-gray-100 transition drop-shadow-[0_2px_6px_rgba(239,68,68,0.35)]"><Trash2 className="w-5 h-5 text-gray-600" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-brand-200 px-6 py-4 flex-shrink-0 bg-gradient-to-r from-brand-50 via-brand-100/40 to-[#FAF7F2]">
              <div className="flex items-start justify-between">
                <div className="text-sm">
                  <span className="font-semibold">Subtotal</span>
                  <span className="text-gray-500"> (sin envío)</span>
                </div>
                <div className="text-right font-semibold text-lg">$ {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(total)}</div>
              </div>
              <div className="mt-4 flex justify-around gap-3">
                <button onClick={clear} className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-700 underline border border-gray-300 rounded-lg bg-white hover:bg-brand-100 hover:border-brand-300 hover:text-brand-700 transition-colors"><Trash2 className="w-4 h-4" /> Vaciar</button>
                <button onClick={checkout} disabled={loading} aria-label="Finalizar por WhatsApp" className="inline-flex items-center gap-2 justify-center rounded-lg bg-[#25D366] text-white px-4 py-2 font-medium shadow hover:bg-[#1EBE5B] transition-colors disabled:opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                  </svg>
                  Finalizar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}