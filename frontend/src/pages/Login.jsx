import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser, registerUser } from '../services/api'
import { Loader2, Key, Sparkles, Shield, User } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [mode, setMode] = useState(location.state?.mode || 'login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Update mode if navigation state changes
  useEffect(() => {
    if (location.state?.mode) setMode(location.state.mode)
  }, [location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = mode === 'login'
        ? await loginUser(form.email, form.password)
        : await registerUser(form.name, form.email, form.password)
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary-300 via-accent-400 to-primary-300 bg-clip-text text-transparent mb-2">
            APTIS B2
          </h1>
          <p className="text-primary-300 text-sm">Your personal English exam study platform</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          {/* Toggle */}
          <div className="flex rounded-xl overflow-hidden mb-6 bg-white/5">
            <button
              onClick={() => { setMode('login'); setError('') }}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                mode === 'login' ? 'bg-primary-600/60 text-white' : 'text-primary-300 hover:text-white'
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => { setMode('register'); setError('') }}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                mode === 'register' ? 'bg-primary-600/60 text-white' : 'text-primary-300 hover:text-white'
              }`}
            >
              Đăng ký
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm text-primary-300 mb-1">Họ tên</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-primary-400 focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-primary-300 mb-1">Email</label>
              <input
                type="email"
                required
                placeholder="example@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-primary-400 focus:outline-none focus:border-primary-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-primary-300 mb-1">Mật khẩu</label>
              <input
                type="password"
                required
                placeholder={mode === 'register' ? 'Tối thiểu 6 ký tự' : '••••••••'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-primary-400 focus:outline-none focus:border-primary-500 transition-all"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...</> : mode === 'login' ? <><Key className="w-5 h-5" /> Đăng nhập</> : <><Sparkles className="w-5 h-5" /> Tạo tài khoản</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            {mode === 'login' ? (
              <p className="text-sm text-primary-400">
                Chưa có tài khoản?{' '}
                <button 
                  onClick={() => setMode('register')}
                  className="text-accent-400 font-bold hover:underline"
                >
                  Đăng ký ngay
                </button>
              </p>
            ) : (
              <p className="text-sm text-primary-400">
                Đã có tài khoản?{' '}
                <button 
                  onClick={() => setMode('login')}
                  className="text-primary-300 font-bold hover:underline"
                >
                  Đăng nhập
                </button>
              </p>
            )}
          </div>

          {mode === 'login' && (
            <div className="mt-4 space-y-2">
              <p className="text-center text-xs text-primary-400 font-semibold">Tài khoản có sẵn:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, email: 'admin@aptis.local', password: 'admin123' })}
                  className="p-3 rounded-xl bg-accent-500/10 border border-accent-500/20 text-xs text-center hover:bg-accent-500/20 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <div className="text-accent-400 font-bold flex items-center gap-1.5"><Shield className="w-4 h-4" /> Admin</div>
                  <div className="text-primary-400 font-medium tracking-wide">admin@aptis.local</div>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, email: 'user@aptis.local', password: 'user123' })}
                  className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20 text-xs text-center hover:bg-primary-500/20 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <div className="text-primary-300 font-bold flex items-center gap-1.5"><User className="w-4 h-4" /> User</div>
                  <div className="text-primary-400 font-medium tracking-wide">user@aptis.local</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
