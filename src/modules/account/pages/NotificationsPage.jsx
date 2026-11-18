import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ExternalLink,
} from 'lucide-react';
import { useNotifications } from '../../../shared/context/NotificationContext';
import Skeleton from '../../../shared/components/ui/Skeleton';
import EmptyState from '../../../shared/components/ui/EmptyState';

const FILTERS = ['All', 'Security', 'Social', 'System', 'Application'];

function TypeIcon({ type }) {
  switch (type) {
    case 'Security':
      return <Shield size={18} className="text-rose-500" />;
    case 'Social':
      return <Users size={18} className="text-blue-500" />;
    case 'System':
      return <Info size={18} className="text-amber-500" />;
    default:
      return <Bell size={18} className="text-indigo-500" />;
  }
}

export default function NotificationsPage() {
  const { notifications, totalCount, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead } =
    useNotifications();

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    fetchNotifications(page, pageSize);
  }, [page, fetchNotifications]);

  const filtered = filter === 'All' ? notifications : notifications.filter((n) => n.type === filter);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const handleClick = async (notif) => {
    if (!notif.isRead) await markAsRead(notif.id);
    if (notif.targetUrl) navigate(notif.targetUrl);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <CheckCircle size={16} /> Mark all as read
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
          <h3 className="mb-3 flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Filter size={14} /> Filters
          </h3>
          <nav className="flex flex-wrap gap-1 lg:flex-col">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                  filter === f
                    ? 'bg-sky-50 font-semibold text-brand-blue dark:bg-sky-950/60 dark:text-sky-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </nav>
        </aside>

        <main className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <>
              <div className="space-y-3">
                {filtered.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleClick(notif)}
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition hover:shadow-sm ${
                      notif.isRead
                        ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800'
                        : 'border-sky-200 bg-sky-50/50 dark:border-sky-800 dark:bg-sky-950/30'
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700">
                      <TypeIcon type={notif.type} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                          {notif.type}
                        </span>
                        <span>
                          {new Date(notif.createdAt).toLocaleDateString()} at{' '}
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h3 className="mt-1.5 text-sm font-medium text-slate-900 dark:text-white">{notif.content}</h3>
                      {notif.targetUrl && (
                        <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue">
                          Go to details <ExternalLink size={12} />
                        </span>
                      )}
                    </div>
                    {!notif.isRead && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-blue" />}
                  </div>
                ))}
              </div>

              {totalCount > pageSize && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-xs font-medium text-slate-500">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={Inbox}
              title="All caught up!"
              description={`You don't have any ${filter !== 'All' ? filter.toLowerCase() : ''} notifications at the moment.`}
            />
          )}
        </main>
      </div>
    </div>
  );
}
