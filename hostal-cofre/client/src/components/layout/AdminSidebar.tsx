import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FiGrid, FiShoppingCart, FiClipboard, FiUsers, FiCalendar,
  FiBarChart2, FiHome, FiX, FiLogOut, FiExternalLink, FiCoffee
} from 'react-icons/fi'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
  { to: '/admin/pos', label: 'Punto de Venta', icon: FiShoppingCart, accent: true },
  { to: '/admin/pedidos', label: 'Pedidos', icon: FiClipboard },
  { to: '/admin/mesas', label: 'Mesas', icon: FiUsers },
  { to: '/admin/menu', label: 'Menú', icon: FiCoffee },
  { to: '/admin/turnos', label: 'Turnos', icon: FiCalendar },
  { to: '/admin/reportes', label: 'Reportes', icon: FiBarChart2 },
  { to: '/admin/reservas', label: 'Reservas', icon: FiCalendar },
]

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = (path: string, exact?: boolean) => {
    return exact ? location.pathname === path : location.pathname.startsWith(path)
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <Link to="/admin" className="flex items-center gap-2" onClick={onClose}>
            <span className="text-2xl font-display text-primary font-bold">Hostal</span>
            <span className="text-2xl font-display text-gold font-bold">Cofre</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <FiX size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon
              const active = isActive(item.to, item.exact)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : item.accent
                        ? 'text-green-400 hover:bg-gray-800 hover:text-green-300'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-gray-800 px-3 py-3 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            onClick={onClose}
          >
            <FiExternalLink size={18} />
            Ver Sitio Público
          </Link>
          <Link
            to="/menu"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            onClick={onClose}
          >
            <FiHome size={18} />
            Ver Menú
          </Link>
        </div>

        <div className="border-t border-gray-800 px-3 py-3">
          <div className="flex items-center gap-3 px-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors"
          >
            <FiLogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  )
}
