import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Calendar, Clock, User, Briefcase, Loader2 } from 'lucide-react';
import { useToast } from '../../../shared/hooks/useToast';
import Toast from '../../../shared/components/ui/Toast';
import StatusBadge from '../../../shared/components/ui/StatusBadge';
import EmptyState from '../../../shared/components/ui/EmptyState';
import { companyApi } from '../api';
import StudentProfileModal from '../components/StudentProfileModal';
import InterviewSchedulerModal from '../components/InterviewSchedulerModal';

const STATUS_OPTIONS = ['Applied', 'Shortlisted', 'InterviewScheduled', 'Interviewing', 'Selected', 'Rejected'];

export default function CompanyApplicationsPage() {
  const navigate = useNavigate();
  const { toast, showToast, clearToast } = useToast();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [processingId, setProcessingId] = useState(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [schedulingApp, setSchedulingApp] = useState(null);

  useEffect(() => {
    companyApi
      .getApplications()
      .then((data) => setApplications(data))
      .catch((err) => {
        console.error('Failed to load applications:', err);
        setError('Could not load applications.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleViewProfile = async (studentId, studentName) => {
    setProfileOpen(true);
    setProfileLoading(true);
    setSelectedStudent(null);
    try {
      const profile = await companyApi.getStudentProfile(studentId);
      setSelectedStudent({ ...profile, name: studentName });
    } catch (err) {
      console.error('Failed to load profile:', err);
      showToast('Could not load student profile.', 'error');
      setProfileOpen(false);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setProcessingId(applicationId);
      await companyApi.updateApplicationStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
      );
      showToast('Application status updated.');
    } catch (err) {
      console.error('Failed to update status:', err);
      showToast('Status update failed.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredApplications = useMemo(
    () =>
      applications.filter((app) => {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          (app.studentName?.toLowerCase() || '').includes(q) ||
          (app.internshipTitle?.toLowerCase() || '').includes(q);
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [applications, searchTerm, statusFilter]
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Toast toast={toast} onClose={clearToast} />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/company/dashboard')}
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Manage Applications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review and advance candidates through your talent pipeline.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-800">
        <div className="relative flex-1">
          <Search size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-10 text-sm outline-none focus:border-brand-blue focus:bg-white dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'InterviewScheduled' ? 'Interview Scheduled' : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20">
          <Loader2 size={36} className="animate-spin text-blue-600" />
          <p className="mt-3 text-sm text-slate-500">Fetching candidates...</p>
        </div>
      ) : error ? (
        <div className="py-16 text-center text-sm text-rose-500">{error}</div>
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          icon={User}
          title="No candidates found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:flex-row lg:items-center dark:border-slate-800 dark:bg-slate-800"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-blue-600 dark:bg-slate-700">
                  <User size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{app.studentName}</h3>
                  <div className="mt-1 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Briefcase size={13} /> {app.internshipTitle}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={13} /> Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={app.status} />

                {processingId === app.id ? (
                  <Loader2 size={20} className="animate-spin text-blue-600" />
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleViewProfile(app.studentId, app.studentName)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      <User size={14} /> View Profile
                    </button>

                    {app.status === 'Shortlisted' && (
                      <button
                        type="button"
                        onClick={() => setSchedulingApp(app)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        <Calendar size={14} /> Schedule Interview
                      </button>
                    )}

                    <select
                      value={app.status}
                      onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                      className="rounded-xl border border-blue-500 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 outline-none dark:bg-slate-900"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s === 'InterviewScheduled' ? 'Interview Scheduled' : s}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <StudentProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        student={selectedStudent}
        loading={profileLoading}
      />

      <InterviewSchedulerModal
        isOpen={Boolean(schedulingApp)}
        onClose={() => setSchedulingApp(null)}
        application={schedulingApp}
        onScheduled={(appId) => {
          setApplications((prev) =>
            prev.map((app) => (app.id === appId ? { ...app, status: 'InterviewScheduled' } : app))
          );
          showToast('Interview successfully scheduled!');
        }}
      />
    </div>
  );
}
