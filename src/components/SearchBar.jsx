import React from 'react';
import { Search, X, Filter } from 'lucide-react';

/**
 * Global search & filter bar component for Phase 3 real-time data filtering.
 * Emits query changes upwards so the parent component can filter the rendered
 * tasks without mutating the original state arrays.
 */
export default function SearchBar({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  filteredCount,
  totalCount,
}) {
  return (
    <div className="search-filter-bar">
      {/* Search Input Box */}
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks by title in real-time..."
          className="search-input"
          aria-label="Search tasks"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="search-clear-btn"
            title="Clear search query"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Priority Pill Filters */}
      <div className="filter-pills-group">
        <span className="filter-label">
          <Filter size={14} />
          Priority:
        </span>
        {['All', 'High', 'Medium', 'Low'].map((p) => {
          const isActive = priorityFilter === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPriorityFilterChange(p)}
              className={`filter-pill ${isActive ? 'filter-pill-active' : ''} filter-pill-${p.toLowerCase()}`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Real-time Match Indicator */}
      <div className="search-match-count">
        <span>
          Showing <strong>{filteredCount}</strong> of {totalCount} tasks
        </span>
      </div>
    </div>
  );
}
