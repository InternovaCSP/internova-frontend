import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * NavLinks Component
 * 
 * Reusable navigation links block used across desktop and mobile layouts.
 * Automatically applies active states based on the current Route.
 * 
 * @param {Object} props
 * @param {boolean} [props.isMobile] - If true, renders links styled for the mobile drawer.
 * @returns {JSX.Element} A fragment containing router NavLinks.
 */
export default function NavLinks({ isMobile }) {
    const navClass = isMobile ? "in-mobile-link" : "in-nav-link";

    return (
        <>
            <NavLink to="/" className={({ isActive }) => `${navClass} ${isActive ? 'active' : ''}`} end>
                Home
            </NavLink>
            <NavLink to="/internships" className={({ isActive }) => `${navClass} ${isActive ? 'active' : ''}`}>
                Internships
            </NavLink>
            <NavLink to="/projects" className={({ isActive }) => `${navClass} ${isActive ? 'active' : ''}`}>
                Projects
            </NavLink>
            <NavLink to="/competitions" className={({ isActive }) => `${navClass} ${isActive ? 'active' : ''}`}>
                Competitions
            </NavLink>
        </>
    );
}
