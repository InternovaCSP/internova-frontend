import React from 'react';
import { Calendar, Users, Award, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CompetitionCard({ competition, userRole, onViewDetails, onRegister }) {

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

    const statusStyle = getStatusStyle(competition.status);
    const userState = getUserStatusConfig(competition.currentUserStatus);

    return (
        <div className="in-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <div className="in-card-header" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 className="in-card-title" style={{ fontSize: '18px' }}>{competition.title}</h3>
                        <p className="in-card-company" style={{ fontSize: '13px', color: 'var(--lp-text-secondary)' }}>
                            {competition.organizer}
                        </p>
                    </div>
                    {/* Status Badge */}
                    <span
                        className="in-badge"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                    >
                        {competition.status}
                    </span>
                </div>
            </div>

            {/* Winner Badge (If Applicable) */}
            {competition.currentUserStatus === 'Won' && (
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    backgroundColor: 'rgba(249, 168, 37, 0.15)', color: '#d68f1c',
                    padding: '4px 10px', borderRadius: '6px', fontSize: '12px',
                    fontWeight: '600', marginBottom: '16px', width: 'fit-content'
                }}>
                    <Award size={14} /> Winner Achieved
                </div>
            )}

            {/* Body */}
            <div className="in-card-body" style={{ flexGrow: 1 }}>
                <p className="in-card-desc" style={{
                    fontSize: '14px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '16px'
                }}>
                    {competition.description}
                </p>

                {/* Metadata Row */}
                <div className="in-card-meta-row" style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '13px' }}>
                    <div className="in-card-meta-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} className="in-card-meta-icon" />
                        <span>Deadline: {competition.deadline}</span>
                    </div>
                    <div className="in-card-meta-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={14} className="in-card-meta-icon" />
                        <span>{competition.eligibility}</span>
                    </div>
                </div>

                {/* Tags */}
                <div className="in-card-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <span className="in-tag" style={{ background: 'rgba(0, 120, 212, 0.05)', color: 'var(--lp-blue)', border: '1px solid rgba(0, 120, 212, 0.1)' }}>
                        {competition.category}
                    </span>
                    {competition.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="in-tag">{skill}</span>
                    ))}
                    {competition.skills.length > 3 && (
                        <span className="in-tag">+{competition.skills.length - 3}</span>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="in-card-footer" style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid var(--lp-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <button
                    className="in-btn in-btn-outline"
                    onClick={() => onViewDetails(competition)}
                    style={{ flex: 1, marginRight: '8px', justifyContent: 'center' }}
                >
                    View Details
                </button>

                {userRole === 'Student' && (
                    <button
                        className={`in-btn ${userState.disabled ? '' : 'in-btn-teal'}`}
                        disabled={userState.disabled}
                        onClick={() => !userState.disabled && onRegister(competition.id)}
                        style={{
                            flex: 1,
                            marginLeft: '8px',
                            justifyContent: 'center',
                            backgroundColor: userState.bg,
                            color: userState.color,
                            border: '1px solid transparent',
                            cursor: userState.disabled ? 'default' : 'pointer'
                        }}
                    >
                        {userState.disabled && userState.text === 'Registered' && <CheckCircle2 size={16} style={{ marginRight: '6px' }} />}
                        {userState.disabled && userState.text === 'Participated' && <CheckCircle2 size={16} style={{ marginRight: '6px' }} />}
                        {userState.disabled && userState.text === 'Winner' && <Award size={16} style={{ marginRight: '6px' }} />}
                        {userState.text}
                    </button>
                )}
            </div>
        </div>
    );
}
