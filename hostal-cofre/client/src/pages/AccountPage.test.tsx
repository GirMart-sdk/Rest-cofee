import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AccountPage from './AccountPage'

const apiMock = vi.hoisted(() => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

vi.mock('../services/api', () => apiMock)

const toastMock = vi.hoisted(() => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('react-hot-toast', () => ({ __esModule: true, default: toastMock.toast }))

const authMock = vi.hoisted(() => ({
  useAuth: { user: { id: 'u1', name: 'Ana', email: 'ana@x.com', role: 'client' as const } },
}))

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: authMock.useAuth.user,
    logout: vi.fn(),
  }),
}))

function renderPage() {
  return render(<AccountPage />)
}

describe('AccountPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiMock.api.get.mockResolvedValue({ data: { data: { enabled: false } } })
  })

  it('renders the account sections', async () => {
    renderPage()
    expect(screen.getByText('Mi Cuenta')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cambiar Contraseña' })).toBeInTheDocument()
    expect(screen.getByText('Autenticación de Dos Pasos (2FA)')).toBeInTheDocument()
    await waitFor(() => expect(apiMock.api.get).toHaveBeenCalledWith('/auth/2fa/status'))
  })

  it('changes the password and logs the user out', async () => {
    apiMock.api.post.mockResolvedValue({ data: { success: true } })
    renderPage()

    fireEvent.change(screen.getByLabelText('Contraseña actual'), {
      target: { value: 'OldPass!1' },
    })
    fireEvent.change(screen.getByLabelText('Nueva contraseña'), {
      target: { value: 'NewPass!2' },
    })
    fireEvent.change(screen.getByLabelText('Confirmar nueva contraseña'), {
      target: { value: 'NewPass!2' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Cambiar Contraseña' }))

    await waitFor(() =>
      expect(apiMock.api.post).toHaveBeenCalledWith('/auth/change-password', {
        currentPassword: 'OldPass!1',
        newPassword: 'NewPass!2',
      }),
    )
    expect(toastMock.toast.success).toHaveBeenCalledWith(
      'Contraseña actualizada. Vuelve a iniciar sesión.',
    )
  })

  it('rejects a password that does not match the confirmation', async () => {
    renderPage()
    fireEvent.change(screen.getByLabelText('Contraseña actual'), {
      target: { value: 'OldPass!1' },
    })
    fireEvent.change(screen.getByLabelText('Nueva contraseña'), {
      target: { value: 'NewPass!2' },
    })
    fireEvent.change(screen.getByLabelText('Confirmar nueva contraseña'), {
      target: { value: 'Different1!' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Cambiar Contraseña' }))
    expect(toastMock.toast.error).toHaveBeenCalledWith('Las contraseñas no coinciden')
    expect(apiMock.api.post).not.toHaveBeenCalled()
  })

  it('sets up and enables 2FA with a valid code', async () => {
    apiMock.api.get.mockResolvedValueOnce({ data: { data: { enabled: false } } })
    apiMock.api.get.mockResolvedValueOnce({
      data: { data: { secret: 'SECRET123', otpauthUrl: 'otpauth://totp/test' } },
    })
    apiMock.api.post.mockResolvedValue({ data: { success: true } })
    renderPage()

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Configurar 2FA' })).toBeInTheDocument(),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Configurar 2FA' }))

    await waitFor(() => expect(screen.getByText('SECRET123')).toBeInTheDocument())
    fireEvent.change(screen.getByLabelText('Código de 6 dígitos'), {
      target: { value: '123456' },
    })
    fireEvent.change(screen.getAllByLabelText('Contraseña actual')[1], {
      target: { value: 'Pass!123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Activar 2FA' }))

    await waitFor(() =>
      expect(apiMock.api.post).toHaveBeenCalledWith('/auth/2fa/enable', {
        code: '123456',
        password: 'Pass!123',
      }),
    )
    expect(toastMock.toast.success).toHaveBeenCalledWith('Autenticación de dos pasos activada')
  })

  it('disables 2FA with a valid code', async () => {
    apiMock.api.get.mockResolvedValue({ data: { data: { enabled: true } } })
    apiMock.api.post.mockResolvedValue({ data: { success: true } })
    renderPage()

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Desactivar 2FA' })).toBeInTheDocument(),
    )
    fireEvent.change(screen.getByLabelText('Código de 6 dígitos'), {
      target: { value: '123456' },
    })
    fireEvent.change(screen.getAllByLabelText('Contraseña actual')[1], {
      target: { value: 'Pass!123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Desactivar 2FA' }))

    await waitFor(() =>
      expect(apiMock.api.post).toHaveBeenCalledWith('/auth/2fa/disable', {
        code: '123456',
        password: 'Pass!123',
      }),
    )
    expect(toastMock.toast.success).toHaveBeenCalledWith('Autenticación de dos pasos desactivada')
  })
})
