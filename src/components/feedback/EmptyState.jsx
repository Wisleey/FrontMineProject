import { Inbox } from "lucide-react"

export function EmptyState({
  titulo = "Nenhum registro encontrado",
  descricao = "Nao ha dados para exibir no momento."
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-300">
        <Inbox size={24} />
      </div>
      <h3 className="text-base font-semibold text-slate-100">{titulo}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">{descricao}</p>
    </div>
  )
}
