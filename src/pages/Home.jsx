import { useState, useEffect } from 'react';
import { fetchDrives } from '../api/sheets';
import DriveCard from '../components/DriveCard';
import FilterBar from '../components/FilterBar';
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';
import { Rocket, Search, Building2, TrendingUp } from 'lucide-react';

export default function Home() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    branch: '',
    status: '',
    role: '',
  });

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDrives();
      if (result.success) {
        setDrives(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch drives');
      }
    } catch (err) {
      setError('Unable to connect to the server. Please try again.');
    }
    setLoading(false);
  };

  // Client-side filtering (in addition to server-side)
  const filteredDrives = drives.filter(drive => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchable = `${drive.name} ${drive.role} ${drive.package}`.toLowerCase();
      if (!searchable.includes(searchTerm)) return false;
    }
    if (filters.branch) {
      const branches = (drive.eligibility_branch || '').toLowerCase().split(',').map(b => b.trim());
      if (!branches.includes(filters.branch.toLowerCase())) return false;
    }
    if (filters.status) {
      if (drive.status?.toLowerCase() !== filters.status.toLowerCase()) return false;
    }
    return true;
  });

  const openCount = drives.filter(d => d.status === 'Open').length;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-400/5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6 animate-fade-in">
              <Rocket className="w-4 h-4" />
              Campus Placement Portal
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display leading-tight animate-fade-in-up">
              Your Gateway to
              <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-100">
                Dream Careers
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-white/70 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Explore top company drives, check eligibility, and apply seamlessly. Stay ahead in your placement journey.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">{drives.length}</p>
                <p className="text-xs text-white/60 mt-0.5">Total Drives</p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="text-2xl sm:text-3xl font-bold text-emerald-300">{openCount}</p>
                <p className="text-xs text-white/60 mt-0.5">Open Now</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-amber-300">{new Set(drives.map(d => d.name)).size}</p>
                <p className="text-xs text-white/60 mt-0.5">Companies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V30C240 5 480 0 720 15C960 30 1200 35 1440 20V60H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* Drives Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-surface-900">
              Placement Drives
            </h2>
            <p className="text-sm text-surface-500 mt-0.5">
              {loading ? 'Loading...' : `${filteredDrives.length} drive${filteredDrives.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onFilterChange={setFilters} />

        {/* Content */}
        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-surface-800 mb-2">Unable to load drives</h3>
              <p className="text-sm text-surface-500 max-w-md mx-auto mb-4">{error}</p>
              <button onClick={loadDrives} className="btn-primary">
                Try Again
              </button>
            </div>
          ) : filteredDrives.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-surface-400" />
              </div>
              <h3 className="text-lg font-semibold text-surface-800 mb-2">No drives found</h3>
              <p className="text-sm text-surface-500">
                {drives.length === 0
                  ? 'No placement drives have been posted yet. Check back soon!'
                  : 'Try adjusting your filters or search terms.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDrives.map((drive, index) => (
                <DriveCard key={drive.id} drive={drive} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
