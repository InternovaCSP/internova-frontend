import React from 'react';

export default function ActivityTimeline() {
    const activities = [
        { id: 1, title: 'Application Submitted', desc: 'Applied for Cloud Intern at Microsoft.', time: '2 hours ago', color: 'azure' },
        { id: 2, title: 'Interview Scheduled', desc: 'Interview with Google HR Team.', time: 'Yesterday, 2:30 PM', color: 'teal' },
        { id: 3, title: 'Profile Updated', desc: 'Added 3 new skills to profile.', time: 'Oct 18, 2025', color: 'azure' },
        { id: 4, title: 'Competition Winner', desc: 'Placed 1st in Global AI Hackathon.', time: 'Oct 15, 2025', color: 'gold' },
    ];

    const getColorVars = (color) => {
        if (color === 'azure') return { bg: 'rgba(0, 120, 212, 0.1)', border: 'var(--lp-azure)' };
        if (color === 'teal') return { bg: 'rgba(29, 137, 84, 0.1)', border: 'var(--lp-teal)' };
        if (color === 'gold') return { bg: 'rgba(249, 168, 37, 0.1)', border: 'var(--lp-gold)' };
        return { bg: '#e2e8f0', border: '#94a3b8' };
    };

    return (
        <div className="dash-v2-card">
            <div className="dash-v2-section-title">
                <span>Recent Activity</span>
            </div>

            <div style={{ position: 'relative', paddingLeft: '16px' }}>
                {/* Vertical Line */}
                <div style={{ position: 'absolute', left: '19px', top: '16px', bottom: '0', width: '2px', backgroundColor: '#e2e8f0' }}></div>

                {activities.map((item, index) => {
                    const colors = getColorVars(item.color);
                    return (
                        <div key={item.id} style={{ position: 'relative', paddingBottom: index === activities.length - 1 ? '0' : '24px', paddingLeft: '24px' }}>
                            {/* Timeline Dot */}
                            <div style={{
                                position: 'absolute',
                                left: '-3px',
                                top: '4px',
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: colors.bg,
                                border: `2px solid ${colors.border}`,
                                zIndex: 1
                            }}></div>

                            <div style={{ fontWeight: 600, color: 'var(--lp-navy)', marginBottom: '4px', fontSize: '15px' }}>{item.title}</div>
                            <div style={{ color: '#475569', fontSize: '14px', marginBottom: '4px' }}>{item.desc}</div>
                            <div style={{ color: '#94a3b8', fontSize: '12px' }}>{item.time}</div>
                        </div>
                    );
                })}
            </div>

            <a href="#" className="dash-v2-link" style={{ display: 'block', marginTop: '20px', textAlign: 'center' }}>View All Activity</a>
        </div>
    );
}
