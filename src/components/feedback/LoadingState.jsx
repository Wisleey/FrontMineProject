export function LoadingState({ texto = "Carregando..." }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/70">
      <div className="flex items-center gap-3 text-sm text-slate-300">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-t-sky-400" />
        <span>{texto}</span>
      </div>
    </div>
  )
}
