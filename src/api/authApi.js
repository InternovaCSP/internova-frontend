import axios from 'axios';

// The proxy in vite.config.js maps /api to the .NET backend (localhost:5128)
const apiClient = axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor to attach JWT token if it exists
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('internova_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const login = async (email, password) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
};

export const register = async (userData) => {
    // Expected userData: { FullName, Email, Password, Role }
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
};

export const fetchMe = async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
};

export default apiClient;
