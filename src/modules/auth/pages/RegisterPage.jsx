import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building2, GraduationCap, AlertCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../../../shared/layouts/AuthLayout';
import { authApi } from '../api';
import { getErrorMessage } from '../../../shared/api/client';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('Student');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    universityId: '',
    department: '',
    companyName: '',
    industry: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.register({
        FullName: formData.fullName,
        Email: formData.email,
        Password: formData.password,
        Role: role,
      });
      navigate('/login');
    } catch (error) {
      setErrorMsg(getErrorMessage(error, 'Registration failed. Please try again later.'));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 dark:border-slate-600 dark:bg-slate-900';

  return (
    <AuthLayout>
      <div className="animate-fade-up w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Join InterNova to access internships, projects, and verify your university status.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
            {[
              { id: 'Student', Icon: GraduationCap },
              { id: 'Company', Icon: Building2 },
            ].map(({ id, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setRole(id);
                  setErrorMsg('');
                }}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition ${
                  role === id
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                <Icon size={16} /> {id}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label htmlFor="fullName" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              University or Work Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@university.edu"
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Confirm
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {formData.password.length > 0 && (
            <div className="flex gap-1">
              <div className="h-1 flex-1 rounded bg-brand-teal" />
              <div className={`h-1 flex-1 rounded ${formData.password.length > 5 ? 'bg-brand-teal' : 'bg-slate-200 dark:bg-slate-700'}`} />
              <div className={`h-1 flex-1 rounded ${formData.password.length > 8 ? 'bg-brand-teal' : 'bg-slate-200 dark:bg-slate-700'}`} />
            </div>
          )}

          {role === 'Student' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="universityId" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Student ID
                </label>
                <input
                  type="text"
                  id="universityId"
                  name="universityId"
                  value={formData.universityId}
                  onChange={handleChange}
                  placeholder="Ex: 20210543"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="department" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Department
                </label>
                <select id="department" name="department" value={formData.department} onChange={handleChange} className={inputClass}>
                  <option value="">Select Dept...</option>
                  <option value="cs">Computer Science</option>
                  <option value="eng">Engineering</option>
                  <option value="bus">Business</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="companyName" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Microsoft Inc."
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="industry" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Industry
                </label>
                <select id="industry" name="industry" value={formData.industry} onChange={handleChange} className={inputClass}>
                  <option value="">Select Industry...</option>
                  <option value="tech">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="health">Healthcare</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
          </button>

          <p className="pt-2 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-teal hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
