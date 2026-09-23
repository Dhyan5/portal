import { useState, useRef } from 'react';
import { X, Upload, Image, FileText, Loader2 } from 'lucide-react';
import { uploadFile } from '../api/sheets';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BRANCHES = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'AIDS', 'AIML', 'IOT', 'Other'];

export default function DriveForm({ drive, onSubmit, onClose }) {
  const { token } = useAuth();
  const isEditing = !!drive;
  const [uploading, setUploading] = useState({ logo: false, jd: false });

  const [form, setForm] = useState({
    name: drive?.name || '',
    logo_url: drive?.logo_url || '',
    role: drive?.role || '',
    package: drive?.package || '',
    eligibility_branch: drive?.eligibility_branch || '',
    eligibility_cgpa: drive?.eligibility_cgpa || '',
    backlog_allowed: drive?.backlog_allowed || 'No',
    drive_date: drive?.drive_date || '',
    apply_deadline: drive?.apply_deadline || '',
    apply_link: drive?.apply_link || '',
    jd_pdf_url: drive?.jd_pdf_url || '',
    status: drive?.status || 'Open',
  });

  const [selectedBranches, setSelectedBranches] = useState(
    form.eligibility_branch ? form.eligibility_branch.split(',').map(b => b.trim()) : []
  );

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const toggleBranch = (branch) => {
    const updated = selectedBranches.includes(branch)
      ? selectedBranches.filter(b => b !== branch)
      : [...selectedBranches, branch];
    setSelectedBranches(updated);
    handleChange('eligibility_branch', updated.join(', '));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max 5MB.');
      return;
    }

    setUploading(prev => ({ ...prev, [type]: true }));

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result.split(',')[1]; // Remove data:... prefix
        const result = await uploadFile(token, base64, file.name, file.type);

        if (result.success) {
          const urlKey = type === 'logo' ? 'logo_url' : 'jd_pdf_url';
          handleChange(urlKey, result.data.url);
          toast.success(`${type === 'logo' ? 'Logo' : 'JD PDF'} uploaded!`);
        } else {
          toast.error(result.error || 'Upload failed');
        }
        setUploading(prev => ({ ...prev, [type]: false }));
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error('Upload error: ' + err.message);
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.role) {
      toast.error('Company name and role are required');
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-scale-in custom-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-surface-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <h2 className="text-lg font-bold font-display text-surface-900">
            {isEditing ? 'Edit Drive' : 'Add New Drive'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Company Name */}
          <div>
            <label className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5 block">Company Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="input-field"
              placeholder="e.g. Google, TCS, Infosys"
              required
              id="field-company-name"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5 block">Company Logo</label>
            <div className="flex items-center gap-3">
              {form.logo_url ? (
                <div className="w-14 h-14 rounded-xl border border-surface-200 overflow-hidden flex-shrink-0">
                  <img src={form.logo_url} alt="Logo" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl border-2 border-dashed border-surface-300 flex items-center justify-center flex-shrink-0">
                  <Image className="w-5 h-5 text-surface-400" />
                </div>
              )}
              <label className="btn-secondary cursor-pointer !py-2 !px-4 text-xs">
                {uploading.logo ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="w-3.5 h-3.5" /> Upload Logo</>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'logo')}
                  className="hidden"
                  disabled={uploading.logo}
                />
              </label>
              {form.logo_url && (
                <button type="button" onClick={() => handleChange('logo_url', '')} className="text-xs text-red-500 hover:text-red-700">Remove</button>
              )}
            </div>
          </div>

          {/* Role + Package */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5 block">Job Role *</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="input-field"
                placeholder="e.g. SDE, Analyst"
                required
                id="field-role"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5 block">Package / CTC</label>
              <input
                type="text"
                value={form.package}
                onChange={(e) => handleChange('package', e.target.value)}
                className="input-field"
                placeholder="e.g. 12 LPA"
                id="field-package"
              />
            </div>
          </div>

          {/* Branches */}
          <div>
            <label className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5 block">Eligible Branches</label>
            <div className="flex flex-wrap gap-1.5">
              {BRANCHES.map((branch) => (
                <button
                  key={branch}
                  type="button"
                  onClick={() => toggleBranch(branch)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedBranches.includes(branch)
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>

          {/* CGPA + Backlog */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5 block">Min CGPA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={form.eligibility_cgpa}
                onChange={(e) => handleChange('eligibility_cgpa', e.target.value)}
                className="input-field"
                placeholder="e.g. 7.0"
                id="field-cgpa"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5 block">Backlogs Allowed</label>
              <select
                value={form.backlog_allowed}
                onChange={(e) => handleChange('backlog_allowed', e.target.value)}
                className="input-field"
                id="field-backlog"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
                <option value="Active backlogs not allowed">Active backlogs not allowed</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5 block">Drive Date</label>
              <input
                type="date"
                value={form.drive_date}
                onChange={(e) => handleChange('drive_date', e.target.value)}
                className="input-field"
                id="field-drive-date"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5 block">Apply Deadline</label>
              <input
                type="date"
                value={form.apply_deadline}
                onChange={(e) => handleChange('apply_deadline', e.target.value)}
                className="input-field"
                id="field-deadline"
              />
            </div>
          </div>

          {/* Apply Link */}
          <div>
            <label className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5 block">Apply Link (External URL)</label>
            <input
              type="url"
              value={form.apply_link}
              onChange={(e) => handleChange('apply_link', e.target.value)}
              className="input-field"
              placeholder="https://forms.google.com/..."
              id="field-apply-link"
            />
          </div>

          {/* JD PDF Upload */}
          <div>
            <label className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5 block">Job Description (PDF)</label>
            <div className="flex items-center gap-3">
              <label className="btn-secondary cursor-pointer !py-2 !px-4 text-xs">
                {uploading.jd ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</>
                ) : (
                  <><FileText className="w-3.5 h-3.5" /> Upload PDF</>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e, 'jd')}
                  className="hidden"
                  disabled={uploading.jd}
                />
              </label>
              {form.jd_pdf_url && (
                <div className="flex items-center gap-2">
                  <a href={form.jd_pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline">View uploaded PDF</a>
                  <button type="button" onClick={() => handleChange('jd_pdf_url', '')} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5 block">Status</label>
            <div className="flex gap-2">
              {['Open', 'Closed'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleChange('status', s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    form.status === s
                      ? s === 'Open' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" id="btn-submit-drive">
              {isEditing ? 'Save Changes' : 'Add Drive'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
