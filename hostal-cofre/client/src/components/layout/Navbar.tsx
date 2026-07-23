import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { itemCount } = useCart()
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsOpen(false) }, [location])

  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/menu', label: 'Menú' },
    { to: '/reservas', label: 'Reservas' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md shadow-xl' : 'bg-transparent'}`}>
      <div className="container-main flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl font-display text-primary font-bold">Hostal</span>
          <span className="text-3xl font-display text-gold font-bold">Cofre</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`text-white/80 hover:text-white font-semibold transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 ${location.pathname === l.to ? 'text-white after:w-full' : 'after:w-0 hover:after:w-full'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/carrito" className="relative text-white/80 hover:text-white transition-colors">
            <FiShoppingCart size={24} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                {itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link to="/admin" className="text-white/80 hover:text-gold transition-colors text-sm font-semibold">
                  Panel Admin
                </Link>
              )}
              <button onClick={logout} className="text-white/60 hover:text-white transition-colors">
                <FiLogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-white/80 hover:text-white transition-colors">
              <FiUser size={24} />
            </Link>
          )}
        </div>

        <div className="flex md:hidden items-center gap-4">
          <Link to="/carrito" className="relative text-white/80">
            <FiShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-black/95 backdrop-blur-md border-t border-white/10 px-4 py-6 flex flex-col gap-4">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`text-white/80 hover:text-white font-semibold py-2 transition-colors ${location.pathname === l.to ? 'text-white' : ''}`}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              {isAdmin && <Link to="/admin" className="text-gold font-semibold py-2">Panel Admin</Link>}
              <button onClick={logout} className="text-white/60 hover:text-white text-left py-2">Cerrar Sesión</button>
            </>
          ) : (
            <Link to="/login" className="text-white/80 hover:text-white font-semibold py-2">Iniciar Sesión</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
