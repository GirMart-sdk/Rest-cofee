import { Link } from 'react-router-dom'
import { FiMessageCircle, FiPhone } from 'react-icons/fi'

const WHATSAPP_PHONE = import.meta.env.VITE_WHATSAPP_PHONE || '573001234567'
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hola, quiero información sobre Hostal Cofee')}`

export default function Footer() {
  return (
    <footer className="bg-black text-white/80">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-2xl mb-4">
              <span className="text-primary">Hostal</span> <span className="text-gold">Cofre</span>
            </h3>
            <p className="text-white/60 leading-relaxed">
              Donde el sabor se encuentra con la tradición. Experiencia gastronómica única desde
              2020.
            </p>
          </div>
          <div>
            <h4 className="font-display text-xl mb-4">Enlaces</h4>
            <ul className="space-y-2">
              {[
                { to: '/menu', label: 'Menú' },
                { to: '/reservas', label: 'Reservas' },
                { to: '/carrito', label: 'Carrito' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/60 hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xl mb-4">Contacto</h4>
            <div className="space-y-3 text-white/60">
              <a
                href="tel:+576012345678"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <FiPhone /> (601) 234-5678
              </a>
              <p>Av. Principal 123, Bogotá</p>
              <p>Lun-Dom 12pm - 11pm</p>
            </div>
            <div className="flex gap-4 mt-4">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escríbenos por WhatsApp"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiMessageCircle size={18} />
              </a>
              <a
                href="tel:+576012345678"
                aria-label="Llámanos"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiPhone size={18} />
              </a>
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
