import { useEffect, useState, useMemo } from 'react';
import { FolderKanban, Plus, Search, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import StatusBadge from '../../../shared/components/ui/StatusBadge';
import EmptyState from '../../../shared/components/ui/EmptyState';
import { useToast } from '../../../shared/hooks/useToast';
import Toast from '../../../shared/components/ui/Toast';
import { getErrorMessage } from '../../../shared/api/client';
import { projectsApi } from '../../projects/api';
import ProjectFormModal from '../../projects/components/ProjectFormModal';

export default function AdminProjectsPage() {
  const { toast, showToast, clearToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    projectsApi
      .getAll()
      .then((list) => setProjects(list))
      .catch((err) => {
        console.error('Error loading projects:', err);
        setError('Failed to load projects.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.creatorName?.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  const handleDelete = async (projectId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    try {
      await projectsApi.remove(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      showToast('Project deleted.');
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to delete project.'), 'error');
    }
  };

  const stats = [
    { label: 'Total Projects', value: projects.length, color: 'text-blue-600' },
    { label: 'Active', value: projects.filter((p) => p.status === 'Open' || p.status === 'Active').length, color: 'text-emerald-600' },
    { label: 'Completed', value: projects.filter((p) => p.status === 'Completed').length, color: 'text-sky-600' },
    { label: 'Closed', value: projects.filter((p) => p.status === 'Closed').length, color: 'text-rose-600' },
  ];

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={clearToast} />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Projects</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage university projects, research initiatives, and startups.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={16} /> Create Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800"
          >
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20">
          <Loader2 size={36} className="animate-spin text-blue-600" />
          <p className="mt-3 text-sm text-slate-500">Loading projects...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertCircle size={20} /> <span>{error}</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={searchQuery ? 'No Matching Projects' : 'No Projects Yet'}
          description={searchQuery ? 'Try a different search term.' : 'Create your first project to get started.'}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-700 dark:bg-slate-900/50">
            <span>Project</span>
            <span>Category</span>
            <span>Creator</span>
            <span>Status</span>
            <span className="text-center">Actions</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] items-center gap-3 px-6 py-4 transition hover:bg-slate-50/70 dark:hover:bg-slate-700/30"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60">
                    <FolderKanban size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white">{project.title}</h4>
                    <p className="truncate text-xs text-slate-400">{project.description || 'No description'}</p>
                  </div>
                </div>

                <div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    {project.category || 'General'}
                  </span>
                </div>

                <span className="truncate text-sm text-slate-600 dark:text-slate-300">
                  {project.creatorName || 'Unknown'}
                </span>

                <div>
                  <StatusBadge status={project.status} />
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    title="Delete"
                    onClick={() => handleDelete(project.id, project.title)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition hover:bg-rose-100 dark:bg-rose-950/50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ProjectFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(newProject) => {
          setProjects((prev) => [newProject, ...prev]);
          setShowCreateModal(false);
          showToast('Project created!');
        }}
      />
    </div>
  );
}
