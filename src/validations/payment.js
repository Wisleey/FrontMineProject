import { z } from "zod";

export const schemaPagamento = z.object({
  cnpjFavorecido: z.string().min(18, "Informe um CNPJ valido."),
  razaoSocial: z.string().trim().min(3, "Informe a razão social."),
  valor: z.coerce.number().positive("Informe um valor valido."),
  descricaoServico: z.string().trim().min(3, "Informe a descrição do serviço."),
});

export const schemaRejeicao = z.object({
  motivoRejeicao: z.string().trim().min(3, "Informe o motivo da rejeição."),
});
