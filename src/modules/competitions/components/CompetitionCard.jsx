import { Calendar, Users, Award, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../../../shared/components/ui/StatusBadge';

export default function CompetitionCard({ competition, userRole, onViewDetails, onRegister }) {
  const userStatus = competition.currentUserStatus;
  const isRegistered = Boolean(userStatus);

  const actionLabel =
    userStatus === 'Won'
      ? 'Winner'
      : userStatus === 'Submitted' || userStatus === 'Participated'
      ? 'Participated'
      : userStatus === 'Registered'
      ? 'Registered'
      : 'Register';

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-800">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{competition.title}</h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{competition.organizer}</p>
        </div>
        <StatusBadge status={competition.status} />
      </div>

      {userStatus === 'Won' && (
        <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
          <Award size={14} /> Winner Achieved
        </div>
      )}

      <div className="flex-1 space-y-4">
        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{competition.description}</p>

        <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={13} /> Deadline: {competition.deadline}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={13} /> {competition.eligibility}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-md border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-brand-blue dark:border-sky-800 dark:bg-sky-950/60">
            {competition.category}
          </span>
          {competition.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200"
            >
              {skill}
            </span>
          ))}
          {competition.skills.length > 3 && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700">
              +{competition.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-700">
        <button
          type="button"
          onClick={() => onViewDetails(competition)}
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          View Details
        </button>

        {userRole === 'Student' && (
          <button
            type="button"
            disabled={isRegistered}
            onClick={() => !isRegistered && onRegister(competition.id)}
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
              userStatus === 'Won'
                ? 'bg-amber-100 text-amber-700'
                : isRegistered
                ? 'cursor-default bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                : 'bg-brand-teal text-white hover:bg-emerald-700'
            }`}
          >
            {isRegistered && (userStatus === 'Won' ? <Award size={14} /> : <CheckCircle2 size={14} />)}
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
