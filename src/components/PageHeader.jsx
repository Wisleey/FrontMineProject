export function PageHeader({ titulo, descricao, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">{titulo}</h1>
        <p className="mt-2 text-sm text-slate-400">{descricao}</p>
      </div>

      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  )
}
