import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavLinks from './NavLinks';
import AuthButtons from './AuthButtons';
import NotificationBell from './NotificationBell';
import UserMenu from './UserMenu';
import MobileDrawer from './MobileDrawer';
import { Menu } from 'lucide-react';

export default function TopNavbar() {
    const { user } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    return (
        <header className="in-navbar-wrapper">
            {/* Accessibility Skip Link */}
            <a href="#main-content" className="in-skip-link">Skip to main content</a>

            <nav className="in-navbar">
                <div className="in-navbar-container">

                    {/* Left: Logo */}
                    <Link to="/" className="in-navbar-logo" aria-label="InterNova Home">
                        <span className="in-logo-text">InterNova</span>
                    </Link>

                    {/* Center: Desktop Links (Hidden on Mobile) */}
                    <div className="in-navbar-center">
                        <NavLinks />
                    </div>

                    {/* Right: Auth/Profile (Hidden on Mobile) */}
                    <div className="in-navbar-right">
                        {!user ? (
                            <AuthButtons />
                        ) : (
                            <div className="in-navbar-auth-group">
                                <NotificationBell />
                                <Link to={`/${user.role?.toLowerCase() || 'student'}/dashboard`} className="in-nav-dash-btn">
                                    Dashboard
                                </Link>
                                <UserMenu user={user} />
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <button
                        className="in-hamburger"
                        onClick={() => setIsMobileOpen(true)}
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMobileOpen}
                    >
                        <Menu size={28} />
                    </button>

                </div>
            </nav>

            {/* Mobile Drawer Overlay */}
            <MobileDrawer
                isOpen={isMobileOpen}
                onClose={() => setIsMobileOpen(false)}
                user={user}
            />
        </header>
    );
}
