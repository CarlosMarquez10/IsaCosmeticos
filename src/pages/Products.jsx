import { useEffect, useState } from 'react'
import { listProducts, listCategories } from '../services/api'
import { useSearchParams, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [categoria, setCategoria] = useState('')
  const [categories, setCategories] = useState([])
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    listProducts().then(data => { if (mounted) setItems(data) }).catch(() => setError('No se pudo cargar')).finally(() => setLoading(false))
    listCategories().then(cs => { if (mounted) setCategories(cs) }).catch(() => {})
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const cat = searchParams.get('categoria') || ''
    setCategoria(cat)
  }, [searchParams])

  const filtered = items.filter(p => (
    (!q || (p.nombre?.toLowerCase().includes(q.toLowerCase()) || p.descripcion?.toLowerCase().includes(q.toLowerCase()))) &&
    (!categoria || p.categoria === categoria)
  ))
  const isGrouped = !categoria && !q
  const byCat = new Map()
  if (isGrouped) {
    for (const p of filtered) { if (!byCat.has(p.categoria)) byCat.set(p.categoria, p) }
  }
  const display = isGrouped ? Array.from(byCat.values()) : filtered

  return (
    <div className="container-max py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
        <div>
          <h2 className="text-2xl font-bold heading-gradient">Productos</h2>
          <p className="text-gray-600">Explora nuestras categorías</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar" className="w-full sm:w-64 rounded-lg border border-gray-300 bg-white/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300" />
          <select value={categoria} onChange={e => setCategoria(e.target.value)} className="rounded-lg border border-gray-300 bg-white/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300 w-full sm:w-auto">
            <option value="">Todas</option>
            {categories.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
          </select>
        </div>
      </div>

      {loading && <div className="mt-10 text-gray-600">Cargando...</div>}
      {error && <div className="mt-10 text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {display.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              showViewAll={isGrouped}
              onViewAll={() => navigate(`/productos?categoria=${encodeURIComponent(p.categoria)}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
