import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient, { fetchStudentProfile } from '../api/authApi';
import {
    Upload, FileText, CheckCircle2,
    X, AlertCircle, ArrowLeft, Loader2
} from 'lucide-react';

export default function StudentProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // ─── STATE: Data ──────────────────────────────────────────────────────────

    const [profile, setProfile] = useState({
        universityId: '',
        department: '',
        gpa: '',
        skills: [] // Array of strings for tags
    });
    const [originalProfile, setOriginalProfile] = useState(null);

    // ─── STATE: UI ────────────────────────────────────────────────────────────
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // ─── STATE: Resume ────────────────────────────────────────────────────────
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeUrl, setResumeUrl] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    // ─── REFS ─────────────────────────────────────────────────────────────────
    const fileInputRef = useRef(null);
    const tagInputRef = useRef(null);
    const [tagInputValue, setTagInputValue] = useState('');

    // ─── LIFECYCLE: Fetch Profile ─────────────────────────────────────────────
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setIsLoading(true);
        try {
            const data = await fetchStudentProfile();
            if (data) {
                const loadedProfile = {
                    universityId: data.universityId || '',
                    department: data.department || '',
                    gpa: data.gpa ? data.gpa.toString() : '',
                    skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : []
                };
                setProfile(loadedProfile);
                setOriginalProfile(loadedProfile);
                setResumeUrl(data.resumeUrl || '');
            }
        } catch (error) {
            // 404 means profile doesn't exist yet, which is fine for first-time users.
            if (error.response?.status !== 404) {
                showToast('Failed to load profile data', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ─── DIRTY STATE CHECK ────────────────────────────────────────────────────
    useEffect(() => {
        if (!originalProfile) return;
        const o = originalProfile;
        const isChanged =
            profile.universityId !== o.universityId ||
            profile.department !== o.department ||
            profile.gpa !== o.gpa ||
            profile.skills.join(',') !== o.skills.join(',') ||
            resumeFile !== null;

        setIsDirty(isChanged);
    }, [profile, resumeFile, originalProfile]);

    // ─── HANDLERS: Form Fields ────────────────────────────────────────────────
    const handleFieldChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    // ─── HANDLERS: Skills Tags ────────────────────────────────────────────────
    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInputValue.trim();
            if (newTag && !profile.skills.includes(newTag)) {
                setProfile(prev => ({ ...prev, skills: [...prev.skills, newTag] }));
                setTagInputValue('');
            }
        } else if (e.key === 'Backspace' && tagInputValue === '' && profile.skills.length > 0) {
            // Remove last tag if input is empty and backspace is pressed
            setProfile(prev => ({ ...prev, skills: prev.skills.slice(0, -1) }));
        }
    };

    const removeTag = (indexToRemove) => {
        setProfile(prev => ({
            ...prev,
            skills: prev.skills.filter((_, index) => index !== indexToRemove)
        }));
    };

    // ─── HANDLERS: Resume Dropzone ────────────────────────────────────────────
    const handleFile = (file) => {
        if (!file) return;
        if (file.type !== 'application/pdf') {
            showToast('Only PDF files are accepted', 'error');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            showToast('Resume must be strictly under 10 MB', 'error');
            return;
        }
        setResumeFile(file);
    };

    const clearResumeSelection = (e) => {
        e.stopPropagation();
        setResumeFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // ─── HANDLERS: Submission ─────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!profile.universityId) {
            showToast('University ID is required', 'error');
            return;
        }

        // If no existing resume URL and no file selected, block
        if (!resumeUrl && !resumeFile) {
            showToast('A resume file is required for your profile', 'error');
            return;
        }

        setIsSaving(true);
        const formData = new FormData();
        formData.append('UniversityId', profile.universityId);
        formData.append('Department', profile.department);
        formData.append('GPA', profile.gpa || '0');
        formData.append('Skills', profile.skills.join(', '));

        // Note: Backend requires a resume file. If updating without a new file,
        // the backend needs modification, but currently it's marked as required in the API unless changed.
        // Assuming the backend accepts updates without a new file if we send empty/null, or we force file re-upload.
        // For this UI, we append the file if selected.
        if (resumeFile) {
            formData.append('resume', resumeFile);
        }

        try {
            const response = await apiClient.put('/api/student/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const data = response.data;
            setResumeUrl(data.resumeUrl);
            setResumeFile(null);
            setOriginalProfile({ ...profile });
            setIsDirty(false);
            showToast('Profile updated successfully', 'success');

        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to save profile', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (originalProfile) {
            setProfile({ ...originalProfile });
        }
        setResumeFile(null);
        setIsDirty(false);
    };

    // ─── UTILS ────────────────────────────────────────────────────────────────
    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    const calculateProgress = () => {
        let score = 0;
        if (profile.universityId) score += 25;
        if (profile.department) score += 25;
        if (profile.gpa) score += 25;
        if (profile.skills.length > 0) score += 15;
        if (resumeUrl || resumeFile) score += 10;
        return score;
    };

    const progress = calculateProgress();

    // ─── RENDER ───────────────────────────────────────────────────────────────

    return (
        <div className="pr-shell pr-animate-fade">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`pr-toast ${toast.type}`}>
                    {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {toast.message}
                </div>
            )}

            {/* Header / Navbar */}
            <div className="pr-header-wrap">
                <div className="pr-container">
                    <div className="pr-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '24px' }}>
                        <div>
                            <h1 className="pr-h1">Profile</h1>
                            <p className="pr-subtext">Manage your academic and professional details.</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                            <div className="pr-progress-wrap" style={{ textAlign: 'right', minWidth: '180px' }}>
                                <div className="pr-progress-meta">
                                    {progress === 100 && <span className="pr-badge-complete">Complete</span>}
                                    {progress}%
                                </div>
                                <div className="pr-progress-track">
                                    <div className="pr-progress-fill" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    className="pr-btn pr-btn-ghost"
                                    onClick={handleCancel}
                                    disabled={isSaving || !isDirty}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="pr-btn pr-btn-primary"
                                    onClick={handleSubmit}
                                    disabled={isSaving || !profile.universityId || (!resumeUrl && !resumeFile) || !isDirty}
                                >
                                    {isSaving ? <><Loader2 size={16} className="sp-spinner" /> Saving...</> : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pr-container">
                <div className="pr-main">

                    {/* Left Column: Identity Panel */}
                    <div>
                        <div className="pr-identity-card">
                            {isLoading ? (
                                <>
                                    <div className="pr-skeleton pr-sk-avatar"></div>
                                    <div className="pr-skeleton pr-sk-text" style={{ width: '60%' }}></div>
                                    <div className="pr-skeleton pr-sk-text" style={{ width: '40%' }}></div>
                                </>
                            ) : (
                                <>
                                    <div className="pr-avatar">
                                        {user?.email ? user.email.charAt(0).toUpperCase() : 'S'}
                                    </div>
                                    <h2 className="pr-name">{user?.email?.split('@')[0] || 'Student'}</h2>
                                    <p className="pr-email">{user?.email}</p>
                                    <div className="pr-role-badge">Student</div>

                                    <div className="pr-identity-divider"></div>

                                    <div className="pr-stat-row">
                                        <span className="pr-stat-label">University ID</span>
                                        <span className="pr-stat-value">{profile.universityId || '—'}</span>
                                    </div>
                                    <div className="pr-stat-row">
                                        <span className="pr-stat-label">GPA</span>
                                        <span className="pr-stat-value-badge">{profile.gpa ? `${profile.gpa}/4.00` : '—'}</span>
                                    </div>
                                    <div className="pr-stat-row">
                                        <span className="pr-stat-label">Skills</span>
                                        <span className="pr-stat-value">{profile.skills.length} listed</span>
                                    </div>

                                    <div className="pr-last-updated">
                                        Last updated: {resumeUrl ? 'Recently' : 'Never'}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Editor Panel */}
                    <div>
                        <div className="pr-editor-card">

                            {/* Section 1: Academic Details */}
                            <div className="pr-section">
                                <div className="pr-section-header">
                                    <h3 className="pr-h3">Academic Details</h3>
                                    <p className="pr-section-desc">Your verified university information.</p>
                                </div>
                                {isLoading ? (
                                    <div className="pr-field-grid">
                                        <div><div className="pr-skeleton pr-sk-label"></div><div className="pr-skeleton pr-sk-input"></div></div>
                                        <div><div className="pr-skeleton pr-sk-label"></div><div className="pr-skeleton pr-sk-input"></div></div>
                                        <div><div className="pr-skeleton pr-sk-label"></div><div className="pr-skeleton pr-sk-input"></div></div>
                                    </div>
                                ) : (
                                    <div className="pr-field-grid">
                                        <div className="pr-field">
                                            <label className="pr-label">University ID *</label>
                                            <input
                                                type="text"
                                                className="pr-input"
                                                placeholder="e.g. CS-2024-001"
                                                value={profile.universityId}
                                                onChange={e => handleFieldChange('universityId', e.target.value)}
                                            />
                                            {!profile.universityId && <span className="pr-error-text">Required</span>}
                                        </div>
                                        <div className="pr-field">
                                            <label className="pr-label">Department</label>
                                            <input
                                                type="text"
                                                className="pr-input"
                                                placeholder="e.g. Computer Science"
                                                value={profile.department}
                                                onChange={e => handleFieldChange('department', e.target.value)}
                                            />
                                        </div>
                                        <div className="pr-field">
                                            <label className="pr-label">Cumulative GPA</label>
                                            <input
                                                type="number"
                                                min="0" max="4.00" step="0.01"
                                                className="pr-input"
                                                placeholder="0.00 - 4.00"
                                                value={profile.gpa}
                                                onChange={e => handleFieldChange('gpa', e.target.value)}
                                            />
                                            <span className="pr-helper">Official unweighted 4.0 scale.</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 2: Skills */}
                            <div className="pr-section">
                                <div className="pr-section-header">
                                    <h3 className="pr-h3">Core Skills</h3>
                                    <p className="pr-section-desc">Technologies and concepts you're highly proficient in.</p>
                                </div>
                                {isLoading ? (
                                    <div><div className="pr-skeleton pr-sk-label"></div><div className="pr-skeleton pr-sk-input" style={{ height: '60px' }}></div></div>
                                ) : (
                                    <div className="pr-field full">
                                        <label className="pr-label">Skills</label>
                                        <div className="pr-tags-wrap" onClick={() => tagInputRef.current?.focus()}>
                                            {profile.skills.map((skill, index) => (
                                                <div key={index} className="pr-tag">
                                                    {skill}
                                                    <div className="pr-tag-remove" onClick={(e) => { e.stopPropagation(); removeTag(index); }}>
                                                        <X size={12} />
                                                    </div>
                                                </div>
                                            ))}
                                            <input
                                                ref={tagInputRef}
                                                type="text"
                                                className="pr-tag-input"
                                                placeholder={profile.skills.length === 0 ? "e.g. React, C#, Azure (Press Enter)" : ""}
                                                value={tagInputValue}
                                                onChange={e => setTagInputValue(e.target.value)}
                                                onKeyDown={handleTagKeyDown}
                                            />
                                        </div>
                                        <span className="pr-helper">Type a skill and press Enter to add it.</span>
                                    </div>
                                )}
                            </div>

                            {/* Section 3: Resume */}
                            <div className="pr-section">
                                <div className="pr-section-header">
                                    <h3 className="pr-h3">Resume / CV</h3>
                                    <p className="pr-section-desc">Upload your most recent resume for employers.</p>
                                </div>
                                {isLoading ? (
                                    <div className="pr-skeleton pr-sk-input" style={{ height: '120px' }}></div>
                                ) : (
                                    <>
                                        {/* If a new file is staged OR existing resume URL is present & no new file */}
                                        {(resumeFile || resumeUrl) ? (
                                            <div className="pr-file-row">
                                                <div className="pr-file-info">
                                                    <div className="pr-file-icon-wrap">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="pr-file-name">
                                                            {resumeFile ? resumeFile.name : 'Current Resume.pdf'}
                                                        </div>
                                                        <div className="pr-file-meta">
                                                            {resumeFile
                                                                ? `${(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Ready to save`
                                                                : 'Previously uploaded'
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pr-file-actions">
                                                    {resumeFile ? (
                                                        <button type="button" className="pr-file-replace" onClick={clearResumeSelection}>
                                                            Cancel
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <div className="pr-file-success">
                                                                <CheckCircle2 size={16} style={{ marginRight: '6px' }} /> Uploaded
                                                            </div>
                                                            <button type="button" className="pr-file-replace" onClick={() => fileInputRef.current?.click()}>
                                                                Replace
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className={`pr-dropzone ${isDragging ? 'active' : ''}`}
                                                onClick={() => fileInputRef.current?.click()}
                                                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                                onDragLeave={() => setIsDragging(false)}
                                                onDrop={e => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0] ?? null); }}
                                            >
                                                <div className="pr-dropzone-icon">
                                                    <Upload size={24} />
                                                </div>
                                                <div className="pr-dropzone-title">Click or drag file to this area to upload</div>
                                                <div className="pr-dropzone-sub">Strictly PDF only. Maximum 10MB.</div>
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="application/pdf,.pdf"
                                            style={{ display: 'none' }}
                                            onChange={e => handleFile(e.target.files[0] ?? null)}
                                        />
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>



        </div>
    );
}
