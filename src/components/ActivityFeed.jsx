import React from 'react';

export default function ActivityFeed() {
    const activities = [
        { id: 1, action: 'Applied to Full-Stack Engineer at TechCorp', time: '2 hours ago', type: 'application' },
        { id: 2, action: 'Interview scheduled for Data Analyst role', time: 'Yesterday', type: 'interview' },
        { id: 3, action: 'Joined Quantum Computing Research Project', time: '3 days ago', type: 'project' },
        { id: 4, action: 'Registered for Global AI Hackathon 2026', time: '1 week ago', type: 'competition' }
    ];

    const getDotColor = (type) => {
        switch (type) {
            case 'application': return 'var(--lp-blue)';
            case 'interview': return 'var(--lp-teal)';
            case 'project': return 'var(--lp-gold)';
            case 'competition': return 'var(--lp-navy)';
            default: return 'var(--lp-border)';
        }
    };

    return (
        <div className="dash-card">
            <h3 className="dash-section-title">Recent Activity</h3>
            <div className="dash-activity-list">
                {activities.map((item, index) => (
                    <div className="dash-activity-item" key={item.id}>
                        <div className="dash-activity-timeline">
                            <div className="dash-activity-dot" style={{ backgroundColor: getDotColor(item.type) }}></div>
                            {index !== activities.length - 1 && <div className="dash-activity-line"></div>}
                        </div>
                        <div className="dash-activity-content">
                            <p className="dash-activity-text">{item.action}</p>
                            <span className="dash-activity-time">{item.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
