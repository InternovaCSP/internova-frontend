import { useRef, useState } from 'react';
import { GraduationCap, FileText, X, Loader2 } from 'lucide-react';

export default function AcademicProfileTab({
  academicProfile,
  isEditMode,
  resumeFile,
  onResumeChange,
  onChange,
  onAddSkill,
  onRemoveSkill,
}) {
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  if (!academicProfile) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={28} className="animate-spin text-brand-violet" />
      </div>
    );
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed) {
        onAddSkill(trimmed);
        setTagInput('');
      }
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 dark:border-slate-600 dark:bg-slate-900';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-800">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-violet/10 text-brand-violet">
          <GraduationCap size={20} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Academic Records</h3>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            University ID
          </label>
          {isEditMode ? (
            <input
              value={academicProfile.universityId}
              onChange={(e) => onChange('universityId', e.target.value)}
              placeholder="e.g. STU-12345"
              className={inputClass}
            />
          ) : (
            <div className="py-1 text-sm font-bold text-slate-800 dark:text-slate-100">
              {academicProfile.universityId || 'Not Set'}
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Department / Major
          </label>
          {isEditMode ? (
            <input
              value={academicProfile.department}
              onChange={(e) => onChange('department', e.target.value)}
              placeholder="e.g. Computer Science"
              className={inputClass}
            />
          ) : (
            <div className="py-1 text-sm font-bold text-slate-800 dark:text-slate-100">
              {academicProfile.department || 'Not Set'}
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Cumulative GPA
          </label>
          {isEditMode ? (
            <input
              type="number"
              step="0.01"
              value={academicProfile.gpa}
              onChange={(e) => onChange('gpa', e.target.value)}
              placeholder="0.00"
              className={inputClass}
            />
          ) : (
            <span className="inline-block rounded-lg bg-brand-violet px-3 py-1 text-sm font-bold text-white">
              {academicProfile.gpa ? `${academicProfile.gpa} / 4.00` : '—'}
            </span>
          )}
        </div>
      </div>

      <div className="mt-7">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Technical Skillset
        </label>
        {isEditMode ? (
          <div
            onClick={() => tagInputRef.current?.focus()}
            className="flex min-h-24 flex-wrap items-start gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-900/50"
          >
            {academicProfile.skills.map((skill, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-violet px-3 py-1 text-xs font-semibold text-white"
              >
                {skill}
                <button type="button" onClick={() => onRemoveSkill(i)} aria-label={`Remove ${skill}`}>
                  <X size={13} />
                </button>
              </span>
            ))}
            <input
              ref={tagInputRef}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Press Enter to add skill..."
              className="min-w-36 flex-1 bg-transparent py-1 text-sm outline-none"
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {academicProfile.skills.length > 0 ? (
              academicProfile.skills.map((s, i) => (
                <span
                  key={i}
                  className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-sm italic text-slate-400">No skills listed. Build your career by adding some!</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-7">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Curriculum Vitae / Resume
        </label>
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-7 text-center transition hover:border-brand-violet dark:border-slate-700 dark:bg-slate-900/40">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xs dark:bg-slate-800">
            <FileText
              size={28}
              className={resumeFile || academicProfile.resumeUrl ? 'text-brand-violet' : 'text-slate-400'}
            />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {resumeFile
                ? resumeFile.name
                : academicProfile.resumeUrl
                ? 'Verified Resume.pdf'
                : 'No Document Uploaded'}
            </div>
            <div className="mt-0.5 text-xs text-slate-500">
              {resumeFile
                ? 'Ready for synchronization'
                : academicProfile.resumeUrl
                ? 'Last updated recently'
                : 'Upload your PDF resume to qualify for internships.'}
            </div>
          </div>

          {isEditMode ? (
            <button
              type="button"
              onClick={() => resumeInputRef.current?.click()}
              className="rounded-xl bg-brand-violet px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-600"
            >
              {resumeFile ? 'Replace Selection' : 'Upload Resume (PDF)'}
            </button>
          ) : (
            academicProfile.resumeUrl && (
              <a
                href={academicProfile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-brand-violet hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
              >
                View Document
              </a>
            )
          )}
          <input
            ref={resumeInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => onResumeChange(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
