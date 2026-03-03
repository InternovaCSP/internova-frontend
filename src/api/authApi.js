/**
 * api/authApi.js
 * 
 * Centralized API client for authentication and user profile operations.
 * Configures an Axios instance with base headers and implements a request
 * interceptor to automatically inject the JWT token into all outgoing requests,
 * ensuring secure communication with the backend.
 */
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

/**
 * Authenticates a user with the backend.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} The authentication response (token, user details).
 */
export const login = async (email, password) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
};

/**
 * Registers a new account.
 * @param {Object} userData - Registration payload { FullName, Email, Password, Role }.
 * @returns {Promise<Object>} The backend registration response.
 */
export const register = async (userData) => {
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
};

/**
 * Fetches the currently authenticated user's base identity.
 * @returns {Promise<Object>} Identity object.
 */
export const fetchMe = async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
};

/**
 * Fetches the extended profile data for a Student user.
 * @returns {Promise<Object>} Detailed student profile data, including resume and academic info.
 */
export const fetchStudentProfile = async () => {
    const response = await apiClient.get('/api/student/profile');
    return response.data;
};

export default apiClient;
