import { useAuth } from "./use-auth"

export function usePermissao() {
  const { usuario } = useAuth()

  function temPermissao(perfisPermitidos = []) {
    if (!usuario) {
      return false
    }

    return perfisPermitidos.includes(usuario.role)
  }

  return {
    usuario,
    ehRegistro: usuario?.role === "REGISTRO",
    ehAutorizacao: usuario?.role === "AUTORIZACAO",
    ehAdministracao: usuario?.role === "ADMINISTRACAO",
    temPermissao
  }
}
