import { useState } from 'react';
import { student as mockStudent, subjects as mockSubjects } from '../data/mock';
import EditProfileModal from '../components/features/EditProfileModal';
import { AnimatePresence } from 'framer-motion';

const Toggle = ({ value, onChange, label, description }) => (
  <div className="flex items-center justify-between py-4 border-b border-amber-100 last:border-0">
    <div className="flex-1 pr-6">
      <p className="text-sm font-medium text-stone-900">{label}</p>
      {description && <p className="text-xs text-amber-500 mt-0.5">{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${value ? 'bg-emerald-500' : 'bg-amber-100'}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${value ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  </div>
);

const Profile = ({ student = mockStudent, subjects = mockSubjects, onUpdateProfile }) => {
  const [notif, setNotif] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [sundayStart, setSundayStart] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="p-3 md:p-6 space-y-5 max-w-4xl mx-auto">
      {/* Profile card */}
      <div className="bg-white rounded-lg border border-amber-200 p-4 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4 md:gap-5">
        <div className="w-16 h-16 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-user text-amber-600 text-2xl"></i>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-stone-900 truncate">{student.name}</h2>
          <p className="text-xs text-amber-500 mt-0.5 truncate">{student.email}</p>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {student.rollNo && <span className="text-[10px] font-semibold bg-amber-900 text-white px-2.5 py-1 rounded">{student.rollNo}</span>}
            {student.semester && <span className="text-[10px] font-medium bg-amber-100 text-amber-700 px-2.5 py-1 rounded border border-amber-200">{student.semester}</span>}
            {student.year && <span className="text-[10px] font-medium bg-amber-100 text-amber-700 px-2.5 py-1 rounded border border-amber-200">{student.year}</span>}
            {!student.rollNo && !student.semester && <span className="text-[10px] font-medium bg-amber-100 text-amber-700 px-2.5 py-1 rounded border border-amber-200">Personal Workspace</span>}
          </div>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="text-xs font-medium text-amber-700 border border-amber-200 px-3 py-2 rounded-md hover:bg-amber-50 transition-colors cursor-pointer self-start sm:self-start whitespace-nowrap"
        >
          <i className="fa-solid fa-pen-to-square mr-1.5 text-amber-400"></i>Edit
        </button>
      </div>

      {/* Academic / Workspace info */}
      <div className="bg-white rounded-lg border border-amber-200 p-4 md:p-6">
        <h3 className="text-sm font-semibold text-stone-900 mb-5">{student.department ? "Academic Information" : "Workspace Details"}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 md:gap-x-8">
          {[
            ['Organization / School',  student.department || 'Not Specified'],
            ['Role / Title',      student.degree || 'Personal Workspace'],
            ['Workspace Tier',        student.year || 'Standard'],
            ['Join Status',    student.semester || 'Active Member'],
            ['Account ID', student.rollNo || 'Standard Account'],
            ['Efficiency Rate',        student.department ? `${student.gpa} / 10.0` : '100% Productivity'],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide mb-1">{label}</p>
              <p className="text-sm font-medium text-stone-900 truncate">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Enrolled subjects */}
      {subjects.length > 0 && (
        <div className="bg-white rounded-lg border border-amber-200 p-4 md:p-6">
          <h3 className="text-sm font-semibold text-stone-900 mb-4">Enrolled Subjects</h3>
          <div className="divide-y divide-amber-100">
            {subjects.map(s => (
              <div key={s.id} className="flex items-center gap-3 md:gap-4 py-3">
                <div className="w-9 h-9 bg-amber-100 border border-amber-200 rounded-md flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-amber-700">{s.code.slice(-3)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">{s.name}</p>
                  <p className="text-xs text-amber-500 truncate">{s.code} · {s.credits} Credits</p>
                </div>
                <div className="text-right shrink-0 text-sm">
                  <p className="font-bold text-stone-900">{s.grade}</p>
                  <p className="text-xs text-amber-500">{s.gradePoints}/10</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preferences */}
      <div className="bg-white rounded-lg border border-amber-200 p-4 md:p-6">
        <h3 className="text-sm font-semibold text-stone-900 mb-1">Preferences</h3>
        <p className="text-xs text-amber-500 mb-4">Manage your notification and display settings.</p>
        <Toggle value={notif}       onChange={setNotif}       label="Deadline Notifications"   description="Get notified before task due dates" />
        <Toggle value={reminders}   onChange={setReminders}   label="Daily Study Reminders"    description="Morning reminder to plan your day"  />
        <Toggle value={sundayStart} onChange={setSundayStart} label="Week starts on Sunday"    description="Affects the schedule calendar view" />
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-lg border border-amber-200 p-4 md:p-6">
        <h3 className="text-sm font-semibold text-amber-900 mb-1 flex items-center gap-2">
          <i className="fa-solid fa-triangle-exclamation text-amber-400 text-xs"></i>
          Danger Zone
        </h3>
        <p className="text-xs text-amber-500 mb-4">These actions are permanent and cannot be undone.</p>
        <button className="text-xs font-medium text-amber-700 border border-amber-200 px-3 py-2 rounded-md hover:bg-amber-50 transition-colors cursor-pointer">
          Clear All Tasks
        </button>
    </div>
      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal
            student={student}
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={onUpdateProfile}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
