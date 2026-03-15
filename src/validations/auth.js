import { z } from "zod"

export const schemaLogin = z.object({
  login: z.string().trim().min(1, "Informe o login."),
  senha: z.string().min(1, "Informe a senha.")
})
