import { useState } from 'react';
import { Calendar, Clock, Video, Loader2 } from 'lucide-react';
import Modal from '../../../shared/components/ui/Modal';
import { getErrorMessage } from '../../../shared/api/client';
import { companyApi } from '../api';

export default function InterviewSchedulerModal({ isOpen, onClose, application, onScheduled }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!application) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const interviewDate = new Date(`${date}T${time}`);
      await companyApi.scheduleInterview({
        applicationId: application.id,
        interviewDate: interviewDate.toISOString(),
        locationOrLink: location,
      });

      setDate('');
      setTime('');
      setLocation('');
      onScheduled?.(application.id);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not schedule interview.'));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 dark:border-slate-600 dark:bg-slate-900';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Interview" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Candidate</div>
          <div className="mt-0.5 text-base font-bold text-slate-900 dark:text-white">{application.studentName}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{application.internshipTitle}</div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Calendar size={14} /> Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Clock size={14} /> Time
            </label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Video size={14} /> Meeting Link or Location
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Zoom/Teams Link or Office Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Calendar size={16} />}
            Confirm Schedule
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
