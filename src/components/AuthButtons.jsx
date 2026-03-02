import React from 'react';
import { Link } from 'react-router-dom';

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
