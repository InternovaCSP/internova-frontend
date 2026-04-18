import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, ExternalLink, Inbox } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

/**
 * NotificationBell Component
 * 
 * A clickable bell icon that opens a dropdown containing user-specific alerts.
 * Uses NotificationContext for real-time updates and unread count.
 */
export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead 
    } = useNotifications();

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

    const handleNotificationClick = async (notif) => {
        if (!notif.isRead) {
            await markAsRead(notif.id);
        }
        if (notif.targetUrl) {
            navigate(notif.targetUrl);
        }
        setIsOpen(false);
    };

    const handleViewAll = () => {
        navigate('/notifications');
        setIsOpen(false);
    };

    return (
        <div className="in-nav-dropdown-wrapper" ref={dropdownRef}>
            <button
                className={`in-nav-icon-btn ${isOpen ? 'active' : ''}`}
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
                        {unreadCount > 0 && (
                            <button 
                                className="in-header-action-btn"
                                onClick={markAllAsRead}
                                title="Mark all as read"
                            >
                                <CheckCircle size={14} />
                                <span>Mark all as read</span>
                            </button>
                        )}
                    </div>
                    <div className="in-dropdown-body">
                        {notifications.length > 0 ? (
                            notifications.slice(0, 5).map((notif) => (
                                <div 
                                    key={notif.id} 
                                    className={`in-notif-item ${notif.isRead ? '' : 'unread'}`}
                                    onClick={() => handleNotificationClick(notif)}
                                >
                                    {!notif.isRead && <span className="in-notif-dot"></span>}
                                    <div className="in-notif-content">
                                        <div className="in-notif-header">
                                            <span className="in-notif-type">{notif.type}</span>
                                            <span className="in-notif-time">
                                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p>{notif.content}</p>
                                        {notif.targetUrl && (
                                            <span className="in-notif-action">
                                                View <ExternalLink size={12} />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="in-notif-empty">
                                <Inbox size={32} />
                                <p>All caught up!</p>
                            </div>
                        )}
                    </div>
                    <div className="in-dropdown-footer">
                        <button className="in-dropdown-link-btn" onClick={handleViewAll}>
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
