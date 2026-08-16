import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Card, Button, Input } from '../components/ui'
import toast from 'react-hot-toast'

export default function AccountPage() {
  const { user, logout } = useAuth()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean | null>(null)
  const [setupSecret, setSetupSecret] = useState<{ secret: string; otpauthUrl: string } | null>(
    null,
  )
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [twoFactorPassword, setTwoFactorPassword] = useState('')
  const [twoFactorBusy, setTwoFactorBusy] = useState(false)

  const loadTwoFactorStatus = useCallback(async () => {
    try {
      const res = await api.get('/auth/2fa/status')
      setTwoFactorEnabled(res.data.data.enabled)
    } catch {
      setTwoFactorEnabled(false)
    }
  }, [])

  useEffect(() => {
    loadTwoFactorStatus()
  }, [loadTwoFactorStatus])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      toast.error('La nueva contraseña debe tener al menos 8 caracteres')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    setChangingPassword(true)
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword })
      toast.success('Contraseña actualizada. Vuelve a iniciar sesión.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      logout()
    } catch {
      toast.error('No se pudo cambiar la contraseña. Verifica la contraseña actual.')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleTwoFactorSetup = async () => {
    setTwoFactorBusy(true)
    try {
      const res = await api.get('/auth/2fa/setup')
      setSetupSecret(res.data.data)
    } catch {
      toast.error('No se pudo iniciar la configuración de 2FA')
    } finally {
      setTwoFactorBusy(false)
    }
  }

  const handleTwoFactorEnable = async () => {
    if (!twoFactorCode || !twoFactorPassword) {
      toast.error('Ingresa el código y tu contraseña actual')
      return
    }
    setTwoFactorBusy(true)
    try {
      await api.post('/auth/2fa/enable', { code: twoFactorCode, password: twoFactorPassword })
      toast.success('Autenticación de dos pasos activada')
      setTwoFactorEnabled(true)
      setSetupSecret(null)
      setTwoFactorCode('')
      setTwoFactorPassword('')
    } catch {
      toast.error('No se pudo activar 2FA. Revisa el código y la contraseña.')
    } finally {
      setTwoFactorBusy(false)
    }
  }

  const handleTwoFactorDisable = async () => {
    if (!twoFactorCode || !twoFactorPassword) {
      toast.error('Ingresa el código y tu contraseña actual')
      return
    }
    setTwoFactorBusy(true)
    try {
      await api.post('/auth/2fa/disable', { code: twoFactorCode, password: twoFactorPassword })
      toast.success('Autenticación de dos pasos desactivada')
      setTwoFactorEnabled(false)
      setTwoFactorCode('')
      setTwoFactorPassword('')
    } catch {
      toast.error('No se pudo desactivar 2FA. Revisa el código y la contraseña.')
    } finally {
      setTwoFactorBusy(false)
    }
  }

  return (
    <section className="section-padding pt-28 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-display mb-1">Mi Cuenta</h1>
        <p className="text-gray-500 mb-8">{user ? `${user.name} · ${user.email}` : ''}</p>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cambiar Contraseña</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              type="password"
              label="Contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Nueva contraseña"
              placeholder="Mínimo 8 caracteres con mayúscula, número y símbolo"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={changingPassword}>
              {changingPassword ? 'Guardando...' : 'Cambiar Contraseña'}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Autenticación de Dos Pasos (2FA)</h2>
            {twoFactorEnabled !== null && (
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {twoFactorEnabled ? 'Activado' : 'Desactivado'}
              </span>
            )}
          </div>

          {!twoFactorEnabled && !setupSecret && (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Protege tu cuenta requiriendo un código de tu app de autenticación al iniciar
                sesión.
              </p>
              <Button onClick={handleTwoFactorSetup} disabled={twoFactorBusy}>
                {twoFactorBusy ? 'Cargando...' : 'Configurar 2FA'}
              </Button>
            </div>
          )}

          {setupSecret && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">
                  Escanea el código QR en tu app de autenticación (Google Authenticator, Authy…) o
                  ingresa la clave manualmente:
                </p>
                {setupSecret.otpauthUrl.includes('otpauth://') && (
                  <div className="flex justify-center mb-3">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(setupSecret.otpauthUrl)}`}
                      alt="Código QR para configurar 2FA"
                      className="w-48 h-48"
                    />
                  </div>
                )}
                <code className="block text-center text-xs bg-white rounded border px-3 py-2 select-all">
                  {setupSecret.secret}
                </code>
              </div>
              <Input
                type="text"
                inputMode="numeric"
                label="Código de 6 dígitos"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                required
              />
              <Input
                type="password"
                label="Contraseña actual"
                value={twoFactorPassword}
                onChange={(e) => setTwoFactorPassword(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <Button onClick={handleTwoFactorEnable} disabled={twoFactorBusy}>
                  {twoFactorBusy ? 'Activando...' : 'Activar 2FA'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSetupSecret(null)
                    setTwoFactorCode('')
                    setTwoFactorPassword('')
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {twoFactorEnabled && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Tu cuenta está protegida con 2FA. Para desactivarla ingresa un código válido y tu
                contraseña actual.
              </p>
              <Input
                type="text"
                inputMode="numeric"
                label="Código de 6 dígitos"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                required
              />
              <Input
                type="password"
                label="Contraseña actual"
                value={twoFactorPassword}
                onChange={(e) => setTwoFactorPassword(e.target.value)}
                required
              />
              <Button variant="danger" onClick={handleTwoFactorDisable} disabled={twoFactorBusy}>
                {twoFactorBusy ? 'Desactivando...' : 'Desactivar 2FA'}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
