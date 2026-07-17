import ReservationForm from '../components/reservations/ReservationForm'

export default function ReservationsPage() {
  return (
    <section className="section-padding pt-28">
      <div className="container-main">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold text-lg mb-2">Reserva</p>
          <h1 className="text-4xl md:text-5xl font-display text-gray-900 mb-4">Tu Mesa</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Selecciona fecha, hora y mesa para garantizar tu lugar
          </p>
        </div>
        <ReservationForm />
      </div>
    </section>
  )
}
