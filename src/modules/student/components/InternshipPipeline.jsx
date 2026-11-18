import { Fragment, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { studentApi } from '../api';
import Skeleton from '../../../shared/components/ui/Skeleton';

const STAGES = [
  { key: 'Applied', label: 'Applied', sub: 'Submitted', active: 'border-violet-200 bg-violet-50/70 text-violet-600 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300' },
  { key: 'Shortlisted', label: 'Shortlisted', sub: 'Reviewed', active: 'border-amber-200 bg-amber-50/70 text-amber-600 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300' },
  { key: 'Interviewing', label: 'Interviewing', sub: 'In Progress', active: 'border-blue-200 bg-blue-50/70 text-blue-600 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300' },
  { key: 'Selected', label: 'Selected', sub: 'Offer Made', active: 'border-emerald-200 bg-emerald-50/70 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' },
];

export default function InternshipPipeline() {
  const [stats, setStats] = useState({ Applied: 0, Shortlisted: 0, Interviewing: 0, Selected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi
      .getPipelineStats()
      .then((data) => setStats(data))
      .catch((err) => console.error('Pipeline fetch failed:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Application Pipeline</h2>
        <Link
          to="/internships"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-violet hover:underline"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:flex sm:items-center">
        {loading
          ? STAGES.map((s) => <Skeleton key={s.key} className="h-28 flex-1 rounded-xl" />)
          : STAGES.map((stage, i) => {
              const count = stats[stage.key] ?? 0;
              const isActive = count > 0;
              return (
                <Fragment key={stage.key}>
                  <div
                    className={`flex flex-1 flex-col items-center rounded-xl border p-4 text-center transition ${
                      isActive
                        ? stage.active
                        : 'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-900/40'
                    }`}
                  >
                    <div className="font-heading text-2xl font-extrabold">{count}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">
                      {stage.label}
                    </div>
                    <div className="text-[11px] text-slate-400">{stage.sub}</div>
                  </div>
                  {i < STAGES.length - 1 && (
                    <div
                      className={`hidden h-0.5 flex-1 rounded sm:block ${
                        (stats[STAGES[i + 1].key] ?? 0) > 0
                          ? 'bg-brand-violet/40'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                  )}
                </Fragment>
              );
            })}
      </div>
    </div>
  );
}
