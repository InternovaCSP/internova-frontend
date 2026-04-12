import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchProfile, updateProfile } from '../api/authApi';
import {
    User, Mail, MapPin, Camera, 
    Save, CheckCircle2, AlertCircle, 
    Loader2, FileText, GraduationCap
} from 'lucide-react';
import '../styles/TopNavbar.css';

/**
 * PersonalProfilePage Component
 * 
 * Integrated with the C# backend. Combines personal identity settings
 * with academic performance tracking. 
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

    // ─── STATE: UI ────────────────────────────────────────────────────────────
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [errors, setErrors] = useState({});

    // ─── REFS ─────────────────────────────────────────────────────────────────
    const fileInputRef = useRef(null);

    // ─── LIFECYCLE ────────────────────────────────────────────────────────────
    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        setIsLoading(true);
        try {
            const data = await fetchProfile();
            setPersonalInfo({
                fullName: data.fullName || '',
                bio: data.bio || '',
                location: data.location || '',
                email: data.email || '',
                profilePictureUrl: data.profilePictureUrl || null,
                previewUrl: data.profilePictureUrl || null,
                file: null
            });

            if (data.academicProfile) {
                setAcademicProfile(data.academicProfile);
            }
        } catch (error) {
            showToast('Failed to load profile data', 'error');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // ─── HANDLERS ─────────────────────────────────────────────────────────────
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            showToast('Only JPG/PNG images are accepted', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('File must be under 5MB', 'error');
            return;
        }

        setPersonalInfo(prev => ({ 
            ...prev, 
            file, 
            previewUrl: URL.createObjectURL(file) 
        }));
    };

    const handleSavePersonal = async () => {
        if (!personalInfo.fullName.trim()) {
            setErrors({ fullName: 'Name is required' });
            return;
        }

        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('FullName', personalInfo.fullName.trim());
            formData.append('Bio', personalInfo.bio || '');
            formData.append('Location', personalInfo.location || '');
            
            if (personalInfo.file) {
                formData.append('ProfilePicture', personalInfo.file);
            }

            const result = await updateProfile(formData);
            
            // Sync local state with backend response
            setPersonalInfo(prev => ({
                ...prev,
                profilePictureUrl: result.profilePictureUrl,
                file: null
            }));
            
            setIsEditMode(false);
            showToast('Profile updated successfully!', 'success');
        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to update profile', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    // ─── RENDER HELPERS ───────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="pr-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <Loader2 size={40} className="sp-spinner" style={{ color: '#6c63ff' }} />
            </div>
        );
    }

    return (
        <div className="pr-shell pr-animate-fade" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
            {/* Toast Notification */}
            {toast.show && (
                <div className={`pr-toast ${toast.type}`} style={{ zIndex: 1000 }}>
                    {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {toast.message}
                </div>
            )}

            {/* Premium Header Container */}
            <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', paddingTop: '40px' }}>
                <div className="pr-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                            <div style={{ position: 'relative' }}>
                                <div className="pr-avatar" style={{ width: '100px', height: '100px', fontSize: '32px', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                    {personalInfo.previewUrl ? (
                                        <img src={personalInfo.previewUrl} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        personalInfo.fullName.charAt(0).toUpperCase()
                                    )}
                                </div>
                                {isEditMode && (
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{ 
                                            position: 'absolute', bottom: '0', right: '0', 
                                            background: '#6c63ff', color: 'white', border: 'none', 
                                            borderRadius: '50%', width: '32px', height: '32px', 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        <Camera size={16} />
                                    </button>
                                )}
                                <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
                            </div>
                            <div>
                                <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{personalInfo.fullName}</h1>
                                <p style={{ color: '#64748b', fontSize: '16px', margin: '4px 0 0' }}>{authUser?.role || 'Member'} • {personalInfo.location || 'Unknown Location'}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            {!isEditMode ? (
                                <button 
                                    className="pr-btn pr-btn-primary" 
                                    onClick={() => setIsEditMode(true)}
                                    style={{ background: '#6c63ff', padding: '10px 24px' }}
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button className="pr-btn pr-btn-ghost" onClick={() => setIsEditMode(false)} disabled={isSaving}>Cancel</button>
                                    <button 
                                        className="pr-btn pr-btn-primary" 
                                        onClick={handleSavePersonal}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? <Loader2 size={16} className="sp-spinner" /> : <Save size={16} />}
                                        Save Changes
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div style={{ display: 'flex', gap: '32px' }}>
                        <button 
                            onClick={() => setActiveTab('personal')}
                            style={{ 
                                padding: '12px 4px', border: 'none', background: 'transparent',
                                fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                                color: activeTab === 'personal' ? '#6c63ff' : '#64748b',
                                borderBottom: activeTab === 'personal' ? '2px solid #6c63ff' : '2px solid transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            Personal Details
                        </button>
                        {authUser?.role === 'Student' && academicProfile && (
                            <button 
                                onClick={() => setActiveTab('academic')}
                                style={{ 
                                    padding: '12px 4px', border: 'none', background: 'transparent',
                                    fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                                    color: activeTab === 'academic' ? '#6c63ff' : '#64748b',
                                    borderBottom: activeTab === 'academic' ? '2px solid #6c63ff' : '2px solid transparent',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Academic Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="pr-container" style={{ marginTop: '32px' }}>
                <div style={{ maxWidth: '800px' }}>
                    
                    {activeTab === 'personal' && (
                        <div className="pr-animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="pr-editor-card" style={{ padding: '32px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <User size={20} color="#6c63ff" />
                                    About Me
                                </h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    <div className="pr-field">
                                        <label className="pr-label">Full Name</label>
                                        {isEditMode ? (
                                            <>
                                                <input 
                                                    name="fullName"
                                                    value={personalInfo.fullName} 
                                                    onChange={handleInputChange}
                                                    className={`pr-input ${errors.fullName ? 'error' : ''}`} 
                                                />
                                                {errors.fullName && <span className="pr-error-text">{errors.fullName}</span>}
                                            </>
                                        ) : (
                                            <div style={{ padding: '10px 0', fontSize: '15px', fontWeight: 500 }}>{personalInfo.fullName}</div>
                                        )}
                                    </div>
                                    <div className="pr-field">
                                        <label className="pr-label">Email Address</label>
                                        <div style={{ padding: '10px 0', fontSize: '15px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Mail size={16} />
                                            {personalInfo.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="pr-field" style={{ marginTop: '24px' }}>
                                    <label className="pr-label">Location</label>
                                    {isEditMode ? (
                                        <div style={{ position: 'relative' }}>
                                            <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                                            <input 
                                                name="location"
                                                value={personalInfo.location} 
                                                onChange={handleInputChange}
                                                className="pr-input" 
                                                style={{ paddingLeft: '40px' }}
                                            />
                                        </div>
                                    ) : (
                                        <div style={{ padding: '10px 0', fontSize: '15px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <MapPin size={16} color="#6c63ff" />
                                            {personalInfo.location || 'Not specified'}
                                        </div>
                                    )}
                                </div>

                                <div className="pr-field" style={{ marginTop: '24px' }}>
                                    <label className="pr-label">Bio</label>
                                    {isEditMode ? (
                                        <textarea 
                                            name="bio"
                                            value={personalInfo.bio} 
                                            onChange={handleInputChange}
                                            className="pr-input" 
                                            style={{ minHeight: '120px', resize: 'vertical', paddingTop: '12px' }}
                                        />
                                    ) : (
                                        <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.6', color: '#334155' }}>
                                            {personalInfo.bio || 'No bio provided.'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'academic' && academicProfile && (
                        <div className="pr-animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="pr-editor-card" style={{ padding: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <GraduationCap size={20} color="#6c63ff" />
                                        University Information
                                    </h3>
                                    <button 
                                        className="pr-btn pr-btn-ghost" 
                                        style={{ fontSize: '13px', padding: '6px 12px' }}
                                        onClick={() => window.location.href = '/student/profile'}
                                    >
                                        Edit Full Academic Profile
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>University ID</span>
                                            <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginTop: '4px' }}>{academicProfile.universityId || 'Not set'}</div>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Department</span>
                                            <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginTop: '4px' }}>{academicProfile.department || 'Not set'}</div>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Current GPA</span>
                                            <div style={{ marginTop: '8px' }}>
                                                <span className="pr-stat-value-badge" style={{ fontSize: '15px', padding: '6px 12px' }}>{academicProfile.gpa ? `${academicProfile.gpa} / 4.00` : '—'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Core Skills</span>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                                            {academicProfile.skills ? (
                                                academicProfile.skills.split(',').map((skill, idx) => (
                                                    <span key={idx} className="pr-tag" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569' }}>{skill.trim()}</span>
                                                ))
                                            ) : (
                                                <span style={{ fontSize: '14px', fontStyle: 'italic', color: '#94a3b8' }}>No skills listed</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '32px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ background: 'white', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                <FileText size={20} color="#64748b" />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 600 }}>Curriculum Vitae / Resume</div>
                                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{academicProfile.resumeUrl ? 'Verified Document Attached' : 'No document uploaded'}</div>
                                            </div>
                                        </div>
                                        {academicProfile.resumeUrl && (
                                            <a href={academicProfile.resumeUrl} target="_blank" rel="noreferrer" style={{ fontSize: '13px', fontWeight: 600, color: '#6c63ff', textDecoration: 'none' }}>View Resume</a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
