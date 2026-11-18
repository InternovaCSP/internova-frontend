import { useState, useEffect, useCallback } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { useToast } from '../../../shared/hooks/useToast';
import Toast from '../../../shared/components/ui/Toast';
import Skeleton from '../../../shared/components/ui/Skeleton';
import EmptyState from '../../../shared/components/ui/EmptyState';
import { seminarsApi } from '../api';
import SeminarCard from '../components/SeminarCard';
import SeminarCreateModal from '../components/SeminarCreateModal';

export default function SeminarsPage() {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const { toast, showToast, clearToast } = useToast();

  const fetchSeminars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await seminarsApi.getAll();
      setSeminars(data);
    } catch (err) {
      console.error('Fetch seminars error:', err);
      setError('Unable to load seminar requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeminars();
  }, [fetchSeminars]);

  const handleCreateSuccess = (newSeminar) => {
    setSeminars((prev) => [newSeminar, ...prev]);
    fetchSeminars();
    showToast('Seminar request submitted!');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Toast toast={toast} onClose={clearToast} />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">
            Peer-Learning Seminars
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Voice your interest in new learning topics. Requests reaching {seminars[0]?.threshold || 2} votes will be
            reviewed.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-violet px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          <Plus size={18} /> Request Seminar
        </button>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-60 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-rose-50 p-8 text-center text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          <p>{error}</p>
          <button type="button" onClick={fetchSeminars} className="mt-3 font-semibold underline">
            Retry Loading
          </button>
        </div>
      ) : seminars.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No active seminar requests yet"
          description="Be the first to suggest a topic for the community!"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {seminars.map((seminar) => (
            <SeminarCard
              key={seminar.id}
              seminar={seminar}
              onError={(msg) => showToast(msg, 'error')}
              onVoteSuccess={(id, count, status) =>
                setSeminars((prev) =>
                  prev.map((item) =>
                    item.id === id ? { ...item, voteCount: count, hasVoted: true, status } : item
                  )
                )
              }
            />
          ))}
        </div>
      )}

      <SeminarCreateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
