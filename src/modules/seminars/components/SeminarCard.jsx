import { useState } from 'react';
import { CheckCircle2, Users, Loader2 } from 'lucide-react';
import { seminarsApi } from '../api';
import { getErrorMessage } from '../../../shared/api/client';

export default function SeminarCard({ seminar, onVoteSuccess, onError }) {
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(seminar.hasVoted);
  const [voteCount, setVoteCount] = useState(seminar.voteCount);
  const [status, setStatus] = useState(seminar.status);

  const threshold = seminar.threshold || 2;
  const pct = Math.min((voteCount / threshold) * 100, 100);

  const handleVote = async () => {
    if (isVoting || hasVoted || status === 'Approved') return;
    setIsVoting(true);
    try {
      const result = await seminarsApi.vote(seminar.id);
      const nextCount = result.voteCount ?? voteCount + 1;
      const nextStatus = result.status || status;
      setHasVoted(true);
      setVoteCount(nextCount);
      setStatus(nextStatus);
      onVoteSuccess?.(seminar.id, nextCount, nextStatus);
    } catch (error) {
      onError?.(getErrorMessage(error, 'Failed to vote. Please try again.'));
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-800">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Requested by <strong className="text-slate-700 dark:text-slate-200">{seminar.studentName}</strong>
        </span>
        <span>{new Date(seminar.createdAt).toLocaleDateString()}</span>
      </div>

      <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{seminar.topic}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{seminar.description}</p>

      <div className="mt-5">
        {status === 'Approved' ? (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <CheckCircle2 size={16} />
            <span>Threshold Reached - Approved for Scheduling</span>
          </div>
        ) : (
          <div>
            <div className="mb-1.5 flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Community Support</span>
              <span>
                {voteCount} / {threshold} votes
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  pct >= 80 ? 'bg-emerald-500' : 'bg-brand-violet'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-1.5 text-right text-[11px] text-slate-400">
              {pct < 100 ? `${threshold - voteCount} more to approve` : 'Goal reached! 🎉'}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex justify-end border-t border-slate-100 pt-4 dark:border-slate-700">
        {status === 'Approved' ? (
          <span className="text-xs text-slate-400">Total Votes: {voteCount}</span>
        ) : hasVoted ? (
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <CheckCircle2 size={15} /> Voted
          </span>
        ) : (
          <button
            type="button"
            onClick={handleVote}
            disabled={isVoting}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-violet px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
          >
            {isVoting ? <Loader2 size={15} className="animate-spin" /> : <Users size={15} />}
            Support Request
          </button>
        )}
      </div>
    </div>
  );
}
