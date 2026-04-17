import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const halls = {
  getAll: () => api.get('/halls').then(r => r.data),
  getOne: (id) => api.get(`/hall/${id}`).then(r => r.data),
  create: (data) => api.post('/hall', data).then(r => r.data),
  update: (id, data) => api.put(`/hall/${id}`, data).then(r => r.data),
  remove: (id) => api.delete(`/hall/${id}`).then(r => r.data),
}

export const items = {
  getAll: () => api.get('/items').then(r => r.data),
  getOne: (id) => api.get(`/item/${id}`).then(r => r.data),
  create: (data) => api.post('/item', data).then(r => r.data),
  update: (id, data) => api.put(`/item/${id}`, data).then(r => r.data),
  remove: (id) => api.delete(`/item/${id}`).then(r => r.data),
}

export const bookings = {
  getAll: () => api.get('/bookings').then(r => r.data),
  getOne: (id) => api.get(`/booking/${id}`).then(r => r.data),
  create: (data) => api.post('/booking', data).then(r => r.data),
  update: (id, data) => api.put(`/booking/${id}`, data).then(r => r.data),
  remove: (id) => api.delete(`/booking/${id}`).then(r => r.data),
}
