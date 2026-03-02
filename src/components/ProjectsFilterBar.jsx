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
        <div className="in-filters-bar">

            {/* Search Input */}
            <div className="in-search-wrap">
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
            <div className="in-filter-group">

                {/* Category Filter */}
                <select
                    className={`in-select ${categoryFilter ? 'active' : ''}`}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="Research">Research</option>
                    <option value="Startup">Startup</option>
                    <option value="Product Development">Product Development</option>
                    <option value="Innovation Lab">Innovation Lab</option>
                </select>

                {/* Status Filter */}
                <select
                    className={`in-select ${statusFilter ? 'active' : ''}`}
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
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="popular">Popular (Most Slots vs Size)</option>
                </select>

            </div>
        </div>
    );
}
