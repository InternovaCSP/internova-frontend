import { useEffect, useState } from 'react';
import { Briefcase, Calendar, BookOpen, Trophy } from 'lucide-react';
import { studentApi } from '../api';

export default function KpiCardGrid() {
  const [stats, setStats] = useState({ Applications: '0', Interviews: '0' });

  useEffect(() => {
    studentApi
      .getKpiStats()
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to load KPI stats:', err));
  }, []);

  const cards = [
    {
      title: 'Applications Submitted',
      count: stats.Applications ?? '0',
      Icon: Briefcase,
      trend: '+0 this week',
      variant: 'azure',
    },
    {
      title: 'Interviews Scheduled',
      count: stats.Interviews ?? '0',
      Icon: Calendar,
      trend: '+0 this week',
      variant: 'azure',
    },
    {
      title: 'Projects Joined',
      count: '2',
      Icon: BookOpen,
      variant: 'teal',
    },
    {
      title: 'Competitions Registered',
      count: '2',
      Icon: Trophy,
      trend: '1 active',
      variant: 'teal',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ title, count, Icon, trend, variant }) => (
        <div
          key={title}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-800"
        >
          <div className="mb-4 flex items-center justify-between">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                variant === 'teal'
                  ? 'bg-emerald-50 text-brand-teal dark:bg-emerald-950/60'
                  : 'bg-sky-50 text-brand-blue dark:bg-sky-950/60'
              }`}
            >
              <Icon size={22} />
            </div>
            {trend && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {trend}
              </span>
            )}
          </div>
          <div className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white">{count}</div>
          <div className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{title}</div>
        </div>
      ))}
    </div>
  );
}
