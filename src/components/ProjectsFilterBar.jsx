import React from 'react';
import { Search } from 'lucide-react';

export default function ProjectsFilterBar({
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy
}) {
    return (
        <div className="in-filters-bar" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'stretch' }}>

            {/* Top Row: Search & Dropdowns */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                
                {/* Search Input */}
                <div className="in-search-wrap" style={{ flex: '1 1 250px', margin: 0 }}>
                    <Search size={16} className="in-search-icon" />
                    <input
                        type="text"
                        className="in-input"
                        placeholder="Search projects or skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filters Base */}
                <div className="in-filter-group" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', margin: 0 }}>
                    {/* Status Filter */}
                    <select
                        className={`in-select ${statusFilter ? 'active' : ''}`}
                        style={{ minWidth: '150px', height: '42px' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                    </select>

                    {/* Sort By */}
                    <select
                        className="in-select"
                        style={{ minWidth: '150px', height: '42px' }}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="popular">Popular (Most Slots vs Size)</option>
                    </select>
                </div>

            </div>

            {/* Bottom Row: Checkboxes */}
            <div className="in-category-checkboxes" style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid var(--in-border)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--in-text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categories</span>
                {['Research', 'Startup', 'Product Development', 'Innovation Lab'].map((cat) => (
                    <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: 'var(--in-text-main)', fontWeight: categoryFilter.includes(cat) ? 600 : 400 }}>
                        <input
                            type="checkbox"
                            style={{ 
                                width: '16px', height: '16px', accentColor: 'var(--in-azure)', cursor: 'pointer' 
                            }}
                            checked={categoryFilter.includes(cat)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setCategoryFilter([...categoryFilter, cat]);
                                } else {
                                    setCategoryFilter(categoryFilter.filter(c => c !== cat));
                                }
                            }}
                        />
                        {cat}
                    </label>
                ))}
            </div>

        </div>
    );
}
