import { sileo } from "sileo"

function configurarPayload(payload) {
  return {
    duration: 3500,
    ...payload
  }
}

export function toastSucesso(payload) {
  return sileo.success(configurarPayload(payload))
}

export function toastErro(payload) {
  return sileo.error(configurarPayload(payload))
}

export function toastAviso(payload) {
  return sileo.warning(configurarPayload(payload))
}

export function toastInfo(payload) {
  return sileo.info(configurarPayload(payload))
}
