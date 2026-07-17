import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiPhone } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-black text-white/80">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-2xl mb-4">
              <span className="text-primary">Hostal</span> <span className="text-gold">Cofre</span>
            </h3>
            <p className="text-white/60 leading-relaxed">Donde el sabor se encuentra con la tradición. Experiencia gastronómica única desde 2020.</p>
          </div>
          <div>
            <h4 className="font-display text-xl mb-4">Enlaces</h4>
            <ul className="space-y-2">
              {[
                { to: '/menu', label: 'Menú' },
                { to: '/reservas', label: 'Reservas' },
                { to: '/carrito', label: 'Carrito' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/60 hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xl mb-4">Contacto</h4>
            <div className="space-y-3 text-white/60">
              <p className="flex items-center gap-2"><FiPhone /> (601) 234-5678</p>
              <p>Av. Principal 123, Bogotá</p>
              <p>Lun-Dom 12pm - 11pm</p>
            </div>
            <div className="flex gap-4 mt-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"><FiFacebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"><FiInstagram size={18} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/40 text-sm">
          <p>&copy; {new Date().getFullYear()} Hostal Cofee. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
