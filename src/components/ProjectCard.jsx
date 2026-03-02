import React from 'react';
import { Users, Clock, CheckCircle2, ChevronRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProjectCard({ project, onRequestJoin }) {
    const { user } = useAuth();

    // Status tag configurations based on currentUserStatus
    const statusConfig = {
        'Pending': { bg: '#e0f2fe', text: '#0284c7', label: 'Request Pending' },
        'Accepted': { bg: '#dcfce7', text: '#15803d', label: 'Accepted to Project' },
        'Rejected': { bg: '#fee2e2', text: '#b91c1c', label: 'Application Declined' }
    };

    const currentStatus = statusConfig[project.currentUserStatus];

    // For computing "popularity" or availability
    const isFull = project.availableSlots === 0;

    return (
        <div className="in-card">

            {/* Header */}
            <div className="in-card-header">
                <div className="in-card-title-row">
                    <h3 className="in-card-title">{project.title}</h3>
                    {project.featured && (
                        <div className="in-badge in-badge-selected" style={{ padding: '4px 8px', gap: '4px' }}>
                            <Star size={12} fill="currentColor" /> Featured
                        </div>
                    )}
                </div>

                <div className="in-card-meta">
                    <span className="in-badge in-badge-active" style={{ backgroundColor: 'transparent', border: '1px solid var(--in-azure)' }}>
                        {project.category}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--in-text-muted)' }}>
                        Led by {project.leaderName}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="in-card-body">
                <p className="in-card-desc">{project.description}</p>

                {/* Skills */}
                <div className="in-card-tags">
                    {project.skills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="in-skill-tag">{skill}</span>
                    ))}
                    {project.skills.length > 4 && (
                        <span className="in-skill-tag">+{project.skills.length - 4}</span>
                    )}
                </div>

                {/* Info Row */}
                <div className="in-card-info-row">
                    <div className="in-info-item">
                        <Users size={16} />
                        {project.availableSlots} / {project.teamSize} Slots Open
                    </div>
                    <div className="in-info-item">
                        <Clock size={16} />
                        {project.duration}
                    </div>
                    <div className="in-info-item" style={{
                        color: project.status === 'Completed' ? '#b91c1c' : 'var(--in-text-muted)'
                    }}>
                        {project.status === 'Completed' ? 'Project Completed' : 'Active Phase'}
                    </div>
                </div>
            </div>

            {/* Footer / Actions */}
            <div className="in-card-footer">

                {/* Left side Status (for students) */}
                <div className="in-card-status-area">
                    {user?.role === 'Student' && currentStatus && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: currentStatus.text, backgroundColor: currentStatus.bg, padding: '4px 10px', borderRadius: '12px' }}>
                            {project.currentUserStatus === 'Accepted' && <CheckCircle2 size={14} />}
                            {currentStatus.label}
                        </div>
                    )}
                </div>

                {/* Right side Actions */}
                <div className="in-card-actions">
                    <button className="in-btn in-btn-outline">
                        View Details
                    </button>

                    {user?.role === 'Student' && !project.currentUserStatus && !isFull && project.status === 'Active' && (
                        <button
                            className="in-btn in-btn-secondary"
                            onClick={() => onRequestJoin(project.id)}
                        >
                            Request to Join <ChevronRight size={16} />
                        </button>
                    )}

                    {isFull && project.status === 'Active' && !project.currentUserStatus && (
                        <button className="in-btn in-btn-secondary" disabled style={{ opacity: 0.5 }}>
                            Team Full
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
