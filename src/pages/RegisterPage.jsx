import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
    const { register } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'Student',
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }

        setLoading(true)
        try {
            await register(form.fullName.trim(), form.email.trim(), form.password, form.role)
            setSuccess('Account created! Redirecting to login…')
            setTimeout(() => navigate('/login', { replace: true }), 1500)
        } catch (err) {
            const status = err?.response?.status
            const msg = err?.response?.data?.error ?? err?.response?.data?.title

            if (status === 409) {
                setError('An account with this email already exists.')
            } else if (status === 400) {
                setError(msg ?? 'Please check your input and try again.')
            } else {
                setError(msg ?? 'Something went wrong. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <img src="/logo-long.png" alt="Internova" className="auth-logo" style={{ height: '40px', objectFit: 'contain', marginBottom: '0.75rem', display: 'block' }} />
                <p className="auth-subtitle">Create a new account</p>

                {error && <div className="alert alert-error stagger-1">{error}</div>}
                {success && <div className="alert alert-success stagger-1">{success}</div>}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group stagger-1">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            autoComplete="name"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Jane Doe"
                            required
                        />
                    </div>

                    <div className="form-group stagger-1">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-group stagger-2">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Min. 6 characters"
                            required
                        />
                    </div>

                    <div className="form-group stagger-2">
                        <label htmlFor="role">I am a…</label>
                        <select
                            id="role"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="Student">Student</option>
                            <option value="Company">Company</option>
                        </select>
                    </div>

                    <div className="divider stagger-3" />

                    <button type="submit" className="btn btn-primary stagger-3" disabled={loading}>
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    )
}
