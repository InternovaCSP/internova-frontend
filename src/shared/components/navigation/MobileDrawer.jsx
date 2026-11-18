import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NavLinks from './NavLinks';
import AuthButtons from './AuthButtons';

export default function MobileDrawer({ isOpen, onClose, user }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} aria-hidden="true" />
      <div
        className="fixed inset-y-0 right-0 flex w-72 flex-col bg-white p-5 shadow-2xl dark:bg-slate-900"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <span className="font-heading text-lg font-extrabold text-slate-900 dark:text-white">InterNova</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-1">
          <NavLinks isMobile onNavigate={onClose} />
        </nav>

        <div className="my-4 border-t border-slate-100 dark:border-slate-800" />

        {user ? (
          <div className="flex flex-col gap-1">
            <Link
              to={`/${user.role?.toLowerCase() || 'student'}/dashboard`}
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Profile
            </Link>
            <Link
              to="/settings"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Settings
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
            >
              Logout
            </button>
          </div>
        ) : (
          <AuthButtons isMobile onNavigate={onClose} />
        )}
      </div>
    </div>
  );
}
