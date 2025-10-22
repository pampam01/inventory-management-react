import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { InventoryProvider } from './contexts/InventoryContext'
import { ProtectedRoute } from './components/Auth/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { Dashboard } from './pages/Dashboard'

function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </InventoryProvider>
    </AuthProvider>
  )
}

export default App
