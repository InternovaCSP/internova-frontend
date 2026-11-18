import { useState, useEffect, useMemo } from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import { getErrorMessage } from '../../../shared/api/client';
import { useToast } from '../../../shared/hooks/useToast';
import Toast from '../../../shared/components/ui/Toast';
import Skeleton from '../../../shared/components/ui/Skeleton';
import EmptyState from '../../../shared/components/ui/EmptyState';
import { projectsApi } from '../api';
import ProjectFilters from '../components/ProjectFilters';
import ProjectCard from '../components/ProjectCard';
import ProjectDetailModal from '../components/ProjectDetailModal';
import ProjectFormModal from '../components/ProjectFormModal';

function normalizeProject(p, requestMap) {
  return {
    ...p,
    leaderName: p.creatorName || 'Unknown',
    leaderId: p.creatorId,
    skills: p.requiredSkills ? p.requiredSkills.split(',').map((s) => s.trim()) : [],
    availableSlots: p.availableSlots || 0,
    teamSize: p.teamSize || 0,
    duration: p.duration || 'Flexible',
    currentUserStatus: requestMap.get(p.id) || null,
  };
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const { toast, showToast, clearToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const [projectsData, requestsData] = await Promise.all([
          projectsApi.getAll(),
          user?.role === 'Student' ? projectsApi.getMyRequests() : Promise.resolve([]),
        ]);
        const requestMap = new Map(requestsData.map((r) => [r.projectId, r.status]));
        setProjects(projectsData.map((p) => normalizeProject(p, requestMap)));
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  const handleRequestJoin = async (id) => {
    if (!user || user.role !== 'Student') {
      showToast('Please log in as a student to join a project.', 'error');
      return;
    }

    try {
      await projectsApi.join(id);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, currentUserStatus: 'Pending' } : p))
      );
      showToast('Join request sent!');
    } catch (error) {
      showToast(getErrorMessage(error, 'Failed to send request.'), 'error');
    }
  };

  const filteredData = useMemo(() => {
    let result = [...projects];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (categoryFilter.length > 0) {
      result = result.filter((p) => categoryFilter.includes(p.category));
    }

    if (statusFilter) {
      result = result.filter((p) => p.status === statusFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.postedAt) - new Date(a.postedAt);
      if (sortBy === 'popular') {
        const aFill = a.teamSize ? (a.teamSize - a.availableSlots) / a.teamSize : 0;
        const bFill = b.teamSize ? (b.teamSize - b.availableSlots) / b.teamSize : 0;
        return bFill - aFill;
      }
      return 0;
    });

    return result;
  }, [projects, searchQuery, categoryFilter, statusFilter, sortBy]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Toast toast={toast} onClose={clearToast} />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">
            University Projects &amp; Startups
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Join research initiatives, innovation labs, and student startups to gain real-world experience.
          </p>
        </div>

        {(user?.role === 'Admin' || user?.role === 'Company') && (
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
          >
            <Plus size={16} /> Create Project
          </button>
        )}
      </div>

      <ProjectFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Showing {filteredData.length} opportunities
          </div>

          {filteredData.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title="No projects found."
              description="Adjust your filters or try a different search term."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredData.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onRequestJoin={handleRequestJoin}
                  onViewDetails={setSelectedProject}
                />
              ))}
            </div>
          )}
        </>
      )}

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onRequestJoin={handleRequestJoin}
      />

      <ProjectFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(created) => {
          setProjects((prev) => [normalizeProject(created, new Map()), ...prev]);
          setShowCreateModal(false);
          showToast('Project created!');
        }}
      />
    </div>
  );
}
