import { cn } from "@/utils/cn"

export function FormField({ label, erro, obrigatorio = false, children, descricao }) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center gap-1 text-sm font-medium text-slate-200">
        <span>{label}</span>
        {obrigatorio ? <span className="text-red-400">*</span> : null}
      </div>

      {children}

      {descricao ? <p className="text-xs text-slate-500">{descricao}</p> : null}
      <p className={cn("min-h-5 text-xs text-red-400")}>{erro || ""}</p>
    </label>
  )
}
