import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const unreadCount = 2; // Hardcoded for UI demo

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="in-nav-dropdown-wrapper" ref={dropdownRef}>
            <button
                className="in-nav-icon-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={`View notifications. You have ${unreadCount} unread.`}
                aria-expanded={isOpen}
            >
                <Bell size={20} />
                {unreadCount > 0 && <span className="in-nav-badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="in-nav-dropdown in-notif-dropdown">
                    <div className="in-dropdown-header">
                        <h4>Notifications</h4>
                    </div>
                    <div className="in-dropdown-body">
                        {/* Example Item */}
                        <div className="in-notif-item unread">
                            <span className="in-notif-dot"></span>
                            <div className="in-notif-content">
                                <p>Your internship application to Microsoft was shortlisted!</p>
                                <span className="in-notif-time">10m ago</span>
                            </div>
                        </div>
                        <div className="in-notif-item">
                            <div className="in-notif-content">
                                <p>Reminder: Hackathon 2026 starts tomorrow.</p>
                                <span className="in-notif-time">Yesterday</span>
                            </div>
                        </div>
                    </div>
                    <div className="in-dropdown-footer">
                        <button className="in-dropdown-link-btn">View all</button>
                    </div>
                </div>
            )}
        </div>
    );
}
