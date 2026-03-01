import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, BookOpen, Briefcase, Award } from 'lucide-react'

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
                <img src="/logo-long.png" alt="Internova" className="brand" style={{ height: '28px', objectFit: 'contain' }} />
                <button className="btn btn-ghost" style={{ width: 'auto', padding: '.45rem 1rem' }} onClick={handleLogout}>
                    Sign Out
                </button>
            </nav>

            <div className="dashboard-body">
                <span className="role-badge">Student</span>
                <h1 className="dashboard-title">Student Dashboard</h1>
                <p className="dashboard-meta">
                    Welcome, <strong>{user?.email}</strong>
                </p>
                <p className="dashboard-meta" style={{ color: 'var(--muted)', fontSize: '.82rem', marginBottom: '2rem' }}>
                    Manage your profile, find internships, and track your applications.
                </p>

                {/* Quick action cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', maxWidth: '800px' }}>
                    {/* Profile card */}
                    <Link to="/student/profile" style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            padding: '1.5rem',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s, transform 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#0078D4'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                            <User size={28} color="#0078D4" />
                            <div>
                                <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>My Profile</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Add your university details & upload your resume</p>
                            </div>
                        </div>
                    </Link>

                    {/* Internships card (coming soon) */}
                    <div style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '1.5rem',
                        opacity: 0.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                    }}>
                        <Briefcase size={28} color="#1D8954" />
                        <div>
                            <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>Internships</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Browse & apply for internships — coming soon</p>
                        </div>
                    </div>

                    {/* Projects card (coming soon) */}
                    <div style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '1.5rem',
                        opacity: 0.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                    }}>
                        <BookOpen size={28} color="#F9A825" />
                        <div>
                            <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>Projects</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>University projects & competitions — coming soon</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
