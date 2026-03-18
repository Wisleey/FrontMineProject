import { clienteHttp } from "./cliente-http"

export async function listarNotificacoesApi(params) {
  const { data } = await clienteHttp.get("/notifications", { params })
  return data
}

export async function marcarNotificacaoComoLidaApi(id) {
  const { data } = await clienteHttp.patch(`/notifications/${id}/read`)
  return data
}

export async function marcarTodasNotificacoesComoLidasApi() {
  const { data } = await clienteHttp.patch("/notifications/read-all")
  return data
}
