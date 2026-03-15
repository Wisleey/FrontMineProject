import { clienteHttp } from "./cliente-http"

export async function loginApi(payload) {
  const { data } = await clienteHttp.post("/auth/login", payload)
  return data
}
