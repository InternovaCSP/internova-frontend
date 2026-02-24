import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_DASHBOARDS = {
    Admin: '/admin/dashboard',
    Student: '/student/dashboard',
    Company: '/company/dashboard',
}

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const data = await login(email.trim(), password)
            const dest = ROLE_DASHBOARDS[data.role] ?? '/login'
            navigate(dest, { replace: true })
        } catch (err) {
            const msg = err?.response?.data?.error
                ?? err?.response?.data?.title
                ?? 'Invalid email or password.'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">Internova</div>
                <p className="auth-subtitle">Sign in to your account</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="divider" />

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don&apos;t have an account?{' '}
                    <Link to="/register">Create one</Link>
                </div>
            </div>
        </div>
    )
}
