import { Card } from "@/components/ui/card"

export function ResumoCard({ titulo, valor, descricao, icone: Icone }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{titulo}</p>
          <p className="mt-3 text-2xl font-bold text-slate-100">{valor}</p>
          <p className="mt-2 text-xs text-slate-500">{descricao}</p>
        </div>

        {Icone ? (
          <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-300">
            <Icone size={20} />
          </div>
        ) : null}
      </div>
    </Card>
  )
}
