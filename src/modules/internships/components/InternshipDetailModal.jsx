import Modal from '../../../shared/components/ui/Modal';

export default function InternshipDetailModal({ internship, userRole, onClose, onApply }) {
  if (!internship) return null;

  const isDisabled = Boolean(internship.currentUserStatus) || internship.status === 'Closed';

  return (
    <Modal
      isOpen={Boolean(internship)}
      onClose={onClose}
      title="Internship Overview"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Dismiss
          </button>
          {userRole === 'Student' && (
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => {
                onApply(internship.id);
                onClose();
              }}
              className={`rounded-xl px-5 py-2 text-sm font-semibold ${
                isDisabled
                  ? 'cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-700'
                  : 'bg-brand-teal text-white hover:bg-emerald-700'
              }`}
            >
              {internship.currentUserStatus ? 'Already Applied' : 'Apply for this Role'}
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-700">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{internship.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-bold text-brand-blue">@ {internship.company}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 dark:text-slate-400">{internship.location}</span>
          </div>
        </div>

        <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-3 dark:text-slate-300">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400">Duration</span>
            <p className="font-medium text-slate-900 dark:text-white">{internship.duration}</p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-slate-400">Posted On</span>
            <p className="font-medium text-slate-900 dark:text-white">
              {new Date(internship.postedAt).toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-slate-400">Status</span>
            <p className="font-medium text-slate-900 dark:text-white">{internship.status}</p>
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">About the Role</h4>
          <p className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
            {internship.description}
          </p>
        </div>

        {internship.companyDescription && (
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              About {internship.company}
            </h4>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {internship.companyDescription}
            </p>
          </div>
        )}

        {internship.requirements && (
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Key Requirements</h4>
            <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
              {internship.requirements.split('\n').map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-brand-blue">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}
