import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Bảo vệ route — chỉ cho user đã đăng nhập
export function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()
  if (loading) return null
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return children
}

// Bảo vệ route — chỉ cho admin
export function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin, loading } = useAuth()
  if (loading) return null
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
