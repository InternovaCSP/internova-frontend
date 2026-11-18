import { Users, Clock, Star, MapPin, ChevronRight, CheckCircle2, Settings } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import Modal from '../../../shared/components/ui/Modal';
import StatusBadge from '../../../shared/components/ui/StatusBadge';

const USER_STATUS_LABEL = {
  Pending: 'Request Pending',
  Accepted: 'Accepted to Project',
  Rejected: 'Application Declined',
};

export default function ProjectDetailModal({ project, onClose, onRequestJoin }) {
  const { user } = useAuth();
  if (!project) return null;

  const isFull = project.availableSlots === 0;
  const isLeader = Boolean(user?.userId && project.leaderId && String(user.userId) === String(project.leaderId));
  const fillPercent =
    project.teamSize > 0
      ? Math.round(((project.teamSize - project.availableSlots) / project.teamSize) * 100)
      : 0;

  return (
    <Modal
      isOpen={Boolean(project)}
      onClose={onClose}
      title={project.title}
      footer={
        <div className="flex justify-end gap-3">
          {isLeader ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-brand-blue"
            >
              <Settings size={14} /> Manage Project
            </button>
          ) : (
            <>
              {user?.role === 'Student' && !project.currentUserStatus && !isFull && project.status === 'Active' && (
                <button
                  type="button"
                  onClick={() => {
                    onRequestJoin(project.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-teal px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Request to Join <ChevronRight size={14} />
                </button>
              )}
              {isFull && project.status === 'Active' && !project.currentUserStatus && (
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-400"
                >
                  Team Full
                </button>
              )}
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-brand-blue dark:bg-sky-950/60">
            {project.category}
          </span>
          {project.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              <Star size={11} fill="currentColor" /> Featured
            </span>
          )}
          <StatusBadge status={project.status} />
          <span className="ml-auto text-xs text-slate-500">Led by {project.leaderName}</span>
        </div>

        <div>
          <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">About this Project</h4>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{project.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-xs">
            <Users size={15} className="text-slate-400" />
            <div>
              <div className="text-slate-400">Team Size</div>
              <div className="font-semibold text-slate-900 dark:text-white">{project.teamSize} members</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Clock size={15} className="text-slate-400" />
            <div>
              <div className="text-slate-400">Duration</div>
              <div className="font-semibold text-slate-900 dark:text-white">{project.duration}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <MapPin size={15} className="text-slate-400" />
            <div>
              <div className="text-slate-400">Open Slots</div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {project.availableSlots} of {project.teamSize}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>Team Capacity</span>
            <span>{fillPercent}% filled</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div className="h-full rounded-full bg-brand-blue" style={{ width: `${fillPercent}%` }} />
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Required Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {project.skills.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {user?.role === 'Student' && project.currentUserStatus && (
          <div className="flex items-center gap-2">
            <StatusBadge
              status={project.currentUserStatus}
              label={
                <span className="inline-flex items-center gap-1">
                  {project.currentUserStatus === 'Accepted' && <CheckCircle2 size={14} />}
                  {USER_STATUS_LABEL[project.currentUserStatus] || project.currentUserStatus}
                </span>
              }
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
