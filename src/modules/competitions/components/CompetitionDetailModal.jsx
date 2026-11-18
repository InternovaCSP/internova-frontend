import { Calendar, Users } from 'lucide-react';
import Modal from '../../../shared/components/ui/Modal';

export default function CompetitionDetailModal({ competition, userRole, onClose, onRegister }) {
  if (!competition) return null;

  const isRegistered = Boolean(competition.currentUserStatus);

  return (
    <Modal
      isOpen={Boolean(competition)}
      onClose={onClose}
      title={competition.title}
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Close
          </button>
          {userRole === 'Student' && (
            <button
              type="button"
              disabled={isRegistered}
              onClick={() => onRegister(competition.id)}
              className={`rounded-xl px-5 py-2 text-sm font-semibold ${
                isRegistered
                  ? 'cursor-default bg-slate-200 text-slate-500 dark:bg-slate-700'
                  : 'bg-brand-blue text-white hover:bg-sky-700'
              }`}
            >
              {isRegistered ? 'Already Registered' : 'Register Now'}
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Organized by <strong className="text-slate-800 dark:text-slate-200">{competition.organizer}</strong>
        </p>

        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{competition.description}</p>

        <div className="grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2 dark:bg-slate-900/50">
          <div>
            <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">Eligibility</h4>
            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <Users size={15} className="text-slate-400" /> {competition.eligibility}
            </div>
          </div>
          <div>
            <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">Dates</h4>
            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <Calendar size={15} className="text-slate-400" /> {competition.startDate} - {competition.endDate}
            </div>
            <p className="mt-1 text-xs text-slate-500">Deadline: {competition.deadline}</p>
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            Required Domains / Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {competition.skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
