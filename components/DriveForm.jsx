'use client';

import { useState } from 'react';
import { X, Upload, Building2, Briefcase, IndianRupee, Calendar, Link as LinkIcon, FileText, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DriveForm({ drive = null, onSubmit, onClose }) {
  const isEditing = !!drive;

  const [formData, setFormData] = useState({
    name: drive?.name || '',
    logo_url: drive?.logo_url || '',
    role: drive?.role || '',
    package: drive?.package || '',
    eligibility_branch: drive?.eligibility_branch || '',
    eligibility_cgpa: drive?.eligibility_cgpa || '',
    drive_date: drive?.drive_date || '',
    apply_deadline: drive?.apply_deadline || '',
    apply_link: drive?.apply_link || '',
    jd_pdf_url: drive?.jd_pdf_url || '',
    status: drive?.status || 'Open',
  });

  const [logoFile, setLogoFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const branches = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'MBA', 'MCA'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBranchToggle = (branch) => {
    const current = formData.eligibility_branch
      ? formData.eligibility_branch.split(',').map((b) => b.trim()).filter(Boolean)
      : [];
    let updated;
    if (current.includes(branch)) {
      updated = current.filter((b) => b !== branch);
    } else {
      updated = [...current, branch];
    }
    setFormData((prev) => ({ ...prev, eligibility_branch: updated.join(', ') }));
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Company Name is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...formData };

      if (logoFile) {
        payload.logo_data = await fileToBase64(logoFile);
        payload.logo_name = logoFile.name;
        payload.logo_mime = logoFile.type;
      }

      if (jdFile) {
        payload.jd_data = await fileToBase64(jdFile);
        payload.jd_name = jdFile.name;
        payload.jd_mime = jdFile.type;
      }

      await onSubmit(payload);
    } catch (err) {
      toast.error('Failed to process form. Please check your network.');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl border border-surface-200 shadow-2xl w-full max-w-2xl my-8 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-50 border-b border-surface-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-surface-900">
                {isEditing ? 'Edit Placement Drive' : 'Add New Placement Drive'}
              </h2>
              <p className="text-xs text-surface-500">
                Fill in company details & upload documents to Google Drive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Name & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1 block">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Google, TCS, Infosys"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1 block">
                Drive Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Row 2: Role & Package */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1 block">
                Job Role / Position
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Software Engineer, SDE-1"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1 block">
                Package (CTC)
              </label>
              <input
                type="text"
                name="package"
                value={formData.package}
                onChange={handleChange}
                placeholder="e.g. 7.5 LPA, 45,000/month"
                className="input-field"
              />
            </div>
          </div>

          {/* Row 3: Eligibility Branches */}
          <div>
            <label className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1 block">
              Eligible Branches
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {branches.map((b) => {
                const isSelected = formData.eligibility_branch
                  .split(',')
                  .map((x) => x.trim())
                  .includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleBranchToggle(b)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-surface-50 text-surface-600 border-surface-200 hover:bg-surface-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                    {b}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              name="eligibility_branch"
              value={formData.eligibility_branch}
              onChange={handleChange}
              placeholder="Or enter custom branches (comma-separated)"
              className="input-field text-xs"
            />
          </div>

          {/* Row 4: CGPA & Apply Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1 block">
                Minimum CGPA Cutoff
              </label>
              <input
                type="text"
                name="eligibility_cgpa"
                value={formData.eligibility_cgpa}
                onChange={handleChange}
                placeholder="e.g. 6.0, 7.5, or No Criteria"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1 block">
                Application Link
              </label>
              <input
                type="url"
                name="apply_link"
                value={formData.apply_link}
                onChange={handleChange}
                placeholder="https://forms.google.com/..."
                className="input-field"
              />
            </div>
          </div>

          {/* Row 5: Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1 block">
                Drive Date
              </label>
              <input
                type="date"
                name="drive_date"
                value={formData.drive_date}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1 block">
                Application Deadline
              </label>
              <input
                type="date"
                name="apply_deadline"
                value={formData.apply_deadline}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          {/* File Uploads Section */}
          <div className="p-4 rounded-xl bg-surface-50 border border-surface-200 space-y-4">
            <h4 className="text-xs font-bold text-surface-800 uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-primary-600" /> Upload Files to Google Drive
            </h4>

            {/* Logo */}
            <div>
              <label className="text-xs font-medium text-surface-600 block mb-1">
                Company Logo (Image)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files[0] || null)}
                  className="text-xs text-surface-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>
              {formData.logo_url && !logoFile && (
                <p className="text-[11px] text-surface-400 mt-1 truncate">
                  Current: {formData.logo_url}
                </p>
              )}
            </div>

            {/* JD PDF */}
            <div>
              <label className="text-xs font-medium text-surface-600 block mb-1">
                Job Description PDF (JD)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setJdFile(e.target.files[0] || null)}
                  className="text-xs text-surface-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100"
                />
              </div>
              {formData.jd_pdf_url && !jdFile && (
                <p className="text-[11px] text-surface-400 mt-1 truncate">
                  Current: {formData.jd_pdf_url}
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-surface-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary !px-6"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Drive'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
