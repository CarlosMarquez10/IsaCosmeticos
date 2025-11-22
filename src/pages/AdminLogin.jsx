import { useState, useEffect } from 'react'
import { loginAdmin, getCaptcha } from '../services/api'
import { LogIn } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [needCaptcha, setNeedCaptcha] = useState(false)
  const [captchaId, setCaptchaId] = useState('')
  const [captchaQ, setCaptchaQ] = useState('')
  const [captchaA, setCaptchaA] = useState('')

  const loadCaptcha = async () => {
    try { const c = await getCaptcha(); setCaptchaId(c.id); setCaptchaQ(c.question); setCaptchaA(''); setNeedCaptcha(true) } catch {}
  }

  const submit = async e => {
    e.preventDefault()
    setError('')
    try {
      const payload = needCaptcha ? { captcha_id: captchaId, captcha_answer: captchaA } : undefined
      const { token } = await loginAdmin(email, password, payload)
      try { sessionStorage.setItem('isa_admin_token', token) } catch {}
      try { localStorage.setItem('isa_admin_token', token) } catch {}
      window.location.href = '/admin'
    } catch (e) {
      const requireCaptcha = e?.meta?.require_captcha
      if (requireCaptcha && !needCaptcha) { await loadCaptcha() }
      setError(e?.message || 'Credenciales inválidas')
    }
  }

  return (
    <div className="container-max py-10">
      <h2 className="text-2xl font-bold heading-gradient">Acceso Admin</h2>
      <form onSubmit={submit} className="mt-6 max-w-md space-y-3">
        <input placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-brand-300" />
        <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-brand-300" />
        {needCaptcha && (
          <div className="rounded-lg border border-brand-200 bg-brand-50 p-3">
            <div className="text-sm mb-2">{captchaQ || 'Completa el desafío'}</div>
            <input placeholder="Respuesta" value={captchaA} onChange={e => setCaptchaA(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
        )}
        {error && <div className="text-red-600">{error}</div>}
        <button type="submit" className="btn-primary w-full inline-flex items-center justify-center gap-2"><LogIn className="w-4 h-4" /> Entrar</button>
      </form>
    </div>
  )
}