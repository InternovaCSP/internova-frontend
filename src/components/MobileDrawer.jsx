import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavLinks from './NavLinks';
import AuthButtons from './AuthButtons';
import { X } from 'lucide-react';

/**
 * MobileDrawer Component
 * 
 * A sliding side-drawer designed for mobile navigation. Maps identical routing 
 * options from the TopNavbar into a touch-friendly vertical list.
 * Automatically locks the background body scroll while the drawer is open.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility of the drawer.
 * @param {Function} props.onClose - Callback triggered to close the drawer.
 * @param {Object} props.user - Authenticated user context.
 * @returns {JSX.Element} The side navigation overlay.
 */
export default function MobileDrawer({ isOpen, onClose, user }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/');
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`in-drawer-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Drawer */}
            <div className={`in-mobile-drawer ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Mobile navigation menu">
                <div className="in-drawer-header">
                    <span className="in-logo-text">InterNova</span>
                    <button className="in-close-btn" onClick={onClose} aria-label="Close menu">
                        <X size={28} />
                    </button>
                </div>

                <div className="in-drawer-content">
                    <nav className="in-drawer-nav">
                        <NavLinks isMobile={true} />
                    </nav>

                    <div className="in-drawer-divider"></div>

                    {user ? (
                        <div className="in-drawer-auth-links">
                            <Link to={`/${user.role?.toLowerCase() || 'student'}/dashboard`} className="in-mobile-link" onClick={onClose}>
                                Dashboard
                            </Link>
                            <Link to="/notifications" className="in-mobile-link" onClick={onClose}>
                                Notifications
                            </Link>
                            <Link to={`/${user.role?.toLowerCase() || 'student'}/profile`} className="in-mobile-link" onClick={onClose}>
                                Profile
                            </Link>
                            <button className="in-mobile-link in-logout-link" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <AuthButtons isMobile={true} closeDrawer={onClose} />
                    )}
                </div>
            </div>
        </>
    );
}
