import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Moon,
  Sun,
  Monitor,
  Bell,
  Lock,
  Trash2,
  ShieldCheck,
  Mail,
  Save,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../../../shared/context/ThemeContext';
import { useAuth } from '../../../shared/context/AuthContext';
import { getErrorMessage } from '../../../shared/api/client';
import Modal from '../../../shared/components/ui/Modal';
import { accountApi } from '../api';

const TABS = [
  { id: 'appearance', label: 'Appearance', Icon: Sun },
  { id: 'notifications', label: 'Notifications', Icon: Bell },
  { id: 'security', label: 'Security', Icon: Lock },
  { id: 'account', label: 'Account', Icon: Trash2 },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('appearance');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [prefs, setPrefs] = useState({ emailNotifications: true, pushNotifications: true });
  const [pwd, setPwd] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    accountApi
      .getSettings()
      .then((data) =>
        setPrefs({
          emailNotifications: data.emailNotifications,
          pushNotifications: data.pushNotifications,
        })
      )
      .catch((err) => console.error('Failed to fetch settings', err));
  }, []);

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    setError(null);
    try {
      await accountApi.updateSettings({
        emailNotifications: prefs.emailNotifications,
        pushNotifications: prefs.pushNotifications,
        themePreference: theme,
      });
      flashSaved();
    } catch {
      setError('Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwd.new !== pwd.confirm) {
      setError('New passwords do not match.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await accountApi.changePassword({
        currentPassword: pwd.current,
        newPassword: pwd.new,
      });
      setPwd({ current: '', new: '', confirm: '' });
      flashSaved();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update password.'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await accountApi.deleteAccount();
      logout();
      navigate('/');
    } catch {
      setError('Failed to delete account. Please contact support.');
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-brand-violet focus:bg-white dark:border-slate-700 dark:bg-slate-900';

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="grid min-h-[480px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-[220px_1fr] dark:border-slate-800 dark:bg-slate-800">
        <aside className="border-b border-slate-200 bg-slate-50/70 p-5 md:border-r md:border-b-0 dark:border-slate-700 dark:bg-slate-900/40">
          <h2 className="mb-5 px-2 text-lg font-extrabold">Settings</h2>
          <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveTab(id);
                  setError(null);
                }}
                className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                  activeTab === id
                    ? 'bg-brand-violet text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="p-6 sm:p-8">
          {saved && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <CheckCircle2 size={15} /> Changes saved successfully.
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
              <AlertTriangle size={15} /> {error}
            </div>
          )}

          {activeTab === 'appearance' && (
            <section className="space-y-6">
              <div>
                <h3 className="text-lg font-bold">Appearance</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Personalize how InterNova looks on your device.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light', label: 'Light Mode', Icon: Sun },
                  { id: 'dark', label: 'Dark Mode', Icon: Moon },
                  { id: 'system', label: 'System Default', Icon: Monitor },
                ].map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTheme(id)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-xs font-semibold transition ${
                      theme === id
                        ? 'border-brand-violet bg-brand-violet/5 text-brand-violet'
                        : 'border-slate-200 hover:border-brand-violet/50 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-brand-violet dark:bg-slate-700">
                      <Icon size={18} />
                    </div>
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSavePreferences}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-violet px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-600 disabled:opacity-60"
              >
                <Save size={15} /> {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </section>
          )}

          {activeTab === 'notifications' && (
            <section className="space-y-6">
              <div>
                <h3 className="text-lg font-bold">Notifications</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Control when and where you want to be notified.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: 'emailNotifications',
                    title: 'Email Notifications',
                    desc: 'Receive updates via email.',
                    Icon: Mail,
                  },
                  {
                    key: 'pushNotifications',
                    title: 'Browser Notifications',
                    desc: 'Push alerts on your desktop.',
                    Icon: Bell,
                  },
                ].map(({ key, title, desc, Icon }) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-violet dark:bg-slate-800">
                        <Icon size={17} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">{title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefs[key]}
                      onChange={(e) => setPrefs((prev) => ({ ...prev, [key]: e.target.checked }))}
                      className="h-4 w-4 rounded accent-brand-violet"
                    />
                  </label>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSavePreferences}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-violet px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-600 disabled:opacity-60"
              >
                <Save size={15} /> {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </section>
          )}

          {activeTab === 'security' && (
            <section className="space-y-6">
              <div>
                <h3 className="text-lg font-bold">Security</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Manage your account password.</p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold">Current Password</label>
                  <input
                    type="password"
                    required
                    value={pwd.current}
                    onChange={(e) => setPwd((prev) => ({ ...prev, current: e.target.value }))}
                    placeholder="Enter current password"
                    className={inputClass}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold">New Password</label>
                    <input
                      type="password"
                      required
                      value={pwd.new}
                      onChange={(e) => setPwd((prev) => ({ ...prev, new: e.target.value }))}
                      placeholder="at least 8 chars"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={pwd.confirm}
                      onChange={(e) => setPwd((prev) => ({ ...prev, confirm: e.target.value }))}
                      placeholder="repeat password"
                      className={inputClass}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-violet px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-600 disabled:opacity-60"
                >
                  <ShieldCheck size={15} /> {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </section>
          )}

          {activeTab === 'account' && (
            <section className="space-y-6">
              <div>
                <h3 className="text-lg font-bold">Account Management</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Manage your data and status.</p>
              </div>

              <div className="flex flex-col justify-between gap-4 rounded-2xl border border-dashed border-rose-300 bg-rose-50/40 p-5 sm:flex-row sm:items-center dark:border-rose-800 dark:bg-rose-950/20">
                <div>
                  <h4 className="text-sm font-bold text-rose-600">Delete Account</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Irreversible action. Permanently removes all your data.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="rounded-xl border border-rose-500 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-950/50"
                >
                  Delete Account
                </button>
              </div>
            </section>
          )}
        </main>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Are you absolutely sure?"
        maxWidth="max-w-md"
        footer={
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={loading}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
            >
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This will permanently delete your account (<strong>{user?.email}</strong>).
        </p>
      </Modal>
    </div>
  );
}
