import axios from 'axios'
import { getToken } from './auth'

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const AuthAPI = {
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
}

export const CanvasAPI = {
  create: (data) => api.post('/canvas', data).then((r) => r.data),
  list: () => api.get('/canvas').then((r) => r.data),
  get: (id) => api.get(`/canvas/${id}`).then((r) => r.data),
  saveStrokes: (id, strokes) => api.put(`/canvas/${id}/strokes`, { strokes }).then((r) => r.data),
  getMessages: (id) => api.get(`/canvas/${id}/messages`).then((r) => r.data),
}

 
