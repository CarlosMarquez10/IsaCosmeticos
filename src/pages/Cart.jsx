import { useCart } from '../state/CartContext'
import { whatsappCheckout } from '../services/api'
import { Plus, Minus, Trash2 } from 'lucide-react'

export default function Cart() {
  const { items, updateQuantity, removeItem, clear, total } = useCart()

  const checkout = async () => {
    try {
      const payload = { items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })) }
      const { url } = await whatsappCheckout(payload)
      window.open(url, '_blank')
    } catch (e) {}
  }

  if (!items.length) return (
    <div className="container-max py-10">
      <h2 className="text-2xl font-bold heading-gradient">Carrito</h2>
      <p className="text-gray-600 mt-2">Tu carrito está vacío.</p>
    </div>
  )

  return (
    <div className="container-max py-10">
      <h2 className="text-2xl font-bold heading-gradient">Carrito</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {items.map(i => (
            <div key={i.id} className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4">
              {i.image && <img src={import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${i.image}` : `http://localhost:4000${i.image}`} alt={i.name} className="w-20 h-20 object-cover rounded-lg" />}
              <div className="flex-1">
                <div className="font-semibold truncate">{i.name}</div>
                <div className="text-gray-600">$ {Number(i.price).toFixed(2)}</div>
                {i?.stock !== undefined && (
                  <div className="mt-1 text-xs text-gray-600">Cantidad: {Number(i.stock)}</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(i.id, Math.max(1, Number(i.quantity) - 1))} disabled={Number(i.quantity) <= 1} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"><Minus className="w-4 h-4" /></button>
                <input type="number" min="1" max={Number(i?.stock ?? 999)} value={i.quantity} onChange={e => updateQuantity(i.id, Math.max(1, Math.min(Number(i?.stock ?? 999), Number(e.target.value))))} className="w-16 text-center rounded-lg border border-gray-300 px-2 py-1" />
                <button onClick={() => updateQuantity(i.id, Number(i.quantity) + 1)} disabled={Number(i?.stock ?? 999) <= Number(i.quantity)} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"><Plus className="w-4 h-4" /></button>
              </div>
              <button onClick={() => removeItem(i.id)} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"><Trash2 className="w-5 h-5" /></button>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-gray-200 p-5 h-fit sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold">Total</div>
            <div className="font-bold">$ {total.toFixed(2)}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={clear} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">Vaciar</button>
            <button onClick={checkout} className="inline-flex items-center justify-center rounded-lg bg-[#25D366] text-white px-4 py-2 font-medium shadow hover:bg-[#1EBE5B] transition-colors">Finalizar por WhatsApp</button>
          </div>
        </div>
      </div>
    </div>
  )
}