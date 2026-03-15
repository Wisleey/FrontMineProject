import { LogOut, ShieldCheck, WalletCards, History, Users, ClipboardCheck } from "lucide-react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn"
import { traduzirRole } from "@/utils/formatadores"
import { useAuth } from "@/hooks/use-auth"

const itensMenu = [
  {
    label: "Novo pagamento",
    to: "/pagamentos/novo",
    icone: WalletCards,
    perfis: ["REGISTRO", "AUTORIZACAO", "ADMINISTRACAO"]
  },
  {
    label: "Meus registros",
    to: "/pagamentos/meus",
    icone: ShieldCheck,
    perfis: ["REGISTRO", "ADMINISTRACAO"]
  },
  {
    label: "Autorizacao",
    to: "/pagamentos/autorizacao",
    icone: ClipboardCheck,
    perfis: ["AUTORIZACAO", "ADMINISTRACAO"]
  },
  {
    label: "Historico",
    to: "/pagamentos/historico",
    icone: History,
    perfis: ["ADMINISTRACAO"]
  },
  {
    label: "Usuarios",
    to: "/usuarios",
    icone: Users,
    perfis: ["ADMINISTRACAO"]
  }
]

export function AppLayout() {
  const { usuario, sair } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    sair()
    navigate("/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-slate-800 bg-slate-950/70 p-6 backdrop-blur-sm">
          <div className="mb-10">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
              <div className="rounded-xl bg-sky-500/15 p-2 text-sky-300">
                <WalletCards size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Sistema interno</p>
                <h1 className="text-base font-semibold">Pagamentos</h1>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {itensMenu
              .filter((item) => item.perfis.includes(usuario.role))
              .map((item) => {
                const Icone = item.icone

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-sky-500 text-slate-950"
                          : "text-slate-300 hover:bg-slate-900 hover:text-white"
                      )
                    }
                  >
                    <Icone size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
          </nav>
        </aside>

        <div className="grade-fundo flex min-h-screen flex-col">
          <header className="border-b border-slate-800 bg-slate-950/40 px-6 py-4 backdrop-blur-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-400">Ambiente autenticado</p>
                <h2 className="text-lg font-semibold text-slate-100">
                  {usuario.nome}
                </h2>
                <p className="text-sm text-slate-500">
                  {usuario.login} · {traduzirRole(usuario.role)}
                </p>
              </div>

              <Button variante="contorno" onClick={handleLogout}>
                <LogOut size={16} />
                Sair
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
