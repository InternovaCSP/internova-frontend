import React from 'react';

const FiltersBar = ({
    searchQuery, setSearchQuery,
    locationFilter, setLocationFilter,
    durationFilter, setDurationFilter,
    statusFilter, setStatusFilter,
    sortBy, setSortBy,
    durationOptions
}) => {
    return (
        <div className="in-filters-bar">

            <div className="in-search-wrap">
                <svg className="in-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    className="in-input"
                    placeholder="Search by title or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="in-filter-group">
                <select
                    className="in-select"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                >
                    <option value="">All Locations</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                </select>

                <select
                    className="in-select"
                    value={durationFilter}
                    onChange={(e) => setDurationFilter(e.target.value)}
                >
                    <option value="">Any Duration</option>
                    {durationOptions.filter(Boolean).map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>

                <select
                    className="in-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Any Status</option>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                </select>

                <select
                    className="in-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: '180px' }}
                >
                    <option value="newest">Sort: Newest</option>
                    <option value="deadline">Sort: Deadline</option>
                    <option value="popular">Sort: Popular</option>
                </select>
            </div>

        </div>
    );
};

export default FiltersBar;
