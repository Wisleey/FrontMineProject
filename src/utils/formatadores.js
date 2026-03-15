import { format } from "date-fns"

export function formatarMoeda(valor) {
  const numero = Number(valor || 0)

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(numero)
}

export function formatarData(data) {
  if (!data) {
    return "-"
  }

  return format(new Date(data), "dd/MM/yyyy HH:mm")
}

export function formatarCnpj(cnpj) {
  const somenteDigitos = String(cnpj || "").replace(/\D/g, "")

  if (somenteDigitos.length !== 14) {
    return cnpj || "-"
  }

  return somenteDigitos.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  )
}

export function traduzirStatus(status) {
  const mapa = {
    PENDENTE: "Pendente",
    AUTORIZADO: "Autorizado",
    REJEITADO: "Rejeitado"
  }

  return mapa[status] || status
}

export function traduzirRole(role) {
  const mapa = {
    REGISTRO: "Registro",
    AUTORIZACAO: "Autorizacao",
    ADMINISTRACAO: "Administracao"
  }

  return mapa[role] || role
}
