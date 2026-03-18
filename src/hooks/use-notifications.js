import { useContext } from "react"
import { NotificationsContext } from "@/contexts/notifications-context"

export function useNotifications() {
  const contexto = useContext(NotificationsContext)

  if (!contexto) {
    throw new Error("useNotifications deve ser usado dentro de NotificationsProvider.")
  }

  return contexto
}
