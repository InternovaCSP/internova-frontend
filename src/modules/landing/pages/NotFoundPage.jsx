import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[75vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-800">
        <div className="font-heading text-5xl font-extrabold text-brand-blue">404</div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Page not found</p>
        <button
          type="button"
          onClick={() => navigate('/login', { replace: true })}
          className="mt-6 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
