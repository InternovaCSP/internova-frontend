import React from 'react';
import SeminarDashboard from '../components/seminars/SeminarDashboard';

/**
 * SeminarsPage Component
 * 
 * The dedicated directory page for viewing and requesting community seminars.
 * Wraps the SeminarDashboard component in the application's standard page shell.
 * 
 * @returns {JSX.Element} The seminars browsing interface.
 */
export default function SeminarsPage() {
    return (
        <div className="in-shell">
            <div className="in-container">
                {/* We use the custom dashboard component which already includes its header and grid */}
                <SeminarDashboard />
            </div>
        </div>
    );
}
