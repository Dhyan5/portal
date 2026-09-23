'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  fetchDrives,
  addDrive,
  editDrive,
  deleteDrive,
  toggleDriveStatus
} from '@/lib/api';
import DriveForm from '@/components/DriveForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Building2,
  Briefcase,
  IndianRupee,
  Calendar,
  ExternalLink,
  Search,
  RefreshCw,
  LayoutDashboard,
  FileText
} from 'lucide-react';

export default function Dashboard() {
  const { token, isAuthenticated, mounted } = useAuth();
  const router = useRouter();

  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace('/login');
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDrives();
    }
  }, [isAuthenticated]);

  const loadDrives = async () => {
    setLoading(true);
    try {
      const result = await fetchDrives();
      if (result.success) {
        setDrives(result.data || []);
      } else {
        toast.error(result.error || 'Failed to fetch drives');
      }
    } catch (err) {
      toast.error('Unable to load drives');
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDrives();
    setRefreshing(false);
    toast.success('Refreshed!');
  };

  const handleAdd = async (data) => {
    const result = await addDrive(token, data);
    if (result.success) {
      toast.success('Placement drive created successfully!');
      setShowForm(false);
      loadDrives();
    } else {
      toast.error(result.error || 'Failed to add drive');
    }
  };

  const handleEdit = async (data) => {
    const result = await editDrive(token, editingDrive.id, data);
    if (result.success) {
      toast.success('Placement drive updated!');
      setEditingDrive(null);
      setShowForm(false);
      loadDrives();
    } else {
      toast.error(result.error || 'Failed to update drive');
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    const result = await deleteDrive(token, id);
    if (result.success) {
      toast.success('Drive deleted');
      setDrives((prev) => prev.filter((d) => d.id !== id));
    } else {
      toast.error(result.error || 'Failed to delete');
    }
    setDeleting(null);
  };

  const handleToggleStatus = async (id) => {
    setToggling(id);
    const result = await toggleDriveStatus(token, id);
    if (result.success) {
      setDrives((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: result.data.status } : d))
      );
      toast.success(`Drive status changed to ${result.data.status}`);
    } else {
      toast.error(result.error || 'Failed to toggle status');
    }
    setToggling(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (!mounted || !isAuthenticated) {
    return <LoadingSpinner text="Authenticating admin..." />;
  }

  const filteredDrives = drives.filter((d) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return `${d.name || ''} ${d.role || ''} ${d.package || ''}`.toLowerCase().includes(term);
  });

  const openCount = drives.filter((d) => (d.status || 'Open') === 'Open').length;
  const closedCount = drives.filter((d) => d.status === 'Closed').length;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface-50">
      {/* Header */}
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-surface-900">Admin Dashboard</h1>
                <p className="text-xs text-surface-500">Manage company recruitment drives</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="btn-secondary !px-3 !py-2"
                disabled={refreshing}
                title="Refresh drives"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => {
                  setEditingDrive(null);
                  setShowForm(true);
                }}
                className="btn-primary"
                id="btn-admin-add-drive"
              >
                <Plus className="w-4 h-4" /> Add Drive
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="p-3 rounded-xl bg-surface-50 border border-surface-100">
              <p className="text-2xl font-bold text-surface-800">{drives.length}</p>
              <p className="text-xs text-surface-500 mt-0.5">Total Drives</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <p className="text-2xl font-bold text-emerald-700">{openCount}</p>
              <p className="text-xs text-emerald-600 mt-0.5">Open Drives</p>
            </div>
            <div className="p-3 rounded-xl bg-red-50 border border-red-100">
              <p className="text-2xl font-bold text-red-700">{closedCount}</p>
              <p className="text-xs text-red-600 mt-0.5">Closed Drives</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search company, role, or package..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field !pl-10 max-w-md"
            id="admin-search-input"
          />
        </div>

        {loading ? (
          <LoadingSpinner text="Loading placement drives..." />
        ) : filteredDrives.length === 0 ? (
          <div className="text-center py-16 animate-fade-in bg-white rounded-2xl border border-surface-200">
            <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7 text-surface-400" />
            </div>
            <h3 className="text-lg font-semibold text-surface-800 mb-2">
              {drives.length === 0 ? 'No placement drives yet' : 'No results found'}
            </h3>
            <p className="text-xs text-surface-500 mb-4">
              {drives.length === 0
                ? 'Click "Add Drive" above to create your first company posting.'
                : 'Try typing a different company name or role.'}
            </p>
            {drives.length === 0 && (
              <button
                onClick={() => {
                  setEditingDrive(null);
                  setShowForm(true);
                }}
                className="btn-primary"
              >
                <Plus className="w-4 h-4" /> Add First Drive
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDrives.map((drive) => (
              <div
                key={drive.id}
                className="bg-white rounded-xl border border-surface-200 p-4 sm:p-5 hover:shadow-md transition-shadow animate-fade-in"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Logo & Basic Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-surface-100 border border-surface-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {drive.logo_url ? (
                        <img src={drive.logo_url} alt={drive.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Building2 className="w-5 h-5 text-surface-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-surface-900 truncate">{drive.name}</h3>
                        <span className={(drive.status || 'Open') === 'Open' ? 'badge-open' : 'badge-closed'}>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              (drive.status || 'Open') === 'Open' ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          />
                          {drive.status || 'Open'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-surface-500">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5" />
                          {drive.role || 'Placement Drive'}
                        </span>
                        <span className="flex items-center gap-1">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {drive.package || '—'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(drive.drive_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 sm:ml-auto">
                    <button
                      onClick={() => handleToggleStatus(drive.id)}
                      disabled={toggling === drive.id}
                      className={`p-2 rounded-lg transition-colors ${
                        (drive.status || 'Open') === 'Open'
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-surface-400 hover:bg-surface-100'
                      }`}
                      title={`Toggle to ${(drive.status || 'Open') === 'Open' ? 'Closed' : 'Open'}`}
                    >
                      {(drive.status || 'Open') === 'Open' ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setEditingDrive(drive);
                        setShowForm(true);
                      }}
                      className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
                      title="Edit Drive"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {drive.apply_link && (
                      <a
                        href={drive.apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 transition-colors"
                        title="Open Apply Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {drive.jd_pdf_url && (
                      <a
                        href={drive.jd_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 transition-colors"
                        title="View JD PDF"
                      >
                        <FileText className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${drive.name}" placement drive?`)) {
                          handleDelete(drive.id);
                        }
                      }}
                      disabled={deleting === drive.id}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete Drive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drive Form Modal */}
      {showForm && (
        <DriveForm
          drive={editingDrive}
          onSubmit={editingDrive ? handleEdit : handleAdd}
          onClose={() => {
            setShowForm(false);
            setEditingDrive(null);
          }}
        />
      )}
    </div>
  );
}
