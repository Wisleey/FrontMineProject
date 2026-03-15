import { clienteHttp } from "./cliente-http"

export async function listarUsuariosApi() {
  const { data } = await clienteHttp.get("/users")
  return data
}

export async function criarUsuarioApi(payload) {
  const { data } = await clienteHttp.post("/users", payload)
  return data
}

export async function atualizarUsuarioApi(id, payload) {
  const { data } = await clienteHttp.put(`/users/${id}`, payload)
  return data
}

export async function removerUsuarioApi(id) {
  const { data } = await clienteHttp.delete(`/users/${id}`)
  return data
}
