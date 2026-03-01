import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    User, GraduationCap, Book, Star, FileText,
    CheckCircle, AlertCircle, ExternalLink, Upload
} from 'lucide-react';
import apiClient from '../api/authApi';

export default function StudentProfilePage() {
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

    const handleFileChange = (e) => {
        const file = e.target.files[0] ?? null;
        handleFile(file);
    };

    const handleFile = (file) => {
        setErrorMessage('');
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setErrorMessage('Only PDF files are accepted. Please select a valid .pdf resume.');
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

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files[0] ?? null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setResumeUrl('');

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
        <div className="profile-page">
            {/* ── Left brand panel (re-uses auth system tokens) ── */}
            <aside className="auth-panel-brand profile-brand-panel">
                <div className="auth-brand-logo">
                    <img src="/logo-mono-long.png" alt="InterNova" className="auth-logo-img" />
                </div>
                <h1 className="auth-brand-heading">Build Your Professional Profile</h1>
                <p className="auth-brand-desc">
                    Complete your profile to unlock internship matching, project recommendations, and company visibility.
                </p>
                <ul className="auth-trust-list">
                    <li><GraduationCap size={16} /><span>University-verified credentials</span></li>
                    <li><Star size={16} /><span>AI-powered internship matching</span></li>
                    <li><FileText size={16} /><span>Secure resume storage on Azure</span></li>
                </ul>

                <div style={{ marginTop: 'auto' }}>
                    <Link to="/" className="auth-link" style={{ fontSize: '13px', opacity: 0.7 }}>
                        ← Back to Home
                    </Link>
                </div>
            </aside>

            {/* ── Right form panel ── */}
            <main className="auth-panel-form">
                <div className="auth-card profile-card">
                    <div className="auth-card-header">
                        <h2 className="auth-card-title">
                            <User size={20} style={{ color: 'var(--auth-teal)', marginRight: '8px' }} />
                            Student Profile
                        </h2>
                        <p className="auth-card-sub">
                            Fill in your academic details and upload your resume PDF.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>

                        {/* ── Error banner ── */}
                        {errorMessage && (
                            <div className="profile-alert profile-alert--error">
                                <AlertCircle size={16} />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* ── Success banner ── */}
                        {successMessage && (
                            <div className="profile-alert profile-alert--success">
                                <CheckCircle size={16} />
                                <span>{successMessage}</span>
                            </div>
                        )}

                        {/* Resume URL result */}
                        {resumeUrl && (
                            <div className="profile-resume-link">
                                <FileText size={14} />
                                <span>Resume Link:</span>
                                <a href={resumeUrl} target="_blank" rel="noreferrer" className="auth-link auth-link--teal">
                                    View uploaded resume <ExternalLink size={12} style={{ display: 'inline' }} />
                                </a>
                            </div>
                        )}

                        {/* ── University ID + Department ── */}
                        <div className="profile-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="universityId">
                                    <GraduationCap size={13} /> University ID <span className="profile-required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="universityId"
                                    className="auth-input"
                                    placeholder="e.g. CS2021001"
                                    value={universityId}
                                    onChange={e => setUniversityId(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="department">
                                    <Book size={13} /> Department
                                </label>
                                <input
                                    type="text"
                                    id="department"
                                    className="auth-input"
                                    placeholder="e.g. Computer Science"
                                    value={department}
                                    onChange={e => setDepartment(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* ── GPA ── */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="gpa">
                                <Star size={13} /> GPA (0.00 – 4.00)
                            </label>
                            <input
                                type="number"
                                id="gpa"
                                className="auth-input"
                                placeholder="e.g. 3.75"
                                min="0"
                                max="4"
                                step="0.01"
                                value={gpa}
                                onChange={e => setGpa(e.target.value)}
                            />
                        </div>

                        {/* ── Skills ── */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="skills">
                                Skills
                            </label>
                            <textarea
                                id="skills"
                                className="auth-input profile-textarea"
                                placeholder="e.g. React, C#, Azure, Node.js, SQL"
                                value={skills}
                                rows={3}
                                onChange={e => setSkills(e.target.value)}
                            />
                        </div>

                        {/* ── Resume drop zone ── */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="resume">
                                <FileText size={13} /> Resume (PDF only, max 5 MB) <span className="profile-required">*</span>
                            </label>
                            <div
                                className={`profile-dropzone ${isDragging ? 'dragging' : ''} ${resumeFile ? 'selected' : ''}`}
                                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('resume').click()}
                            >
                                <Upload size={24} className="profile-dropzone-icon" />
                                {resumeFile ? (
                                    <div>
                                        <p className="profile-dropzone-filename">{resumeFile.name}</p>
                                        <p className="profile-dropzone-hint">
                                            {(resumeFile.size / 1024).toFixed(0)} KB · Click to change
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="profile-dropzone-label">Drag & drop your resume here</p>
                                        <p className="profile-dropzone-hint">or click to browse · PDF only</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                id="resume"
                                accept="application/pdf,.pdf"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* ── Submit ── */}
                        <button
                            type="submit"
                            className="auth-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <div className="spinner" />
                                    Uploading...
                                </span>
                            ) : 'Save Profile'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
