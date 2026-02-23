import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function StudentDashboard() {
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
                <span className="role-badge">Student</span>
                <h1 className="dashboard-title">Student Dashboard</h1>
                <p className="dashboard-meta">Welcome, <strong>{user?.email}</strong></p>
                <p className="dashboard-meta" style={{ color: 'var(--muted)', fontSize: '.82rem' }}>
                    Internship listings &amp; applications coming soon.
                </p>
            </div>
        </div>
    )
}
