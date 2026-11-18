import { Users, Clock, CheckCircle2, ChevronRight, Star, Settings } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import StatusBadge from '../../../shared/components/ui/StatusBadge';

const USER_STATUS_LABEL = {
  Pending: 'Request Pending',
  Accepted: 'Accepted to Project',
  Rejected: 'Application Declined',
};

export default function ProjectCard({ project, onRequestJoin, onViewDetails }) {
  const { user } = useAuth();

  const isFull = project.availableSlots === 0;
  const isLeader = Boolean(user?.userId && project.leaderId && String(user.userId) === String(project.leaderId));

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-800">
      <div className="mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-brand-blue dark:bg-sky-950/60">
            {project.category}
          </span>
          {project.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
              <Star size={11} fill="currentColor" /> Featured
            </span>
          )}
        </div>
        <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">{project.title}</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">Led by {project.leaderName}</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.skills.slice(0, 4).map((skill, idx) => (
          <span
            key={idx}
            className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200"
          >
            {skill}
          </span>
        ))}
        {project.skills.length > 4 && (
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-700">
            +{project.skills.length - 4}
          </span>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1">
          <Users size={14} /> {project.availableSlots}/{project.teamSize} slots
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock size={14} /> {project.duration}
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span
            className={`h-2 w-2 rounded-full ${
              project.status === 'Completed' ? 'bg-sky-500' : 'bg-emerald-500'
            }`}
          />
          {project.status === 'Completed' ? 'Completed' : 'Active'}
        </span>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
        <div>
          {user?.role === 'Student' && project.currentUserStatus && (
            <StatusBadge
              status={project.currentUserStatus}
              label={
                <span className="inline-flex items-center gap-1">
                  {project.currentUserStatus === 'Accepted' && <CheckCircle2 size={12} />}
                  {USER_STATUS_LABEL[project.currentUserStatus] || project.currentUserStatus}
                </span>
              }
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(project)}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            View Details
          </button>

          {isLeader ? (
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-brand-blue"
            >
              <Settings size={13} /> Manage
            </button>
          ) : (
            <>
              {user?.role === 'Student' && !project.currentUserStatus && !isFull && project.status === 'Active' && (
                <button
                  type="button"
                  onClick={() => onRequestJoin(project.id)}
                  className="inline-flex items-center gap-1 rounded-xl bg-brand-teal px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                >
                  Request to Join <ChevronRight size={13} />
                </button>
              )}

              {isFull && project.status === 'Active' && !project.currentUserStatus && (
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-400 dark:bg-slate-700"
                >
                  Team Full
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
