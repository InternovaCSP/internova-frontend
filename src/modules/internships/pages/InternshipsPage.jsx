import { useState, useEffect, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { getErrorMessage } from '../../../shared/api/client';
import { useToast } from '../../../shared/hooks/useToast';
import Toast from '../../../shared/components/ui/Toast';
import Skeleton from '../../../shared/components/ui/Skeleton';
import EmptyState from '../../../shared/components/ui/EmptyState';
import { internshipsApi } from '../api';
import InternshipFilters from '../components/InternshipFilters';
import InternshipCard from '../components/InternshipCard';
import InternshipDetailModal from '../components/InternshipDetailModal';

export default function InternshipsPage() {
  const { user } = useAuth();
  const { toast, showToast, clearToast } = useToast();

  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const [internshipsData, applicationsData] = await Promise.all([
          internshipsApi.getAll(),
          user?.role === 'Student' ? internshipsApi.getMyApplications() : Promise.resolve([]),
        ]);
        const appliedIds = new Set(applicationsData.map((a) => a.internshipId));
        setInternships(
          internshipsData.map((item) => ({
            ...item,
            currentUserStatus: appliedIds.has(item.id) ? 'Applied' : null,
          }))
        );
      } catch (error) {
        console.error('Failed to load internships:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  const handleApply = async (id) => {
    if (!user || user.role !== 'Student') {
      showToast('Please log in as a student to apply.', 'error');
      return;
    }

    try {
      await internshipsApi.apply(id);
      setInternships((prev) =>
        prev.map((item) => (item.id === id ? { ...item, currentUserStatus: 'Applied' } : item))
      );
      showToast('Application submitted successfully!');
    } catch (error) {
      showToast(getErrorMessage(error, 'Failed to submit application.'), 'error');
    }
  };

  const filteredData = useMemo(() => {
    let result = [...internships];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) => i.title.toLowerCase().includes(q) || i.company.toLowerCase().includes(q)
      );
    }

    if (locationFilter === 'Remote') {
      result = result.filter((i) => i.location.includes('Remote'));
    } else if (locationFilter === 'Hybrid') {
      result = result.filter((i) => i.location.includes('Hybrid'));
    } else if (locationFilter === 'On-site') {
      result = result.filter((i) => !i.location.includes('Remote') && !i.location.includes('Hybrid'));
    }

    if (durationFilter) result = result.filter((i) => i.duration === durationFilter);
    if (statusFilter) result = result.filter((i) => i.status === statusFilter);

    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.postedAt) - new Date(a.postedAt);
      if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
      return 0;
    });

    return result;
  }, [internships, searchQuery, locationFilter, durationFilter, statusFilter, sortBy]);

  const durationOptions = useMemo(() => [...new Set(internships.map((i) => i.duration))], [internships]);

  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setDurationFilter('');
    setStatusFilter('');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Toast toast={toast} onClose={clearToast} />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">
            Explore Verified Internship Opportunities
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Browse university-approved internship opportunities from trusted companies.
          </p>
        </div>

        {user?.role === 'Company' && (
          <Link
            to="/company/create-internship"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
          >
            <Plus size={16} /> Post Internship
          </Link>
        )}
      </div>

      <InternshipFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        durationFilter={durationFilter}
        setDurationFilter={setDurationFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        durationOptions={durationOptions}
      />

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Skeleton key={n} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : filteredData.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredData.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              userRole={user?.role}
              onApply={() => handleApply(internship.id)}
              onViewDetails={setSelectedInternship}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No internships found"
          description="Try adjusting your filters or search terms to find what you're looking for."
          action={
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Clear all filters
            </button>
          }
        />
      )}

      <InternshipDetailModal
        internship={selectedInternship}
        userRole={user?.role}
        onClose={() => setSelectedInternship(null)}
        onApply={handleApply}
      />
    </div>
  );
}
