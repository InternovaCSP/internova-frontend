import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavLinks from './NavLinks';
import AuthButtons from './AuthButtons';
import NotificationBell from './NotificationBell';
import UserMenu from './UserMenu';
import MobileDrawer from './MobileDrawer';
import { Menu } from 'lucide-react';
import '../styles/TopNavbar.css';

/**
 * TopNavbar Component
 * 
 * The main global navigation header for the InterNova application.
 * Manages responsive states (desktop vs mobile hamburger menu) and conditionally 
 * renders authentication and profile actions based on the user's login state.
 * 
 * @returns {JSX.Element} The sticky top navigation header.
 */
export default function TopNavbar() {
    const { user } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    // Detect if we should use transparent navbar (only on Landing Page at the top)
    const isLanding = location.pathname === '/';
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (!isLanding) return;
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLanding]);

    // Hide Navbar on Admin pages as they use a custom Sidebar/Header layout
    // Also hide on auth pages (login/register) for a clean full-screen experience
    if (location.pathname.startsWith('/admin') ||
        location.pathname === '/login' ||
        location.pathname === '/register') {
        return null;
    }

    return (
        <header className={`in-navbar-wrapper ${isLanding && !isScrolled ? 'transparent' : ''}`}>
            {/* Accessibility Skip Link */}
            <a href="#main-content" className="in-skip-link">Skip to main content</a>

            <nav className="in-navbar">
                <div className="in-navbar-container">

                    {/* Left: Empty space for Grid balance */}
                    <div />

                    {/* Center: Desktop Links (Hidden on Mobile) */}
                    <div className="in-navbar-center in-glass-island">
                        <NavLinks />
                    </div>

                    {/* Right: Auth/Profile (Hidden on Mobile) */}
                    <div className="in-navbar-right in-glass-island">
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
