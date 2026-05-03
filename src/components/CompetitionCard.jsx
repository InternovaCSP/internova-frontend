import React from 'react';
import { Calendar, Users, Award, CheckCircle2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CompetitionCard({ competition, userRole, onViewDetails, onRegister, onEdit, onDelete }) {

    // Status Badge Helpers
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Upcoming':
                return { bg: 'rgba(0, 120, 212, 0.1)', color: 'var(--lp-blue)' }; // Azure
            case 'Ongoing':
                return { bg: 'rgba(29, 137, 84, 0.1)', color: 'var(--lp-teal)' }; // Teal
            case 'Closed':
                return { bg: 'var(--lp-gray)', color: 'var(--lp-text-secondary)' }; // Slate/Muted
            default:
                return { bg: 'var(--lp-gray)', color: 'var(--lp-text-secondary)' };
        }
    };

    // Current User Registration Status Helpers
    const getUserStatusConfig = (status) => {
        switch (status) {
            case 'Registered':
                return { text: 'Registered', color: 'var(--lp-text-secondary)', bg: 'var(--lp-gray)', disabled: true };
            case 'Submitted':
            case 'Participated':
                return { text: 'Participated', color: 'var(--lp-teal)', bg: 'rgba(29, 137, 84, 0.1)', disabled: true };
            case 'Won':
                return { text: 'Winner', color: '#d68f1c', bg: 'rgba(249, 168, 37, 0.15)', disabled: true }; // Gold
            default:
                return { text: 'Register', color: 'var(--lp-white)', bg: 'var(--lp-teal)', disabled: false };
        }
    };

    const statusConfig = {
        'Upcoming': { bg: 'rgba(0, 120, 212, 0.08)', color: '#0369a1', label: 'Upcoming' },
        'Ongoing': { bg: 'rgba(29, 137, 84, 0.08)', color: '#15803d', label: 'Ongoing' },
        'Closed': { bg: '#f1f5f9', color: '#64748b', label: 'Closed' }
    };

    const statusStyle = statusConfig[competition.status] || statusConfig['Closed'];
    const userState = getUserStatusConfig(competition.currentUserStatus);
    const isAdmin = userRole === 'Admin';

    return (
        <div className="prj-card">
            {/* ── Header ── */}
            <div className="prj-card-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 className="prj-card-title">{competition.title}</h3>
                        <span className="prj-leader" style={{ fontSize: '13px' }}>Organized by {competition.organizer}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {isAdmin && onDelete && (
                            <button
                                className="prj-btn prj-btn--danger"
                                style={{ padding: '6px', borderRadius: '6px' }}
                                onClick={(e) => { e.stopPropagation(); onDelete(competition.id); }}
                                title="Delete Competition"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="prj-card-meta" style={{ marginTop: '10px' }}>
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
                            <Award size={11} fill="currentColor" /> Winner
                        </span>
                    )}
                </div>
            </div>

            {/* ── Body ── */}
            <div className="prj-card-body">
                <p className="prj-card-desc">
                    {competition.description}
                </p>

                {/* Tags */}
                <div className="prj-tags">
                    {(competition.skills || []).slice(0, 3).map((skill, index) => (
                        <span key={index} className="prj-skill-tag">{skill}</span>
                    ))}
                    {(competition.skills || []).length > 3 && (
                        <span className="prj-skill-tag prj-skill-tag--more">+{(competition.skills || []).length - 3}</span>
                    )}
                </div>

                {/* Info Row */}
                <div className="prj-info-row">
                    <div className="prj-info-item">
                        <Calendar size={14} />
                        <span>Deadline: {competition.deadline}</span>
                    </div>
                    <div className="prj-info-item">
                        <Users size={14} />
                        <span>{competition.eligibility}</span>
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="prj-card-footer">
                <div className="prj-footer-left">
                    {competition.currentUserStatus && competition.currentUserStatus !== 'Won' && (
                        <div className="prj-user-status" style={{ backgroundColor: userState.bg, color: userState.color }}>
                            <CheckCircle2 size={13} /> {userState.text}
                        </div>
                    )}
                </div>

                <div className="prj-footer-actions">
                    <button className="prj-btn prj-btn--outline" onClick={() => onViewDetails(competition)}>View Details</button>

                    {isAdmin ? (
                        <button
                            className="prj-btn prj-btn--primary"
                            onClick={(e) => { e.stopPropagation(); onEdit(competition); }}
                        >
                            Edit Competition
                        </button>
                    ) : (
                        userRole === 'Student' && (
                            <button
                                className={`prj-btn ${userState.disabled ? 'prj-btn--disabled' : 'prj-btn--accent'}`}
                                disabled={userState.disabled}
                                onClick={() => !userState.disabled && onRegister(competition.id)}
                            >
                                {userState.text}
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
