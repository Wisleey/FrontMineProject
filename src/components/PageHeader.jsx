export function PageHeader({ titulo, descricao, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="break-words text-xl font-bold text-slate-100 sm:text-2xl">{titulo}</h1>
        <p className="mt-2 break-words text-sm leading-6 text-slate-400">{descricao}</p>
      </div>

      {actions ? <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">{actions}</div> : null}
    </div>
  )
}
