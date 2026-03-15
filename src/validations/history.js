import { z } from "zod"

export const schemaHistorico = z
  .object({
    dataInicio: z.string().optional(),
    dataFim: z.string().optional()
  })
  .refine(
    (dados) => {
      if (!dados.dataInicio || !dados.dataFim) {
        return true
      }

      return new Date(dados.dataFim) >= new Date(dados.dataInicio)
    },
    {
      message: "A data fim deve ser maior ou igual a data inicio.",
      path: ["dataFim"]
    }
  )
