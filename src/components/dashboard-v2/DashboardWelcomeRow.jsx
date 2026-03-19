import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardWelcomeRow() {
    const { user } = useAuth();
    const firstName = user?.email?.split('@')[0] || 'Student';

    return (
        <div className="dash-v2-welcome-row">
            <div className="dash-v2-welcome-text">
                <h1>Welcome back, {firstName} 👋</h1>
                <p>Track internships, projects, competitions, and documents in one place.</p>
            </div>

            <div className="dash-v2-card dash-v2-profile-card">
                <div className="dash-v2-profile-header">
                    <span className="dash-v2-profile-label">Profile Completion</span>
                    <span className="dash-v2-profile-pct">80% Complete</span>
                </div>
                <div className="dash-v2-progress-track">
                    <div className="dash-v2-progress-fill" style={{ width: '80%' }} />
                </div>
                <button className="dash-v2-profile-btn">Complete Profile</button>
            </div>
        </div>
    );
}
