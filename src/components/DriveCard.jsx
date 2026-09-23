import { Link } from 'react-router-dom';
import {
  Building2,
  Briefcase,
  IndianRupee,
  Calendar,
  Clock,
  GraduationCap,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function DriveCard({ drive, index = 0 }) {
  const isOpen = drive.status === 'Open';
  const deadlinePassed = drive.apply_deadline && new Date(drive.apply_deadline) < new Date();

  // Format date nicely
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

  // Days remaining until deadline
  const daysRemaining = () => {
    if (!drive.apply_deadline) return null;
    const diff = Math.ceil((new Date(drive.apply_deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Expired';
    if (diff === 0) return 'Last day!';
    if (diff === 1) return '1 day left';
    return `${diff} days left`;
  };

  const remaining = daysRemaining();

  return (
    <Link
      to={`/drive/${drive.id}`}
      className={`glass-card p-5 block group animate-fade-in-up animate-fill-both stagger-${Math.min(index % 6, 5)}`}
      style={{ animationDelay: `${(index % 6) * 0.08}s` }}
    >
      {/* Header */}
      <div className="flex items-start gap-3.5">
        {/* Logo */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-surface-100 to-surface-50 border border-surface-200 flex items-center justify-center overflow-hidden flex-shrink-0">
          {drive.logo_url ? (
            <img
              src={drive.logo_url}
              alt={drive.name}
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-full h-full items-center justify-center ${drive.logo_url ? 'hidden' : 'flex'}`}>
            <Building2 className="w-6 h-6 text-surface-400" />
          </div>
        </div>

        {/* Title & Role */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-surface-900 truncate group-hover:text-primary-700 transition-colors">
            {drive.name || 'Untitled Company'}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Briefcase className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" />
            <span className="text-sm text-surface-600 truncate">{drive.role || 'N/A'}</span>
          </div>
        </div>

        {/* Status Badge */}
        <span className={isOpen ? 'badge-open' : 'badge-closed'}>
          <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {drive.status || 'N/A'}
        </span>
      </div>

      {/* Details Grid */}
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
            <IndianRupee className="w-3.5 h-3.5 text-green-600" />
          </div>
          <div>
            <p className="text-[10px] text-surface-400 uppercase tracking-wider font-medium">Package</p>
            <p className="text-sm font-semibold text-surface-800">{drive.package || '—'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] text-surface-400 uppercase tracking-wider font-medium">CGPA</p>
            <p className="text-sm font-semibold text-surface-800">≥ {drive.eligibility_cgpa || '—'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div>
            <p className="text-[10px] text-surface-400 uppercase tracking-wider font-medium">Drive</p>
            <p className="text-sm font-semibold text-surface-800">{formatDate(drive.drive_date)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] text-surface-400 uppercase tracking-wider font-medium">Deadline</p>
            <p className="text-sm font-semibold text-surface-800">{formatDate(drive.apply_deadline)}</p>
          </div>
        </div>
      </div>

      {/* Branch tags */}
      {drive.eligibility_branch && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {drive.eligibility_branch.split(',').slice(0, 4).map((branch, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary-50 text-primary-700 border border-primary-100"
            >
              {branch.trim()}
            </span>
          ))}
          {drive.eligibility_branch.split(',').length > 4 && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-100 text-surface-500">
              +{drive.eligibility_branch.split(',').length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-surface-100 flex items-center justify-between">
        {remaining && (
          <span className={`text-xs font-medium ${
            remaining === 'Expired' ? 'text-red-500' :
            remaining === 'Last day!' ? 'text-amber-600' :
            'text-surface-500'
          }`}>
            {remaining === 'Expired' ? '⏰ ' : remaining === 'Last day!' ? '🔥 ' : '⏳ '}
            {remaining}
          </span>
        )}
        <span className="text-xs font-medium text-primary-600 flex items-center gap-1 ml-auto group-hover:gap-2 transition-all">
          View Details <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
