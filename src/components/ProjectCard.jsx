import React from 'react';
import { Users, Clock, CheckCircle2, ChevronRight, Star, Settings, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProjectCard({ project, onRequestJoin, onViewDetails, onDelete }) {
    const { user } = useAuth();

    const statusConfig = {
        'Pending': { bg: '#e0f2fe', text: '#0284c7', label: 'Request Pending' },
        'Accepted': { bg: '#dcfce7', text: '#15803d', label: 'Accepted to Project' },
        'Rejected': { bg: '#fee2e2', text: '#b91c1c', label: 'Application Declined' }
    };

    const currentStatus = statusConfig[project.currentUserStatus];
    const isFull = project.availableSlots === 0;
    const isLeader = user?.userId && project.leaderId && String(user.userId) === String(project.leaderId);
    const isAdmin = user?.role === 'Admin';

    return (
        <div className="prj-card">
            {/* ... rest of header ... */}
            <div className="prj-card-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="prj-card-title">{project.title}</h3>
                    {(isAdmin || isLeader) && onDelete && (
                        <button 
                            className="prj-btn prj-btn--danger" 
                            style={{ padding: '6px', borderRadius: '6px' }}
                            onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                            title="Delete Project"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
                <div className="prj-card-meta">
                    <span className={`prj-badge prj-badge--${project.category.toLowerCase().replace(/\s+/g, '-')}`}>
                        {project.category}
                    </span>
                    {project.featured && (
                        <span className="prj-badge prj-badge--featured">
                            <Star size={11} fill="currentColor" /> Featured
                        </span>
                    )}
                </div>
                <span className="prj-leader">Led by {project.leaderName}</span>
            </div>

            {/* ── Body ── */}
            <div className="prj-card-body">

                {/* Skills */}
                <div className="prj-tags">
                    {(project.skills || []).slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="prj-skill-tag">{skill}</span>
                    ))}
                    {(project.skills || []).length > 4 && (
                        <span className="prj-skill-tag prj-skill-tag--more">+{(project.skills || []).length - 4}</span>
                    )}
                </div>

                {/* Info Row */}
                <div className="prj-info-row">
                    <div className="prj-info-item">
                        <Users size={14} />
                        <span>{project.availableSlots}/{project.teamSize} slots</span>
                    </div>
                    <div className="prj-info-item">
                        <Clock size={14} />
                        <span>{project.duration}</span>
                    </div>
                    <div className={`prj-info-item ${project.status === 'Completed' ? 'prj-info-item--completed' : ''}`}>
                        <span className={`prj-status-dot ${project.status === 'Active' ? 'prj-status-dot--active' : 'prj-status-dot--done'}`} />
                        <span>{project.status === 'Completed' ? 'Completed' : 'Active'}</span>
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="prj-card-footer">

                {/* Left: student status */}
                <div className="prj-footer-left">
                    {user?.role === 'Student' && currentStatus && (
                        <div className="prj-user-status" style={{ color: currentStatus.text, backgroundColor: currentStatus.bg }}>
                            {project.currentUserStatus === 'Accepted' && <CheckCircle2 size={13} />}
                            {currentStatus.label}
                        </div>
                    )}
                </div>

                {/* Right: action buttons */}
                <div className="prj-footer-actions">
                    <button className="prj-btn prj-btn--outline" onClick={() => onViewDetails(project)}>View Details</button>

                    {isLeader ? (
                        <button className="prj-btn prj-btn--primary">
                            <Settings size={14} /> Manage
                        </button>
                    ) : (
                        <>
                            {user?.role === 'Student' && !project.currentUserStatus && !isFull && project.status === 'Active' && (
                                <button
                                    className="prj-btn prj-btn--accent"
                                    onClick={() => onRequestJoin(project.id)}
                                >
                                    Request to Join <ChevronRight size={14} />
                                </button>
                            )}

                            {isFull && project.status === 'Active' && !project.currentUserStatus && (
                                <button className="prj-btn prj-btn--disabled" disabled>
                                    Team Full
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}
