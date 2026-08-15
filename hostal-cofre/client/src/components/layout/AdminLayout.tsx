import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import { FiMenu } from 'react-icons/fi'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <FiMenu size={20} />
          </button>
          <div className="flex-1" />
          <div className="text-sm text-gray-500 hidden sm:block">
            {new Date().toLocaleDateString('es-CO', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
