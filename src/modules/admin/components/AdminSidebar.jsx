import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Settings,
  LogOut,
  Shield,
  Briefcase,
  FolderKanban,
} from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';

const MENU_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Company Approvals', icon: Building2, path: '/admin/companies' },
  { name: 'Internship Approvals', icon: Briefcase, path: '/admin/internships' },
  { name: 'Projects', icon: FolderKanban, path: '/admin/projects' },
  { name: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-800 bg-slate-900 text-slate-50">
      <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue text-white">
          <Shield size={22} />
        </div>
        <div>
          <h2 className="text-base font-bold tracking-tight">InterNova</h2>
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Admin Portal
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-5">
        {MENU_ITEMS.map(({ name, icon: Icon, path }) => {
          const active = pathname === path;
          return (
            <button
              key={path}
              type="button"
              onClick={() => navigate(path)}
              className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm transition ${
                active
                  ? 'bg-blue-600/15 font-semibold text-blue-400'
                  : 'font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`}
            >
              <Icon size={18} />
              <span>{name}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col gap-3 border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-sm font-semibold">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-100">{user?.email}</p>
            <p className="text-[11px] text-slate-400">Administrator</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg bg-rose-500/10 px-3.5 py-2 text-sm font-medium text-rose-400 transition hover:bg-rose-500/20"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
