import React from 'react';

const activities = [
    { id: 1, title: 'Application Submitted', desc: 'Applied for Cloud Intern at Microsoft.', time: '2 hours ago', color: '#0078d4', bg: 'rgba(0,120,212,0.12)' },
    { id: 2, title: 'Interview Scheduled', desc: 'Interview with Google HR Team.', time: 'Yesterday, 2:30 PM', color: '#1d8954', bg: 'rgba(29,137,84,0.12)' },
    { id: 3, title: 'Profile Updated', desc: 'Added 3 new skills to profile.', time: 'Oct 18, 2025', color: '#0078d4', bg: 'rgba(0,120,212,0.12)' },
    { id: 4, title: 'Competition Winner 🏆', desc: 'Placed 1st in Global AI Hackathon.', time: 'Oct 15, 2025', color: '#f9a825', bg: 'rgba(249,168,37,0.12)' },
];

export default function ActivityTimeline() {
    return (
        <div className="dash-v2-card">
            <div className="dash-v2-section-title">
                <span>Recent Activity</span>
                <a href="#" className="dash-v2-link">View all</a>
            </div>

            <div className="dash-v2-timeline-wrap">
                <div className="dash-v2-timeline-line" />
                {activities.map(item => (
                    <div key={item.id} className="dash-v2-timeline-item">
                        <div
                            className="dash-v2-timeline-dot"
                            style={{ background: item.bg, border: `2px solid ${item.color}` }}
                        />
                        <div className="dash-v2-timeline-title">{item.title}</div>
                        <div className="dash-v2-timeline-desc">{item.desc}</div>
                        <div className="dash-v2-timeline-time">{item.time}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
