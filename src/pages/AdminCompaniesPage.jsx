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
            setCompanies(data);
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

            // Optimistic UI Update: Remove the approved company from the list locally
            setCompanies(prev => prev.filter(c => c.companyId !== companyId));
        } catch (err) {
            console.error(`Failed to approve company ${companyId}:`, err);
            alert("Approval failed. Please check the network and try again.");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="dash-icon-btn"
                        style={{ background: 'var(--auth-slate)', padding: '8px' }}
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <span className="role-badge" style={{ background: 'rgba(0,120,212,.1)', color: 'var(--lp-blue)', borderColor: 'rgba(0,120,212,.3)' }}>
                            Moderation
                        </span>
                        <h1 className="dashboard-title" style={{ marginTop: '4px' }}>Pending Approvals</h1>
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--muted)' }}>
                        <Loader2 className="spinner" style={{ borderTopColor: 'var(--primary)', marginBottom: '16px' }} />
                        <p>Fetching pending requests...</p>
                    </div>
                ) : error ? (
                    <div style={{ padding: '24px', background: 'rgba(255,92,122,.05)', border: '1px solid rgba(255,92,122,.2)', borderRadius: '12px', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <AlertCircle size={24} />
                        <p>{error}</p>
                    </div>
                ) : companies.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center', background: 'var(--auth-white)', borderRadius: '16px', border: '1px dashed var(--auth-border)' }}>
                        <div style={{ width: '64px', height: '64px', background: 'var(--auth-slate)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <CheckCircle size={32} color="var(--success)" />
                        </div>
                        <h3 style={{ color: 'var(--auth-navy)', marginBottom: '8px' }}>All caught up!</h3>
                        <p style={{ color: 'var(--muted)' }}>There are no companies currently awaiting approval.</p>
                    </div>
                ) : (
                    <div className="lp-mock-card" style={{ padding: '0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'var(--auth-slate)', borderBottom: '1px solid var(--auth-border)' }}>
                                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--auth-navy)' }}>Company Name</th>
                                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--auth-navy)' }}>Industry</th>
                                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--auth-navy)' }}>Website</th>
                                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--auth-navy)', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.map((company) => (
                                    <tr key={company.companyId} style={{ borderBottom: '1px solid var(--auth-border)', transition: 'background 0.2s' }} className="hover-row">
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', background: 'var(--auth-slate)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lp-blue)' }}>
                                                    <Building2 size={20} />
                                                </div>
                                                <span style={{ fontWeight: 600, color: 'var(--auth-navy)' }}>{company.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', color: 'var(--lp-text-secondary)', fontSize: '14px' }}>
                                            {company.industry || 'Not specified'}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            {company.website ? (
                                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="auth-link" style={{ fontSize: '14px' }}>
                                                    {company.website.replace(/^https?:\/\//, '')}
                                                </a>
                                            ) : (
                                                <span style={{ color: 'var(--muted)', fontSize: '14px' }}>N/A</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleApprove(company.companyId)}
                                                disabled={processingId === company.companyId}
                                                className="lp-btn lp-btn--teal"
                                                style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}
                                            >
                                                {processingId === company.companyId ? (
                                                    <Loader2 className="spinner" style={{ width: '14px', height: '14px' }} />
                                                ) : (
                                                    'Approve'
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`
                .hover-row:hover {
                    background: #f8fafc;
                }
                .spinner {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
