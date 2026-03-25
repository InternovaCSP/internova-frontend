import React from 'react';
import { Link } from 'react-router-dom';

/**
 * AuthButtons Component
 * 
 * Displays the Login and Register Call-To-Action buttons for unauthenticated users.
 * Adapts styling behavior based on whether it is rendered in desktop navbar or mobile drawer.
 * 
 * @param {Object} props
 * @param {boolean} [props.isMobile] - If true, adapts styles for the mobile side-drawer.
 * @param {Function} [props.closeDrawer] - Callback to forcibly close the mobile drawer upon navigation.
 * @returns {JSX.Element} The authentication button group.
 */
export default function AuthButtons({ isMobile, closeDrawer }) {
    if (isMobile) {
        return (
            <div className="in-mobile-auth">
                <Link to="/login" className="in-btn in-btn-outline-teal" onClick={closeDrawer}>
                    Login
                </Link>
                <Link to="/register" className="in-btn in-btn-primary-azure" onClick={closeDrawer}>
                    Register
                </Link>
            </div>
        );
    }

    return (
        <div className="in-auth-buttons">
            <Link to="/help" className="in-help-link">Help/Support</Link>
            <Link to="/login" className="in-btn in-btn-outline-teal">
                Login
            </Link>
            <Link to="/register" className="in-btn in-btn-primary-azure">
                Register
            </Link>
        </div>
    );
}
