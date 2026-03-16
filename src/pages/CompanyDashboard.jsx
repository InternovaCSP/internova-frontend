import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import internshipService from '../services/internshipService'
import { Plus, Briefcase, MapPin, Clock, Calendar, CheckCircle, XCircle } from 'lucide-react'

/**
 * CompanyDashboard Component
 * 
 * The main dashboard for companies to manage their internship postings.
 * Fetches and displays the company's active and draft internships.
 * 
 * @returns {JSX.Element} The company dashboard layout.
 */
export default function CompanyDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [myPostings, setMyPostings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchMyPostings() {
            try {
                const data = await internshipService.getCompanyInternships()
                setMyPostings(data)
            } catch (error) {
                console.error('Error loading postings:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            fetchMyPostings()
        }
    }, [user])

    return (
        <div className="dash-v2-layout">
            <div className="dash-v2-container">
                <header className="dash-v2-welcome-row">
                    <div className="dash-v2-welcome-text">
                        <span className="in-user-role" style={{ fontSize: '12px', padding: '2px 8px', marginBottom: '8px', display: 'inline-block' }}>
                            Company Partner
                        </span>
                        <h1>Company Dashboard</h1>
                        <p>Welcome back, <strong>{user?.email}</strong>. Manage your talent pipeline.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to="/company/applications" className="in-btn in-btn-outline-azure" style={{ gap: '8px' }}>
                            <CheckCircle size={18} /> Manage Applications
                        </Link>
                        <Link to="/company/create-internship" className="in-btn in-btn-primary-azure" style={{ gap: '8px' }}>
                            <Plus size={18} /> Post New Internship
                        </Link>
                    </div>
                </header>

                <section className="dash-v2-analytics-row" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="dash-v2-card">
                        <div className="dash-v2-section-title">
                            <span>My Postings</span>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>
                                {myPostings.length} Active Opportunities
                            </div>
                        </div>

                        {loading ? (
                            <div className="dash-v2-skeleton-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                                {[1, 2, 3].map(n => (
                                    <div key={n} className="in-skeleton" style={{ height: '200px', borderRadius: '16px' }}></div>
                                ))}
                            </div>
                        ) : myPostings.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '48px 0' }}>
                                <div style={{ background: '#f8fafc', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#94a3b8' }}>
                                    <Briefcase size={32} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>No postings found</h3>
                                <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '320px', margin: '0 auto 24px' }}>
                                    Start attracting top talent by creating your first internship posting today.
                                </p>
                                <Link to="/company/create-internship" className="in-btn in-btn-outline-teal">
                                    Create First Posting
                                </Link>
                            </div>
                        ) : (
                            <div className="dash-v2-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                                {myPostings.map(post => (
                                    <div key={post.id} className="dash-v2-card dash-v2-card-interactive" style={{ border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                            <div className="dash-v2-kpi-icon-wrap dash-v2-kpi-icon-azure">
                                                <Briefcase size={20} />
                                            </div>
                                            {post.status === 'Pending Approval' ? (
                                                <span className="dash-v2-kpi-trend" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5' }}>Awaiting Approval</span>
                                            ) : post.isPublished ? (
                                                <span className="dash-v2-kpi-trend dash-v2-kpi-trend-positive">Active</span>
                                            ) : (
                                                <span className="dash-v2-kpi-trend" style={{ background: '#f1f5f9', color: '#64748b' }}>Draft</span>
                                            )}
                                        </div>
                                        
                                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '12px' }}>{post.title}</h3>
                                        
                                        <div style={{ display: 'grid', gap: '8px', marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                                                <MapPin size={14} /> {post.location}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                                                <Clock size={14} /> {post.duration}
                                            </div>
                                        </div>

                                        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                                            <button 
                                                className="dash-v2-link" 
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                                onClick={() => navigate(`/internships?id=${post.id}`)}
                                            >
                                                View Listing
                                            </button>
                                            <span style={{ color: '#e2e8f0' }}>|</span>
                                            <button className="dash-v2-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: 0.6 }}>
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
                
                <footer style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', marginTop: '16px' }}>
                    Industrial data is role-protected and securely managed.
                </footer>
            </div>
        </div>
    )
}
