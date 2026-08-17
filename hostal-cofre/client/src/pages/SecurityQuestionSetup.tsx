import { useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../services/api'
import { Input, Button } from '../components/ui'
import toast from 'react-hot-toast'

const DEFAULT_QUESTIONS = [
  '¿Cuál es el nombre de tu primera mascota?',
  '¿En qué ciudad naciste?',
  '¿Cuál es tu comida favorita?',
  '¿Cuál es el nombre de tu mejor amigo de la infancia?',
  '¿Cuál es tu color favorito?',
]

export default function SecurityQuestionSetup() {
  const [selectedQuestion, setSelectedQuestion] = useState('')
  const [customQuestion, setCustomQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const question = selectedQuestion === '__custom__' ? customQuestion : selectedQuestion

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question || question.length < 10) {
      toast.error('La pregunta debe tener al menos 10 caracteres')
      return
    }
    if (!answer || answer.length < 3) {
      toast.error('La respuesta debe tener al menos 3 caracteres')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/setup-security-question', { question, answer })
      setSaved(true)
      toast.success('Pregunta de seguridad configurada')
    } catch {
      toast.error('Error al configurar la pregunta de seguridad')
    } finally {
      setLoading(false)
    }
  }

  if (saved) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-xl p-6 text-center"
      >
        <div className="text-green-600 text-4xl mb-3">✓</div>
        <h3 className="font-display text-lg text-green-800 mb-2">Pregunta configurada</h3>
        <p className="text-green-600 text-sm">
          Ahora puedes recuperar tu contraseña usando tu pregunta de seguridad.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl p-6"
    >
      <h3 className="font-display text-lg mb-1">Pregunta de seguridad</h3>
      <p className="text-gray-500 text-sm mb-4">
        Configura una pregunta para recuperar tu contraseña sin email.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pregunta</label>
          <select
            value={selectedQuestion}
            onChange={(e) => setSelectedQuestion(e.target.value)}
            className="w-full rounded-lg border-gray-300 border p-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Selecciona una pregunta</option>
            {DEFAULT_QUESTIONS.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
            <option value="__custom__">Escribir mi propia pregunta</option>
          </select>
        </div>

        {selectedQuestion === '__custom__' && (
          <Input
            type="text"
            placeholder="Escribe tu pregunta (mínimo 10 caracteres)"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            required
            minLength={10}
          />
        )}

        <Input
          type="text"
          placeholder="Tu respuesta (mínimo 3 caracteres)"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          minLength={3}
        />

        <Button type="submit" size="sm" disabled={loading || !question || !answer}>
          {loading ? 'Guardando...' : 'Guardar pregunta'}
        </Button>
      </form>
    </motion.div>
  )
}
