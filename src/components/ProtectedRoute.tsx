import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../lib/authContext'

export default function ProtectedRoute() {
  const { user, openAuth } = useAuth()
  if (!user) {
    openAuth()
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
