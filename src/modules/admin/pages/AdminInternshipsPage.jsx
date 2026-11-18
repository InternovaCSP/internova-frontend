import { useEffect, useState } from 'react';
import { Briefcase, CheckCircle, AlertCircle, Loader2, MapPin, Building2, ShieldCheck } from 'lucide-react';
import StatusBadge from '../../../shared/components/ui/StatusBadge';
import EmptyState from '../../../shared/components/ui/EmptyState';
import { useToast } from '../../../shared/hooks/useToast';
import Toast from '../../../shared/components/ui/Toast';
import { adminApi } from '../api';

export default function AdminInternshipsPage() {
  const { toast, showToast, clearToast } = useToast();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    adminApi
      .getPendingInternships()
      .then((list) => setInternships(list))
      .catch((err) => {
        console.error('Error loading pending internships:', err);
        setError('Failed to load pending internships.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (internshipId) => {
    try {
      setProcessingId(internshipId);
      await adminApi.approveInternship(internshipId);
      setInternships((prev) => prev.filter((i) => i.id !== internshipId));
      showToast('Internship approved.');
    } catch (err) {
      console.error(`Failed to approve internship ${internshipId}:`, err);
      showToast('Approval failed.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={clearToast} />

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pending Internships</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review and approve new internship postings from all companies.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20">
          <Loader2 size={36} className="animate-spin text-blue-600" />
          <p className="mt-3 text-sm text-slate-500">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : internships.length === 0 ? (
        <EmptyState
          icon={CheckCircle}
          title="All Caught Up!"
          description="There are no internships awaiting approval."
        />
      ) : (
        <div className="space-y-3">
          {internships.map((internship) => (
            <div
              key={internship.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-800"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-blue-600 dark:bg-slate-700">
                  <Briefcase size={22} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{internship.title}</h3>
                    <StatusBadge status="Pending" />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Building2 size={13} /> {internship.companyName || 'Unknown Company'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={13} /> {internship.location}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleApprove(internship.id)}
                disabled={processingId === internship.id}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
              >
                {processingId === internship.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={16} /> Approve
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
