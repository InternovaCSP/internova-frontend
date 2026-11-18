import axios from 'axios';

export const TOKEN_KEY = 'internova_token';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const url = config.url || '';
  if (!url.startsWith('/api')) {
    config.url = url.startsWith('/') ? `/api${url}` : `/api/${url}`;
  }

  return config;
});

/**
 * Unwraps arrays serialized by ASP.NET ReferenceHandler.Preserve (`$values`)
 * or wrapped response envelopes (`value`, `companies`).
 */
export function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.$values)) return data.$values;
  if (Array.isArray(data?.value)) return data.value;
  if (Array.isArray(data?.companies)) return data.companies;
  return [];
}

/**
 * Extracts a human-readable error message from Axios or ASP.NET validation responses.
 */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data;
  if (data?.errors && typeof data.errors === 'object') {
    return Object.values(data.errors).flat().join(' ');
  }
  return data?.error || data?.message || fallback;
}

export default apiClient;
