import { cn } from "@/utils/cn"
import { traduzirStatus } from "@/utils/formatadores"

const mapaStatus = {
  PENDENTE: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  AUTORIZADO: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  REJEITADO: "bg-red-500/15 text-red-300 border-red-500/30"
}

export function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        mapaStatus[status] || "border-slate-700 bg-slate-800 text-slate-200"
      )}
    >
      {traduzirStatus(status)}
    </span>
  )
}
