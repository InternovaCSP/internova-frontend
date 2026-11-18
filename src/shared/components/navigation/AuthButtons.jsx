import { Link } from 'react-router-dom';

export default function AuthButtons({ isMobile = false, onNavigate }) {
  if (isMobile) {
    return (
      <div className="flex flex-col gap-2.5 pt-2">
        <Link
          to="/login"
          onClick={onNavigate}
          className="rounded-xl border border-brand-teal px-4 py-2.5 text-center text-sm font-semibold text-brand-teal transition hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
        >
          Login
        </Link>
        <Link
          to="/register"
          onClick={onNavigate}
          className="rounded-xl bg-brand-blue px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/login"
        className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-brand-teal hover:text-brand-teal dark:border-slate-600 dark:text-slate-200"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="rounded-full bg-brand-blue px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-sky-700"
      >
        Register
      </Link>
    </div>
  );
}
