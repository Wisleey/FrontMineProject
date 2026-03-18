import axios from "axios"
import { limparSessao, obterToken } from "@/utils/armazenamento"

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333"

export const clienteHttp = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

clienteHttp.interceptors.request.use((configuracao) => {
  const token = obterToken()

  if (token) {
    configuracao.headers.Authorization = `Bearer ${token}`
  }

  return configuracao
})

clienteHttp.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (erro.response?.status === 401) {
      limparSessao()

      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }

    return Promise.reject(erro)
  }
)
