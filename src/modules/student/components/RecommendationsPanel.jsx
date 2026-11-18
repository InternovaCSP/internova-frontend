import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RECOMMENDATIONS = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    company: 'Spotify',
    type: 'Internship',
    to: '/internships',
    accent: 'bg-brand-blue',
    typeText: 'text-brand-blue',
    skills: ['React', 'TypeScript', 'CSS'],
  },
  {
    id: 2,
    title: 'Cloud Architecture Research',
    company: 'University Lab',
    type: 'Project',
    to: '/projects',
    accent: 'bg-brand-teal',
    typeText: 'text-brand-teal',
    skills: ['Azure', 'System Design'],
  },
  {
    id: 3,
    title: 'Global Fintech Hackathon',
    company: 'Stripe',
    type: 'Competition',
    to: '/competitions',
    accent: 'bg-brand-gold',
    typeText: 'text-amber-600',
    skills: ['APIs', 'Node.js', 'Finance'],
  },
];

export default function RecommendationsPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
      <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">Recommended for You</h2>

      <div className="space-y-3">
        {RECOMMENDATIONS.map((rec) => (
          <div
            key={rec.id}
            className="relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-4 pl-5 dark:border-slate-700 dark:bg-slate-900/50"
          >
            <div className={`absolute inset-y-0 left-0 w-1 ${rec.accent}`} />
            <div className={`text-[11px] font-bold uppercase tracking-wider ${rec.typeText}`}>{rec.type}</div>
            <div className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">{rec.title}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{rec.company}</div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {rec.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
                >
                  {s}
                </span>
              ))}
            </div>
            <Link
              to={rec.to}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline"
            >
              View Details <ArrowRight size={13} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
