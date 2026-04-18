import axios from 'axios'

const api = axios.create({
    // Store just the domain as the base; we'll rewrite the path in the interceptor
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
    headers: { 'Content-Type': 'application/json' },
})

// Attach JWT and ensure /api prefix exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('internova_token')
    if (token) config.headers.Authorization = `Bearer ${token}`

    // Ensure that the request path begins with /api
    // Since VITE base might be just the domain, and developers might write '/auth/xyz'
    let url = config.url || '';
    if (!url.startsWith('/api')) {
        // Handle routes that may or may not start with a slash
        config.url = url.startsWith('/') ? `/api${url}` : `/api/${url}`;
    }

    return config
})

export const competitionApi = {
    getAll: () => api.get('/competitions'),
    getById: (id) => api.get(`/competitions/${id}`),
    create: (data) => api.post('/competitions', data),
    update: (id, data) => api.put(`/competitions/${id}`, data),
    delete: (id) => api.delete(`/competitions/${id}`)
};

export const seminarApi = {
    getAll: () => api.get('/seminars'),
    getById: (id) => api.get(`/seminars/${id}`),
    create: (data) => api.post('/seminars', data),
    vote: (id) => api.post(`/seminars/${id}/vote`)
};

export const userSettingsApi = {
    get: () => api.get('/settings'),
    update: (data) => api.put('/settings', data)
};

export const authManagementApi = {
    changePassword: (data) => api.post('/auth/change-password', data),
    deleteAccount: () => api.delete('/auth/account')
};

export const adminApi = {
    getStats: () => api.get('/admin/stats')
};

export default api;
