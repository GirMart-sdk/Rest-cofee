import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Input, Button } from '../components/ui'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const {
    login,
    register,
    verifyTwoFactor,
    cancelTwoFactor,
    twoFactorPending,
    authError,
    clearAuthError,
  } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let success: boolean
    if (twoFactorPending) {
      success = await verifyTwoFactor(code)
    } else if (isRegister) {
      success = await register(name, email, password)
    } else {
      success = await login(email, password)
    }

    setLoading(false)
    if (success) {
      toast.success(isRegister ? '¡Cuenta creada!' : '¡Bienvenido!')
      navigate('/')
    } else if (twoFactorPending) {
      toast.error(authError || 'Código de verificación incorrecto')
    } else {
      toast.error(authError || 'Credenciales incorrectas')
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
              {twoFactorPending
                ? 'Código de verificación'
                : isRegister
                  ? 'Crear Cuenta'
                  : 'Iniciar Sesión'}
            </h1>
            <p className="text-gray-500">
              {twoFactorPending
                ? 'Ingresa el código de 6 dígitos de tu app de autenticación'
                : isRegister
                  ? 'Regístrate para hacer pedidos'
                  : 'Accede a tu cuenta'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {twoFactorPending ? (
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Código (6 dígitos)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                autoFocus
              />
            ) : (
              <>
                {isRegister && (
                  <Input
                    type="text"
                    placeholder="Nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                )}
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading
                ? 'Procesando...'
                : twoFactorPending
                  ? 'Verificar'
                  : isRegister
                    ? 'Crear Cuenta'
                    : 'Iniciar Sesión'}
            </Button>
          </form>

          {!twoFactorPending && (
            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setIsRegister(!isRegister)
                  clearAuthError?.()
                }}
                className="text-primary hover:underline font-semibold"
              >
                {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
              </button>
            </div>
          )}
          {twoFactorPending && (
            <div className="text-center mt-6">
              <button
                onClick={() => {
                  cancelTwoFactor()
                  setCode('')
                }}
                className="text-gray-500 hover:underline text-sm font-semibold"
              >
                Usar otra cuenta
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  )
}
