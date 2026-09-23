'use client';

import { useState, useEffect } from 'react';
import { fetchDrives } from '@/lib/api';
import DriveCard from '@/components/DriveCard';
import FilterBar from '@/components/FilterBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Building2, Sparkles, GraduationCap, CheckCircle2, TrendingUp } from 'lucide-react';

export default function Home() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    branch: 'All',
    status: 'All',
    search: '',
  });

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = async () => {
    setLoading(true);
    try {
      const result = await fetchDrives();
      if (result.success) {
        setDrives(result.data || []);
      } else {
        toast.error(result.error || 'Failed to load placement drives');
      }
    } catch (err) {
      toast.error('Unable to fetch drives. Check your internet connection.');
    }
    setLoading(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ branch: 'All', status: 'All', search: '' });
  };

  const filteredDrives = drives.filter((drive) => {
    // Branch Filter
    if (filters.branch !== 'All') {
      const branches = drive.eligibility_branch
        ? drive.eligibility_branch.toLowerCase().split(',').map((b) => b.trim())
        : [];
      if (!branches.includes(filters.branch.toLowerCase())) {
        return false;
      }
    }

    // Status Filter
    if (filters.status !== 'All') {
      if ((drive.status || 'Open').toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }
    }

    // Search Filter
    if (filters.search.trim() !== '') {
      const term = filters.search.toLowerCase();
      const text = `${drive.name || ''} ${drive.role || ''} ${drive.package || ''}`.toLowerCase();
      if (!text.includes(term)) {
        return false;
      }
    }

    return true;
  });

  const openCount = drives.filter((d) => (d.status || 'Open') === 'Open').length;

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-surface-900 text-white py-14 sm:py-20 px-4">
        <div className="absolute inset-0 -z-10 opacity-20 bg-[radial-gradient(#6366F1_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-primary-200 mb-5 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-accent-500" />
            <span>Campus Placement Season 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-primary-300">Campus Recruitment</span> Drives
          </h1>

          <p className="mt-4 text-sm sm:text-base text-primary-100/90 max-w-2xl mx-auto font-normal">
            Stay updated with active placement drives, company roles, CTC packages, eligibility cutoffs, and official Job Description PDFs.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto mt-8">
            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <p className="text-2xl font-bold font-display text-white">{drives.length}</p>
              <p className="text-xs text-primary-200 mt-0.5">Total Companies</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/20 text-center">
              <p className="text-2xl font-bold font-display text-emerald-300">{openCount}</p>
              <p className="text-xs text-emerald-200 mt-0.5">Open Drives</p>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <p className="text-2xl font-bold font-display text-white">100%</p>
              <p className="text-xs text-primary-200 mt-0.5">Verified Listings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          count={filteredDrives.length}
        />

        {loading ? (
          <LoadingSpinner text="Fetching active placement drives from Google Sheets..." />
        ) : filteredDrives.length === 0 ? (
          <div className="glass-card p-12 text-center animate-fade-in max-w-md mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-surface-900 mb-1">
              {drives.length === 0 ? 'No drives posted yet' : 'No matching drives'}
            </h3>
            <p className="text-xs text-surface-500 mb-5">
              {drives.length === 0
                ? 'Check back later or log in as Admin to add your first company drive.'
                : 'Try adjusting your branch or status filter to see more drives.'}
            </p>
            {drives.length > 0 && (
              <button onClick={handleResetFilters} className="btn-primary text-xs">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrives.map((drive) => (
              <DriveCard key={drive.id} drive={drive} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
