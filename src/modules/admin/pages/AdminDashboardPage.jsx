import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, GraduationCap, TrendingUp, ChevronRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { adminApi } from '../api';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function StatCard({ title, value, loading, icon, trend, iconBg }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>{icon}</div>
        <TrendingUp size={16} className="text-emerald-500" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        {loading ? (
          <Skeleton className="mt-2 h-7 w-1/2 rounded" />
        ) : (
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value || 0}</h2>
        )}
      </div>
      <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{trend}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getStats()
      .then((data) => setStats(data))
      .catch((error) => console.error('Error fetching admin stats:', error))
      .finally(() => setLoading(false));
  }, []);

  const placementData = stats
    ? [
        { name: 'Placed', value: stats.placed },
        { name: 'Seeking', value: stats.seeking },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Placed Students"
          value={stats?.placed}
          loading={loading}
          icon={<GraduationCap size={22} className="text-indigo-500" />}
          trend="+4% from last month"
          iconBg="bg-indigo-50 dark:bg-indigo-950/60"
        />
        <StatCard
          title="Seeking Internship"
          value={stats?.seeking}
          loading={loading}
          icon={<Users size={22} className="text-amber-500" />}
          trend="-2% from last month"
          iconBg="bg-amber-50 dark:bg-amber-950/60"
        />
        <StatCard
          title="Total Industry Reach"
          value={stats?.industries?.length}
          loading={loading}
          icon={<Building2 size={22} className="text-emerald-500" />}
          trend="Global Coverage"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <h3 className="mb-6 text-base font-semibold text-slate-900 dark:text-white">Placement Status</h3>
          {loading ? (
            <Skeleton className="h-72 rounded-xl" />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={placementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {placementData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <h3 className="mb-6 text-base font-semibold text-slate-900 dark:text-white">Industry Distribution</h3>
          {loading ? (
            <Skeleton className="h-72 rounded-xl" />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.industries || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => navigate('/admin/companies')}
          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-xs transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-800"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60">
            <Building2 size={22} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Company Approvals</h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Review and verify business memberships
            </p>
          </div>
          <ChevronRight size={18} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
}
