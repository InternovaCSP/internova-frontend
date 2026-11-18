import { Search } from 'lucide-react';

const CATEGORIES = ['Research', 'Startup', 'Product Development', 'Innovation Lab'];

export default function ProjectFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
}) {
  const toggleCategory = (cat, checked) => {
    setCategoryFilter(
      checked ? [...categoryFilter, cat] : categoryFilter.filter((c) => c !== cat)
    );
  };

  const selectClass =
    'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-blue dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200';

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-10 text-sm outline-none focus:border-brand-blue focus:bg-white dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div className="flex flex-wrap gap-2.5">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
            <option value="newest">Newest First</option>
            <option value="popular">Popular (Most Filled)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 dark:border-slate-700">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Categories</span>
        {CATEGORIES.map((cat) => (
          <label
            key={cat}
            className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
          >
            <input
              type="checkbox"
              checked={categoryFilter.includes(cat)}
              onChange={(e) => toggleCategory(cat, e.target.checked)}
              className="h-4 w-4 rounded accent-brand-blue"
            />
            <span className={categoryFilter.includes(cat) ? 'font-semibold' : ''}>{cat}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
