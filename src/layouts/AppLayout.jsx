import {
  LogOut,
  ShieldCheck,
  WalletCards,
  History,
  Users,
  ClipboardCheck,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { NotificationCenter } from "@/components/NotificationCenter";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { traduzirRole } from "@/utils/formatadores";
import { useAuth } from "@/hooks/use-auth";

const itensMenu = [
  {
    label: "Novo pagamento",
    to: "/pagamentos/novo",
    icone: WalletCards,
    perfis: ["REGISTRO", "AUTORIZACAO", "ADMINISTRACAO"],
  },
  {
    label: "Meus registros",
    to: "/pagamentos/meus",
    icone: ShieldCheck,
    perfis: ["REGISTRO", "ADMINISTRACAO"],
  },
  {
    label: "Autorização",
    to: "/pagamentos/autorizacao",
    icone: ClipboardCheck,
    perfis: ["AUTORIZACAO", "ADMINISTRACAO"],
  },
  {
    label: "Historico",
    to: "/pagamentos/historico",
    icone: History,
    perfis: ["ADMINISTRACAO"],
  },
  {
    label: "Usuarios",
    to: "/usuarios",
    icone: Users,
    perfis: ["ADMINISTRACAO"],
  },
];

export function AppLayout() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();
  const itensVisiveis = itensMenu.filter((item) =>
    item.perfis.includes(usuario.role),
  );

  function handleLogout() {
    sair();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-slate-800 bg-slate-950/70 p-3 backdrop-blur-sm sm:p-4 lg:border-b-0 lg:border-r lg:p-6">
          <div className="mb-4 lg:mb-10">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
              <div className="rounded-xl bg-sky-500/15 p-2 text-sky-300">
                <WalletCards size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Sistema interno
                </p>
                <h1 className="text-base font-semibold">Pagamentos</h1>
              </div>
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:block lg:space-y-2">
            {itensVisiveis.map((item) => {
              const Icone = item.icone;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex min-w-0 items-center justify-center gap-2 rounded-xl px-3 py-3 text-center text-xs font-medium transition sm:px-4 sm:text-sm lg:justify-start lg:gap-3 lg:text-left",
                      isActive
                        ? "bg-sky-500 text-slate-950"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white",
                    )
                  }
                >
                  <Icone size={16} className="shrink-0 sm:size-[18px]" />
                  <span className="min-w-0 truncate lg:truncate-none lg:whitespace-nowrap">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <div className="grade-fundo min-w-0 flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/70 px-4 py-4 backdrop-blur-sm md:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-sm text-slate-400">Ambiente autenticado</p>
                <h2 className="break-words text-lg font-semibold text-slate-100">
                  {usuario.nome}
                </h2>
                <p className="break-words text-sm text-slate-500">
                  {usuario.login} · {traduzirRole(usuario.role)}
                </p>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-2 md:flex md:flex-row md:items-center md:justify-end">
                <NotificationCenter />

                <Button
                  variante="contorno"
                  className="w-full sm:w-auto"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Sair
                </Button>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
