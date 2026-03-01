import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    User, GraduationCap, Book, Star, FileText,
    CheckCircle, AlertCircle, ExternalLink, Upload,
    ArrowLeft, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/authApi';

export default function StudentProfilePage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [universityId, setUniversityId] = useState('');
    const [department, setDepartment] = useState('');
    const [gpa, setGpa] = useState('');
    const [skills, setSkills] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    function handleLogout() {
        logout();
        navigate('/login', { replace: true });
    }

    const handleFile = (file) => {
        setErrorMessage('');
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setErrorMessage('Only PDF files are accepted.');
            setResumeFile(null);
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage('Resume must be smaller than 5 MB.');
            setResumeFile(null);
            return;
        }
        setResumeFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setResumeUrl('');

        if (!universityId.trim()) {
            setErrorMessage('University ID is required.');
            return;
        }
        if (!resumeFile) {
            setErrorMessage('Please select a PDF resume to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('UniversityId', universityId);
        formData.append('Department', department);
        formData.append('GPA', gpa);
        formData.append('Skills', skills);
        formData.append('resume', resumeFile);

        setLoading(true);
        try {
            const response = await apiClient.put('/api/student/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccessMessage(response.data.message);
            setResumeUrl(response.data.resumeUrl);
        } catch (err) {
            setErrorMessage(
                err.response?.data?.error ||
                'Something went wrong. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sp-shell">
            {/* ── Top navbar ── */}
            <nav className="sp-nav">
                <div className="sp-nav-left">
                    <img src="/logo-long.png" alt="Internova" style={{ height: '26px', objectFit: 'contain' }} />
                </div>
                <div className="sp-nav-right">
                    <Link to="/student/dashboard" className="sp-nav-link">
                        <ArrowLeft size={14} /> Dashboard
                    </Link>
                    <button className="sp-nav-signout" onClick={handleLogout}>Sign Out</button>
                </div>
            </nav>

            {/* ── Page body ── */}
            <div className="sp-body">

                {/* Page header */}
                <div className="sp-page-header">
                    <div className="sp-page-header-icon">
                        <User size={22} />
                    </div>
                    <div>
                        <h1 className="sp-page-title">My Profile</h1>
                        <p className="sp-page-sub">Update your academic details and upload your latest resume.</p>
                    </div>
                </div>

                {/* Main form card */}
                <form onSubmit={handleSubmit} noValidate className="sp-card">

                    {/* Section: Academic Info */}
                    <div className="sp-section-label">Academic Information</div>

                    <div className="sp-field-row">
                        <div className="sp-field">
                            <label className="sp-label" htmlFor="universityId">
                                <GraduationCap size={13} /> University ID <span className="sp-required">*</span>
                            </label>
                            <input
                                type="text"
                                id="universityId"
                                className="sp-input"
                                placeholder="e.g. CS2021001"
                                value={universityId}
                                onChange={e => setUniversityId(e.target.value)}
                            />
                        </div>
                        <div className="sp-field">
                            <label className="sp-label" htmlFor="department">
                                <Book size={13} /> Department
                            </label>
                            <input
                                type="text"
                                id="department"
                                className="sp-input"
                                placeholder="e.g. Computer Science"
                                value={department}
                                onChange={e => setDepartment(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="sp-field-row">
                        <div className="sp-field">
                            <label className="sp-label" htmlFor="gpa">
                                <Star size={13} /> GPA (0.00 – 4.00)
                            </label>
                            <input
                                type="number"
                                id="gpa"
                                className="sp-input"
                                placeholder="e.g. 3.75"
                                min="0" max="4" step="0.01"
                                value={gpa}
                                onChange={e => setGpa(e.target.value)}
                            />
                        </div>
                        <div className="sp-field sp-field--full">
                            <label className="sp-label" htmlFor="skills">
                                Skills
                            </label>
                            <input
                                type="text"
                                id="skills"
                                className="sp-input"
                                placeholder="e.g. React, C#, Azure, SQL"
                                value={skills}
                                onChange={e => setSkills(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Section: Resume Upload */}
                    <div className="sp-section-label" style={{ marginTop: '28px' }}>Resume</div>

                    <div
                        className={`sp-dropzone ${isDragging ? 'sp-dropzone--active' : ''} ${resumeFile ? 'sp-dropzone--selected' : ''}`}
                        onClick={() => document.getElementById('sp-resume-input').click()}
                        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={e => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0] ?? null); }}
                    >
                        {resumeFile ? (
                            <>
                                <div className="sp-dropzone-icon sp-dropzone-icon--selected">
                                    <FileText size={28} />
                                </div>
                                <p className="sp-dropzone-filename">{resumeFile.name}</p>
                                <p className="sp-dropzone-hint">{(resumeFile.size / 1024).toFixed(0)} KB · Click to change file</p>
                            </>
                        ) : (
                            <>
                                <div className="sp-dropzone-icon">
                                    <Upload size={28} />
                                </div>
                                <p className="sp-dropzone-title">Drop your resume here or <span className="sp-dropzone-browse">click to browse</span></p>
                                <p className="sp-dropzone-hint">PDF only · Maximum 5 MB</p>
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        id="sp-resume-input"
                        accept="application/pdf,.pdf"
                        style={{ display: 'none' }}
                        onChange={e => handleFile(e.target.files[0] ?? null)}
                    />

                    {/* Alerts */}
                    {errorMessage && (
                        <div className="sp-alert sp-alert--error">
                            <AlertCircle size={15} /> <span>{errorMessage}</span>
                        </div>
                    )}
                    {successMessage && (
                        <div className="sp-alert sp-alert--success">
                            <CheckCircle size={15} /> <span>{successMessage}</span>
                        </div>
                    )}
                    {resumeUrl && (
                        <div className="sp-resume-link">
                            <FileText size={14} />
                            <span>Uploaded resume:</span>
                            <a href={resumeUrl} target="_blank" rel="noreferrer" className="sp-resume-anchor">
                                View PDF <ExternalLink size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
                            </a>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="sp-actions">
                        <button type="submit" className="sp-btn-primary" disabled={loading}>
                            {loading ? (
                                <><Loader2 size={16} className="sp-spinner" /> Uploading…</>
                            ) : 'Save Profile'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
