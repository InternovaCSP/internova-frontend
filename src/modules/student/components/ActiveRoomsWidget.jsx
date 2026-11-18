import { useState, useEffect, useCallback } from 'react';
import { Video, Plus, Loader2, AlertCircle, Users, Clock, ExternalLink } from 'lucide-react';
import { studentApi } from '../api';
import { useToast } from '../../../shared/hooks/useToast';
import Toast from '../../../shared/components/ui/Toast';

export default function ActiveRoomsWidget() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const { toast, showToast, clearToast } = useToast();

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.getActiveRooms();
      setRooms(data);
    } catch (err) {
      console.error('Failed to fetch breakout rooms:', err);
      setError('Could not load active rooms.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleCreateRoom = async () => {
    try {
      setCreating(true);
      await studentApi.createRoom({
        title: `Collaboration Session - ${new Date().toLocaleDateString()}`,
        description: 'Open discussion for project collaboration.',
        scheduledAt: new Date().toISOString(),
        awardSkills: 'Collaboration, Communication',
      });
      await fetchRooms();
      showToast('Breakout room created!');
    } catch (err) {
      console.error('Failed to create room:', err);
      showToast('Failed to create breakout room.', 'error');
    } finally {
      setCreating(false);
    }
  };

  if (loading && rooms.length === 0) {
    return (
      <div className="flex min-h-36 items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-800">
        <Loader2 size={24} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 border-l-4 border-l-emerald-500 bg-white p-6 shadow-xs dark:border-slate-800 dark:border-l-emerald-500 dark:bg-slate-800">
      <Toast toast={toast} onClose={clearToast} />

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-heading text-base font-bold text-slate-900 dark:text-white">
          <Video size={20} className="text-emerald-500" />
          <span>Active Breakout Rooms</span>
        </div>

        <button
          type="button"
          onClick={handleCreateRoom}
          disabled={creating}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
        >
          {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Create Room
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-950/50 dark:text-rose-300">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {rooms.length === 0 ? (
        <div className="py-8 text-center">
          <Users size={32} className="mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No active breakout rooms.</p>
          <p className="text-xs text-slate-400">Be the first to start a session!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="flex flex-col justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30"
            >
              <div>
                <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">{room.title}</h4>
                <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  Host: {room.organizerName || 'Student'}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <Clock size={12} />
                  <span>
                    Live since {new Date(room.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <a
                href={room.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
              >
                Join Room <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
