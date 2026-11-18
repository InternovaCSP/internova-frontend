import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Modal from '../../../shared/components/ui/Modal';
import { getErrorMessage } from '../../../shared/api/client';
import { seminarsApi } from '../api';

export default function SeminarCreateModal({ isOpen, onClose, onSuccess }) {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic || !description) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const created = await seminarsApi.create({ topic, description });
      setTopic('');
      setDescription('');
      onSuccess?.(created);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, 'An unexpected error occurred. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 dark:border-slate-600 dark:bg-slate-900';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Seminar Request" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-xs text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
            <AlertTriangle size={15} />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Topic Name</label>
          <input
            type="text"
            placeholder="e.g. System Design for AI Pipelines"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            maxLength={100}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Why should we organize this?
          </label>
          <textarea
            rows={4}
            placeholder="Describe the topics to be covered and why this peer-learning session is valuable."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !topic || !description}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-brand-violet py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Submit Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
