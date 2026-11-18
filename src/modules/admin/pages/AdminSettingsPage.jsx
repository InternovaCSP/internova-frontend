import { useState } from 'react';
import { User, Bell, Globe, Shield, Save, CheckCircle, Smartphone } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';

const SECTIONS = [
  { id: 'profile', name: 'Profile Information', Icon: User },
  { id: 'security', name: 'Security & Access', Icon: Shield },
  { id: 'notifications', name: 'Notifications', Icon: Bell },
  { id: 'preferences', name: 'Platform Preferences', Icon: Globe },
];

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900';

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-slate-200 dark:border-slate-700">
        {SECTIONS.map(({ id, name, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveSection(id)}
            className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition ${
              activeSection === id
                ? 'border-blue-600 font-semibold text-blue-600'
                : 'border-transparent font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Icon size={16} /> {name}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
        {activeSection === 'profile' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Profile Details</h3>
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6 dark:border-slate-700">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-700">
                <User size={32} />
              </div>
              <div>
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                >
                  Change Avatar
                </button>
                <p className="mt-1 text-xs text-slate-400">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Full Name</label>
                <input type="text" defaultValue="Admin User" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  readOnly
                  className={`${inputClass} cursor-not-allowed bg-slate-100 text-slate-500 dark:bg-slate-900/50`}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Designation</label>
              <input type="text" defaultValue="Principal Administrator" className={inputClass} />
            </div>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold">Security Settings</h3>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/50">
              <h4 className="text-sm font-semibold">Change Password</h4>
              <p className="mt-1 text-xs text-slate-500">
                Ensure your account is using a long, random password to stay secure.
              </p>
              <div className="mt-4 max-w-sm space-y-3">
                <input type="password" placeholder="Current Password" className={inputClass} />
                <input type="password" placeholder="New Password" className={inputClass} />
                <button
                  type="button"
                  className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                >
                  Update Password
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Smartphone size={20} className="text-slate-400" />
                <div>
                  <p className="text-sm font-semibold">Two-factor Authentication</p>
                  <p className="text-xs text-slate-400">Add additional security to your account.</p>
                </div>
              </div>
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                Disabled
              </span>
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Notification Preferences</h3>
            {[
              { title: 'New Company Applications', desc: 'Receive email alerts when a new company registers.' },
              { title: 'System Updates', desc: 'Get notified about platform maintenance and updates.' },
              { title: 'Security Alerts', desc: 'Important notifications about account security.' },
            ].map((item) => (
              <label
                key={item.title}
                className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-none dark:border-slate-700"
              >
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-blue-600" />
              </label>
            ))}
          </div>
        )}

        {activeSection === 'preferences' && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold">Platform Preferences</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Default Language</label>
                <select className={inputClass}>
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Timezone</label>
                <select className={inputClass}>
                  <option>(GMT-05:00) Eastern Time</option>
                  <option>(GMT+00:00) UTC</option>
                  <option>(GMT+05:30) Mumbai, Kolkata</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 rounded-xl border border-sky-100 bg-sky-50 p-4 text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200">
              <Globe size={18} className="mt-0.5 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold">Regional Settings</p>
                <p className="mt-0.5 opacity-80">
                  These settings affect how dates, times, and currency are displayed across the admin portal.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
