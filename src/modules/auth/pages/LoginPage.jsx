import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, AlertCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../../../shared/layouts/AuthLayout';
import { useAuth } from '../../../shared/context/AuthContext';
import { getErrorMessage } from '../../../shared/api/client';

const ROLE_ROUTES = {
  Student: '/student/dashboard',
  Company: '/company/dashboard',
  Admin: '/admin/dashboard',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [pendingRedirect, setPendingRedirect] = useState(false);

  // Wait until AuthContext commits the decoded user before navigating past ProtectedRoute.
  useEffect(() => {
    if (pendingRedirect && user) {
      navigate(ROLE_ROUTES[user.role] ?? '/', { replace: true });
      setPendingRedirect(false);
    }
  }, [pendingRedirect, user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      await login(formData.email, formData.password);
      setPendingRedirect(true);
    } catch (error) {
      setErrorMsg(getErrorMessage(error, 'Invalid email or password.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="animate-fade-up w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
            Sign In <Lock size={20} className="text-brand-teal" />
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Access your portal to manage applications and opportunities.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@university.edu"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 dark:border-slate-600 dark:bg-slate-900"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-10 pl-3.5 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 dark:border-slate-600 dark:bg-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex cursor-pointer items-center gap-2 text-slate-600 dark:text-slate-400">
              <input type="checkbox" name="remember" className="h-4 w-4 rounded accent-brand-blue" />
              Keep me logged in
            </label>
            <a href="#" className="font-semibold text-brand-blue hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Login'}
          </button>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            OR
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-teal hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
