import { z } from "zod";

export const schemaUsuario = z.object({
  nome: z.string().trim().min(3, "Informe o nome."),
  login: z.string().trim().min(3, "Informe o login."),
  senha: z.string().min(8, "A senha deve ter ao menos 8 caracteres."),
  role: z.enum(["REGISTRO", "AUTORIZACAO", "ADMINISTRACAO"], {
    message: "Selecione um nivel de permissão.",
  }),
});

export const schemaAtualizacaoUsuario = z.object({
  nome: z.string().trim().min(3, "Informe o nome."),
  login: z.string().trim().min(3, "Informe o login."),
  senha: z.string().optional(),
  role: z.enum(["REGISTRO", "AUTORIZACAO", "ADMINISTRACAO"], {
    message: "Selecione um nivel de permissão.",
  }),
});
