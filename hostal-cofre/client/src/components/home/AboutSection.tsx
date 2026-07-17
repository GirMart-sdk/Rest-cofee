import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function AboutSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary font-semibold text-lg mb-2">Nuestra Historia</p>
            <h2 className="text-4xl md:text-5xl font-display text-gray-900 mb-6">
              Pasión por la <span className="text-primary">Gastronomía</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              En Hostal Cofee creemos que la comida es más que nourishment — es una experiencia.
              Desde 2020, nuestra chef María González ha creado platos que fusionan tradición
              colombiana con técnicas internacionales.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Cada ingrediente es seleccionado cuidadosamente de productores locales,
              garantizando frescura y calidad en cada bocado.
            </p>
            <Link to="/menu" className="btn-primary">
              Explorar Menú
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <div className="card overflow-hidden rounded-2xl">
                <img
                  src="/images/nosotros1.webp"
                  alt="Restaurante"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="card overflow-hidden rounded-2xl">
                <img
                  src="/images/nosotros2.webp"
                  alt="Pasta fresca"
                  className="w-full h-36 object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="card overflow-hidden rounded-2xl">
                <img
                  src="/images/nosotros3.webp"
                  alt="Pizza artesanal"
                  className="w-full h-36 object-cover"
                />
              </div>
              <div className="card overflow-hidden rounded-2xl">
                <img
                  src="/images/postres1.webp"
                  alt="Postre"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          {[
            { num: '5+', label: 'Años de Experiencia' },
            { num: '50+', label: 'Platos Únicos' },
            { num: '10K+', label: 'Clientes Felices' },
            { num: '4.9', label: 'Calificación Google' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="text-4xl md:text-5xl font-display text-primary mb-2">{s.num}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
