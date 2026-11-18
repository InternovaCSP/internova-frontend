import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, ExternalLink, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) await markAsRead(notif.id);
    if (notif.targetUrl) navigate(notif.targetUrl);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`View notifications. You have ${unreadCount} unread.`}
        aria-expanded={isOpen}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h4>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline"
              >
                <CheckCircle size={13} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-700">
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notif) => (
                <button
                  key={notif.id}
                  type="button"
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex w-full items-start gap-2.5 px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                    notif.isRead ? '' : 'bg-sky-50/60 dark:bg-sky-950/30'
                  }`}
                >
                  {!notif.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-blue" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                        {notif.type}
                      </span>
                      <span>
                        {new Date(notif.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-700 dark:text-slate-200">{notif.content}</p>
                    {notif.targetUrl && (
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-blue">
                        View <ExternalLink size={11} />
                      </span>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center py-8 text-slate-400">
                <Inbox size={28} />
                <p className="mt-2 text-xs font-medium">All caught up!</p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50 p-2 text-center dark:border-slate-700 dark:bg-slate-900/50">
            <button
              type="button"
              onClick={() => {
                navigate('/notifications');
                setIsOpen(false);
              }}
              className="w-full rounded-lg py-1.5 text-xs font-semibold text-brand-blue transition hover:bg-sky-50 dark:hover:bg-slate-800"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
