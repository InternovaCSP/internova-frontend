import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * AdminDashboard Component
 * 
 * The protected dashboard interface specifically for Administrative users.
 * Currently serves as a specialized layout shell for moderating the platform,
 * managing university-partner relationships, and overseeing standard users.
 * 
 * @returns {JSX.Element} The admin dashboard layout.
 */
export default function AdminDashboard() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <div className="dashboard">

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
