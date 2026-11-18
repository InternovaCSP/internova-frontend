import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient, { TOKEN_KEY } from '../api/client';

const AuthContext = createContext(null);

function parseToken(token) {
  if (!token) return null;
  try {
    const payload = jwtDecode(token);
    return {
      userId: payload.user_id ?? payload.sub,
      email: payload.email,
      role: payload.role ?? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => parseToken(localStorage.getItem(TOKEN_KEY)));

  const storeToken = useCallback((newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(parseToken(newToken));
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { data } = await apiClient.post('/auth/login', { email, password });
      storeToken(data.token);
      return data;
    },
    [storeToken]
  );

  const register = useCallback(async (fullName, email, password, role) => {
    const { data } = await apiClient.post('/auth/register', { fullName, email, password, role });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, login, register, logout }),
    [token, user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
