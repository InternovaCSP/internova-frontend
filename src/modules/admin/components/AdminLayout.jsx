import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const ROUTE_TITLES = {
  '/admin/dashboard': 'Administrative Overview',
  '/admin/companies': 'Company Approvals',
  '/admin/internships': 'Internship Approvals',
  '/admin/projects': 'Project Management',
  '/admin/settings': 'System Settings',
};

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isDashboard = pathname === '/admin/dashboard';
  const title = ROUTE_TITLES[pathname] || 'Admin Portal';

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <AdminSidebar />

      <main className="ml-64 flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            {!isDashboard && (
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                aria-label="Back to admin dashboard"
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">{title}</h2>
          </div>

          <button
            type="button"
            onClick={() => navigate('/notifications')}
            aria-label="Notifications"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800"
          >
            <Bell size={18} />
          </button>
        </header>

        <div className="mx-auto w-full max-w-6xl flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
