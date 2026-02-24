import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <div className="dashboard">
            <nav className="dashboard-nav">
                <span className="brand">Internova</span>
                <button className="btn btn-ghost" style={{ width: 'auto', padding: '.45rem 1rem' }} onClick={handleLogout}>
                    Sign Out
                </button>
            </nav>
            <div className="dashboard-body">
                <span className="role-badge" style={{ background: 'rgba(255,92,122,.1)', color: 'var(--danger)', borderColor: 'rgba(255,92,122,.3)' }}>
                    Admin
                </span>
                <h1 className="dashboard-title">Admin Dashboard</h1>
                <p className="dashboard-meta">Welcome, <strong>{user?.email}</strong></p>
                <p className="dashboard-meta" style={{ color: 'var(--muted)', fontSize: '.82rem' }}>
                    User management &amp; platform overview — coming soon.
                </p>
            </div>
        </div>
    )
}
