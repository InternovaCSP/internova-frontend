import { Search } from 'lucide-react';

export default function CompetitionFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  eligibilityFilter,
  setEligibilityFilter,
  eligibilityOptions,
}) {
  const selectClass =
    'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-blue dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200';

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs lg:flex-row lg:items-center dark:border-slate-800 dark:bg-slate-800">
      <div className="relative flex-1">
        <Search size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title, organizer, or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-10 text-sm outline-none focus:border-brand-blue focus:bg-white dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      <div className="flex flex-wrap gap-2.5">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={selectClass}>
          <option value="">All Categories</option>
          <option value="Coding">Coding</option>
          <option value="AI & Data Science">AI &amp; Data Science</option>
          <option value="Research">Research</option>
          <option value="Innovation">Innovation</option>
          <option value="Business">Business</option>
        </select>

        <select value={eligibilityFilter} onChange={(e) => setEligibilityFilter(e.target.value)} className={selectClass}>
          <option value="">Any Eligibility</option>
          {eligibilityOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
          <option value="">All Statuses</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Closed">Closed</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
          <option value="newest">Sort: Newest</option>
          <option value="deadline">Sort: Deadline</option>
          <option value="popular">Sort: Popular</option>
        </select>
      </div>
    </div>
  );
}
