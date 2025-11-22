const API_URL = ((import.meta.env.VITE_API_URL) ? String(import.meta.env.VITE_API_URL) : 'http://localhost:4000').replace(/\/+$/, '')

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, options)
  let data = null
  try { data = await res.json() } catch { data = null }
  if (!res.ok) {
    const err = new Error((data && data.error) || 'Error de red')
    err.meta = data || {}
    throw err
  }
  return data
}

export const listProducts = async (params = {}) => {
  const q = new URLSearchParams(params).toString()
  return request(`/api/products${q ? `?${q}` : ''}`)
}

export const getProduct = id => request(`/api/products/${id}`)

export const loginAdmin = async (email, password, captcha) => {
  return request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, ...(captcha || {}) })
  })
}

export const createProduct = async (token, data) => {
  const form = new FormData()
  Object.entries(data).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    if (Array.isArray(v)) v.forEach(it => form.append(k, it))
    else if (typeof v === 'object' && 'length' in v && typeof v.length === 'number') {
      for (let i = 0; i < v.length; i++) form.append(k, v[i])
    } else form.append(k, v)
  })
  return request('/api/products', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form
  })
}

export const updateProduct = async (token, id, data) => {
  const form = new FormData()
  Object.entries(data).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    if (Array.isArray(v)) v.forEach(it => form.append(k, it))
    else if (typeof v === 'object' && 'length' in v && typeof v.length === 'number') {
      for (let i = 0; i < v.length; i++) form.append(k, v[i])
    } else form.append(k, v)
  })
  return request(`/api/products/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: form
  })
}

export const deleteProduct = async (token, id) => {
  return request(`/api/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const whatsappCheckout = async (payload) => {
  return request('/api/checkout/whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

// duplicate removed

export const removeProductImage = async (token, id, url) => {
  return request(`/api/products/${id}/images/remove`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ url })
  })
}

export const setMainProductImage = async (token, id, url) => {
  return request(`/api/products/${id}/images/main`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ url })
  })
}

export const getCaptcha = async () => request('/api/auth/captcha')
export const listCategories = async () => request('/api/categories')
export const createCategory = async (token, nombre) => {
  return request('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ nombre })
  })
}
export const deleteCategory = async (token, id) => {
  return request(`/api/categories/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const bootstrapAdmin = async (email, password) => {
  return request('/api/auth/bootstrap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
}

export const createUser = async (token, email, password, role = 'admin') => {
  return request('/api/auth/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ email, password, role })
  })
}