import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * DashboardWelcomeRow Component
 * 
 * The hero section of the V2 Student Dashboard.
 * Displays a personalized greeting based on the user's authenticated email,
 * alongside a visual profile completion tracking card.
 * 
 * @returns {JSX.Element} The welcome banner and profile status card.
 */
export default function DashboardWelcomeRow() {
    const { user } = useAuth();

    // Get the first part of the email or a default name
    const firstName = user?.email?.split('@')[0] || 'Student';

    return (
        <div className="dash-v2-welcome-row">
            <div className="dash-v2-welcome-text">
                <h1>Welcome back, {firstName}</h1>
                <p>Track internships, projects, competitions, and documents in one place.</p>
            </div>

            <div className="dash-v2-card" style={{ width: '100%', maxWidth: '340px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--lp-navy)' }}>Profile Completion</span>
                    <span className="dash-v2-kpi-trend dash-v2-kpi-trend-positive">80% Complete</span>
                </div>

                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--lp-slate)', borderRadius: '3px', marginBottom: '16px', overflow: 'hidden' }}>
                    <div style={{ width: '80%', height: '100%', backgroundColor: 'var(--lp-teal)', borderRadius: '3px' }}></div>
                </div>

                <button className="lp-btn lp-btn--primary" style={{ width: '100%', display: 'block', textAlign: 'center' }}>
                    Complete Profile
                </button>
            </div>
        </div>
    );
}
