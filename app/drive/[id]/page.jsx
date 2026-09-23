'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchDriveById } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Briefcase,
  IndianRupee,
  Calendar,
  GraduationCap,
  ExternalLink,
  FileText,
  Clock,
  Award,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DriveDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadDrive();
    }
  }, [id]);

  const loadDrive = async () => {
    setLoading(true);
    try {
      const result = await fetchDriveById(id);
      if (result.success && result.data) {
        setDrive(result.data);
      } else {
        toast.error('Placement drive not found');
        router.push('/');
      }
    } catch (err) {
      toast.error('Unable to load drive details');
    }
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBA';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading placement drive details..." />;
  }

  if (!drive) return null;

  const branches = drive.eligibility_branch
    ? drive.eligibility_branch.split(',').map((b) => b.trim())
    : [];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link href="/" className="btn-secondary text-xs inline-flex mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Drives
      </Link>

      {/* Main Glass Card */}
      <div className="glass-card p-6 sm:p-8 space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b border-surface-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-100 border border-surface-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
              {drive.logo_url ? (
                <img src={drive.logo_url} alt={drive.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <Building2 className="w-8 h-8 text-primary-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-surface-900">
                {drive.name}
              </h1>
              <p className="text-sm text-surface-500 font-medium flex items-center gap-1.5 mt-1">
                <Briefcase className="w-4 h-4 text-primary-600" />
                {drive.role || 'Placement Drive'}
              </p>
            </div>
          </div>

          <span
            className={
              drive.status === 'Open'
                ? 'badge-open text-sm px-3 py-1.5'
                : 'badge-closed text-sm px-3 py-1.5'
            }
          >
            <span className={`w-2 h-2 rounded-full ${drive.status === 'Open' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {drive.status || 'Open'}
          </span>
        </div>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
            <div className="flex items-center gap-2 text-surface-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <IndianRupee className="w-4 h-4 text-emerald-600" /> CTC Package
            </div>
            <p className="text-lg font-bold text-surface-900">
              {drive.package || 'Confidential'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
            <div className="flex items-center gap-2 text-surface-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4 text-primary-500" /> Drive Date
            </div>
            <p className="text-sm font-semibold text-surface-900">
              {formatDate(drive.drive_date)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-50 border border-surface-100">
            <div className="flex items-center gap-2 text-surface-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4 text-red-500" /> Apply Deadline
            </div>
            <p className="text-sm font-semibold text-surface-900">
              {formatDate(drive.apply_deadline)}
            </p>
          </div>
        </div>

        {/* Eligibility Section */}
        <div className="space-y-4">
          <h2 className="text-base font-bold font-display text-surface-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-600" /> Eligibility Criteria
          </h2>

          <div className="p-5 rounded-2xl bg-surface-50 border border-surface-100 space-y-4">
            <div>
              <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider block mb-2">
                Eligible Branches
              </span>
              <div className="flex flex-wrap gap-2">
                {branches.length > 0 ? (
                  branches.map((b, idx) => (
                    <span key={idx} className="badge-branch !text-xs !py-1 !px-2.5">
                      <GraduationCap className="w-3.5 h-3.5 mr-1 inline" />
                      {b}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-surface-600">All Branches Eligible</span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-surface-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-surface-500 font-medium">Minimum CGPA: </span>
                <strong className="text-surface-900 font-bold">{drive.eligibility_cgpa || 'No Cutoff'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-surface-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {drive.apply_link && drive.status === 'Open' && (
            <a
              href={drive.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !py-3 flex-1 text-center justify-center text-sm font-bold"
            >
              <ExternalLink className="w-4 h-4" /> Apply Now
            </a>
          )}

          {drive.jd_pdf_url && (
            <a
              href={drive.jd_pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !py-3 flex-1 text-center justify-center text-sm font-semibold"
            >
              <FileText className="w-4 h-4 text-primary-600" /> View Job Description PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
