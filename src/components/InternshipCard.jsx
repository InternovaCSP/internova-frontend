import React from 'react';

const InternshipCard = ({ internship, userRole, onApply }) => {
    const {
        title,
        company,
        status,
        description,
        location,
        duration,
        deadline,
        currentUserStatus
    } = internship;

    // Determine badge config
    const getBadgeClass = () => {
        if (status === 'Closed') return 'in-badge-closed';
        if (currentUserStatus === 'Selected') return 'in-badge-selected';
        return 'in-badge-active';
    };

    const getBadgeText = () => {
        if (status === 'Closed') return 'Closed';
        if (currentUserStatus === 'Selected') return 'Selected';
        return 'Active';
    };

    const hasApplied = Boolean(currentUserStatus);
    const isStudent = userRole === 'Student';

    return (
        <div className="in-card">
            <div className="in-card-header">
                <div>
                    <h3 className="in-card-title">{title}</h3>
                    <div className="in-card-company">
                        {/* Simple dot placeholder for company icon */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--in-text-muted)">
                            <rect x="4" y="4" width="16" height="16" rx="4" />
                        </svg>
                        {company}
                    </div>
                </div>
                <span className={`in-badge ${getBadgeClass()}`}>
                    {getBadgeText()}
                </span>
            </div>

            <p className="in-card-desc">{description}</p>

            {/* Progress Track if Applied */}
            {hasApplied && currentUserStatus !== 'Selected' && (
                <div className="in-progress-wrap">
                    <div className="in-progress-header">
                        <span style={{ color: 'var(--in-azure)' }}>Application Status</span>
                        <span>{currentUserStatus}</span>
                    </div>
                    <div className="in-progress-track">
                        <div
                            className="in-progress-fill"
                            style={{
                                width: currentUserStatus === 'Applied' ? '25%' :
                                    currentUserStatus === 'Shortlisted' ? '50%' :
                                        currentUserStatus === 'Interviewing' ? '75%' : '0%',
                                background: 'var(--in-azure)'
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="in-meta-list">
                <div className="in-meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {location}
                </div>
                <div className="in-meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {duration}
                </div>
                <div className="in-meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Deadline: {new Date(deadline).toLocaleDateString()}
                </div>
            </div>

            <div className="in-card-footer">
                <button className="in-btn in-btn-outline">
                    View Details
                </button>
                {isStudent && (
                    <button
                        className={`in-btn ${hasApplied ? 'in-btn-disabled' : 'in-btn-secondary'}`}
                        disabled={hasApplied || status === 'Closed'}
                        onClick={onApply}
                    >
                        {hasApplied ? 'Applied' : 'Apply Now'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default InternshipCard;
