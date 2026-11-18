import { Building2, MapPin, Calendar, Clock } from 'lucide-react';
import StatusBadge from '../../../shared/components/ui/StatusBadge';

const PROGRESS_WIDTH = {
  Applied: 'w-1/4',
  Shortlisted: 'w-1/2',
  Interviewing: 'w-3/4',
};

export default function InternshipCard({ internship, userRole, onApply, onViewDetails }) {
  const { title, company, status, description, location, duration, deadline, currentUserStatus } = internship;
  const hasApplied = Boolean(currentUserStatus);
  const isStudent = userRole === 'Student';

  const badgeStatus = status === 'Closed' ? 'Closed' : currentUserStatus === 'Selected' ? 'Selected' : 'Active';

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Building2 size={13} />
            <span>{company}</span>
          </div>
        </div>
        <StatusBadge status={badgeStatus} />
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>

      {hasApplied && currentUserStatus !== 'Selected' && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs font-semibold">
            <span className="text-brand-blue">Application Status</span>
            <span className="text-slate-600 dark:text-slate-300">{currentUserStatus}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div className={`h-full rounded-full bg-brand-blue ${PROGRESS_WIDTH[currentUserStatus] || 'w-0'}`} />
          </div>
        </div>
      )}

      <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <MapPin size={13} /> <span>{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={13} /> <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={13} /> <span>Deadline: {new Date(deadline).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mt-auto flex gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-700">
        <button
          type="button"
          onClick={() => onViewDetails(internship)}
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          View Details
        </button>

        {isStudent && (
          <button
            type="button"
            disabled={hasApplied || status === 'Closed'}
            onClick={onApply}
            className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition ${
              hasApplied || status === 'Closed'
                ? 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                : 'bg-brand-teal text-white hover:bg-emerald-700'
            }`}
          >
            {hasApplied ? 'Applied' : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  );
}
