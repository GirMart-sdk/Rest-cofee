import { motion } from 'framer-motion'

export default function ChefSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-main text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-primary font-semibold text-lg mb-2">Nuestro Equipo</p>
          <h2 className="text-4xl md:text-5xl font-display text-gray-900 mb-12">El Chef</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <div className="card overflow-hidden">
            <img
              src="/images/chef.webp"
              alt="Chef María González"
              className="w-full h-80 object-cover"
            />
            <div className="p-8">
              <h3 className="font-display text-3xl text-gray-900 mb-3">María González</h3>
              <p className="text-primary font-semibold mb-4">Chef Ejecutiva</p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Con más de 25 años de experiencia creando experiencias gastronómicas inolvidables,
                María fusiona los sabores tradicionales colombianos con técnicas culinarias internacionales.
                Su pasión por los ingredientes frescos y locales se refleja en cada platillo que sale de nuestra cocina.
              </p>
              <div className="flex justify-center gap-4 mt-6">
                {['🏆 Chef del Año 2023', '🌟 Estrella Michelin', '📖 Autora de "Sabores de Casa"'].map((badge, i) => (
                  <span key={i} className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
