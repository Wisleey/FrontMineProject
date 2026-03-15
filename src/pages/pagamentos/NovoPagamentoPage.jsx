import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { NumericFormat, PatternFormat } from "react-number-format"
import { Landmark, Save } from "lucide-react"
import { criarPagamentoApi } from "@/api/payments-api"
import { FormField } from "@/components/forms/FormField"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toastErro, toastSucesso } from "@/utils/toast"
import { schemaPagamento } from "@/validations/payment"

export function NovoPagamentoPage() {
  const [salvando, setSalvando] = useState(false)

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schemaPagamento),
    defaultValues: {
      cnpjFavorecido: "",
      razaoSocial: "",
      valor: "",
      descricaoServico: ""
    }
  })

  async function onSubmit(dados) {
    try {
      setSalvando(true)

      await criarPagamentoApi({
        ...dados,
        cnpjFavorecido: String(dados.cnpjFavorecido).replace(/\D/g, "")
      })

      toastSucesso({
        title: "Pagamento registrado",
        description: "A solicitacao foi enviada com sucesso."
      })

      reset()
    } catch (erro) {
      toastErro({
        title: "Falha ao registrar",
        description:
          erro.response?.data?.mensagem || "Nao foi possivel salvar o pagamento."
      })
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <PageHeader
        titulo="Registro de pagamento"
        descricao="Cadastre uma nova solicitacao de pagamento para fornecedor."
      />

      <Card className="max-w-4xl">
        <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="CNPJ do favorecido"
            obrigatorio
            erro={errors.cnpjFavorecido?.message}
          >
            <Controller
              control={control}
              name="cnpjFavorecido"
              render={({ field }) => (
                <PatternFormat
                  customInput={Input}
                  placeholder="00.000.000/0000-00"
                  format="##.###.###/####-##"
                  mask="_"
                  value={field.value}
                  onValueChange={(values) => field.onChange(values.formattedValue)}
                />
              )}
            />
          </FormField>

          <FormField
            label="Valor do pagamento"
            obrigatorio
            erro={errors.valor?.message}
          >
            <Controller
              control={control}
              name="valor"
              render={({ field }) => (
                <NumericFormat
                  customInput={Input}
                  prefix="R$ "
                  decimalSeparator=","
                  thousandSeparator="."
                  decimalScale={2}
                  fixedDecimalScale
                  placeholder="R$ 0,00"
                  value={field.value}
                  onValueChange={(values) => field.onChange(Number(values.floatValue || 0))}
                />
              )}
            />
          </FormField>

          <div className="md:col-span-2">
            <FormField
              label="Razao social"
              obrigatorio
              erro={errors.razaoSocial?.message}
            >
              <Input
                placeholder="Informe a razao social do fornecedor"
                {...register("razaoSocial")}
              />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField
              label="Descricao do servico"
              obrigatorio
              erro={errors.descricaoServico?.message}
            >
              <Textarea
                placeholder="Descreva o servico prestado"
                {...register("descricaoServico")}
              />
            </FormField>
          </div>

          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={salvando}>
              <Save size={16} />
              {salvando ? "Enviando..." : "Enviar pagamento"}
            </Button>

            <div className="inline-flex items-center gap-2 text-sm text-slate-400">
              <Landmark size={16} />
              O backend definira automaticamente data, solicitante e status inicial.
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}
