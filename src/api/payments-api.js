import { clienteHttp } from "./cliente-http"

export async function criarPagamentoApi(payload) {
  const { data } = await clienteHttp.post("/payments", payload)
  return data
}

export async function listarMeusPagamentosApi() {
  const { data } = await clienteHttp.get("/payments/my")
  return data
}

export async function listarPagamentosPendentesApi() {
  const { data } = await clienteHttp.get("/payments/pending")
  return data
}

export async function autorizarPagamentoApi(id) {
  const { data } = await clienteHttp.patch(`/payments/${id}/authorize`)
  return data
}

export async function rejeitarPagamentoApi(id, payload) {
  const { data } = await clienteHttp.patch(`/payments/${id}/reject`, payload)
  return data
}

export async function consultarHistoricoApi(params) {
  const { data } = await clienteHttp.get("/payments/history", { params })
  return data
}
