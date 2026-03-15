const mensagemIgnorada =
  "Rendering was performed in a subtree hidden by content-visibility."

let filtroAplicado = false

export function aplicarFiltroConsole() {
  if (filtroAplicado || typeof window === "undefined") {
    return
  }

  const logOriginal = console.log

  console.log = (...args) => {
    if (args.some((item) => item === mensagemIgnorada)) {
      return
    }

    logOriginal(...args)
  }

  filtroAplicado = true
}
