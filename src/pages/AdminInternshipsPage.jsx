import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPendingInternships, approveInternship } from '../api/adminApi';
import { Briefcase, CheckCircle, AlertCircle, ArrowLeft, Loader2, Search, Bell, MapPin, Building2, ExternalLink, ShieldCheck } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

/**
 * AdminInternshipsPage Component
 * 
 * A dedicated interface for administrators to review and approve 
 * pending internship postings across all companies.
 */
export default function AdminInternshipsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchPendingInternships();
            const list = Array.isArray(data) ? data : (data?.$values || []);
            setInternships(list);
        } catch (err) {
            console.error("Error loading pending internships:", err);
            setError("Failed to load pending internships.");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (internshipId) => {
        try {
            setProcessingId(internshipId);
            await approveInternship(internshipId);
            setInternships(prev => prev.filter(i => i.id !== internshipId));
        } catch (err) {
            console.error(`Failed to approve internship ${internshipId}:`, err);
            alert("Approval failed.");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            <AdminSidebar />

            <main style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '8px' }} onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                            <ArrowLeft size={20} />
                        </button>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Internship Approvals</h2>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="text" 
                                placeholder="Search postings..." 
                                style={{ 
                                    padding: '8px 12px 8px 38px', 
                                    borderRadius: '8px', 
                                    border: '1px solid #e2e8f0', 
                                    fontSize: '14px',
                                    outline: 'none',
                                    width: '240px'
                                }}
                            />
                        </div>
                        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                            <Bell size={20} />
                        </button>
                    </div>
                </header>

                <div style={{ padding: '32px 40px', maxWidth: '1200px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Pending Internships</h1>
                        <p style={{ color: '#64748b', margin: 0 }}>Review and approve new internship postings from all companies.</p>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '100px 0' }}>
                            <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={40} color="#2563eb" />
                            <p style={{ marginTop: '16px', color: '#64748b' }}>Loading...</p>
                        </div>
                    ) : error ? (
                        <div style={{ padding: '24px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <AlertCircle size={24} />
                            <p style={{ margin: 0 }}>{error}</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {internships.length === 0 ? (
                                <div style={{ padding: '80px 24px', textAlign: 'center', background: 'white', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
                                    <div style={{ width: '80px', height: '80px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                        <CheckCircle size={40} color="#15803d" />
                                    </div>
                                    <h2 style={{ color: '#0f172a', fontSize: '24px', marginBottom: '8px', fontWeight: 700 }}>All Caught Up!</h2>
                                    <p style={{ color: '#64748b', margin: 0 }}>There are no internships awaiting approval.</p>
                                </div>
                            ) : (
                                internships.map((internship) => (
                                    <div 
                                        key={internship.id} 
                                        style={{ 
                                            padding: '24px 32px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between', 
                                            background: '#ffffff', 
                                            border: '1px solid #e2e8f0', 
                                            borderRadius: '16px', 
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div style={{ width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                                                <Briefcase size={24} />
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: '#1e293b' }}>{internship.title}</h3>
                                                    <span style={{ 
                                                        padding: '4px 10px', 
                                                        borderRadius: '20px', 
                                                        fontSize: '11px', 
                                                        fontWeight: 700, 
                                                        textTransform: 'uppercase',
                                                        background: '#fffbeb',
                                                        color: '#b45309',
                                                        border: '1px solid #fde68a'
                                                    }}>
                                                        Pending
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748b', fontSize: '14px' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Building2 size={14} /> {internship.companyName || 'Unknown Company'}
                                                    </span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <MapPin size={14} /> {internship.location}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <button 
                                                onClick={() => handleApprove(internship.id)}
                                                disabled={processingId === internship.id}
                                                style={{ 
                                                    padding: '10px 20px', 
                                                    borderRadius: '10px', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '8px', 
                                                    fontWeight: 600, 
                                                    fontSize: '14px', 
                                                    background: '#10b981', 
                                                    border: 'none', 
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    transition: 'opacity 0.2s'
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                            >
                                                {processingId === internship.id ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><ShieldCheck size={16} /> Approve</>}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
