import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sileo"
import App from "./App"
import { AuthProvider } from "./contexts/AuthContext"
import { aplicarFiltroConsole } from "./utils/filtrar-console"
import "./index.css"

aplicarFiltroConsole()

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Toaster position="top-right" theme="dark" />
      <App />
    </AuthProvider>
  </BrowserRouter>
)
