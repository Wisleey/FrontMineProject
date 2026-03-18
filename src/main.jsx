import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sileo"
import App from "./App"
import { AuthProvider } from "./contexts/AuthContext"
import { NotificationsProvider } from "./contexts/NotificationsContext"
import { aplicarFiltroConsole } from "./utils/filtrar-console"
import "./index.css"

aplicarFiltroConsole()

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <NotificationsProvider>
        <Toaster position="top-right" theme="dark" />
        <App />
      </NotificationsProvider>
    </AuthProvider>
  </BrowserRouter>
)
