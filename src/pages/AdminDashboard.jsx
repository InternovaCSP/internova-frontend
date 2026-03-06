import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Building2 } from 'lucide-react'

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
                <h1 className="dashboard-title" style={{ color: 'var(--lp-navy)' }}>Admin Dashboard</h1>
                <p className="dashboard-meta" style={{ color: 'var(--lp-navy)', fontWeight: 500 }}>
                    Welcome, <span style={{ color: 'var(--lp-blue)' }}>{user?.email}</span>
                </p>
                <p className="dashboard-meta" style={{ color: 'var(--lp-text-secondary)', fontSize: '.82rem', marginBottom: '32px' }}>
                    Centralized platform oversight and management.
                </p>

                <div className="dash-mock-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    <button
                        onClick={() => navigate('/admin/companies')}
                        className="lp-card"
                        style={{
                            padding: '32px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: 'white',
                            width: '100%',
                            border: '1px solid var(--lp-border)'
                        }}
                    >
                        <div style={{ width: '56px', height: '56px', background: 'rgba(0,120,212,.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lp-blue)' }}>
                            <Building2 size={28} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--lp-navy)', marginBottom: '8px' }}>Company Approvals</h3>
                            <p style={{ fontSize: '14px', color: 'var(--lp-text-secondary)', lineHeight: '1.5' }}>Review registration requests and verify new industry partners for the platform.</p>
                        </div>
                    </button>

                    {/* Placeholder for other admin features */}
                    <div className="lp-card" style={{ padding: '32px', opacity: 0.6, border: '1px dashed var(--lp-border)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <div>
                            <p style={{ fontSize: '14px', color: 'var(--lp-text-secondary)', fontWeight: 500 }}>Analytics & Reports</p>
                            <p style={{ fontSize: '12px', color: 'var(--muted)' }}>Feature coming soon</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
