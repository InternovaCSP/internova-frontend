import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function CompanyDashboard() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <div className="dashboard">
            <nav className="dashboard-nav">
                <img src="/logo-long.png" alt="Internova" className="brand" style={{ height: '28px', objectFit: 'contain' }} />
                <button className="btn btn-ghost" style={{ width: 'auto', padding: '.45rem 1rem' }} onClick={handleLogout}>
                    Sign Out
                </button>
            </nav>
            <div className="dashboard-body">
                <span className="role-badge" style={{ background: 'rgba(52,211,153,.12)', color: 'var(--success)', borderColor: 'rgba(52,211,153,.3)' }}>
                    Company
                </span>
                <h1 className="dashboard-title">Company Dashboard</h1>
                <p className="dashboard-meta">Welcome, <strong>{user?.email}</strong></p>
                <p className="dashboard-meta" style={{ color: 'var(--muted)', fontSize: '.82rem' }}>
                    Post internships &amp; browse candidates — coming soon.
                </p>
            </div>
        </div>
    )
}
