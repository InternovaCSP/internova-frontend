import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Building2, 
    Users, 
    Settings, 
    LogOut,
    Menu,
    X,
    Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * AdminSidebar Component
 * 
 * Professional, minimalistic sidebar for the Admin Dashboard.
 */
const AdminSidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { 
            name: 'Dashboard', 
            icon: <LayoutDashboard size={20} />, 
            path: '/admin/dashboard' 
        },
        { 
            name: 'Company Approvals', 
            icon: <Building2 size={20} />, 
            path: '/admin/companies' 
        },
        { 
            name: 'User Management', 
            icon: <Users size={20} />, 
            path: '/admin/users' 
        },
        { 
            name: 'Settings', 
            icon: <Settings size={20} />, 
            path: '/admin/settings' 
        },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="admin-sidebar" style={{
            width: '260px',
            height: '100vh',
            background: '#0f172a', // Slate 900
            color: '#f8fafc', // Slate 50
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            borderRight: '1px solid #1e293b',
            zIndex: 1000,
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Logo area */}
            <div style={{
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: '1px solid #1e293b'
            }}>
                <div style={{
                    background: 'var(--lp-blue)',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Shield size={24} color="white" />
                </div>
                <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>Internova</h2>
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase' }}>Admin Portal</span>
                </div>
            </div>

            {/* Navigation links */}
            <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {menuItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            background: isActive(item.path) ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                            color: isActive(item.path) ? '#3b82f6' : '#94a3b8',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            transition: 'all 0.2s ease',
                            fontWeight: isActive(item.path) ? 600 : 500,
                            fontSize: '14px'
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive(item.path)) {
                                e.currentTarget.style.color = '#f8fafc';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive(item.path)) {
                                e.currentTarget.style.color = '#94a3b8';
                                e.currentTarget.style.background = 'transparent';
                            }
                        }}
                    >
                        {item.icon}
                        {item.name}
                    </button>
                ))}
            </nav>

            {/* Bottom area with user info and logout */}
            <div style={{
                padding: '20px',
                borderTop: '1px solid #1e293b',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 600
                    }}>
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.email}
                        </p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Administrator</p>
                    </div>
                </div>
                
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        transition: 'all 0.2s ease',
                        fontWeight: 500,
                        fontSize: '14px'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
