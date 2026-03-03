import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * UserMenu Component
 * 
 * A dropdown menu linked to the user's avatar in the top navbar.
 * Displays user identity context (Role, Email) and provides quick links
 * to Profile, Settings, and the Logout action.
 * 
 * @param {Object} props
 * @param {Object} props.user - The currently authenticated user object from AuthContext.
 * @returns {JSX.Element} The interactive dropdown menu component.
 */
export default function UserMenu({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'ST';
    const role = user?.role || 'Student';

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    return (
        <div className="in-nav-dropdown-wrapper" ref={dropdownRef}>
            <button
                className="in-user-menu-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <div className="in-avatar">{initials}</div>
                <div className="in-user-info">
                    <span className="in-user-name">{user?.email?.split('@')[0]}</span>
                    <span className="in-user-role">{role}</span>
                </div>
            </button>

            {isOpen && (
                <div className="in-nav-dropdown in-user-dropdown">
                    <Link to={`/${role.toLowerCase()}/profile`} className="in-dropdown-item" onClick={() => setIsOpen(false)}>
                        Profile
                    </Link>
                    <Link to="/settings" className="in-dropdown-item" onClick={() => setIsOpen(false)}>
                        Settings
                    </Link>
                    <div className="in-dropdown-divider"></div>
                    <button className="in-dropdown-item in-logout-item" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
