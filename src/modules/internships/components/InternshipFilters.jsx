import { Search } from 'lucide-react';

export default function InternshipFilters({
  searchQuery,
  setSearchQuery,
  locationFilter,
  setLocationFilter,
  durationFilter,
  setDurationFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  durationOptions,
}) {
  const selectClass =
    'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-blue dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200';

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs lg:flex-row lg:items-center dark:border-slate-800 dark:bg-slate-800">
      <div className="relative flex-1">
        <Search size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-10 text-sm outline-none focus:border-brand-blue focus:bg-white dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      <div className="flex flex-wrap gap-2.5">
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className={selectClass}>
          <option value="">All Locations</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>

        <select value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)} className={selectClass}>
          <option value="">Any Duration</option>
          {durationOptions.filter(Boolean).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
          <option value="">Any Status</option>
          <option value="Active">Active</option>
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
