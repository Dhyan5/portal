import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchDriveById } from '../api/sheets';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ArrowLeft,
  Building2,
  Briefcase,
  IndianRupee,
  Calendar,
  Clock,
  GraduationCap,
  ExternalLink,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MapPin
} from 'lucide-react';

export default function DriveDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDrive();
  }, [id]);

  const loadDrive = async () => {
    setLoading(true);
    try {
      const result = await fetchDriveById(id);
      if (result.success) {
        setDrive(result.data);
      } else {
        setError(result.error || 'Drive not found');
      }
    } catch (err) {
      setError('Unable to load drive details');
    }
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) return <LoadingSpinner text="Loading drive details..." />;

  if (error || !drive) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-surface-900 mb-2">Drive Not Found</h2>
        <p className="text-surface-500 mb-6">{error || 'This placement drive may have been removed.'}</p>
        <Link to="/" className="btn-primary">Back to All Drives</Link>
      </div>
    );
  }

  const isOpen = drive.status === 'Open';
  const deadlinePassed = drive.apply_deadline && new Date(drive.apply_deadline) < new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-surface-800 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Drives
      </button>

      {/* Main card */}
      <div className="glass-card overflow-hidden" style={{ '--tw-shadow': '0 4px 24px rgba(0,0,0,0.06)' }}>
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-6 sm:p-8">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center overflow-hidden flex-shrink-0">
              {drive.logo_url ? (
                <img src={drive.logo_url} alt={drive.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <Building2 className="w-8 h-8 text-white/80" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-display truncate">
                    {drive.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Briefcase className="w-4 h-4 text-white/70" />
                    <span className="text-sm sm:text-base text-white/80">{drive.role}</span>
                  </div>
                </div>
                <span className={`flex-shrink-0 ${isOpen ? 'badge-open' : 'badge-closed'}`}>
                  <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {drive.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details body */}
        <div className="p-6 sm:p-8">
          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem icon={IndianRupee} iconBg="bg-green-50" iconColor="text-green-600" label="Package / CTC" value={drive.package || '—'} />
            <InfoItem icon={GraduationCap} iconBg="bg-blue-50" iconColor="text-blue-600" label="Min CGPA" value={drive.eligibility_cgpa ? `≥ ${drive.eligibility_cgpa}` : '—'} />
            <InfoItem
              icon={drive.backlog_allowed === 'Yes' ? CheckCircle2 : XCircle}
              iconBg={drive.backlog_allowed === 'Yes' ? 'bg-emerald-50' : 'bg-red-50'}
              iconColor={drive.backlog_allowed === 'Yes' ? 'text-emerald-600' : 'text-red-600'}
              label="Backlogs Allowed"
              value={drive.backlog_allowed || '—'}
            />
            <InfoItem icon={Calendar} iconBg="bg-purple-50" iconColor="text-purple-600" label="Drive Date" value={formatDate(drive.drive_date)} />
            <InfoItem icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-600" label="Apply Deadline" value={formatDate(drive.apply_deadline)} highlight={deadlinePassed} />
          </div>

          {/* Eligible Branches */}
          {drive.eligibility_branch && (
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Eligible Branches</h3>
              <div className="flex flex-wrap gap-2">
                {drive.eligibility_branch.split(',').map((branch, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-50 text-primary-700 border border-primary-100">
                    {branch.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {drive.apply_link && (
              <a
                href={drive.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-primary flex-1 text-center ${(!isOpen || deadlinePassed) ? 'opacity-50 pointer-events-none' : ''}`}
                id="btn-apply-now"
              >
                <ExternalLink className="w-4 h-4" />
                {deadlinePassed ? 'Deadline Passed' : isOpen ? 'Apply Now' : 'Applications Closed'}
              </a>
            )}

            {drive.jd_pdf_url && (
              <a
                href={drive.jd_pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 text-center"
                id="btn-view-jd"
              >
                <FileText className="w-4 h-4" />
                View Job Description
              </a>
            )}
          </div>

          {/* Deadline warning */}
          {deadlinePassed && isOpen && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>The application deadline has passed, but the drive status hasn't been updated yet. Contact your placement cell for clarification.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, iconBg, iconColor, label, value, highlight }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl ${highlight ? 'bg-red-50 border border-red-100' : 'bg-surface-50'}`}>
      <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-[10px] text-surface-400 uppercase tracking-wider font-semibold">{label}</p>
        <p className={`text-sm font-semibold mt-0.5 ${highlight ? 'text-red-600' : 'text-surface-800'}`}>{value}</p>
      </div>
    </div>
  );
}
