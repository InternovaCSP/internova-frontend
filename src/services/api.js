import axios from 'axios'

const api = axios.create({
    // Use VITE_API_BASE_URL if it exists (e.g., prod environments), otherwise use the local dev proxy '/api'
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('internova_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export default api
