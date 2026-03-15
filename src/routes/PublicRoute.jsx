import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"

export function PublicRoute() {
  const { autenticado } = useAuth()

  if (autenticado) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
