import React, { useEffect, useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { 
    Bell, 
    CheckCircle, 
    Filter, 
    Inbox, 
    Shield, 
    Users, 
    Info, 
    ChevronLeft, 
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationsPage() {
    const { 
        notifications, 
        totalCount, 
        unreadCount, 
        loading, 
        fetchNotifications, 
        markAsRead, 
        markAllAsRead 
    } = useNotifications();
    
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();
    const pageSize = 10;

    useEffect(() => {
        fetchNotifications(page, pageSize);
    }, [page, fetchNotifications]);

    const filteredNotifications = filter === 'All' 
        ? notifications 
        : notifications.filter(n => n.type === filter);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= Math.ceil(totalCount / pageSize)) {
            setPage(newPage);
            window.scrollTo(0, 0);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Security': return <Shield size={18} className="text-red-500" />;
            case 'Social': return <Users size={18} className="text-blue-500" />;
            case 'System': return <Info size={18} className="text-amber-500" />;
            default: return <Bell size={18} className="text-indigo-500" />;
        }
    };

    const handleNotificationClick = async (notif) => {
        if (!notif.isRead) {
            await markAsRead(notif.id);
        }
        if (notif.targetUrl) {
            navigate(notif.targetUrl);
        }
    };

    return (
        <div className="in-page-container">
            <div className="in-page-header">
                <div>
                    <h1 className="in-page-title">Notifications</h1>
                    <p className="in-page-subtitle">
                        You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button 
                        className="in-btn in-btn-outline"
                        onClick={markAllAsRead}
                    >
                        <CheckCircle size={18} />
                        <span>Mark all as read</span>
                    </button>
                )}
            </div>

            <div className="in-notifications-layout">
                {/* Filters Sidebar */}
                <aside className="in-notifications-sidebar">
                    <div className="in-sidebar-card">
                        <h3><Filter size={16} /> Filters</h3>
                        <nav className="in-sidebar-nav">
                            {['All', 'Security', 'Social', 'System', 'Application'].map(f => (
                                <button 
                                    key={f}
                                    className={`in-sidebar-link ${filter === f ? 'active' : ''}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main List */}
                <main className="in-notifications-main">
                    {loading ? (
                        <div className="in-loading-placeholder">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="in-skeleton-card mb-4" />
                            ))}
                        </div>
                    ) : filteredNotifications.length > 0 ? (
                        <div className="in-notifications-list">
                            {filteredNotifications.map((notif) => (
                                <div 
                                    key={notif.id}
                                    className={`in-notif-card ${notif.isRead ? '' : 'unread'}`}
                                    onClick={() => handleNotificationClick(notif)}
                                >
                                    <div className="in-notif-icon-wrapper">
                                        {getTypeIcon(notif.type)}
                                    </div>
                                    <div className="in-notif-body">
                                        <div className="in-notif-top">
                                            <span className="in-notif-badge">{notif.type}</span>
                                            <span className="in-notif-date">
                                                {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h3 className="in-notif-text">{notif.content}</h3>
                                        {notif.targetUrl && (
                                            <span className="in-notif-link">
                                                Go to details <ExternalLink size={14} />
                                            </span>
                                        )}
                                    </div>
                                    {!notif.isRead && <div className="in-unread-indicator" />}
                                </div>
                            ))}

                            {/* Pagination */}
                            {totalCount > pageSize && (
                                <div className="in-pagination">
                                    <button 
                                        className="in-pagination-btn"
                                        disabled={page === 1}
                                        onClick={() => handlePageChange(page - 1)}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <span className="in-page-info">
                                        Page {page} of {Math.ceil(totalCount / pageSize)}
                                    </span>
                                    <button 
                                        className="in-pagination-btn"
                                        disabled={page === Math.ceil(totalCount / pageSize)}
                                        onClick={() => handlePageChange(page + 1)}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="in-empty-state">
                            <div className="in-empty-icon">
                                <Inbox size={64} />
                            </div>
                            <h2>All caught up!</h2>
                            <p>You don't have any {filter !== 'All' ? filter.toLowerCase() : ''} notifications at the moment.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
