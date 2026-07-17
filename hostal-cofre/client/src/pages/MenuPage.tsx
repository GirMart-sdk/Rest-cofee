import MenuGrid from '../components/menu/MenuGrid'

export default function MenuPage() {
  return (
    <section className="section-padding pt-28">
      <div className="container-main">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold text-lg mb-2">Descubre</p>
          <h1 className="text-4xl md:text-5xl font-display text-gray-900 mb-4">Nuestro Menú</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Platillos preparados con ingredientes frescos y recetas tradicionales
          </p>
        </div>
        <MenuGrid />
      </div>
    </section>
  )
}
