import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPendingCompanies, approveCompany } from '../api/adminApi';
import { Building2, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

/**
 * AdminCompaniesPage Component
 * 
 * Secure interface for platform administrators to review and approve 
 * newly registered companies. Features a responsive grid/table and
 * optimistic UI updates for a seamless management experience.
 */
export default function AdminCompaniesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        loadPendingCompanies();
    }, []);

    const loadPendingCompanies = async () => {
        try {
            setLoading(true);
            const data = await fetchPendingCompanies();
            
            // Handle various backend response formats (direct array or { value: [], ... })
            const list = Array.isArray(data) ? data : (data?.value || data?.companies || data?.$values || []);
            setCompanies(list);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch pending companies:", err);
            setError("Could not load pending companies. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (companyId) => {
        try {
            setProcessingId(companyId);
            await approveCompany(companyId);
            
            // Success! Remove from local list
            setCompanies(prev => prev.filter(c => (c.companyId || c.CompanyId) !== companyId));
        } catch (err) {
            console.error(`Failed to approve company ${companyId}:`, err);
            alert("Approval failed. Please ensure the backend is running and try again.");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-body">
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="dash-icon-btn"
                            style={{ background: 'var(--auth-slate)', padding: '10px', borderRadius: '12px' }}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="dashboard-title">Company Approvals</h1>
                            <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Review and verify newly registered organizations</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <Loader2 className="spinner" size={40} color="var(--primary)" />
                        <p style={{ marginTop: '16px', color: 'var(--muted)' }}>Loading pending requests...</p>
                    </div>
                ) : error ? (
                    <div style={{ padding: '24px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '12px', color: '#c53030' }}>
                        <AlertCircle size={24} style={{ marginBottom: '8px' }} />
                        <p>{error}</p>
                    </div>
                ) : companies.length === 0 ? (
                    <div style={{ padding: '64px 24px', textAlign: 'center', background: '#fff', borderRadius: '24px', border: '1px dashed #cbd5e0' }}>
                        <div style={{ width: '80px', height: '80px', background: '#f0fff4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <CheckCircle size={40} color="#48bb78" />
                        </div>
                        <h2 style={{ color: 'var(--auth-navy)', fontSize: '24px', marginBottom: '8px' }}>Wonderful!</h2>
                        <p style={{ color: 'var(--muted)' }}>All companies have been processed and approved.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {companies.map((company, index) => {
                            const id = company?.companyId || company?.CompanyId || index;
                            const name = company?.companyName || company?.CompanyName || 'New Company';
                            const industry = company?.industry || company?.Industry || 'Sector not specified';
                            const website = company?.websiteUrl || company?.WebsiteUrl;

                            return (
                                <div key={id} className="lp-mock-card" style={{ 
                                    padding: '24px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    border: '1px solid var(--auth-border)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    cursor: 'default'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ 
                                            width: '64px', 
                                            height: '64px', 
                                            background: 'var(--auth-slate)', 
                                            borderRadius: '16px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            color: 'var(--primary)'
                                        }}>
                                            <Building2 size={32} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '18px', color: 'var(--auth-navy)', marginBottom: '4px', fontWeight: 700 }}>{name}</h3>
                                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                                <span style={{ fontSize: '14px', color: '#718096', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    {industry}
                                                </span>
                                                {website && (
                                                    <a href={website} target="_blank" rel="noopener noreferrer" 
                                                       style={{ fontSize: '14px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                                                        {website.replace(/^https?:\/\//, '')}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleApprove(id)}
                                        disabled={processingId === id}
                                        className="lp-btn lp-btn--teal"
                                        style={{ 
                                            padding: '12px 24px', 
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontWeight: 600
                                        }}
                                    >
                                        {processingId === id ? (
                                            <Loader2 size={18} className="spinner" />
                                        ) : (
                                            <>
                                                <CheckCircle size={18} />
                                                Approve Company
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <style>{`
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .lp-mock-card:hover { 
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                }
            `}</style>
        </div>
    );
}
