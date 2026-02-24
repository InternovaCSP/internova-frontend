import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { jwtDecode } from 'jwt-decode'
import api from '../services/api'

const AuthContext = createContext(null)

/**
 * Parses a JWT token string into a user object with { userId, email, role }.
 * Returns null if the token is missing or invalid.
 */
function parseToken(token) {
    if (!token) return null
    try {
        const payload = jwtDecode(token)
        return {
            userId: payload.user_id ?? payload.sub,
            email: payload.email,
            role: payload.role ?? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        }
    } catch {
        return null
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('internova_token'))
    const [user, setUser] = useState(() => parseToken(localStorage.getItem('internova_token')))

    /** Store token, update user state, persist in localStorage */
    const storeToken = useCallback((newToken) => {
        localStorage.setItem('internova_token', newToken)
        setToken(newToken)
        setUser(parseToken(newToken))
    }, [])

    /** POST /api/auth/login — resolves with the auth response */
    const login = useCallback(async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password })
        storeToken(data.token)
        return data
    }, [storeToken])

    /** POST /api/auth/register */
    const register = useCallback(async (fullName, email, password, role) => {
        const { data } = await api.post('/auth/register', { fullName, email, password, role })
        return data
    }, [])

    /** Clear session */
    const logout = useCallback(() => {
        localStorage.removeItem('internova_token')
        setToken(null)
        setUser(null)
    }, [])

    const value = useMemo(
        () => ({ token, user, login, register, logout }),
        [token, user, login, register, logout]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** Hook — throws if used outside AuthProvider */
export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
    return ctx
}
