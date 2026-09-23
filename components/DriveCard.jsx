'use client';

import Link from 'next/link';
import {
  Building2,
  Briefcase,
  IndianRupee,
  Calendar,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  FileText
} from 'lucide-react';

export default function DriveCard({ drive }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBA';
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

  const branches = drive.eligibility_branch
    ? drive.eligibility_branch.split(',').map((b) => b.trim())
    : [];

  return (
    <div className="glass-card p-5 sm:p-6 flex flex-col justify-between hover-lift group">
      <div>
        {/* Header: Logo, Name & Status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-surface-100 border border-surface-200 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-primary-300 transition-colors">
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
              <div
                className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 font-bold text-lg"
                style={{ display: drive.logo_url ? 'none' : 'flex' }}
              >
                {drive.name ? drive.name.charAt(0).toUpperCase() : <Building2 className="w-5 h-5" />}
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-lg font-display text-surface-900 group-hover:text-primary-600 transition-colors truncate">
                {drive.name}
              </h3>
              <p className="text-xs text-surface-500 font-medium truncate flex items-center gap-1 mt-0.5">
                <Briefcase className="w-3.5 h-3.5 text-surface-400" />
                {drive.role || 'Placement Drive'}
              </p>
            </div>
          </div>

          <span
            className={
              drive.status === 'Open'
                ? 'badge-open flex-shrink-0'
                : 'badge-closed flex-shrink-0'
            }
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                drive.status === 'Open' ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            />
            {drive.status || 'Open'}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="p-2.5 rounded-lg bg-surface-50 border border-surface-100">
            <span className="text-surface-400 uppercase text-[10px] font-bold tracking-wider block">
              Package (CTC)
            </span>
            <span className="font-bold text-surface-800 text-sm mt-0.5 flex items-center gap-0.5">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              {drive.package || 'Confidential'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-50 border border-surface-100">
            <span className="text-surface-400 uppercase text-[10px] font-bold tracking-wider block">
              Drive Date
            </span>
            <span className="font-semibold text-surface-800 text-xs mt-0.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary-500" />
              {formatDate(drive.drive_date)}
            </span>
          </div>
        </div>

        {/* Branch Eligibility Tags */}
        {branches.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <GraduationCap className="w-3.5 h-3.5 text-surface-400 mr-1" />
            {branches.map((b, idx) => (
              <span key={idx} className="badge-branch">
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-surface-100 flex items-center justify-between gap-2 mt-auto">
        <div className="text-[11px] text-surface-400">
          {drive.apply_deadline ? (
            <span>Deadline: <strong className="text-surface-700">{formatDate(drive.apply_deadline)}</strong></span>
          ) : (
            <span>CGPA Cutoff: <strong className="text-surface-700">{drive.eligibility_cgpa || 'Any'}</strong></span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {drive.jd_pdf_url && (
            <a
              href={drive.jd_pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !p-2"
              title="View Job Description PDF"
            >
              <FileText className="w-4 h-4 text-surface-600" />
            </a>
          )}

          <Link href={`/drive/${drive.id}`} className="btn-primary !py-1.5 !px-3 text-xs">
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
