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

export default api
