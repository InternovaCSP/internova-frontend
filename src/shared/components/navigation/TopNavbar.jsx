import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NavLinks from './NavLinks';
import AuthButtons from './AuthButtons';
import NotificationBell from './NotificationBell';
import UserMenu from './UserMenu';
import MobileDrawer from './MobileDrawer';

export default function TopNavbar() {
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();

  const isLanding = pathname === '/';

  useEffect(() => {
    if (!isLanding) {
      setIsScrolled(false);
      return undefined;
    }
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLanding]);

  const transparent = isLanding && !isScrolled;

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        transparent
          ? 'bg-transparent'
          : 'border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/85'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-brand-blue focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to main content
      </a>

      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-heading text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
          <img src="/logo-mono.png" alt="InterNova" className="h-7 w-7 rounded-md object-contain dark:invert" />
          <span>InterNova</span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-white/90 px-2 py-1 shadow-xs backdrop-blur-sm lg:flex dark:border-slate-700 dark:bg-slate-800/90">
          <NavLinks />
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {!user ? (
            <AuthButtons />
          ) : (
            <div className="flex items-center gap-2.5">
              <NotificationBell />
              <Link
                to={`/${user.role?.toLowerCase() || 'student'}/dashboard`}
                className="rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-brand-blue dark:hover:bg-sky-600"
              >
                Dashboard
              </Link>
              <UserMenu user={user} />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileOpen}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Menu size={24} />
        </button>
      </nav>

      <MobileDrawer isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} user={user} />
    </header>
  );
}
