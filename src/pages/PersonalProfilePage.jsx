import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchProfile, updateProfile, updateStudentProfile } from '../api/authApi';
import {
    User, Mail, MapPin, Camera, 
    Save, CheckCircle2, AlertCircle, 
    Loader2, FileText, GraduationCap,
    X, Upload, Plus, Briefcase
} from 'lucide-react';
import '../styles/TopNavbar.css';

/**
 * PersonalProfilePage Component
 * 
 * Unified and polished interface for Personal and Academic profile management.
 * Uses a grid-based layout for better space utilization and premium aesthetics.
 */
export default function PersonalProfilePage() {
    const { user: authUser } = useAuth();
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditMode, setIsEditMode] = useState(false);
    
    // ─── STATE: Data ───────────────────────────────────────────────────────────
    const [personalInfo, setPersonalInfo] = useState({
        fullName: '',
        bio: '',
        location: '',
        email: '',
        profilePictureUrl: null,
        previewUrl: null,
        file: null
    });

    const [academicProfile, setAcademicProfile] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [tagInputValue, setTagInputValue] = useState('');

    // ─── STATE: UI ────────────────────────────────────────────────────────────
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [errors, setErrors] = useState({});

    // ─── REFS ─────────────────────────────────────────────────────────────────
    const fileInputRef = useRef(null);
    const resumeInputRef = useRef(null);
    const tagInputRef = useRef(null);

    // ─── LIFECYCLE ────────────────────────────────────────────────────────────
    useEffect(() => {
        loadProfileData();
    }, []);

    // Proactive initialization for Students to prevent infinite loader
    useEffect(() => {
        if (!academicProfile && (authUser?.role?.toLowerCase() === 'student')) {
            setAcademicProfile({
                universityId: '',
                department: '',
                gpa: '',
                skills: [],
                resumeUrl: null
            });
        }
    }, [authUser, academicProfile]);

    const loadProfileData = async () => {
        setIsLoading(true);
        try {
            const data = await fetchProfile();
            
            setPersonalInfo({
                fullName: data.fullName || data.FullName || '',
                bio: data.bio || data.Bio || '',
                location: data.location || data.Location || '',
                email: data.email || data.Email || '',
                profilePictureUrl: data.profilePictureUrl || data.ProfilePictureUrl || null,
                previewUrl: data.profilePictureUrl || data.ProfilePictureUrl || null,
                file: null
            });

            const rawRole = data.role || data.Role || authUser?.role || '';
            const isStudent = rawRole.toLowerCase() === 'student';

            if (isStudent) {
                const ac = data.academicProfile || data.AcademicProfile;
                setAcademicProfile({
                    universityId: ac?.universityId || ac?.UniversityId || '',
                    department: ac?.department || ac?.Department || '',
                    gpa: ac?.gpa !== undefined ? ac.gpa : (ac?.GPA !== undefined ? ac.GPA : ''),
                    skills: (ac?.skills || ac?.Skills) 
                        ? String(ac.skills || ac.Skills).split(',').map(s => s.trim()).filter(Boolean) 
                        : [],
                    resumeUrl: ac?.resumeUrl || ac?.ResumeUrl || null
                });
            }
        } catch (error) {
            console.error("Profile load failed:", error);
            showToast('Unable to load profile', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // ─── HANDLERS ─────────────────────────────────────────────────────────────
    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPersonalInfo(prev => ({ ...prev, file, previewUrl: URL.createObjectURL(file) }));
    };

    const handleSavePersonal = async () => {
        if (!personalInfo.fullName.trim()) { setErrors({ fullName: 'Required' }); return; }
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('FullName', personalInfo.fullName.trim());
            formData.append('Bio', personalInfo.bio || '');
            formData.append('Location', personalInfo.location || '');
            if (personalInfo.file) formData.append('ProfilePicture', personalInfo.file);

            const result = await updateProfile(formData);
            setPersonalInfo(prev => ({ ...prev, profilePictureUrl: result.profilePictureUrl, file: null }));
            setIsEditMode(false);
            showToast('Personal info saved!', 'success');
        } catch (error) {
            showToast('Update failed', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAcademicChange = (field, value) => {
        setAcademicProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tag = tagInputValue.trim();
            if (tag && !academicProfile.skills.includes(tag)) {
                setAcademicProfile(prev => ({ ...prev, skills: [...prev.skills, tag] }));
                setTagInputValue('');
            }
        }
    };

    const removeTag = (idx) => {
        setAcademicProfile(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));
    };

    const handleSaveAcademic = async () => {
        if (!academicProfile.universityId.trim()) { showToast('Uni ID required', 'error'); return; }
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('UniversityId', academicProfile.universityId.trim());
            formData.append('Department', academicProfile.department || '');
            formData.append('GPA', academicProfile.gpa || '0');
            formData.append('Skills', academicProfile.skills.join(', '));
            if (resumeFile) formData.append('resume', resumeFile);

            const result = await updateStudentProfile(formData);
            setAcademicProfile(prev => ({ ...prev, resumeUrl: result.resumeUrl }));
            setResumeFile(null);
            setIsEditMode(false);
            showToast('Academic info saved!', 'success');
        } catch (error) {
            showToast('Update failed', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // ─── RENDER ───────────────────────────────────────────────────────────────
    if (isLoading) {
        return <div className="pr-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}><Loader2 size={40} className="sp-spinner" style={{ color: '#6c63ff' }} /></div>;
    }

    const currentRole = authUser?.role?.toLowerCase() || '';

    return (
        <div className="pr-shell" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
            {/* Toast Notification */}
            {toast.show && (
                <div className={`pr-toast ${toast.type}`} style={{ zIndex: 1000, position: 'fixed', top: '24px', right: '24px', animation: 'slideIn 0.3s ease-out' }}>
                    {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {toast.message}
                </div>
            )}

            {/* Premium Header Section */}
            <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', paddingTop: '60px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div className="pr-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                            <div style={{ position: 'relative' }}>
                                <div className="pr-avatar" style={{ 
                                    width: '120px', 
                                    height: '120px', 
                                    fontSize: '40px', 
                                    border: '6px solid white', 
                                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                                    background: '#0f172a',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    fontWeight: 700
                                }}>
                                    {personalInfo.previewUrl ? (
                                        <img src={personalInfo.previewUrl} alt="P" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        personalInfo.fullName.charAt(0).toUpperCase()
                                    )}
                                </div>
                                {isEditMode && activeTab === 'personal' && (
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{ 
                                            position: 'absolute', bottom: '4px', right: '4px', 
                                            background: '#6c63ff', color: 'white', border: '3px solid white', 
                                            borderRadius: '50%', width: '36px', height: '36px', 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <Camera size={18} />
                                    </button>
                                )}
                                <input type="file" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} accept="image/*" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>{personalInfo.fullName}</h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b', fontSize: '15px' }}>
                                    <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, color: '#6c63ff', fontSize: '12px', textTransform: 'uppercase' }}>{authUser?.role || 'Member'}</span>
                                    {personalInfo.location && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <MapPin size={14} /> {personalInfo.location}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            {!isEditMode ? (
                                <button className="pr-btn pr-btn-primary" onClick={() => setIsEditMode(true)} style={{ height: '46px', padding: '0 28px' }}>
                                    Edit {activeTab === 'personal' ? 'Personal' : 'Academic'}
                                </button>
                            ) : (
                                <>
                                    <button className="pr-btn pr-btn-ghost" onClick={() => setIsEditMode(false)} disabled={isSaving}>Cancel</button>
                                    <button 
                                        className="pr-btn pr-btn-primary" 
                                        onClick={activeTab === 'personal' ? handleSavePersonal : handleSaveAcademic} 
                                        disabled={isSaving}
                                        style={{ height: '46px', padding: '0 28px' }}
                                    >
                                        {isSaving ? <Loader2 size={18} className="sp-spinner" /> : <Save size={18} />}
                                        Save Changes
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div style={{ display: 'flex', gap: '40px' }}>
                        <button 
                            onClick={() => { setActiveTab('personal'); setIsEditMode(false); }} 
                            style={{ 
                                padding: '16px 4px', border: 'none', background: 'transparent', 
                                fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                                color: activeTab === 'personal' ? '#6c63ff' : '#64748b', 
                                borderBottom: activeTab === 'personal' ? '3px solid #6c63ff' : '3px solid transparent',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Personal Details
                        </button>
                        {currentRole === 'student' && (
                            <button 
                                onClick={() => { setActiveTab('academic'); setIsEditMode(false); }} 
                                style={{ 
                                    padding: '16px 4px', border: 'none', background: 'transparent', 
                                    fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                                    color: activeTab === 'academic' ? '#6c63ff' : '#64748b', 
                                    borderBottom: activeTab === 'academic' ? '3px solid #6c63ff' : '3px solid transparent',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Academic Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="pr-container" style={{ marginTop: '40px' }}>
                <div style={{ maxWidth: '900px' }}>
                    
                    {/* PERSONAL TAB */}
                    {activeTab === 'personal' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div className="pr-editor-card" style={{ padding: '40px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                    <div style={{ background: 'rgba(108, 99, 255, 0.1)', padding: '10px', borderRadius: '12px' }}>
                                        <User size={24} color="#6c63ff" />
                                    </div>
                                    <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Public Identity</h3>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                                    <div className="pr-field">
                                        <label className="pr-label">Full Name</label>
                                        {isEditMode ? (
                                            <input name="fullName" value={personalInfo.fullName} onChange={handlePersonalChange} className="pr-input" style={{ height: '48px' }} />
                                        ) : (
                                            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', padding: '8px 0' }}>{personalInfo.fullName}</div>
                                        )}
                                    </div>
                                    <div className="pr-field">
                                        <label className="pr-label">Email Address</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '16px', fontWeight: 500, padding: '8px 0' }}>
                                            <Mail size={16} />
                                            {personalInfo.email}
                                        </div>
                                    </div>
                                    <div className="pr-field">
                                        <label className="pr-label">Location</label>
                                        {isEditMode ? (
                                            <div style={{ position: 'relative' }}>
                                                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: '#94a3b8' }} />
                                                <input name="location" value={personalInfo.location} onChange={handlePersonalChange} className="pr-input" style={{ paddingLeft: '40px', height: '48px' }} placeholder="City, Country" />
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', padding: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <MapPin size={18} color="#6c63ff" />
                                                {personalInfo.location || 'Not Specified'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="pr-field">
                                        <label className="pr-label">Work Preferences</label>
                                        <div style={{ fontSize: '14px', color: '#64748b', padding: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Briefcase size={16} /> Ready for Opportunities
                                        </div>
                                    </div>
                                </div>

                                <div className="pr-field" style={{ marginTop: '32px' }}>
                                    <label className="pr-label">Professional Bio</label>
                                    {isEditMode ? (
                                        <textarea name="bio" value={personalInfo.bio} onChange={handlePersonalChange} className="pr-input" style={{ minHeight: '140px', padding: '16px', lineHeight: '1.6' }} placeholder="Write a brief introduction about yourself..." />
                                    ) : (
                                        <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.8', color: '#475569', maxWidth: '100%' }}>
                                            {personalInfo.bio || 'Tell the world who you are. Add a bio to help employers find you!'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ACADEMIC TAB */}
                    {activeTab === 'academic' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div className="pr-editor-card" style={{ padding: '40px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                    <div style={{ background: 'rgba(108, 99, 255, 0.1)', padding: '10px', borderRadius: '12px' }}>
                                        <GraduationCap size={24} color="#6c63ff" />
                                    </div>
                                    <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Academic Records</h3>
                                </div>

                                {!academicProfile ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><Loader2 className="sp-spinner" size={32} color="#6c63ff" /></div>
                                ) : (
                                    <>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                                            <div className="pr-field">
                                                <label className="pr-label">University ID</label>
                                                {isEditMode ? (
                                                    <input value={academicProfile.universityId} onChange={e => handleAcademicChange('universityId', e.target.value)} className="pr-input" style={{ height: '48px' }} placeholder="e.g. STU-12345" />
                                                ) : (
                                                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', padding: '8px 0' }}>{academicProfile.universityId || 'Not Set'}</div>
                                                )}
                                            </div>
                                            <div className="pr-field">
                                                <label className="pr-label">Department / Major</label>
                                                {isEditMode ? (
                                                    <input value={academicProfile.department} onChange={e => handleAcademicChange('department', e.target.value)} className="pr-input" style={{ height: '48px' }} placeholder="e.g. Computer Science" />
                                                ) : (
                                                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', padding: '8px 0' }}>{academicProfile.department || 'Not Set'}</div>
                                                )}
                                            </div>
                                            <div className="pr-field">
                                                <label className="pr-label">Cumulative GPA</label>
                                                {isEditMode ? (
                                                    <input type="number" step="0.01" value={academicProfile.gpa} onChange={e => handleAcademicChange('gpa', e.target.value)} className="pr-input" style={{ height: '48px' }} placeholder="0.00" />
                                                ) : (
                                                    <div style={{ padding: '8px 0' }}>
                                                        <span className="pr-stat-value-badge" style={{ fontSize: '16px', background: '#6c63ff', color: 'white', padding: '6px 14px' }}>
                                                            {academicProfile.gpa ? `${academicProfile.gpa} / 4.00` : '—'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pr-field" style={{ marginTop: '40px' }}>
                                            <label className="pr-label">Technical Skillset</label>
                                            {isEditMode ? (
                                                <div style={{ marginTop: '12px' }}>
                                                    <div className="pr-tags-wrap" style={{ padding: '12px', minHeight: '100px', backgroundColor: '#fcfcfe', border: '1.5px dashed #e2e8f0' }} onClick={() => tagInputRef.current?.focus()}>
                                                        {academicProfile.skills.map((s, i) => (
                                                            <div key={i} className="pr-tag" style={{ background: '#6c63ff', color: 'white', borderRadius: '8px', padding: '6px 14px' }}>
                                                                {s}
                                                                <X size={14} onClick={() => removeTag(i)} style={{ marginLeft: '8px', cursor: 'pointer' }} />
                                                            </div>
                                                        ))}
                                                        <input ref={tagInputRef} value={tagInputValue} onChange={e => setTagInputValue(e.target.value)} onKeyDown={handleTagKeyDown} placeholder="Press Enter to add skill..." className="pr-tag-input" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
                                                    {academicProfile.skills.length > 0 ? (
                                                        academicProfile.skills.map((s, i) => (
                                                            <span key={i} className="pr-tag" style={{ background: '#f1f5f9', color: '#475569', fontWeight: 600, padding: '8px 16px', border: '1px solid #e2e8f0' }}>{s}</span>
                                                        ))
                                                    ) : (
                                                        <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>No skills listed. Build your career by adding some!</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="pr-field" style={{ marginTop: '40px' }}>
                                            <label className="pr-label">Curriculum Vitae / Resume</label>
                                            <div style={{ 
                                                marginTop: '16px', 
                                                padding: '32px', 
                                                background: '#f8fafc', 
                                                borderRadius: '20px', 
                                                border: '2px dashed #e2e8f0',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '16px',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = '#6c63ff'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                                            >
                                                <div style={{ background: 'white', padding: '16px', borderRadius: '50%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                                    <FileText size={40} color={resumeFile || academicProfile.resumeUrl ? "#6c63ff" : "#94a3b8"} />
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                                                        {resumeFile ? resumeFile.name : (academicProfile.resumeUrl ? 'Verified Resume.pdf' : 'No Document Uploaded')}
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                                                        {resumeFile ? 'Ready for synchronization' : (academicProfile.resumeUrl ? 'Last updated recently' : 'Upload your PDF resume to qualify for internships.')}
                                                    </div>
                                                </div>

                                                <div style={{ marginTop: '8px' }}>
                                                    {isEditMode ? (
                                                        <button onClick={() => resumeInputRef.current?.click()} className="pr-btn pr-btn-primary" style={{ background: '#6c63ff', height: '40px', fontSize: '13px' }}>
                                                            {resumeFile ? 'Replace Selection' : 'Upload Resume (PDF)'}
                                                        </button>
                                                    ) : academicProfile.resumeUrl && (
                                                        <a href={academicProfile.resumeUrl} target="_blank" rel="noreferrer" className="pr-btn pr-btn-ghost" style={{ backgroundColor: 'white', color: '#6c63ff', border: '1px solid #e2e8f0' }}>
                                                            View Document
                                                        </a>
                                                    )}
                                                </div>
                                                <input type="file" ref={resumeInputRef} onChange={e => setResumeFile(e.target.files[0])} style={{ display: 'none' }} accept=".pdf" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .pr-input:focus {
                    border-color: #6c63ff !important;
                    box-shadow: 0 0 0 4px rgba(108, 99, 255, 0.1) !important;
                    outline: none;
                }
                .pr-btn:active {
                    transform: scale(0.98);
                }
            `}</style>
        </div>
    );
}
