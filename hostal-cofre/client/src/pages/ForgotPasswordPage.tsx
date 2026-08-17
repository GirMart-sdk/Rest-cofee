import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { api } from '../services/api'
import { Input, Button } from '../components/ui'
import toast from 'react-hot-toast'

type Step = 'email' | 'question' | 'reset'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
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
      const res = await api.post('/auth/security-question', { email })
      if (res.data.data?.hasQuestion) {
        setQuestion(res.data.data.question)
        setStep('question')
      } else {
        toast.error(t('forgotPassword.noQuestionFound'))
      }
    } catch {
      toast.error(t('forgotPassword.noQuestionFound'))
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/verify-security-answer', { email, answer })
      setResetToken(res.data.data.resetToken)
      setStep('reset')
    } catch {
      toast.error(t('forgotPassword.wrongAnswer'))
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token: resetToken, newPassword })
      toast.success(t('forgotPassword.resetSuccess'))
      navigate('/login')
    } catch {
      toast.error(t('forgotPassword.resetError'))
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
            <h1 className="text-3xl font-display mb-2">{t('forgotPassword.title')}</h1>
            <p className="text-gray-500">
              {step === 'email' && t('forgotPassword.emailStep')}
              {step === 'question' && t('forgotPassword.questionStep')}
              {step === 'reset' && t('forgotPassword.resetStep')}
            </p>
          </div>

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder={t('auth.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? t('forgotPassword.verifying') : t('forgotPassword.searchQuestion')}
              </Button>
            </form>
          )}

          {step === 'question' && (
            <form onSubmit={handleAnswerSubmit} className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">{t('forgotPassword.securityQuestion')}</p>
                <p className="font-medium text-gray-800">{question}</p>
              </div>
              <Input
                type="text"
                placeholder={t('forgotPassword.answerPlaceholder')}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
                autoFocus
              />
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? t('forgotPassword.verifying') : t('forgotPassword.verifyAnswer')}
              </Button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder={t('forgotPassword.newPasswordPlaceholder')}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? t('forgotPassword.resetting') : t('forgotPassword.resetPassword')}
              </Button>
            </form>
          )}

          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/login')}
              className="text-primary hover:underline text-sm font-semibold"
            >
              {t('forgotPassword.backToLogin')}
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
