const CHAVE_TOKEN = "pagamentos.token"
const CHAVE_USUARIO = "pagamentos.usuario"

export function salvarSessao({ token, usuario }) {
  localStorage.setItem(CHAVE_TOKEN, token)
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario))
}

export function obterToken() {
  return localStorage.getItem(CHAVE_TOKEN)
}

export function obterUsuario() {
  const usuario = localStorage.getItem(CHAVE_USUARIO)

  if (!usuario) {
    return null
  }

  try {
    return JSON.parse(usuario)
  } catch {
    return null
  }
}

export function limparSessao() {
  localStorage.removeItem(CHAVE_TOKEN)
  localStorage.removeItem(CHAVE_USUARIO)
}
