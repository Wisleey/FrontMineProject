import { useEffect, useMemo, useState } from "react"
import { loginApi } from "@/api/auth-api"
import { AuthContext } from "@/contexts/auth-context"
import { limparSessao, obterToken, obterUsuario, salvarSessao } from "@/utils/armazenamento"
import { toastErro, toastInfo, toastSucesso } from "@/utils/toast"

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => obterUsuario())
  const [token, setToken] = useState(() => obterToken())
  const [carregandoAuth, setCarregandoAuth] = useState(false)

  useEffect(() => {
    if (!token || !usuario) {
      limparSessao()
      setUsuario(null)
      setToken(null)
    }
  }, [token, usuario])

  async function entrar(credenciais) {
    setCarregandoAuth(true)

    try {
      const resposta = await loginApi(credenciais)
      salvarSessao({
        token: resposta.token,
        usuario: resposta.usuario
      })
      setToken(resposta.token)
      setUsuario(resposta.usuario)
      toastSucesso({
        title: "Acesso liberado",
        description: `Bem-vindo, ${resposta.usuario.nome}.`
      })
      return resposta.usuario
    } catch (erro) {
      const mensagem =
        erro.response?.data?.mensagem || "Nao foi possivel realizar o login."

      toastErro({
        title: "Falha no login",
        description: mensagem
      })
      throw erro
    } finally {
      setCarregandoAuth(false)
    }
  }

  function sair() {
    limparSessao()
    setUsuario(null)
    setToken(null)
    toastInfo({
      title: "Sessao encerrada",
      description: "Voce saiu do sistema com sucesso."
    })
  }

  const valor = useMemo(
    () => ({
      usuario,
      token,
      autenticado: Boolean(usuario && token),
      carregandoAuth,
      entrar,
      sair
    }),
    [usuario, token, carregandoAuth]
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
