import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"

export function ProtectedRoute({ perfisPermitidos = [] }) {
  const { autenticado, usuario } = useAuth()
  const location = useLocation()

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (
    perfisPermitidos.length > 0 &&
    usuario &&
    !perfisPermitidos.includes(usuario.role)
  ) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
