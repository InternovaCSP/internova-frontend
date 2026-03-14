import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPendingCompanies, fetchAllCompanies, approveCompany } from '../api/adminApi';
import { Building2, CheckCircle, AlertCircle, ArrowLeft, Loader2, X, Globe, MapPin, Info } from 'lucide-react';

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
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'all'

    useEffect(() => { loadData(); }, [activeTab]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = activeTab === 'pending' ? await fetchPendingCompanies() : await fetchAllCompanies();
            const list = Array.isArray(data) ? data : (data?.value || data?.companies || data?.$values || []);
            setCompanies(list);
        } catch (err) {
            console.error(`Error loading ${activeTab} companies:`, err);
            setError(`Failed to load ${activeTab} companies.`);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (companyId) => {
        try {
            setProcessingId(companyId);
            await approveCompany(companyId);
            setCompanies(prev => prev.filter(c => (c.companyId || c.CompanyId) !== companyId));
            if (selectedCompany && (selectedCompany.companyId || selectedCompany.CompanyId) === companyId) {
                handleCloseModal();
            }
        } catch (err) {
            console.error(`Failed to approve company ${companyId}:`, err);
            alert("Approval failed.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleOpenModal = (company) => {
        setSelectedCompany(company);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTimeout(() => setSelectedCompany(null), 300);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-body">
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <button onClick={() => navigate('/admin/dashboard')} className="dash-icon-btn" style={{ background: 'white', padding: '12px', borderRadius: '14px', border: '1px solid var(--auth-border)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="dashboard-title" style={{ fontSize: '28px', marginBottom: '4px' }}>Company Management</h1>
                            <p style={{ color: 'var(--muted)', fontSize: '15px' }}>{activeTab === 'pending' ? 'Review newly registered organizations' : 'Overview of all companies'}</p>
                        </div>
                    </div>

                    <div className="tab-switcher">
                        <button className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Pending</button>
                        <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Companies</button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <Loader2 className="spinner" size={40} color="var(--primary)" />
                        <p style={{ marginTop: '16px', color: 'var(--muted)' }}>Loading...</p>
                    </div>
                ) : error ? (
                    <div style={{ padding: '24px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '12px', color: '#c53030' }}>
                        <AlertCircle size={24} style={{ marginBottom: '8px' }} />
                        <p>{error}</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {companies.length === 0 ? (
                            <div style={{ padding: '64px 24px', textAlign: 'center', background: '#fff', borderRadius: '24px', border: '1px dashed #cbd5e0' }}>
                                <div style={{ width: '80px', height: '80px', background: '#f0fff4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                    <CheckCircle size={40} color="#48bb78" />
                                </div>
                                <h2 style={{ color: 'var(--auth-navy)', fontSize: '24px', marginBottom: '8px' }}>Wonderful!</h2>
                                <p style={{ color: 'var(--muted)' }}>No companies found.</p>
                            </div>
                        ) : (
                            companies.map((company, index) => {
                                const id = company?.companyId || company?.CompanyId || index;
                                const name = company?.companyName || company?.CompanyName || 'New Company';
                                const industry = company?.industry || company?.Industry || 'Sector not specified';
                                const statusValue = company?.status || company?.Status || 'Pending';
                                const status = String(statusValue);
                                const isPending = status.toLowerCase() === 'pending';
                                
                                return (
                                    <div key={id} className="lp-mock-card" onClick={() => handleOpenModal(company)} style={{ padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid #f1f5f9' }}>
                                                <Building2 size={32} />
                                            </div>
                                            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--auth-navy)' }}>{name}</h3>
                                                    {activeTab === 'all' && (
                                                        <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
                                                    )}
                                                </div>
                                                <span style={{ fontSize: '14px', color: '#718096' }}>{industry}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {isPending && (
                                                <button onClick={(e) => { e.stopPropagation(); handleApprove(id); }} disabled={processingId === id} className="lp-btn lp-btn--teal" style={{ padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px', background: '#10b981', border: 'none', color: 'white' }}>
                                                    {processingId === id ? <Loader2 size={16} className="spinner" /> : <><CheckCircle size={16} /> Approve</>}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && selectedCompany && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className="modal-icon-bg"><Building2 size={24} /></div>
                                <div>
                                    <h2 className="modal-title">{selectedCompany.companyName || selectedCompany.CompanyName}</h2>
                                    <span className="modal-subtitle">{selectedCompany.industry || selectedCompany.Industry}</span>
                                </div>
                            </div>
                            <button className="modal-close-btn" onClick={handleCloseModal}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-section">
                                <div className="detail-label"><Info size={16} /><span>Description</span></div>
                                <p className="detail-value description-text">{selectedCompany.description || selectedCompany.Description || 'No description provided.'}</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div className="detail-section">
                                    <div className="detail-label"><MapPin size={16} /><span>Location</span></div>
                                    <address className="detail-value" style={{ fontStyle: 'normal' }}>{selectedCompany.address || selectedCompany.Address || 'No address.'}</address>
                                </div>
                                <div className="detail-section">
                                    <div className="detail-label"><Globe size={16} /><span>Website</span></div>
                                    <div className="detail-value">
                                        {(selectedCompany.websiteUrl || selectedCompany.WebsiteUrl) ? (
                                            <a href={selectedCompany.websiteUrl || selectedCompany.WebsiteUrl} target="_blank" rel="noopener noreferrer" className="modal-link">
                                                {(selectedCompany.websiteUrl || selectedCompany.WebsiteUrl).replace(/^https?:\/\//, '')}
                                            </a>
                                        ) : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="lp-btn modal-cancel-btn" onClick={handleCloseModal}>Dismiss</button>
                            {(String(selectedCompany.status || selectedCompany.Status || '').toLowerCase() === 'pending') && (
                                <button className="lp-btn lp-btn--teal" style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => handleApprove(selectedCompany.companyId || selectedCompany.CompanyId)} disabled={processingId === (selectedCompany.companyId || selectedCompany.CompanyId)}>
                                    {processingId === (selectedCompany.companyId || selectedCompany.CompanyId) ? <Loader2 size={18} className="spinner" /> : <><CheckCircle size={18} /> Approve Company</>}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .lp-mock-card:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
                .tab-switcher { display: flex; background: #f1f5f9; padding: 4px; border-radius: 12px; border: 1px solid #e2e8f0; }
                .tab-btn { padding: 8px 24px; border-radius: 10px; border: none; background: transparent; color: #64748b; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; }
                .tab-btn:hover { color: var(--auth-navy); }
                .tab-btn.active { background: white; color: var(--primary); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
                .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; }
                .status-badge.pending { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
                .status-badge.active, .status-badge.approved { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.3s ease-out; }
                .modal-content { background: white; width: 90%; max-width: 650px; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                .modal-header { padding: 24px 32px; border-bottom: 1px solid #f1f5f9; display: flex; alignItems: center; justifyContent: space-between; }
                .modal-icon-bg { width: 48px; height: 48px; background: #f1f5f9; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--primary); }
                .modal-title { font-size: 20px; color: var(--auth-navy); margin: 0; font-weight: 700; }
                .modal-subtitle { font-size: 14px; color: var(--muted); }
                .modal-close-btn { padding: 8px; border-radius: 50%; border: none; background: transparent; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
                .modal-close-btn:hover { background: #f1f5f9; color: var(--danger); }
                .modal-body { padding: 32px; }
                .detail-section { margin-bottom: 24px; }
                .detail-label { display: flex; alignItems: center; gap: 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
                .detail-value { color: var(--auth-navy); font-size: 15px; line-height: 1.6; }
                .description-text { background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #f1f5f9; }
                .modal-link { color: var(--primary); text-decoration: none; font-weight: 600; }
                .modal-link:hover { text-decoration: underline; }
                .modal-footer { padding: 24px 32px; background: #f8fafc; display: flex; justify-content: flex-end; gap: 16px; }
                .modal-cancel-btn { background: transparent; color: #64748b; font-weight: 600; }
                .modal-cancel-btn:hover { background: #f1f5f9; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
}
