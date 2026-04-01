import React, { useEffect } from 'react';
import { X, Users, Clock, Star, MapPin, ChevronRight, CheckCircle2, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetailModal({ project, onClose, onRequestJoin }) {
    const { user } = useAuth();

    if (!project) return null;

    const isFull = project.availableSlots === 0;
    const isLeader = user?.userId && project.leaderId && String(user.userId) === String(project.leaderId);

    const statusConfig = {
        'Pending': { bg: '#e0f2fe', text: '#0284c7', label: 'Request Pending' },
        'Accepted': { bg: '#dcfce7', text: '#15803d', label: 'Accepted to Project' },
        'Rejected': { bg: '#fee2e2', text: '#b91c1c', label: 'Application Declined' }
    };
    const currentStatus = statusConfig[project.currentUserStatus];

    // Lock body scroll & close on Escape
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const fillPercent = project.teamSize > 0
        ? Math.round(((project.teamSize - project.availableSlots) / project.teamSize) * 100)
        : 0;

    return (
        <div className="prj-modal-overlay" onClick={onClose}>
            <div className="prj-modal" onClick={(e) => e.stopPropagation()}>

                {/* Close button */}
                <button className="prj-modal-close" onClick={onClose} aria-label="Close">
                    <X size={20} />
                </button>

                {/* ── Header ── */}
                <div className="prj-modal-header">
                    <div className="prj-modal-badges">
                        <span className={`prj-badge prj-badge--${project.category.toLowerCase().replace(/\s+/g, '-')}`}>
                            {project.category}
                        </span>
                        {project.featured && (
                            <span className="prj-badge prj-badge--featured">
                                <Star size={11} fill="currentColor" /> Featured
                            </span>
                        )}
                        <span className={`prj-badge ${project.status === 'Active' ? 'prj-modal-badge--active' : 'prj-modal-badge--completed'}`}>
                            {project.status}
                        </span>
                    </div>
                    <h2 className="prj-modal-title">{project.title}</h2>
                    <span className="prj-modal-leader">Led by {project.leaderName}</span>
                </div>

                {/* ── Description ── */}
                <div className="prj-modal-section">
                    <h4 className="prj-modal-section-title">About this Project</h4>
                    <p className="prj-modal-desc">{project.description}</p>
                </div>

                {/* ── Details Grid ── */}
                <div className="prj-modal-details">
                    <div className="prj-modal-detail-item">
                        <Users size={16} />
                        <div>
                            <span className="prj-modal-detail-label">Team Size</span>
                            <span className="prj-modal-detail-value">{project.teamSize} members</span>
                        </div>
                    </div>
                    <div className="prj-modal-detail-item">
                        <Clock size={16} />
                        <div>
                            <span className="prj-modal-detail-label">Duration</span>
                            <span className="prj-modal-detail-value">{project.duration}</span>
                        </div>
                    </div>
                    <div className="prj-modal-detail-item">
                        <MapPin size={16} />
                        <div>
                            <span className="prj-modal-detail-label">Open Slots</span>
                            <span className="prj-modal-detail-value">{project.availableSlots} of {project.teamSize}</span>
                        </div>
                    </div>
                </div>

                {/* ── Team Fill Progress ── */}
                <div className="prj-modal-progress-wrap">
                    <div className="prj-modal-progress-header">
                        <span>Team Capacity</span>
                        <span>{fillPercent}% filled</span>
                    </div>
                    <div className="prj-modal-progress-track">
                        <div className="prj-modal-progress-fill" style={{ width: `${fillPercent}%` }} />
                    </div>
                </div>

                {/* ── Skills ── */}
                <div className="prj-modal-section">
                    <h4 className="prj-modal-section-title">Required Skills</h4>
                    <div className="prj-tags">
                        {project.skills.map((skill, idx) => (
                            <span key={idx} className="prj-skill-tag">{skill}</span>
                        ))}
                    </div>
                </div>

                {/* ── User Status (if any) ── */}
                {user?.role === 'Student' && currentStatus && (
                    <div className="prj-modal-status-banner" style={{ color: currentStatus.text, backgroundColor: currentStatus.bg }}>
                        {project.currentUserStatus === 'Accepted' && <CheckCircle2 size={16} />}
                        {currentStatus.label}
                    </div>
                )}

                {/* ── Actions ── */}
                <div className="prj-modal-actions">
                    {isLeader ? (
                        <button className="prj-btn prj-btn--primary" style={{ flex: 1 }}>
                            <Settings size={14} /> Manage Project
                        </button>
                    ) : (
                        <>
                            {user?.role === 'Student' && !project.currentUserStatus && !isFull && project.status === 'Active' && (
                                <button
                                    className="prj-btn prj-btn--accent"
                                    style={{ flex: 1 }}
                                    onClick={() => { onRequestJoin(project.id); onClose(); }}
                                >
                                    Request to Join <ChevronRight size={14} />
                                </button>
                            )}
                            {isFull && project.status === 'Active' && !project.currentUserStatus && (
                                <button className="prj-btn prj-btn--disabled" disabled style={{ flex: 1 }}>
                                    Team Full
                                </button>
                            )}
                        </>
                    )}
                    <button className="prj-btn prj-btn--outline" onClick={onClose}>
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}
