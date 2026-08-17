import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Input, Button } from '../components/ui'
import toast from 'react-hot-toast'

type Step = 'email' | 'question' | 'reset'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/security-question', { email })
      if (res.data.data?.hasQuestion) {
        setQuestion(res.data.data.question)
        setStep('question')
      } else {
        toast.error('No se encontró una pregunta de seguridad para este email')
      }
    } catch {
      toast.error('No se encontró una pregunta de seguridad para este email')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/verify-security-answer', { email, answer })
      setResetToken(res.data.data.resetToken)
      setStep('reset')
    } catch {
      toast.error('Respuesta incorrecta')
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/auth/reset-password', { token: resetToken, newPassword })
      toast.success('Contraseña restablecida. Inicia sesión con tu nueva contraseña.')
      navigate('/login')
    } catch {
      toast.error('Error al restablecer la contraseña')
    } finally {
      setLoading(false)
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
            <h1 className="text-3xl font-display mb-2">Recuperar contraseña</h1>
            <p className="text-gray-500">
              {step === 'email' && 'Ingresa tu email para verificar tu pregunta de seguridad'}
              {step === 'question' && 'Responde tu pregunta de seguridad'}
              {step === 'reset' && 'Ingresa tu nueva contraseña'}
            </p>
          </div>

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Verificando...' : 'Buscar pregunta de seguridad'}
              </Button>
            </form>
          )}

          {step === 'question' && (
            <form onSubmit={handleAnswerSubmit} className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Tu pregunta:</p>
                <p className="font-medium text-gray-800">{question}</p>
              </div>
              <Input
                type="text"
                placeholder="Tu respuesta"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
                autoFocus
              />
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Verificando...' : 'Verificar respuesta'}
              </Button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Nueva contraseña (mínimo 8 caracteres)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
              </Button>
            </form>
          )}

          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/login')}
              className="text-primary hover:underline text-sm font-semibold"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
