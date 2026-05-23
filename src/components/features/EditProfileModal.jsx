import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const inputCls = "w-full px-3 py-2 border border-amber-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all bg-white text-stone-900 placeholder:text-amber-200/50";
const labelCls = "block text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1.5";

const EditProfileModal = ({ student, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [form, setForm] = useState({
    name: student.name || '',
    email: student.email || '',
    department: student.department || '',
    semester: student.semester || '',
    degree: student.degree || '',
    year: student.year || '',
    oldPassword: '',
    password: '',
    confirmPassword: '',
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
    setError('');
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.email.trim()) return 'Email is required';
    
    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      return 'Please enter a valid email address';
    }

    if (form.password) {
      if (!form.oldPassword.trim()) {
        return 'Old password is required to change password';
      }
      if (form.password.length < 6) {
        return 'Password must be at least 6 characters long';
      }
      if (form.password !== form.confirmPassword) {
        return 'Passwords do not match';
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updateData = {
        name: form.name.trim(),
        email: form.email.trim(),
        department: form.department.trim() || null,
        semester: form.semester.trim() || null,
        degree: form.degree.trim() || null,
        year: form.year.trim() || null,
      };

      if (form.password) {
        updateData.password = form.password;
        updateData.oldPassword = form.oldPassword;
      }

      await onUpdate(updateData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update profile details.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'fa-user' },
    ...(student.role !== 'admin' ? [{ id: 'workspace', label: 'Workspace / Academic', icon: 'fa-graduation-cap' }] : []),
    { id: 'security', label: 'Security', icon: 'fa-shield-halved' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
        className="bg-amber-50 rounded-xl shadow-2xl w-full max-w-md border border-amber-200 overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100 bg-white">
          <div>
            <h3 className="text-base font-bold text-stone-900">Update Profile Details</h3>
            <p className="text-xs text-amber-500 mt-0.5">Customize your personal and academic desk space</p>
          </div>
          <motion.button
            onClick={onClose}
            disabled={loading}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="w-7 h-7 rounded-md hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </motion.button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-4 bg-white pb-3 border-b border-amber-100">
          <div className="flex bg-amber-50 rounded-lg p-1 gap-1 border border-amber-200">
            {tabs.map(t => (
              <button
                key={t.id}
                type="button"
                disabled={loading}
                onClick={() => { setActiveTab(t.id); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  activeTab === t.id
                    ? 'bg-amber-900 text-white shadow'
                    : 'text-amber-800 hover:bg-amber-100'
                }`}
              >
                <i className={`fa-solid ${t.icon} text-[10px]`}></i>
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto max-h-[70vh]">
          <div className="p-6 space-y-4">
            
            {/* Status alerts */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2.5 text-xs text-amber-950 bg-amber-100 border border-amber-200 rounded-md px-3.5 py-2.5"
                >
                  <i className="fa-solid fa-triangle-exclamation text-amber-600 text-sm shrink-0"></i>
                  <span className="font-semibold">{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2.5 text-xs text-emerald-950 bg-emerald-50 border border-emerald-200 rounded-md px-3.5 py-2.5"
                >
                  <i className="fa-solid fa-circle-check text-emerald-600 text-sm shrink-0"></i>
                  <span className="font-semibold">Profile details updated successfully! Saving settings...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* TAB CONTENTS */}
            <AnimatePresence mode="wait">
              {activeTab === 'personal' && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="edit-name" className={labelCls}>Full Name *</label>
                    <input
                      id="edit-name"
                      type="text"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="e.g. Sahiti Akella"
                      disabled={loading || success}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-email" className={labelCls}>Email Address *</label>
                    <input
                      id="edit-email"
                      type="email"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="e.g. sahiti@college.edu"
                      disabled={loading || success}
                      className={inputCls}
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'workspace' && (
                <motion.div
                  key="workspace"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="edit-department" className={labelCls}>Org / School</label>
                      <input
                        id="edit-department"
                        type="text"
                        value={form.department}
                        onChange={e => set('department', e.target.value)}
                        placeholder="e.g. Computer Science"
                        disabled={loading || success}
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-degree" className={labelCls}>Role / Title</label>
                      <input
                        id="edit-degree"
                        type="text"
                        value={form.degree}
                        onChange={e => set('degree', e.target.value)}
                        placeholder="e.g. B.Tech / Student"
                        disabled={loading || success}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="edit-semester" className={labelCls}>Join Status</label>
                      <input
                        id="edit-semester"
                        type="text"
                        value={form.semester}
                        onChange={e => set('semester', e.target.value)}
                        placeholder="e.g. 5th Semester"
                        disabled={loading || success}
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-year" className={labelCls}>Workspace Tier</label>
                      <input
                        id="edit-year"
                        type="text"
                        value={form.year}
                        onChange={e => set('year', e.target.value)}
                        placeholder="e.g. 3rd Year"
                        disabled={loading || success}
                        className={inputCls}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="bg-amber-100/50 rounded-lg p-3 border border-amber-200/60 mb-2">
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      <i className="fa-solid fa-circle-info mr-1 text-amber-600"></i>
                      Only fill out the password fields if you wish to change your current password. Leave blank to keep it unchanged.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="edit-old-password" className={labelCls}>Old Password *</label>
                    <div className="relative">
                      <input
                        id="edit-old-password"
                        type={showOldPassword ? "text" : "password"}
                        value={form.oldPassword}
                        onChange={e => set('oldPassword', e.target.value)}
                        placeholder="••••••••"
                        disabled={loading || success}
                        className={`${inputCls} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        disabled={loading || success}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800 cursor-pointer disabled:opacity-50"
                      >
                        <i className={`fa-solid ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="edit-password" className={labelCls}>New Password</label>
                    <div className="relative">
                      <input
                        id="edit-password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={e => set('password', e.target.value)}
                        placeholder="••••••••"
                        disabled={loading || success}
                        className={`${inputCls} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading || success}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800 cursor-pointer disabled:opacity-50"
                      >
                        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="edit-confirm-password" className={labelCls}>Confirm New Password</label>
                    <div className="relative">
                      <input
                        id="edit-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={e => set('confirmPassword', e.target.value)}
                        placeholder="••••••••"
                        disabled={loading || success}
                        className={`${inputCls} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading || success}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800 cursor-pointer disabled:opacity-50"
                      >
                        <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-3 pt-3 border-t border-amber-100">
              <motion.button
                type="button"
                onClick={onClose}
                disabled={loading || success}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2.5 rounded-md border border-amber-200 text-xs font-semibold text-amber-700 bg-white hover:bg-amber-100/50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </motion.button>
              
              <motion.button
                type="submit"
                disabled={loading || success}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2.5 rounded-md bg-amber-900 hover:bg-amber-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin text-xs"></i>
                    Saving...
                  </>
                ) : success ? (
                  <>
                    <i className="fa-solid fa-check text-xs"></i>
                    Saved!
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk text-xs"></i>
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>

          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditProfileModal;
