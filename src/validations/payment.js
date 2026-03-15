import { z } from "zod"

export const schemaPagamento = z.object({
  cnpjFavorecido: z.string().min(18, "Informe um CNPJ valido."),
  razaoSocial: z.string().trim().min(3, "Informe a razao social."),
  valor: z.coerce.number().positive("Informe um valor valido."),
  descricaoServico: z
    .string()
    .trim()
    .min(3, "Informe a descricao do servico.")
})

export const schemaRejeicao = z.object({
  motivoRejeicao: z
    .string()
    .trim()
    .min(3, "Informe o motivo da rejeicao.")
})
