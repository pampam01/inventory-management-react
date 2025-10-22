import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../UI/Button'
import { Input } from '../UI/Input'
import { Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export const Login = () => {
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (login(password)) {
      toast.success('Login berhasil!')
      navigate('/dashboard')
    } else {
      toast.error('Password salah!')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Inventory Management
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Masukkan password untuk mengakses sistem
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            required
          />
          
          <Button 
            type="submit" 
            variant="primary"
            className="w-full"
          >
            Login
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>💡dibuat oleh aslab Prayitno</p>
        </div>
      </div>
    </div>
  )
}
