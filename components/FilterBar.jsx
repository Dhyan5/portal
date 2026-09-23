'use client';

import { Search, Filter, RefreshCw, X } from 'lucide-react';

export default function FilterBar({ filters, onFilterChange, onReset, count = 0 }) {
  const branches = ['All', 'CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'MBA', 'MCA'];
  const statuses = ['All', 'Open', 'Closed'];

  const hasActiveFilters =
    filters.branch !== 'All' ||
    filters.status !== 'All' ||
    filters.search.trim() !== '';

  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-4 sm:p-5 shadow-sm mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search company, role, or package..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="input-field !pl-10"
            id="filter-search-input"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Branch Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider hidden sm:inline">
              Branch:
            </span>
            <select
              value={filters.branch}
              onChange={(e) => onFilterChange('branch', e.target.value)}
              className="input-field !py-2 !px-3 text-xs min-w-[110px]"
              id="filter-branch-select"
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b === 'All' ? 'All Branches' : b}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider hidden sm:inline">
              Status:
            </span>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="input-field !py-2 !px-3 text-xs min-w-[110px]"
              id="filter-status-select"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Status' : s}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="btn-secondary !py-2 !px-3 text-xs !text-red-600 hover:!bg-red-50 !border-red-200"
              title="Reset Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Stats Badge */}
      <div className="mt-3 pt-3 border-t border-surface-100 flex items-center justify-between text-xs text-surface-500">
        <span>
          Showing <strong className="text-surface-900 font-semibold">{count}</strong> placement drive{count !== 1 ? 's' : ''}
        </span>

        {hasActiveFilters && (
          <span className="flex items-center gap-1 text-primary-600 font-medium">
            <Filter className="w-3 h-3" /> Filters active
          </span>
        )}
      </div>
    </div>
  );
}
