import { io } from 'socket.io-client'
import { API_BASE } from './api'

let socket
let listenersBound = false

export function getSocket() {
  if (!socket) {
    socket = io(API_BASE, { withCredentials: true })
  }
  return socket
}

export function onPresence(callback) {
  const s = getSocket()
  s.on('presence', callback)
  return () => s.off('presence', callback)
}


