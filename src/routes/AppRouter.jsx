import { Navigate, Route, Routes } from "react-router-dom"
import { AppLayout } from "@/layouts/AppLayout"
import { LoginPage } from "@/pages/login/LoginPage"
import { NovoPagamentoPage } from "@/pages/pagamentos/NovoPagamentoPage"
import { MeusPagamentosPage } from "@/pages/pagamentos/MeusPagamentosPage"
import { AutorizacaoPage } from "@/pages/pagamentos/AutorizacaoPage"
import { HistoricoPage } from "@/pages/historico/HistoricoPage"
import { UsuariosPage } from "@/pages/usuarios/UsuariosPage"
import { ProtectedRoute } from "./ProtectedRoute"
import { PublicRoute } from "./PublicRoute"
import { useAuth } from "@/hooks/use-auth"

function RedirecionadorInicial() {
  const { usuario } = useAuth()

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (usuario.role === "REGISTRO") {
    return <Navigate to="/pagamentos/meus" replace />
  }

  return <Navigate to="/pagamentos/novo" replace />
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<RedirecionadorInicial />} />

          <Route
            path="/pagamentos/novo"
            element={<NovoPagamentoPage />}
          />

          <Route
            element={
              <ProtectedRoute perfisPermitidos={["REGISTRO", "ADMINISTRACAO"]} />
            }
          >
            <Route
              path="/pagamentos/meus"
              element={<MeusPagamentosPage />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute perfisPermitidos={["AUTORIZACAO", "ADMINISTRACAO"]} />
            }
          >
            <Route
              path="/pagamentos/autorizacao"
              element={<AutorizacaoPage />}
            />
          </Route>

          <Route
            element={<ProtectedRoute perfisPermitidos={["ADMINISTRACAO"]} />}
          >
            <Route
              path="/pagamentos/historico"
              element={<HistoricoPage />}
            />
          </Route>

          <Route
            element={<ProtectedRoute perfisPermitidos={["ADMINISTRACAO"]} />}
          >
            <Route path="/usuarios" element={<UsuariosPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
