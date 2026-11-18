import { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Loader2, AlertCircle } from 'lucide-react';
import { studentApi } from '../api';

export default function UpcomingInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    studentApi
      .getInterviews()
      .then((data) => setInterviews(data))
      .catch((err) => {
        console.error('Failed to fetch interviews:', err);
        setError('Could not load your interviews.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-800">
        <Loader2 size={24} className="animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-600 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
        <AlertCircle size={18} /> {error}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Interviews</h2>
        <span className="text-xs font-medium text-slate-500">{interviews.length} Scheduled</span>
      </div>

      {interviews.length === 0 ? (
        <div className="py-8 text-center">
          <Calendar size={36} className="mx-auto mb-2 text-slate-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">No interviews scheduled yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-900/50"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-brand-blue dark:bg-sky-950/60">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{interview.internshipTitle}</h4>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{interview.companyName}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} /> {new Date(interview.interviewDate).toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} />{' '}
                      {new Date(interview.interviewDate).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <a
                href={interview.locationOrLink?.startsWith('http') ? interview.locationOrLink : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                <Video size={14} /> Join Meeting
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
