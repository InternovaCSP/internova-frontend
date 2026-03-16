import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCompanyApplications, updateApplicationStatus } from '../api/companyApi';
import { Loader2, Search, Filter, ArrowLeft, Mail, Calendar, MapPin, CheckCircle, XCircle, Clock, User, Briefcase, ChevronDown } from 'lucide-react';

export default function CompanyApplicationsPage() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => { loadApplications(); }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const data = await fetchCompanyApplications();
            const list = Array.isArray(data) ? data : (data?.$values || []);
            setApplications(list);
        } catch (err) {
            console.error("Failed to load applications:", err);
            setError("Could not load applications.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (applicationId, newStatus) => {
        try {
            setProcessingId(applicationId);
            await updateApplicationStatus(applicationId, newStatus);
            setApplications(prev => prev.map(app => 
                app.id === applicationId ? { ...app, status: newStatus } : app
            ));
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Status update failed.");
        } finally {
            setProcessingId(null);
        }
    };

    const statusColors = {
        Applied: { bg: '#eff6ff', text: '#1d4ed8', border: '#dbeafe' },
        Shortlisted: { bg: '#f0fdf4', text: '#15803d', border: '#dcfce7' },
        Interviewing: { bg: '#fefce8', text: '#a16207', border: '#fef9c3' },
        Selected: { bg: '#fdf2f8', text: '#be185d', border: '#fce7f3' },
        Rejected: { bg: '#fef2f2', text: '#991b1b', border: '#fee2e2' }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = (app.studentName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                             (app.internshipTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '60px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                    <button onClick={() => navigate('/company/dashboard')} style={{ 
                        background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', 
                        padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' 
                    }}>
                        <ArrowLeft size={20} color="#64748b" />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Manage Applications</h1>
                        <p style={{ color: '#64748b', margin: '4px 0 0' }}>Review and advance candidates through your talent pipeline.</p>
                    </div>
                </div>

                <div style={{ 
                    background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', 
                    display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' 
                }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                            type="text" 
                            placeholder="Search by student or role..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                width: '100%', padding: '12px 12px 12px 48px', borderRadius: '12px', 
                                border: '1px solid #e2e8f0', outline: 'none', fontSize: '15px' 
                            }} 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Filter:</span>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ 
                                padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', 
                                background: 'white', cursor: 'pointer', outline: 'none', fontWeight: 500 
                            }}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <Loader2 size={40} className="animate-spin" color="#3b82f6" />
                        <p style={{ marginTop: '16px', color: '#64748b' }}>Fetching candidates...</p>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#ef4444' }}>{error}</div>
                ) : filteredApplications.length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', padding: '80px 24px', background: 'white', 
                        borderRadius: '20px', border: '1px dashed #cbd5e1' 
                    }}>
                        <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#94a3b8' }}>
                            <User size={32} />
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>No candidates found</h3>
                        <p style={{ color: '#64748b' }}>Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {filteredApplications.map(app => (
                            <div key={app.id} style={{ 
                                background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', 
                                padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
                                    <div style={{ 
                                        width: '56px', height: '56px', borderRadius: '16px', background: '#f8fafc',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6'
                                    }}>
                                        <User size={28} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>{app.studentName}</h3>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '14px', color: '#64748b' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Briefcase size={14} /> {app.internshipTitle}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Clock size={14} /> Applied {new Date(app.appliedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                    <div style={{ 
                                        padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                                        background: statusColors[app.status]?.bg || '#f1f5f9',
                                        color: statusColors[app.status]?.text || '#64748b',
                                        border: `1px solid ${statusColors[app.status]?.border || '#e2e8f0'}`
                                    }}>
                                        {app.status}
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
                                        {processingId === app.id ? (
                                            <Loader2 size={24} className="animate-spin" color="#3b82f6" />
                                        ) : (
                                            <>
                                                <select 
                                                    value={app.status}
                                                    onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                                                    style={{ 
                                                        padding: '8px 16px', borderRadius: '10px', border: '1px solid #3b82f6',
                                                        background: 'white', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', outline: 'none'
                                                    }}
                                                >
                                                    <option value="Applied">Applied</option>
                                                    <option value="Shortlisted">Shortlisted</option>
                                                    <option value="Interviewing">Interviewing</option>
                                                    <option value="Selected">Selected</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
}
