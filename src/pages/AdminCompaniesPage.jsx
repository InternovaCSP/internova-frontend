import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPendingCompanies, fetchAllCompanies, approveCompany, fetchCompanyInternships, approveInternship } from '../api/adminApi';
import { Building2, CheckCircle, AlertCircle, ArrowLeft, Loader2, X, Globe, MapPin, Info, Bell, Search, Briefcase, ExternalLink, ShieldCheck } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

/**
 * AdminCompaniesPage Component
 * 
 * Secure interface for platform administrators to review and approve 
 * newly registered companies. Features a professional sidebar layout.
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
    const [companyInternships, setCompanyInternships] = useState([]);
    const [loadingInternships, setLoadingInternships] = useState(false);
    const [approvingInternshipId, setApprovingInternshipId] = useState(null);

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
            if (activeTab === 'all') {
                // Refresh list if in "all" tab to show updated status
                loadData();
            }
            if (selectedCompany && (selectedCompany.companyId || selectedCompany.CompanyId) === companyId) {
                setSelectedCompany({...selectedCompany, status: 'Active', Status: 'Active'});
            }
        } catch (err) {
            console.error(`Failed to approve company ${companyId}:`, err);
            alert("Approval failed.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleApproveInternship = async (internshipId) => {
        try {
            setApprovingInternshipId(internshipId);
            await approveInternship(internshipId);
            setCompanyInternships(prev => prev.map(i => i.id === internshipId ? { ...i, status: 'Active' } : i));
        } catch (err) {
            console.error(`Failed to approve internship ${internshipId}:`, err);
            alert("Internship approval failed.");
        } finally {
            setApprovingInternshipId(null);
        }
    };

    const handleOpenModal = async (company) => {
        setSelectedCompany(company);
        setShowModal(true);
        setLoadingInternships(true);
        try {
            const data = await fetchCompanyInternships(company.companyId || company.CompanyId);
            const list = Array.isArray(data) ? data : (data?.$values || []);
            setCompanyInternships(list);
        } catch (err) {
            console.error("Failed to load company internships:", err);
            setCompanyInternships([]);
        } finally {
            setLoadingInternships(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTimeout(() => {
            setSelectedCompany(null);
            setCompanyInternships([]);
        }, 300);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                
                {/* Content Header */}
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
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Company Approvals</h2>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="text" 
                                placeholder="Search companies..." 
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
                    {/* Tabs area */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '24px' }}>

                        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <button 
                                style={{ 
                                    padding: '8px 20px', 
                                    borderRadius: '8px', 
                                    border: 'none', 
                                    background: activeTab === 'pending' ? 'white' : 'transparent', 
                                    color: activeTab === 'pending' ? '#2563eb' : '#64748b', 
                                    fontWeight: 600, 
                                    fontSize: '14px', 
                                    cursor: 'pointer',
                                    boxShadow: activeTab === 'pending' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                                }} 
                                onClick={() => setActiveTab('pending')}
                            >
                                Pending
                            </button>
                            <button 
                                style={{ 
                                    padding: '8px 20px', 
                                    borderRadius: '8px', 
                                    border: 'none', 
                                    background: activeTab === 'all' ? 'white' : 'transparent', 
                                    color: activeTab === 'all' ? '#2563eb' : '#64748b', 
                                    fontWeight: 600, 
                                    fontSize: '14px', 
                                    cursor: 'pointer',
                                    boxShadow: activeTab === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                                }} 
                                onClick={() => setActiveTab('all')}
                            >
                                All Companies
                            </button>
                        </div>
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
                            {companies.length === 0 ? (
                                <div style={{ padding: '80px 24px', textAlign: 'center', background: 'white', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
                                    <div style={{ width: '80px', height: '80px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                        <CheckCircle size={40} color="#15803d" />
                                    </div>
                                    <h2 style={{ color: '#0f172a', fontSize: '24px', marginBottom: '8px', fontWeight: 700 }}>No Applications</h2>
                                    <p style={{ color: '#64748b', margin: 0 }}>There are currently no companies awaiting approval.</p>
                                </div>
                            ) : (
                                companies.map((company, index) => {
                                    const id = company?.companyId || company?.CompanyId || index;
                                    const name = company?.companyName || company?.CompanyName || 'New Company';
                                    const industry = company?.industry || company?.Industry || 'Sector not specified';
                                    const statusValue = company?.status ?? company?.Status ?? 'Pending';
                                    const status = String(statusValue);
                                    // Fix: Handle both string 'Pending' and integer 0 (if somehow still coming through)
                                    const isPending = status.toLowerCase() === 'pending' || status === '0';
                                    
                                    return (
                                        <div 
                                            key={id} 
                                            onClick={() => handleOpenModal(company)} 
                                            style={{ 
                                                padding: '24px 32px', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'space-between', 
                                                background: '#ffffff', 
                                                border: '1px solid #e2e8f0', 
                                                borderRadius: '16px', 
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)', 
                                                transition: 'all 0.2s ease', 
                                                cursor: 'pointer' 
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.borderColor = '#3b82f6';
                                                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.borderColor = '#e2e8f0';
                                                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: '#1e293b' }}>{name}</h3>
                                                        {(activeTab === 'all' || !isPending) && (
                                                            <span style={{ 
                                                                padding: '4px 10px', 
                                                                borderRadius: '20px', 
                                                                fontSize: '11px', 
                                                                fontWeight: 700, 
                                                                textTransform: 'uppercase',
                                                                background: isPending ? '#fffbeb' : '#f0fdf4',
                                                                color: isPending ? '#b45309' : '#15803d',
                                                                border: `1px solid ${isPending ? '#fde68a' : '#bbf7d0'}`
                                                            }}>
                                                                {isPending ? 'Pending' : 'Active'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span style={{ fontSize: '14px', color: '#64748b' }}>{industry === 'Sector not specified' ? 'New registration (stub)' : industry}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {isPending && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleApprove(id); }} 
                                                        disabled={processingId === id} 
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
                                                        {processingId === id ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><CheckCircle size={16} /> Approve</>}
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
            </main>

            {/* Modal */}
            {showModal && selectedCompany && (
                <div 
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}
                    onClick={handleCloseModal}
                >
                    <div 
                        style={{ background: 'white', width: '90%', maxWidth: '750px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '20px', color: '#1e293b', margin: 0, fontWeight: 700 }}>{selectedCompany.companyName || selectedCompany.CompanyName}</h2>
                                    <span style={{ fontSize: '14px', color: '#64748b' }}>{selectedCompany.industry || selectedCompany.Industry || 'Industry unknown'}</span>
                                </div>
                            </div>
                            <button style={{ padding: '8px', borderRadius: '50%', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }} onClick={handleCloseModal}><X size={20} /></button>
                        </div>
                        
                        <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                                    <Info size={16} /><span>Description</span>
                                </div>
                                <p style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9', color: '#334155', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
                                    {selectedCompany.description || selectedCompany.Description || 'This company has not completed their profile yet. They may have been created automatically during a job posting.'}
                                </p>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                                        <MapPin size={16} /><span>Location</span>
                                    </div>
                                    <address style={{ fontStyle: 'normal', color: '#1e293b', fontSize: '15px' }}>{selectedCompany.address || selectedCompany.Address || 'No address.'}</address>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                                        <Globe size={16} /><span>Website</span>
                                    </div>
                                    <div style={{ fontSize: '15px' }}>
                                        {(selectedCompany.websiteUrl || selectedCompany.WebsiteUrl) ? (
                                            <a href={selectedCompany.websiteUrl || selectedCompany.WebsiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                                                {(selectedCompany.websiteUrl || selectedCompany.WebsiteUrl).replace(/^https?:\/\//, '')}
                                            </a>
                                        ) : 'N/A'}
                                    </div>
                                </div>
                            </div>

                            {/* Internships Section */}
                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        <Briefcase size={16} /><span>Job Postings ({companyInternships.length})</span>
                                    </div>
                                </div>

                                {loadingInternships ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', padding: '12px' }}>
                                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                        <span style={{ fontSize: '14px' }}>Loading postings...</span>
                                    </div>
                                ) : companyInternships.length === 0 ? (
                                    <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #e2e8f0', color: '#64748b', fontSize: '14px' }}>
                                        No internships posted by this company yet.
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {companyInternships.map(internship => (
                                            <div key={internship.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                                <div>
                                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1e293b' }}>{internship.title}</h4>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <MapPin size={12} /> {internship.location}
                                                        </span>
                                                        <span style={{ 
                                                            fontSize: '11px', 
                                                            fontWeight: 700, 
                                                            textTransform: 'uppercase',
                                                            color: internship.status === 'Active' ? '#10b981' : '#f59e0b'
                                                        }}>
                                                            {internship.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                {internship.status !== 'Active' && (
                                                    <button 
                                                        onClick={() => handleApproveInternship(internship.id)}
                                                        disabled={approvingInternshipId === internship.id}
                                                        style={{ 
                                                            padding: '6px 12px', 
                                                            borderRadius: '8px', 
                                                            background: '#10b981', 
                                                            color: 'white', 
                                                            border: 'none', 
                                                            fontSize: '12px', 
                                                            fontWeight: 600, 
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        {approvingInternshipId === internship.id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <><ShieldCheck size={14} /> Approve Job</>}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ padding: '24px 32px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                            <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontWeight: 600, cursor: 'pointer', padding: '10px 20px', borderRadius: '10px' }} onClick={handleCloseModal}>Dismiss</button>
                            {(String(selectedCompany.status || selectedCompany.Status || '').toLowerCase() === 'pending' || String(selectedCompany.status || selectedCompany.Status || '') === '0') && (
                                <button 
                                    style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: 600, background: '#10b981', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} 
                                    onClick={() => handleApprove(selectedCompany.companyId || selectedCompany.CompanyId)} 
                                    disabled={processingId === (selectedCompany.companyId || selectedCompany.CompanyId)}
                                >
                                    {processingId === (selectedCompany.companyId || selectedCompany.CompanyId) ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <><CheckCircle size={18} /> Approve Company</>}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
