import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let success: boolean
    if (isRegister) {
      success = await register(name, email, password)
    } else {
      success = await login(email, password)
    }

    setLoading(false)
    if (success) {
      toast.success(isRegister ? '¡Cuenta creada!' : '¡Bienvenido!')
      navigate('/')
    } else {
      toast.error('Credenciales incorrectas')
    }
  }

  return (
    <section className="section-padding pt-28 min-h-screen flex items-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display mb-2">
              {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h1>
            <p className="text-gray-500">
              {isRegister ? 'Regístrate para hacer pedidos' : 'Accede a tu cuenta'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
              minLength={6}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg disabled:opacity-50"
            >
              {loading ? 'Procesando...' : isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary hover:underline font-semibold"
            >
              {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
