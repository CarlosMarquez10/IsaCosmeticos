import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('isa_cart')) || [] } catch { return [] }
  })

  useEffect(() => { localStorage.setItem('isa_cart', JSON.stringify(items)) }, [items])

  const addItem = (product, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(p => p.id === product.id)
      if (idx >= 0) {
        const copy = [...prev]
        const max = Number(copy[idx].stock ?? product.stock ?? 999)
        const nextQty = Math.min(max, Number(copy[idx].quantity) + Number(qty))
        copy[idx] = { ...copy[idx], quantity: nextQty, stock: copy[idx].stock ?? product.stock }
        return copy
      }
      const baseQty = Math.min(Number(product.stock ?? qty), Number(qty))
      return [...prev, { id: product.id, name: product.nombre, price: product.precio, image: product.imagen_url, quantity: baseQty, stock: product.stock }]
    })
  }

  const removeItem = id => setItems(prev => prev.filter(p => p.id !== id))
  const updateQuantity = (id, qty) => setItems(prev => prev.map(p => {
    if (p.id !== id) return p
    const max = Number(p.stock ?? 999)
    const nextQty = Math.max(1, Math.min(max, Number(qty)))
    return { ...p, quantity: nextQty }
  }))
  const clear = () => setItems([])

  const total = useMemo(() => items.reduce((sum, p) => sum + Number(p.price) * Number(p.quantity), 0), [items])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() { return useContext(CartContext) }