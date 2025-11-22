import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import MobileBottomNav from './components/MobileBottomNav'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'

export default function App() {
  const [openCart, setOpenCart] = useState(false)
  return (
    <div className="min-h-screen flex flex-col">
      <Header openCart={openCart} setOpenCart={setOpenCart} />
      <main className="flex-1 pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
      <Footer />
      <MobileBottomNav setOpenCart={setOpenCart} />
    </div>
  )
}