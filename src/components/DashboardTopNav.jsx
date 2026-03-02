import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * DashboardTopNav Component (Legacy)
 * 
 * Represents the top navigation strip inside V1 dashboard layouts.
 * Features profile completion status and a localized notification bell.
 * 
 * @returns {JSX.Element} The legacy dashboard header.
 */
export default function DashboardTopNav() {
    const { user } = useAuth();

    // Fallback initials if no name is provided
    const getInitials = (email) => {
        if (!email) return 'ST';
        return email.substring(0, 2).toUpperCase();
    };

    return (
        <header className="dash-topnav">
            <div className="dash-topnav-left">
                {/* Optional Breadcrumbs or Page Title could go here */}
            </div>

            <div className="dash-topnav-right">
                <div className="dash-profile-status">
                    <span className="status-dot"></span>
                    <span className="status-text">Profile 80% Complete</span>
                </div>

                <button className="dash-icon-btn">
                    <Bell size={20} />
                    <span className="dash-badge">2</span>
                </button>

                <div className="dash-user-menu">
                    <div className="dash-avatar">
                        {getInitials(user?.email)}
                    </div>
                    <div className="dash-user-info">
                        <span className="dash-user-name">{user?.email?.split('@')[0] || 'Student'}</span>
                        <span className="dash-user-role">Student</span>
                    </div>
                    <ChevronDown size={16} className="dash-user-chevron" />
                </div>
            </div>
        </header>
    );
}
