import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import ReservationsPage from './pages/ReservationsPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import MesaPage from './pages/MesaPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMenu from './pages/admin/AdminMenu'
import AdminOrders from './pages/admin/AdminOrders'
import AdminReservations from './pages/admin/AdminReservations'
import AdminPOS from './pages/admin/AdminPOS'
import AdminShifts from './pages/admin/AdminShifts'
import AdminReports from './pages/admin/AdminReports'
import AdminTables from './pages/admin/AdminTables'
import ProtectedRoute from './components/layout/ProtectedRoute'

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontFamily: '"Mulish", sans-serif' } }} />
      <Routes>
        <Route path="/mesa" element={<MesaPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/reservas" element={<ReservationsPage />} />
          <Route path="/carrito" element={<CartPage />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/menu" element={<AdminMenu />} />
          <Route path="/admin/pedidos" element={<AdminOrders />} />
          <Route path="/admin/reservas" element={<AdminReservations />} />
          <Route path="/admin/pos" element={<AdminPOS />} />
          <Route path="/admin/turnos" element={<AdminShifts />} />
          <Route path="/admin/reportes" element={<AdminReports />} />
          <Route path="/admin/mesas" element={<AdminTables />} />
        </Route>
      </Routes>
    </>
  )
}
