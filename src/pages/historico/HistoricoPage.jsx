import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarRange, Search } from "lucide-react"
import { consultarHistoricoApi } from "@/api/payments-api"
import { EmptyState } from "@/components/feedback/EmptyState"
import { FormField } from "@/components/forms/FormField"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TBody, TD, TH, THead } from "@/components/ui/table"
import { formatarData, formatarMoeda } from "@/utils/formatadores"
import { toastErro } from "@/utils/toast"
import { schemaHistorico } from "@/validations/history"

export function HistoricoPage() {
  const [resultado, setResultado] = useState([])
  const [carregando, setCarregando] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schemaHistorico),
    defaultValues: {
      dataInicio: "",
      dataFim: ""
    }
  })

  async function onSubmit(filtros) {
    try {
      setCarregando(true)
      const resposta = await consultarHistoricoApi(
        Object.fromEntries(
          Object.entries(filtros).filter(([, valor]) => Boolean(valor))
        )
      )
      setResultado(resposta.dados || [])
    } catch (erro) {
      toastErro({
        title: "Falha na consulta",
        description:
          erro.response?.data?.mensagem || "Nao foi possivel consultar o historico."
      })
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div>
      <PageHeader
        titulo="Consulta de historico"
        descricao="Pesquise pagamentos por periodo com retorno ordenado do mais recente para o mais antigo."
      />

      <Card className="mb-6">
        <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="Data inicio"
            erro={errors.dataInicio?.message}
          >
            <Input type="date" {...register("dataInicio")} />
          </FormField>

          <FormField
            label="Data fim"
            erro={errors.dataFim?.message}
          >
            <Input type="date" {...register("dataFim")} />
          </FormField>

          <div className="flex items-end">
            <Button type="submit" className="w-full md:w-auto" disabled={carregando}>
              <Search size={16} />
              {carregando ? "Consultando..." : "Consultar"}
            </Button>
          </div>
        </form>
      </Card>

      {resultado.length === 0 ? (
        <EmptyState
          titulo="Nenhum resultado encontrado"
          descricao="Defina um periodo e clique em consultar para visualizar os registros."
        />
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {resultado.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="min-w-0 flex-1 break-words font-medium text-slate-100">
                      {item.razaoSocial}
                    </p>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="grid gap-2 text-sm text-slate-300">
                    <p>Data: {formatarData(item.dataRegistro)}</p>
                    <p>CNPJ: {item.cnpjFavorecido}</p>
                    <p>Valor: {formatarMoeda(item.valor)}</p>
                    <p>Solicitante: {item.solicitante?.nome || "-"}</p>
                    <p>Autorizador: {item.autorizador?.nome || "-"}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="hidden md:block">
            <Table>
              <THead>
                <tr>
                  <TH>Data</TH>
                  <TH>Favorecido</TH>
                  <TH>Valor</TH>
                  <TH>Solicitante</TH>
                  <TH>Autorizador</TH>
                  <TH>Status</TH>
                </tr>
              </THead>
              <TBody>
                {resultado.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/60">
                    <TD>{formatarData(item.dataRegistro)}</TD>
                    <TD>
                      <div>
                        <p className="font-medium text-slate-100">{item.razaoSocial}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.cnpjFavorecido}</p>
                      </div>
                    </TD>
                    <TD>{formatarMoeda(item.valor)}</TD>
                    <TD>{item.solicitante?.nome || "-"}</TD>
                    <TD>{item.autorizador?.nome || "-"}</TD>
                    <TD>
                      <StatusBadge status={item.status} />
                    </TD>
                  </tr>
                ))}
              </TBody>
            </Table>
          </div>
        </>
      )}

      {resultado.length > 0 ? (
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <CalendarRange size={14} />
          Resultados ordenados do mais recente para o mais antigo.
        </div>
      ) : null}
    </div>
  )
}
