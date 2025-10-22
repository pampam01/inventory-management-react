import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { LogOut, Package } from 'lucide-react'
import { Button } from '../UI/Button'

export const Layout = ({ children }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Inventory Management System
                </h1>
                <p className="text-sm text-gray-500">
                  Sistem Manajemen Inventory Komponen
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
