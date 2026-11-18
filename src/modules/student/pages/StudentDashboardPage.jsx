import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import ActiveRoomsWidget from '../components/ActiveRoomsWidget';
import InternshipPipeline from '../components/InternshipPipeline';
import UpcomingInterviews from '../components/UpcomingInterviews';
import KpiCardGrid from '../components/KpiCardGrid';
import ActivityTimeline from '../components/ActivityTimeline';
import RecommendationsPanel from '../components/RecommendationsPanel';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const firstName = user?.email?.split('@')[0] || 'Student';

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track internships, projects, competitions, and documents in one place.
          </p>
        </div>

        <div className="w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500 dark:text-slate-400">Profile Completion</span>
            <span className="text-brand-blue">80% Complete</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div className="h-full w-4/5 rounded-full bg-brand-blue" />
          </div>
          <Link
            to="/profile"
            className="mt-3 block w-full rounded-xl bg-slate-900 py-2 text-center text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-brand-blue dark:hover:bg-sky-600"
          >
            Complete Profile
          </Link>
        </div>
      </div>

      <ActiveRoomsWidget />
      <InternshipPipeline />
      <UpcomingInterviews />
      <KpiCardGrid />

      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityTimeline />
        <RecommendationsPanel />
      </div>

      <p className="pt-2 text-center text-xs text-slate-400">
        Your data is securely encrypted and role-protected via <span className="font-semibold">Azure</span>.
      </p>
    </div>
  );
}
