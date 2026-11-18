import { useState, useEffect, useMemo } from 'react';
import { Trophy, Plus } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import Skeleton from '../../../shared/components/ui/Skeleton';
import EmptyState from '../../../shared/components/ui/EmptyState';
import { competitionsApi } from '../api';
import CompetitionFilters from '../components/CompetitionFilters';
import CompetitionCard from '../components/CompetitionCard';
import CompetitionDetailModal from '../components/CompetitionDetailModal';

export default function CompetitionsPage() {
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCompetition, setSelectedCompetition] = useState(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const list = await competitionsApi.getAll();
        setCompetitions(
          list.map((comp) => ({
            id: comp.id,
            title: comp.title,
            organizer: comp.organizerName || 'Unknown Organizer',
            description: comp.description || 'No description available.',
            category: comp.category || 'General',
            status: new Date(comp.endDate) < new Date() ? 'Completed' : 'Upcoming',
            eligibility: comp.eligibilityCriteria || 'Open to all students',
            startDate: comp.startDate ? new Date(comp.startDate).toLocaleDateString() : 'TBD',
            endDate: comp.endDate ? new Date(comp.endDate).toLocaleDateString() : 'TBD',
            deadline: comp.endDate ? new Date(comp.endDate).toLocaleDateString() : 'TBD',
            skills: comp.category ? [comp.category] : ['General'],
            currentUserStatus: null,
          }))
        );
      } catch (error) {
        console.error('Failed to fetch competitions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleRegister = (id) => {
    setCompetitions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, currentUserStatus: 'Registered' } : c))
    );
    if (selectedCompetition?.id === id) {
      setSelectedCompetition((prev) => ({ ...prev, currentUserStatus: 'Registered' }));
    }
  };

  const filteredData = useMemo(() => {
    let result = [...competitions];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.organizer.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (categoryFilter) result = result.filter((c) => c.category === categoryFilter);
    if (statusFilter) result = result.filter((c) => c.status === statusFilter);
    if (eligibilityFilter) result = result.filter((c) => c.eligibility === eligibilityFilter);

    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.startDate) - new Date(a.startDate);
      if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
      return 0;
    });

    return result;
  }, [competitions, searchQuery, categoryFilter, statusFilter, eligibilityFilter, sortBy]);

  const eligibilityOptions = useMemo(
    () => [...new Set(competitions.map((c) => c.eligibility))],
    [competitions]
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">
            Discover Academic &amp; Industry Competitions
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Explore coding challenges, research contests, innovation events, and hackathons approved by the university.
          </p>
        </div>
        {user?.role === 'Admin' && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
          >
            <Plus size={16} /> Post Competition
          </button>
        )}
      </div>

      <CompetitionFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        eligibilityFilter={eligibilityFilter}
        setEligibilityFilter={setEligibilityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        eligibilityOptions={eligibilityOptions}
      />

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Skeleton key={n} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Showing {filteredData.length} competitions
          </div>

          {filteredData.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="No competitions found."
              description="Adjust your filters or try a different search term."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredData.map((comp) => (
                <CompetitionCard
                  key={comp.id}
                  competition={comp}
                  userRole={user?.role}
                  onViewDetails={setSelectedCompetition}
                  onRegister={handleRegister}
                />
              ))}
            </div>
          )}
        </>
      )}

      <CompetitionDetailModal
        competition={selectedCompetition}
        userRole={user?.role}
        onClose={() => setSelectedCompetition(null)}
        onRegister={handleRegister}
      />
    </div>
  );
}
