import { User, Mail, MapPin, Briefcase } from 'lucide-react';

export default function PersonalProfileTab({ personalInfo, isEditMode, errors, onChange }) {
  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 dark:border-slate-600 dark:bg-slate-900';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-800">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-violet/10 text-brand-violet">
          <User size={20} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Public Identity</h3>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Full Name
          </label>
          {isEditMode ? (
            <>
              <input
                name="fullName"
                value={personalInfo.fullName}
                onChange={onChange}
                className={inputClass}
              />
              {errors.fullName && <p className="mt-1 text-xs text-rose-500">{errors.fullName}</p>}
            </>
          ) : (
            <div className="py-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
              {personalInfo.fullName}
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Email Address
          </label>
          <div className="flex items-center gap-2 py-1 text-sm text-slate-500 dark:text-slate-400">
            <Mail size={15} /> {personalInfo.email}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Location
          </label>
          {isEditMode ? (
            <div className="relative">
              <MapPin size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
              <input
                name="location"
                value={personalInfo.location}
                onChange={onChange}
                placeholder="City, Country"
                className={`${inputClass} pl-9`}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 py-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <MapPin size={15} className="text-brand-violet" />
              {personalInfo.location || 'Not Specified'}
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Work Preferences
          </label>
          <div className="flex items-center gap-2 py-1 text-sm text-slate-500 dark:text-slate-400">
            <Briefcase size={15} /> Ready for Opportunities
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Professional Bio
        </label>
        {isEditMode ? (
          <textarea
            name="bio"
            rows={4}
            value={personalInfo.bio}
            onChange={onChange}
            placeholder="Write a brief introduction about yourself..."
            className={inputClass}
          />
        ) : (
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {personalInfo.bio || 'Tell the world who you are. Add a bio to help employers find you!'}
          </p>
        )}
      </div>
    </div>
  );
}
