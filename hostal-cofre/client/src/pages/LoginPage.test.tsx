import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from './LoginPage'

const authMock = vi.hoisted(() => ({
  useAuth: vi.fn(),
}))

vi.mock('../context/AuthContext', () => authMock)

const navigateMock = vi.hoisted(() => vi.fn())

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

const toastMock = vi.hoisted(() => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('react-hot-toast', () => ({ __esModule: true, default: toastMock.toast }))

function renderPage() {
  return render(<LoginPage />)
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authMock.useAuth.mockReturnValue({ login: vi.fn(), register: vi.fn() })
  })

  it('renders the login form', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument()
  })

  it('logs in successfully and navigates home', async () => {
    const login = vi.fn().mockResolvedValue(true)
    authMock.useAuth.mockReturnValue({ login, register: vi.fn() })
    renderPage()

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'Pass!123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }))

    await waitFor(() => expect(login).toHaveBeenCalledWith('a@b.com', 'Pass!123'))
    expect(toastMock.toast.success).toHaveBeenCalledWith('¡Bienvenido!')
    expect(navigateMock).toHaveBeenCalledWith('/')
  })

  it('shows an error toast when the credentials are wrong', async () => {
    const login = vi.fn().mockResolvedValue(false)
    authMock.useAuth.mockReturnValue({ login, register: vi.fn() })
    renderPage()

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }))

    await waitFor(() =>
      expect(toastMock.toast.error).toHaveBeenCalledWith('Credenciales incorrectas'),
    )
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('registers a new account', async () => {
    const register = vi.fn().mockResolvedValue(true)
    authMock.useAuth.mockReturnValue({ login: vi.fn(), register })
    renderPage()

    fireEvent.click(screen.getByText('¿No tienes cuenta? Regístrate'))
    expect(screen.getByRole('heading', { name: 'Crear Cuenta' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Nombre completo')).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('Nombre completo'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'Pass!123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Crear Cuenta' }))

    await waitFor(() => expect(register).toHaveBeenCalledWith('Ana', 'a@b.com', 'Pass!123'))
    expect(toastMock.toast.success).toHaveBeenCalledWith('¡Cuenta creada!')
    expect(navigateMock).toHaveBeenCalledWith('/')
  })

  it('disables the button while the request is in flight', async () => {
    let resolveLogin!: (ok: boolean) => void
    const login = vi.fn(
      () =>
        new Promise<boolean>((resolve) => {
          resolveLogin = resolve
        }),
    )
    authMock.useAuth.mockReturnValue({ login, register: vi.fn() })
    renderPage()

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'Pass!123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }))

    const button = await screen.findByRole('button', { name: 'Procesando...' })
    expect(button).toBeDisabled()

    resolveLogin(true)
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument(),
    )
  })

  it('shows the 2FA code step and completes login with a valid code', async () => {
    const login = vi.fn().mockResolvedValue(false)
    const verifyTwoFactor = vi.fn().mockResolvedValue(true)
    const cancelTwoFactor = vi.fn()
    authMock.useAuth.mockReturnValue({
      login,
      register: vi.fn(),
      verifyTwoFactor,
      cancelTwoFactor,
      twoFactorPending: 'pt-1',
      authError: null,
    })
    renderPage()

    expect(screen.getByRole('heading', { name: 'Código de verificación' })).toBeInTheDocument()
    fireEvent.change(screen.getByPlaceholderText('Código (6 dígitos)'), {
      target: { value: '123456' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Verificar' }))

    await waitFor(() => expect(verifyTwoFactor).toHaveBeenCalledWith('123456'))
    expect(toastMock.toast.success).toHaveBeenCalledWith('¡Bienvenido!')
    expect(navigateMock).toHaveBeenCalledWith('/')
  })

  it('shows the 2FA error message when the code is wrong', async () => {
    const verifyTwoFactor = vi.fn().mockResolvedValue(false)
    authMock.useAuth.mockReturnValue({
      login: vi.fn(),
      register: vi.fn(),
      verifyTwoFactor,
      cancelTwoFactor: vi.fn(),
      twoFactorPending: 'pt-1',
      authError: 'Invalid authentication code',
    })
    renderPage()

    fireEvent.change(screen.getByPlaceholderText('Código (6 dígitos)'), {
      target: { value: '000000' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Verificar' }))

    await waitFor(() =>
      expect(toastMock.toast.error).toHaveBeenCalledWith('Invalid authentication code'),
    )
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('shows the server error message on a failed register', async () => {
    const register = vi.fn().mockResolvedValue(false)
    authMock.useAuth.mockReturnValue({
      login: vi.fn(),
      register,
      verifyTwoFactor: vi.fn(),
      cancelTwoFactor: vi.fn(),
      twoFactorPending: null,
      authError: 'El email ya está registrado',
    })
    renderPage()

    fireEvent.click(screen.getByText('¿No tienes cuenta? Regístrate'))
    fireEvent.change(screen.getByPlaceholderText('Nombre completo'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'Pass!123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Crear Cuenta' }))

    await waitFor(() =>
      expect(toastMock.toast.error).toHaveBeenCalledWith('El email ya está registrado'),
    )
  })
})
