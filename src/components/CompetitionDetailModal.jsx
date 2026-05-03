import React, { useEffect } from 'react';
import { X, Users, Calendar, Award, CheckCircle2, Trash2, Award as WinIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CompetitionDetailModal({ competition, onClose, onRegister, onDelete }) {
    const { user } = useAuth();

    if (!competition) return null;

    const isAdmin = user?.role === 'Admin';
    const isStudent = user?.role === 'Student';

    const statusConfig = {
        'Upcoming': { bg: 'rgba(0, 120, 212, 0.08)', color: '#0369a1', label: 'Upcoming' },
        'Ongoing': { bg: 'rgba(29, 137, 84, 0.08)', color: '#15803d', label: 'Ongoing' },
        'Closed': { bg: '#f1f5f9', color: '#64748b', label: 'Closed' }
    };
    const statusStyle = statusConfig[competition.status] || statusConfig['Closed'];

    const getUserStatusConfig = (status) => {
        switch (status) {
            case 'Registered':
                return { text: 'Registered', color: '#64748b', bg: '#f1f5f9', disabled: true };
            case 'Submitted':
            case 'Participated':
                return { text: 'Participated', color: '#15803d', bg: 'rgba(29, 137, 84, 0.1)', disabled: true };
            case 'Won':
                return { text: 'Winner', color: '#92400e', bg: 'rgba(249, 168, 37, 0.15)', disabled: true };
            default:
                return { text: 'Register Now', color: '#fff', bg: '#1D8954', disabled: false };
        }
    };
    const userState = getUserStatusConfig(competition.currentUserStatus);

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
                        <span 
                            className="prj-badge" 
                            style={{ backgroundColor: statusStyle.bg, color: statusStyle.color, borderColor: 'rgba(0,0,0,0.05)' }}
                        >
                            {statusStyle.label}
                        </span>
                        <span className="prj-badge prj-badge--innovation-lab">
                            {competition.category}
                        </span>
                        {competition.currentUserStatus === 'Won' && (
                            <span className="prj-badge prj-badge--featured">
                                <WinIcon size={11} fill="currentColor" /> Winner
                            </span>
                        )}
                    </div>
                    <h2 className="prj-modal-title">{competition.title}</h2>
                    <span className="prj-modal-leader">Organized by {competition.organizer}</span>
                </div>

                {/* ── Description ── */}
                <div className="prj-modal-section">
                    <h4 className="prj-modal-section-title">Description</h4>
                    <p className="prj-modal-desc">{competition.description}</p>
                </div>

                {/* ── Details Grid ── */}
                <div className="prj-modal-details">
                    <div className="prj-modal-detail-item">
                        <Users size={16} />
                        <div>
                            <span className="prj-modal-detail-label">Eligibility</span>
                            <span className="prj-modal-detail-value">{competition.eligibility}</span>
                        </div>
                    </div>
                    <div className="prj-modal-detail-item">
                        <Calendar size={16} />
                        <div>
                            <span className="prj-modal-detail-label">Important Dates</span>
                            <span className="prj-modal-detail-value">{competition.startDate} - {competition.endDate}</span>
                        </div>
                    </div>
                    <div className="prj-modal-detail-item">
                        <Clock size={16} />
                        <div>
                            <span className="prj-modal-detail-label">Deadline</span>
                            <span className="prj-modal-detail-value" style={{ color: '#0078D4', fontWeight: '600' }}>{competition.deadline}</span>
                        </div>
                    </div>
                </div>

                {/* ── Skills ── */}
                <div className="prj-modal-section" style={{ marginTop: '24px' }}>
                    <h4 className="prj-modal-section-title">Required Domains & Skills</h4>
                    <div className="prj-tags">
                        {(competition.skills || []).map((skill, idx) => (
                            <span key={idx} className="prj-skill-tag">{skill}</span>
                        ))}
                    </div>
                </div>

                {/* ── User Status (if any) ── */}
                {isStudent && competition.currentUserStatus && competition.currentUserStatus !== 'Won' && (
                    <div className="prj-modal-status-banner" style={{ color: userState.color, backgroundColor: userState.bg }}>
                        <CheckCircle2 size={16} /> {userState.text}
                    </div>
                )}

                {/* ── Actions ── */}
                <div className="prj-modal-actions">
                    {isStudent && (
                        <button
                            className={`prj-btn ${userState.disabled ? 'prj-btn--disabled' : 'prj-btn--accent'}`}
                            style={{ flex: 1 }}
                            disabled={userState.disabled}
                            onClick={() => { onRegister(competition.id); onClose(); }}
                        >
                            {userState.text === 'Register Now' ? 'Register for Competition' : userState.text}
                        </button>
                    )}
                    {isAdmin && onDelete && (
                        <button 
                            className="prj-btn prj-btn--danger" 
                            onClick={() => { if(window.confirm('Are you sure you want to delete this competition?')) { onDelete(competition.id); onClose(); } }}
                        >
                            <Trash2 size={14} /> Delete Competition
                        </button>
                    )}
                    <button className="prj-btn prj-btn--outline" onClick={onClose}>
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}

// Reuse clock icon from project details
const Clock = ({ size, style }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        style={style}
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);
