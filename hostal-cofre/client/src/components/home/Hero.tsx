import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const SLIDES = [
  { src: '/images/ensalada.webp', alt: 'Ensalada de la casa' },
  { src: '/images/pasta2.webp', alt: 'Pasta fresca' },
  { src: '/images/pizza1.webp', alt: 'Pizza artesanal' },
  { src: '/images/postres1.webp', alt: 'Postre de la casa' },
]

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.img
            key={index}
            src={SLIDES[index].src}
            alt={SLIDES[index].alt}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.4 }, scale: { duration: 6, ease: 'linear' } }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-primary text-lg md:text-xl font-semibold mb-4 tracking-widest uppercase">
            Bienvenido a
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-white mb-4">
            Hostal <span className="text-gold">Cofre</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-body">
            Donde cada platillo cuenta una historia. Ingredientes frescos, recetas tradicionales y
            pasión por la gastronomía.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="btn-primary text-lg flex items-center justify-center gap-2">
              Ver Menú <FiArrowRight />
            </Link>
            <Link
              to="/reservas"
              className="btn-outline border-white text-white hover:bg-white hover:text-black text-lg"
            >
              Reservar Mesa
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
