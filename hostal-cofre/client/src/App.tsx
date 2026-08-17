import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import HomePage from './pages/HomePage'
import ProtectedRoute from './components/layout/ProtectedRoute'

const MenuPage = lazy(() => import('./pages/MenuPage'))
const ReservationsPage = lazy(() => import('./pages/ReservationsPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))
const MesaPage = lazy(() => import('./pages/MesaPage'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminMenu = lazy(() => import('./pages/admin/AdminMenu'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminReservations = lazy(() => import('./pages/admin/AdminReservations'))
const AdminPOS = lazy(() => import('./pages/admin/AdminPOS'))
const AdminShifts = lazy(() => import('./pages/admin/AdminShifts'))
const AdminReports = lazy(() => import('./pages/admin/AdminReports'))
const AdminTables = lazy(() => import('./pages/admin/AdminTables'))
const AdminAudit = lazy(() => import('./pages/admin/AdminAudit'))
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'))
const AdminMonitor = lazy(() => import('./pages/admin/AdminMonitor'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const SecurityQuestionSetup = lazy(() => import('./pages/SecurityQuestionSetup'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  )
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{ duration: 3000, style: { fontFamily: '"Mulish", sans-serif' } }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/mesa" element={<MesaPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/reservas" element={<ReservationsPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route
              path="/cuenta"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cuenta/seguridad"
              element={
                <ProtectedRoute>
                  <SecurityQuestionSetup />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/menu" element={<AdminMenu />} />
            <Route path="/admin/pedidos" element={<AdminOrders />} />
            <Route path="/admin/reservas" element={<AdminReservations />} />
            <Route path="/admin/pos" element={<AdminPOS />} />
            <Route path="/admin/turnos" element={<AdminShifts />} />
            <Route path="/admin/reportes" element={<AdminReports />} />
            <Route path="/admin/mesas" element={<AdminTables />} />
            <Route path="/admin/auditoria" element={<AdminAudit />} />
            <Route path="/admin/pagos" element={<AdminPayments />} />
            <Route path="/admin/monitoreo" element={<AdminMonitor />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
