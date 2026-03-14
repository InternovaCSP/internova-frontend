import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Building2, Bell, Search } from 'lucide-react'
import AdminSidebar from '../components/AdminSidebar'

/**
 * AdminDashboard Component
 * 
 * The protected dashboard interface specifically for Administrative users.
 * Features a professional sidebar layout and minimalistic UI.
 */
export default function AdminDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                
                {/* Content Header - Minimalistic replacement for topnav */}
                <header style={{ 
                    height: '70px', 
                    background: 'white', 
                    borderBottom: '1px solid #e2e8f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0 40px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Overview</h2>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                style={{ 
                                    padding: '8px 12px 8px 38px', 
                                    borderRadius: '8px', 
                                    border: '1px solid #e2e8f0', 
                                    fontSize: '14px',
                                    outline: 'none',
                                    width: '240px',
                                    transition: 'border 0.2s'
                                }}
                            />
                        </div>
                        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Bell size={20} />
                        </button>
                    </div>
                </header>

                {/* Dashboard Body */}
                <div style={{ padding: '32px 40px', maxWidth: '1200px' }}>
                    

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                        <button
                            onClick={() => navigate('/admin/companies')}
                            style={{
                                padding: '32px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '24px',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                                outline: 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 20px -10px rgba(0,0,0,0.08)';
                                e.currentTarget.style.borderColor = '#3b82f6';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                            }}
                        >
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Company Approvals</h3>
                                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                                    Review and verify new company registrations and membership requests.
                                </p>
                            </div>
                            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f1f5f9', color: '#2563eb', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                View pending 
                                <span style={{ padding: '2px 8px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', fontSize: '12px' }}>12</span>
                            </div>
                        </button>

                        {/* Placeholder for other admin features */}
                        <div style={{ 
                            padding: '32px', 
                            background: '#f8fafc', 
                            borderRadius: '16px', 
                            border: '1px dashed #cbd5e1', 
                            display: 'flex', 
                            flexDirection: 'column',
                            justifyContent: 'center', 
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: '12px'
                        }}>
                            <div style={{ color: '#94a3b8' }}>
                                <p style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Analytics & Reports</p>
                                <p style={{ fontSize: '13px', margin: 0 }}>Feature coming soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
