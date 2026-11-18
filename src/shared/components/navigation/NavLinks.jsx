import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/internships', label: 'Internships' },
  { to: '/projects', label: 'Projects' },
  { to: '/competitions', label: 'Competitions' },
  { to: '/breakout-rooms', label: 'Breakout Rooms' },
  { to: '/seminars', label: 'Seminars' },
];

export default function NavLinks({ isMobile = false, onNavigate }) {
  return (
    <>
      {NAV_ITEMS.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            isMobile
              ? `block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-sky-50 font-semibold text-brand-blue dark:bg-sky-950/60 dark:text-sky-400'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                }`
              : `rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`
          }
        >
          {label}
        </NavLink>
      ))}
    </>
  );
}
