import { useEffect, useState } from 'react'
import { createProduct, deleteProduct, listProducts, updateProduct, getProduct, removeProductImage, setMainProductImage, listCategories, createCategory, deleteCategory } from '../services/api'
import { Pencil, Trash2, Loader2 } from 'lucide-react'

export default function AdminDashboard() {
  const token = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('isa_admin_token')) || (typeof localStorage !== 'undefined' && localStorage.getItem('isa_admin_token'))
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ nombre: '', descripcion: '', categoria: '', precio: '', stock: '', descuento: 0 })
  const [files, setFiles] = useState([null, null, null, null, null])
  const [editing, setEditing] = useState(null)
  const [categories, setCategories] = useState([])
  const [newCat, setNewCat] = useState('')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const validateForm = () => {
    const errs = {}
    if (!String(form.nombre || '').trim()) errs.nombre = 'Nombre requerido'
    if (!String(form.categoria || '').trim()) errs.categoria = 'Categoría requerida'
    const precioN = Number(form.precio)
    if (!precioN || precioN <= 0) errs.precio = 'Precio debe ser mayor a 0'
    const stockN = Number(form.stock)
    if (Number.isNaN(stockN) || stockN < 0) errs.stock = 'Stock debe ser 0 o más'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const load = async () => {
    const data = await listProducts()
    setItems(data)
  }

  const loadCategories = async () => {
    try { const cats = await listCategories(); setCategories(cats) } catch {}
  }

useEffect(() => { load(); loadCategories() }, [])

  const submit = async e => {
    e.preventDefault()
    setSubmitError('')
    const ok = validateForm()
    if (!ok) return
    setSaving(true)
    try {
      const payload = { ...form }
      const arr = files.filter(Boolean).slice(0, 5)
      if (arr.length) {
        payload.imagen = arr[0]
        payload.imagenes = arr
      }
      if (editing) {
        await updateProduct(token, editing.id, payload)
      } else {
        await createProduct(token, payload)
      }
    setForm({ nombre: '', descripcion: '', categoria: '', precio: '', stock: '', descuento: 0 })
      setFiles([null, null, null, null, null])
      setEditing(null)
      await load()
    } catch (e) {
      setSubmitError(e?.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const edit = async item => {
    const data = await getProduct(item.id)
    setEditing(data)
    setForm({ nombre: data.nombre, descripcion: data.descripcion, categoria: data.categoria, precio: data.precio, stock: data.stock, descuento: Number(data.descuento_porcentaje || 0) })
    setFiles([null, null, null, null, null])
  }

  const remove = async id => { await deleteProduct(token, id); await load() }

  const removeImage = async url => {
    if (!editing) return
    await removeProductImage(token, editing.id, url)
    const data = await getProduct(editing.id)
    setEditing(data)
  }

  const makeMain = async url => {
    if (!editing) return
    await setMainProductImage(token, editing.id, url)
    const data = await getProduct(editing.id)
    setEditing(data)
  }

  return (
    <div className="container-max py-10">
      <h2 className="text-2xl font-bold heading-gradient">Panel Admin</h2>
      <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl">
        <input placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-brand-300" />
        {errors.nombre && <div className="text-xs text-red-600">{errors.nombre}</div>}
        <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} className="rounded-lg border border-gray-300 bg-white/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300">
          <option value="">Selecciona categoría</option>
          {categories.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
        </select>
        {errors.categoria && <div className="text-xs text-red-600">{errors.categoria}</div>}
        <textarea placeholder="Descripción" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} className="md:col-span-2 rounded-lg border border-gray-300 px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-brand-300" />
        <input placeholder="Precio" type="number" step="0.01" min="0.01" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-brand-300" />
        {errors.precio && <div className="text-xs text-red-600">{errors.precio}</div>}
        <input placeholder="Stock" type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-brand-300" />
        {errors.stock && <div className="text-xs text-red-600">{errors.stock}</div>}
        <div className="flex flex-col gap-1">
          <div className="text-xs text-gray-600">Descuento a aplicar (%)</div>
          <input placeholder="Ej: 10 para 10%" type="number" min="0" max="100" value={form.descuento} onChange={e => setForm(f => ({ ...f, descuento: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-brand-300" />
          <div className="text-[11px] text-gray-500">Ingresa un número entre 0 y 100</div>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <input type="file" onChange={e => setFiles(prev => { const n=[...prev]; n[0]=e.target.files[0]||null; return n })} className="rounded-lg border border-gray-300 px-3 py-2 bg-white/70" placeholder="Imagen 1" />
          <input type="file" onChange={e => setFiles(prev => { const n=[...prev]; n[1]=e.target.files[0]||null; return n })} className="rounded-lg border border-gray-300 px-3 py-2 bg-white/70" placeholder="Imagen 2" />
          <input type="file" onChange={e => setFiles(prev => { const n=[...prev]; n[2]=e.target.files[0]||null; return n })} className="rounded-lg border border-gray-300 px-3 py-2 bg-white/70" placeholder="Imagen 3" />
          <input type="file" onChange={e => setFiles(prev => { const n=[...prev]; n[3]=e.target.files[0]||null; return n })} className="rounded-lg border border-gray-300 px-3 py-2 bg-white/70" placeholder="Imagen 4" />
          <input type="file" onChange={e => setFiles(prev => { const n=[...prev]; n[4]=e.target.files[0]||null; return n })} className="rounded-lg border border-gray-300 px-3 py-2 bg-white/70" placeholder="Imagen 5" />
        </div>
        {editing && editing.imagenes && editing.imagenes.length > 0 && (
          <div className="md:col-span-2">
            <div className="text-sm font-semibold mb-2">Imágenes del producto</div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {editing.imagenes.map((u, idx) => (
                <div key={idx} className={`rounded-lg border ${editing.imagen_url === u ? 'border-brand-500 ring-2 ring-brand-200' : 'border-gray-200'} p-2 bg-white flex flex-col items-center gap-2`}>
                  <img src={`${(import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL) : 'http://localhost:4002').replace(/\/+$/, '')}${u}`} alt="img" className="h-20 object-contain" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => makeMain(u)} className="px-2 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-xs">Principal</button>
                    <button type="button" onClick={() => removeImage(u)} className="px-2 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition text-xs">Quitar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {submitError && <div className="md:col-span-2 text-sm text-red-600">{submitError}</div>}
        <button type="submit" disabled={saving} className="md:col-span-2 btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">{saving ? (<><Loader2 className="w-4 h-4 animate-spin" /> {editing ? 'Guardando...' : 'Creando...'}</>) : (editing ? 'Guardar cambios' : 'Crear producto')}</button>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-semibold">Categorías</h3>
        <div className="mt-3 flex gap-3">
          <input placeholder="Nueva categoría" value={newCat} onChange={e => setNewCat(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-brand-300" />
          <button type="button" onClick={async () => { if (!newCat.trim()) return; await createCategory(token, newCat.trim()); setNewCat(''); await loadCategories() }} className="btn-primary">Agregar</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map(c => (
            <div key={c.id} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1 bg-white">
              <span className="text-sm">{c.nombre}</span>
              <button type="button" onClick={async () => { await deleteCategory(token, c.id); await loadCategories() }} className="text-xs px-2 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">Eliminar</button>
            </div>
          ))}
        </div>
      </div>

      <h3 className="mt-8 text-lg font-semibold">Productos</h3>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(it => (
          <div key={it.id} className="card p-4">
            <div className="font-semibold">{it.nombre}</div>
            <div className="text-sm text-gray-600">{it.categoria}</div>
            <div className="mt-2">
              {Number(it.descuento_porcentaje || 0) > 0 ? (
                <div className="flex items-baseline gap-2">
                  <div className="text-gray-500 line-through text-sm">$ {Number(it.precio).toFixed(2)}</div>
                  <div className="font-bold text-gray-900">$ {Number((Number(it.precio) * (100 - Number(it.descuento_porcentaje || 0)) / 100)).toFixed(2)}</div>
                  <div className="text-xs text-green-700">-{Number(it.descuento_porcentaje)}%</div>
                </div>
              ) : (
                <div className="font-bold text-gray-900">$ {Number(it.precio).toFixed(2)}</div>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => edit(it)} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition inline-flex items-center gap-2"><Pencil className="w-4 h-4" /> Editar</button>
              <button onClick={() => remove(it.id)} className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition inline-flex items-center gap-2"><Trash2 className="w-4 h-4" /> Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
