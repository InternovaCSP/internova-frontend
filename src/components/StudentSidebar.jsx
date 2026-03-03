import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, BookOpen, Trophy, FileText, User as UserIcon, LogOut } from 'lucide-react';

export default function StudentSidebar({ onLogout }) {
    const navItems = [
        { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/internships', icon: Briefcase, label: 'Internships' },
        { path: '/projects', icon: BookOpen, label: 'Projects' },
        { path: '/competitions', icon: Trophy, label: 'Competitions' },
        { path: '/student/documents', icon: FileText, label: 'Documents' },
        { path: '/student/profile', icon: UserIcon, label: 'Profile' }
    ];

    return (
        <aside className="dash-sidebar">
            <div className="dash-sidebar-header">
                <img src="/logo-mono-long.png" alt="InterNova" className="dash-logo" />
            </div>

            <nav className="dash-nav-links">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `dash-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon className="dash-nav-icon" size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="dash-sidebar-footer">
                <button className="dash-nav-item logout-btn" onClick={onLogout}>
                    <LogOut className="dash-nav-icon" size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
