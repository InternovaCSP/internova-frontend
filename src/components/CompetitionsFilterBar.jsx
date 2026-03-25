import React from 'react';
import { Search } from 'lucide-react';

export default function CompetitionsFilterBar({
    searchQuery, setSearchQuery,
    categoryFilter, setCategoryFilter,
    statusFilter, setStatusFilter,
    sortBy, setSortBy,
    eligibilityFilter, setEligibilityFilter,
    eligibilityOptions
}) {
    return (
        <div className="in-filters-bar">
            {/* Search Input */}
            <div className="in-search-wrap">
                <Search className="in-search-icon" size={16} />
                <input
                    type="text"
                    className="in-input"
                    placeholder="Search by title, organizer, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="in-filter-group">
                {/* Category Dropdown */}
                <select
                    className={`in-select ${categoryFilter ? 'active' : ''}`}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="Coding">Coding</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="Research">Research</option>
                    <option value="Innovation">Innovation</option>
                    <option value="Business">Business</option>
                </select>

                {/* Eligibility Dropdown */}
                <select
                    className={`in-select ${eligibilityFilter ? 'active' : ''}`}
                    value={eligibilityFilter}
                    onChange={(e) => setEligibilityFilter(e.target.value)}
                >
                    <option value="">Any Eligibility</option>
                    {eligibilityOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>

                {/* Status Dropdown */}
                <select
                    className={`in-select ${statusFilter ? 'active' : ''}`}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Closed">Closed</option>
                </select>

                {/* Sort By Dropdown */}
                <select
                    className="in-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="newest">Sort: Newest</option>
                    <option value="deadline">Sort: Deadline</option>
                    <option value="popular">Sort: Popular</option>
                </select>
            </div>
        </div>
    );
}
