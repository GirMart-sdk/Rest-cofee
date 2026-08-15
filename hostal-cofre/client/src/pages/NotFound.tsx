import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-display text-7xl md:text-9xl text-primary font-bold leading-none">404</p>
        <h1 className="font-display text-2xl md:text-3xl text-white mt-4">Página no encontrada</h1>
        <p className="text-white/60 mt-2 max-w-md mx-auto">
          La página que buscas no existe o fue movida. Verifica la dirección o regresa al inicio.
        </p>
        <Link
          to="/"
          className="inline-block mt-8 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
