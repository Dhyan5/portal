import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

const BRANCHES = ['All', 'CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'AIDS', 'AIML', 'IOT', 'Other'];
const STATUSES = ['All', 'Open', 'Closed'];

export default function FilterBar({ filters, onFilterChange }) {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value === 'All' ? '' : value });
  };

  const clearFilters = () => {
    onFilterChange({ search: '', branch: '', status: '', role: '' });
  };

  const hasActiveFilters = filters.branch || filters.status || filters.role;

  return (
    <div className="space-y-3">
      {/* Search + toggle */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search company, role, or package..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="input-field !pl-10"
            id="search-drives"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-primary-50 text-primary-700 border-primary-200'
              : 'bg-white text-surface-600 border-surface-200 hover:bg-surface-50'
          }`}
          id="toggle-filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] flex items-center justify-center font-bold">
              {[filters.branch, filters.status, filters.role].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter pills */}
      {showFilters && (
        <div className="glass-card p-4 animate-scale-in space-y-4" style={{ '--tw-shadow': 'none' }}>
          {/* Branch Filter */}
          <div>
            <label className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2 block">Branch</label>
            <div className="flex flex-wrap gap-1.5">
              {BRANCHES.map((branch) => {
                const isActive = (branch === 'All' && !filters.branch) || filters.branch === branch;
                return (
                  <button
                    key={branch}
                    onClick={() => updateFilter('branch', branch)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    }`}
                  >
                    {branch}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2 block">Status</label>
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map((status) => {
                const isActive = (status === 'All' && !filters.status) || filters.status === status;
                return (
                  <button
                    key={status}
                    onClick={() => updateFilter('status', status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? status === 'Open' ? 'bg-emerald-500 text-white' :
                          status === 'Closed' ? 'bg-red-500 text-white' :
                          'bg-primary-600 text-white'
                        : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clear */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
