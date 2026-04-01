import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCompanyApplications, updateApplicationStatus, fetchStudentProfile, scheduleInterview } from '../api/companyApi';
import { Loader2, Search, Filter, ArrowLeft, Mail, Calendar, MapPin, CheckCircle, XCircle, Clock, User, Briefcase, ChevronDown, GraduationCap, Award, FileText, X, Video, ExternalLink } from 'lucide-react';
import Modal from '../components/Modal';

export default function CompanyApplicationsPage() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [processingId, setProcessingId] = useState(null);
    
    // Profile Modal State
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    
    // Interview Scheduling Modal State
    const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
    const [schedulingApp, setSchedulingApp] = useState(null);
    const [interviewDate, setInterviewDate] = useState('');
    const [interviewTime, setInterviewTime] = useState('');
    const [meetingLink, setMeetingLink] = useState('');
    const [scheduling, setScheduling] = useState(false);

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

    const handleViewProfile = async (studentId, studentName) => {
        try {
            setProfileLoading(true);
            setShowModal(true);
            const profile = await fetchStudentProfile(studentId);
            setSelectedStudent({ ...profile, name: studentName });
        } catch (err) {
            console.error("Failed to load profile:", err);
            alert("Could not load student profile.");
            setShowModal(false);
        } finally {
            setProfileLoading(false);
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

    const handleOpenScheduler = (app) => {
        setSchedulingApp(app);
        setIsSchedulerOpen(true);
        // Reset scheduling form
        setInterviewDate('');
        setInterviewTime('');
        setMeetingLink('');
    };

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        try {
            setScheduling(true);
            const fullDateTime = new Date(`${interviewDate}T${interviewTime}`);
            await scheduleInterview({
                applicationId: schedulingApp.id,
                interviewDate: fullDateTime.toISOString(),
                locationOrLink: meetingLink
            });
            
            // Update local state
            setApplications(prev => prev.map(app => 
                app.id === schedulingApp.id ? { ...app, status: 'InterviewScheduled' } : app
            ));
            
            setIsSchedulerOpen(false);
            alert("Interview successfully scheduled!");
        } catch (err) {
            console.error("Failed to schedule interview:", err);
            alert("Could not schedule interview.");
        } finally {
            setScheduling(false);
        }
    };

    const statusColors = {
        Applied: { bg: '#eff6ff', text: '#1d4ed8', border: '#dbeafe' },
        Shortlisted: { bg: '#f0fdf4', text: '#15803d', border: '#dcfce7' },
        InterviewScheduled: { bg: '#f5f3ff', text: '#6d28d9', border: '#ede9fe' },
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
                            <option value="InterviewScheduled">Interview Scheduled</option>
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
                                        {app.status === 'InterviewScheduled' ? 'Interview Scheduled' : app.status}
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
                                        {processingId === app.id ? (
                                            <Loader2 size={24} className="animate-spin" color="#3b82f6" />
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => handleViewProfile(app.studentId, app.studentName)}
                                                    style={{ 
                                                        padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0',
                                                        background: 'white', color: '#64748b', fontWeight: 600, cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', gap: '8px'
                                                    }}
                                                >
                                                    <User size={16} /> View Profile
                                                </button>
                                                
                                                {app.status === 'Shortlisted' && (
                                                    <button 
                                                        onClick={() => handleOpenScheduler(app)}
                                                        style={{ 
                                                            padding: '8px 16px', borderRadius: '10px', background: '#3b82f6',
                                                            color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', gap: '8px'
                                                        }}
                                                    >
                                                        <Calendar size={16} /> Schedule Interview
                                                    </button>
                                                )}

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
                                                    <option value="InterviewScheduled">Interview Scheduled</option>
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

            {/* Profile Modal */}
            {showModal && (
                <div style={{ 
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    padding: '24px'
                }}>
                    <div style={{ 
                        background: 'white', borderRadius: '24px', width: '100%', maxWidth: '550px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden',
                        animation: 'modalSlideUp 0.3s ease-out'
                    }}>
                        {profileLoading ? (
                            <div style={{ padding: '80px', textAlign: 'center' }}>
                                <Loader2 size={40} className="animate-spin" color="#3b82f6" style={{ margin: '0 auto' }} />
                                <p style={{ marginTop: '16px', color: '#64748b', fontWeight: 500 }}>Fetching student details...</p>
                            </div>
                        ) : selectedStudent ? (
                            <>
                                <div style={{ 
                                    padding: '32px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    position: 'relative', color: 'white'
                                }}>
                                    <button 
                                        onClick={() => setShowModal(false)}
                                        style={{ 
                                            position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.2)',
                                            border: 'none', borderRadius: '12px', padding: '8px', cursor: 'pointer', color: 'white'
                                        }}
                                    >
                                        <X size={20} />
                                    </button>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ 
                                            width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(255,255,255,0.2)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)'
                                        }}>
                                            <User size={40} />
                                        </div>
                                        <div>
                                            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>{selectedStudent.name}</h2>
                                            <p style={{ opacity: 0.9, margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <GraduationCap size={16} /> {selectedStudent.department || 'Not Specified'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ padding: '32px', display: 'grid', gap: '24px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px' }}>
                                            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>GPA</p>
                                            <p style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Award size={20} color="#eab308" /> {selectedStudent.gpa || 'N/A'}
                                            </p>
                                        </div>
                                        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px' }}>
                                            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>University ID</p>
                                            <p style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{selectedStudent.universityId || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <CheckCircle size={16} color="#3b82f6" /> SKILLS & EXPERTISE
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {(selectedStudent.skills || '').split(',').map((skill, i) => (
                                                <span key={i} style={{ 
                                                    padding: '6px 12px', background: '#eff6ff', color: '#1d4ed8', 
                                                    borderRadius: '8px', fontSize: '13px', fontWeight: 500
                                                }}>
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                            {!selectedStudent.skills && <span style={{ color: '#94a3b8', fontSize: '14px' }}>No skills listed.</span>}
                                        </div>
                                    </div>

                                    {selectedStudent.resumeUrl && (
                                        <a href={selectedStudent.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                            padding: '16px', background: '#0f172a', color: 'white', borderRadius: '16px',
                                            textDecoration: 'none', fontWeight: 600, transition: 'all 0.2s'
                                        }}>
                                            <FileText size={20} /> View Student Resume
                                        </a>
                                    )}

                                    <button 
                                        onClick={() => setShowModal(false)}
                                        style={{ 
                                            padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                            background: 'white', color: '#64748b', fontWeight: 600, cursor: 'pointer'
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '60px', textAlign: 'center' }}>
                                <p style={{ color: '#ef4444' }}>Error loading profile.</p>
                                <button onClick={() => setShowModal(false)} style={{ marginTop: '16px' }}>Close</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Interview Scheduler Modal */}
            <Modal 
                isOpen={isSchedulerOpen} 
                onClose={() => setIsSchedulerOpen(false)}
                title="Schedule Interview"
                maxWidth="500px"
            >
                {schedulingApp && (
                    <form onSubmit={handleScheduleSubmit} style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ marginBottom: '8px', padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Candidate</p>
                            <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{schedulingApp.studentName}</p>
                            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748b' }}>{schedulingApp.internshipTitle}</p>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={16} /> Date
                                </label>
                                <input 
                                    type="date"
                                    required
                                    value={interviewDate}
                                    onChange={(e) => setInterviewDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Clock size={16} /> Time
                                </label>
                                <input 
                                    type="time"
                                    required
                                    value={interviewTime}
                                    onChange={(e) => setInterviewTime(e.target.value)}
                                    style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Video size={16} /> Meeting Link or Location
                            </label>
                            <input 
                                type="text"
                                required
                                placeholder="e.g. Zoom/Teams Link or Office Location"
                                value={meetingLink}
                                onChange={(e) => setMeetingLink(e.target.value)}
                                style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                type="submit"
                                disabled={scheduling}
                                style={{ 
                                    flex: 1, padding: '14px', borderRadius: '14px', background: '#3b82f6',
                                    color: 'white', fontWeight: 700, border: 'none', cursor: scheduling ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                {scheduling ? <Loader2 size={20} className="animate-spin" /> : <><Calendar size={20} /> Confirm Schedule</>}
                            </button>
                            <button 
                                type="button"
                                onClick={() => setIsSchedulerOpen(false)}
                                style={{ 
                                    padding: '14px 20px', borderRadius: '14px', background: 'white',
                                    color: '#64748b', fontWeight: 600, border: '1px solid #e2e8f0', cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes modalSlideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
