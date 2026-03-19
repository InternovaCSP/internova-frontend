import axios from 'axios'

const api = axios.create({
    baseURL: '/api',          // proxied to http://localhost:5000 by vite.config.js
    headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('internova_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export const competitionApi = {
    getAll: () => api.get('/competitions'),
    getById: (id) => api.get(`/competitions/${id}`),
    create: (data) => api.post('/competitions', data),
    update: (id, data) => api.put(`/competitions/${id}`, data),
    delete: (id) => api.delete(`/competitions/${id}`)
};

export default api;
