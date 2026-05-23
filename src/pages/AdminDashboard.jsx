import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import EditProfileModal from '../components/features/EditProfileModal';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AdminDashboard = ({ user, onLogout, onProfileUpdate }) => {
  const [adminProfile, setAdminProfile] = useState(user || api.getCurrentUser());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleUpdateAdminProfile = async (updatedData) => {
    const updated = await api.updateProfile(updatedData);
    setAdminProfile(updated);
    if (onProfileUpdate) {
      onProfileUpdate(updated);
    }
  };
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Register New Student Form States
  const [showRegForm, setShowRegForm] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRoll, setRegRoll] = useState('');
  const [regDept, setRegDept] = useState('Computer Science & Engineering');
  const [regSem, setRegSem] = useState('5th Semester');
  const [regDegree, setRegDegree] = useState('B.Tech');
  const [regYear, setRegYear] = useState('3rd Year');

  // Assign Task Form States
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskHours, setTaskHours] = useState('2');
  const [taskContext, setTaskContext] = useState('general');

  const PERSONAL_CATEGORIES = [
    { id: 'coding', name: 'Coding & Development' },
    { id: 'health', name: 'Health & Wellness' },
    { id: 'social', name: 'Social & Networking' },
    { id: 'work', name: 'Career & Work' },
    { id: 'other', name: 'General/Other' }
  ];

  // Load all students
  const loadStudents = async () => {
    try {
      setLoadingList(true);
      const data = await api.adminGetStudents();
      setStudents(data);
      if (data.length > 0 && !selectedStudent) {
        handleSelectStudent(data[0]);
      }
    } catch (err) {
      setError('Failed to fetch students.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Fetch full details of selected student
  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setStudentDetails(null);
    setLoadingDetails(true);
    try {
      const data = await api.adminGetStudentDetails(student.id);
      setStudentDetails(data);
      setTaskContext('general');
    } catch (err) {
      setError(`Failed to fetch academic details for ${student.name}`);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Register Student handler
  const handleRegisterStudent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const newStudent = await api.adminCreateStudent({
        name: regName,
        email: regEmail,
        password: regPassword,
        rollNo: regRoll,
        department: regDept,
        semester: regSem,
        degree: regDegree,
        year: regYear
      });
      setSuccess(`Successfully registered ${newStudent.name}!`);
      setShowRegForm(false);
      // Clear forms
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegRoll('');
      
      // Reload lists and select the new student
      const listData = await api.adminGetStudents();
      setStudents(listData);
      const added = listData.find(s => s.id === newStudent.id);
      if (added) {
        handleSelectStudent(added);
      }
    } catch (err) {
      setError(err.message || 'Failed to create student account.');
    }
  };

  // Delete Student account
  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete ${studentName}'s account and all their records?`)) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      await api.adminDeleteStudent(studentId);
      setSuccess(`Deleted ${studentName}'s account successfully.`);
      const remaining = students.filter(s => s.id !== studentId);
      setStudents(remaining);
      if (remaining.length > 0) {
        handleSelectStudent(remaining[0]);
      } else {
        setSelectedStudent(null);
        setStudentDetails(null);
      }
    } catch (err) {
      setError('Failed to delete student account.');
    }
  };

  // Assign Task handler
  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!taskTitle) return;
    setError('');
    setSuccess('');

    let subjectId = null;
    let personalCategory = null;

    if (taskContext.startsWith('subject:')) {
      subjectId = taskContext.split(':')[1];
    } else if (taskContext.startsWith('personal:')) {
      personalCategory = taskContext.split(':')[1];
    }

    try {
      await api.createTask({
        title: taskTitle,
        description: taskDesc,
        priority: taskPriority,
        dueDate: taskDueDate,
        estimatedHours: parseFloat(taskHours),
        subjectId,
        personalCategory,
        studentId: selectedStudent.id
      });
      setSuccess(`Task assigned to ${selectedStudent.name}!`);
      setShowTaskForm(false);
      setTaskTitle('');
      setTaskDesc('');
      setTaskContext('general');
      
      // Reload student details to refresh task feed
      if (selectedStudent) {
        handleSelectStudent(selectedStudent);
      }
    } catch (err) {
      setError('Failed to assign task.');
    }
  };

  // Calculate Admin Stats
  const totalStudents = students.length;
  const avgGpa = students.length > 0 
    ? (students.reduce((acc, s) => acc + parseFloat(s.gpa), 0) / students.length).toFixed(2)
    : '0.00';
  const totalTasks = students.reduce((acc, s) => acc + (s.totalTasks || 0), 0);
  const completedTasks = students.reduce((acc, s) => acc + (s.completedTasks || 0), 0);
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#fff7ed] text-stone-900 font-sans p-6">
      
      {/* Admin Navbar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-amber-200 pb-5 mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
            <i className="fa-solid fa-shield-halved text-amber-800"></i> Admin Management Portal
          </h1>
          <p className="text-amber-800 text-xs mt-0.5">Welcome, {adminProfile?.name || 'Administrator'} · Academica Suite</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-white hover:bg-amber-50 border border-amber-200 text-amber-900 font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <i className="fa-solid fa-user-gear text-amber-600"></i> Edit Details
          </button>
          <button 
            onClick={onLogout}
            className="bg-amber-100 hover:bg-amber-200 border border-amber-200 text-amber-900 font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            Sign Out <i className="fa-solid fa-arrow-right-from-bracket text-[10px]"></i>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Global Notifications */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 flex items-center gap-2 shadow-sm"
            >
              <i className="fa-solid fa-circle-exclamation text-rose-600"></i>
              <span>{error}</span>
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-800 flex items-center gap-2 shadow-sm"
            >
              <i className="fa-solid fa-circle-check text-emerald-600"></i>
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm">
            <p className="text-amber-800 text-[10px] uppercase font-bold tracking-wider">Total Enrolled</p>
            <h3 className="text-2xl font-bold mt-1 text-stone-900">{totalStudents}</h3>
            <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
              <i className="fa-solid fa-users text-amber-700"></i> Active student accounts
            </p>
          </div>
          <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm">
            <p className="text-amber-800 text-[10px] uppercase font-bold tracking-wider">Institution Average GPA</p>
            <h3 className="text-2xl font-bold mt-1 text-stone-900">{avgGpa} / 10.0</h3>
            <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
              <i className="fa-solid fa-star text-amber-600"></i> Semester cumulative scale
            </p>
          </div>
          <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm">
            <p className="text-amber-800 text-[10px] uppercase font-bold tracking-wider">Academic Homework Load</p>
            <h3 className="text-2xl font-bold mt-1 text-stone-900">{totalTasks}</h3>
            <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
              <i className="fa-solid fa-list-check text-amber-700"></i> Tasks currently assigned
            </p>
          </div>
          <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm">
            <p className="text-amber-800 text-[10px] uppercase font-bold tracking-wider">Task Completion Rate</p>
            <h3 className="text-2xl font-bold mt-1 text-stone-900">{overallProgress}%</h3>
            <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
              <i className="fa-solid fa-circle-check text-emerald-600"></i> {completedTasks} / {totalTasks} finished
            </p>
          </div>
        </div>

        {/* Dynamic Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Student Roster */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800">Students Enrolled</h2>
              <button 
                onClick={() => setShowRegForm(!showRegForm)}
                className="bg-amber-900 text-white font-bold text-[10px] px-3 py-1.5 rounded hover:bg-amber-800 transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <i className="fa-solid fa-plus text-[8px]"></i> Register Student
              </button>
            </div>

            {/* Register Student Form Drawer */}
            <AnimatePresence>
              {showRegForm && (
                <motion.form 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleRegisterStudent}
                  className="bg-white border border-amber-200 rounded-xl p-5 space-y-3.5 overflow-hidden shadow-sm"
                >
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">Register Student Account</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-amber-900 uppercase tracking-wide">Full Name</label>
                      <input 
                        type="text" 
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Sahiti"
                        className="w-full bg-amber-50/50 border border-amber-200 rounded px-2.5 py-1.5 text-xs text-stone-900 placeholder-amber-700/50 focus:outline-none focus:border-amber-750"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-amber-900 uppercase tracking-wide">Roll Number</label>
                      <input 
                        type="text" 
                        value={regRoll}
                        onChange={(e) => setRegRoll(e.target.value)}
                        placeholder="21CS043"
                        className="w-full bg-amber-50/50 border border-amber-200 rounded px-2.5 py-1.5 text-xs text-stone-900 placeholder-amber-700/50 focus:outline-none focus:border-amber-750"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-amber-900 uppercase tracking-wide">Email Address</label>
                    <input 
                      type="email" 
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="student@college.edu"
                      className="w-full bg-amber-50/50 border border-amber-200 rounded px-2.5 py-1.5 text-xs text-stone-900 placeholder-amber-700/50 focus:outline-none focus:border-amber-750"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-amber-900 uppercase tracking-wide">Account Password</label>
                    <input 
                      type="password" 
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="student123"
                      className="w-full bg-amber-50/50 border border-amber-200 rounded px-2.5 py-1.5 text-xs text-stone-900 placeholder-amber-700/50 focus:outline-none focus:border-amber-750"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-amber-900 uppercase tracking-wide">Department</label>
                      <select 
                        value={regDept}
                        onChange={(e) => setRegDept(e.target.value)}
                        className="w-full bg-amber-50/50 border border-amber-200 rounded px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-amber-750"
                      >
                        <option>Computer Science & Engineering</option>
                        <option>Information Technology</option>
                        <option>Electronics & Communication</option>
                        <option>Electrical & Electronics</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-amber-900 uppercase tracking-wide">Semester</label>
                      <select 
                        value={regSem}
                        onChange={(e) => setRegSem(e.target.value)}
                        className="w-full bg-amber-50/50 border border-amber-200 rounded px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-amber-750"
                      >
                        <option>1st Semester</option>
                        <option>3rd Semester</option>
                        <option>5th Semester</option>
                        <option>7th Semester</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button 
                      type="submit" 
                      className="flex-1 bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs py-2 rounded transition-colors shadow-sm"
                    >
                      Register Student
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowRegForm(false)}
                      className="bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs px-4 py-2 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Enrolled Students list */}
            {loadingList ? (
              <div className="text-amber-800 text-xs py-6 flex items-center justify-center gap-2">
                <i className="fa-solid fa-spinner animate-spin animate-spin"></i> Loading Enrolled Students...
              </div>
            ) : students.length === 0 ? (
              <div className="bg-white border border-amber-200 rounded-xl p-8 text-center text-amber-800 text-xs">
                No students enrolled yet. Register your first student account!
              </div>
            ) : (
              <div className="space-y-2">
                {students.map((student) => {
                  const isSelected = selectedStudent?.id === student.id;
                  const progressPct = student.totalTasks > 0 
                    ? Math.round((student.completedTasks / student.totalTasks) * 100) 
                    : 0;

                  return (
                    <div 
                      key={student.id}
                      onClick={() => handleSelectStudent(student)}
                      className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 text-left ${
                        isSelected 
                          ? 'bg-amber-100/70 border-amber-300 shadow-sm' 
                          : 'bg-white border-amber-200 hover:bg-amber-50/50 hover:border-amber-250'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                            {student.name}
                            <span className="text-[10px] font-medium text-amber-800">{student.rollNo}</span>
                          </h4>
                          <p className="text-[10px] text-amber-800/80 mt-0.5 truncate max-w-[200px]">{student.department}</p>
                          <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
                            <i className="fa-solid fa-graduation-cap"></i> {student.semester} · {student.degree}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded">
                            {student.gpa} GPA
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStudent(student.id, student.name);
                            }}
                            className="block text-[10px] text-rose-700 hover:text-rose-900 mt-2 font-bold cursor-pointer transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Mini task completion bar */}
                      <div className="mt-3.5 space-y-1">
                        <div className="flex justify-between text-[9px] text-amber-800">
                          <span>Progress: {progressPct}%</span>
                          <span>{student.completedTasks}/{student.totalTasks} Tasks</span>
                        </div>
                        <div className="w-full h-1 bg-amber-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-900 rounded-full" 
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column (Span 2): Student Details Inspector */}
          <div className="lg:col-span-2">
            {loadingDetails ? (
              <div className="bg-white border border-amber-200 rounded-2xl p-24 text-center text-amber-800 text-xs flex flex-col items-center justify-center gap-3">
                <i className="fa-solid fa-spinner text-xl animate-spin text-amber-800"></i>
                <p>Retrieving academic profile, schedule, and tasks...</p>
              </div>
            ) : !selectedStudent || !studentDetails ? (
              <div className="bg-white border border-amber-200 rounded-2xl p-24 text-center text-amber-800 text-xs">
                Select a student from the roster list to inspect their record.
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Profile Inspector Banner */}
                <div className="bg-amber-900 border border-amber-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
                  <div>
                    <span className="text-[9px] font-bold bg-amber-800 border border-amber-700 text-amber-200 px-2 py-0.5 rounded-full">
                      Student Dossier
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
                      {studentDetails.profile.name}
                      <span className="text-xs font-semibold text-amber-200">({studentDetails.profile.rollNo})</span>
                    </h3>
                    <p className="text-amber-200 text-xs mt-1.5">
                      {studentDetails.profile.department} · {studentDetails.profile.semester}
                    </p>
                    <p className="text-amber-200/90 text-[10px] mt-0.5">
                      Email: <span className="text-white font-medium">{studentDetails.profile.email}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="border border-amber-800/40 px-4 py-2 rounded-xl text-center bg-amber-955 bg-amber-950/40">
                      <p className="text-[9px] text-amber-200 font-bold uppercase tracking-wide">Streak</p>
                      <p className="text-sm font-bold text-white mt-0.5">{studentDetails.profile.streakDays} Days</p>
                    </div>
                    <div className="border border-amber-800/40 px-4 py-2 rounded-xl text-center bg-amber-955 bg-amber-950/40">
                      <p className="text-[9px] text-amber-200 font-bold uppercase tracking-wide">GPA</p>
                      <p className="text-sm font-bold text-white mt-0.5">{studentDetails.profile.gpa}</p>
                    </div>
                  </div>
                </div>

                {/* Academic Subjects Grid */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">Semester Subjects</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {studentDetails.subjects && studentDetails.subjects.map((sub) => (
                      <div key={sub.id} className="bg-white border border-amber-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-amber-900">{sub.code}</span>
                            <h4 className="font-bold text-xs text-stone-900 truncate max-w-[120px] mt-0.5">{sub.name}</h4>
                          </div>
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-950 px-1.5 py-0.5 rounded">
                            Grade: {sub.grade}
                          </span>
                        </div>
                        <div className="mt-3.5 space-y-1">
                          <div className="flex justify-between text-[9px] text-amber-800">
                            <span>Syllabus: {sub.progress}%</span>
                            <span>{sub.credits} Credits</span>
                          </div>
                          <div className="w-full h-1 bg-amber-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-900 rounded-full" style={{ width: `${sub.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks Inspector / Assign Panel */}
                <div className="bg-white border border-amber-200 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">Assigned Homework & Tasks</h3>
                    <button 
                      onClick={() => setShowTaskForm(!showTaskForm)}
                      className="bg-amber-900 border border-amber-800 text-white font-bold text-[10px] px-3 py-1.5 rounded hover:bg-amber-850 transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <i className="fa-solid fa-plus text-[8px]"></i> Assign Task
                    </button>
                  </div>

                  {/* Assign Task Inline Drawer */}
                  <AnimatePresence>
                    {showTaskForm && (
                      <motion.form 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleAssignTask}
                        className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-3 overflow-hidden text-left"
                      >
                        <h4 className="text-[10px] font-bold text-stone-900 uppercase tracking-wider">Create New Task Assignment</h4>
                        
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-amber-900 uppercase tracking-wide">Task Title</label>
                          <input 
                            type="text" 
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            placeholder="Complete SQL Lab Query Homework"
                            className="w-full bg-white border border-amber-200 rounded px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-200"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-amber-900 uppercase tracking-wide">Task Description</label>
                          <textarea 
                            value={taskDesc}
                            onChange={(e) => setTaskDesc(e.target.value)}
                            placeholder="Provide deep details or instructions for this student..."
                            rows={2}
                            className="w-full bg-white border border-amber-200 rounded px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-amber-900 uppercase tracking-wide">Task Context / Type</label>
                            <select 
                              value={taskContext}
                              onChange={(e) => setTaskContext(e.target.value)}
                              className="w-full bg-white border border-amber-200 rounded px-2 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                            >
                              <option value="general">General / Institutional Task</option>
                              <optgroup label="Semester Subjects">
                                {studentDetails.subjects && studentDetails.subjects.map(s => (
                                  <option key={s.id} value={`subject:${s.id}`}>{s.code} - {s.name}</option>
                                ))}
                              </optgroup>
                              <optgroup label="Personal Categories">
                                {PERSONAL_CATEGORIES.map(cat => (
                                  <option key={cat.id} value={`personal:${cat.id}`}>{cat.name}</option>
                                ))}
                              </optgroup>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-amber-900 uppercase tracking-wide">Priority</label>
                            <select 
                              value={taskPriority}
                              onChange={(e) => setTaskPriority(e.target.value)}
                              className="w-full bg-white border border-amber-200 rounded px-2 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                            >
                              <option value="high">High</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-amber-900 uppercase tracking-wide">Due Date</label>
                            <input 
                              type="date" 
                              value={taskDueDate}
                              onChange={(e) => setTaskDueDate(e.target.value)}
                              className="w-full bg-white border border-amber-200 rounded px-2 py-1.5 text-xs text-stone-900 focus:outline-none"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-amber-900 uppercase tracking-wide">Est. Hours</label>
                            <input 
                              type="number" 
                              step="0.5"
                              value={taskHours}
                              onChange={(e) => setTaskHours(e.target.value)}
                              placeholder="2.0"
                              className="w-full bg-white border border-amber-200 rounded px-2 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-200"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button 
                            type="submit"
                            className="bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs px-4 py-2 rounded cursor-pointer transition-colors shadow-sm"
                          >
                            Assign To Student
                          </button>
                          <button 
                            type="button"
                            onClick={() => setShowTaskForm(false)}
                            className="bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs px-4 py-2 rounded cursor-pointer transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Tasks List */}
                  {(!studentDetails.tasks || studentDetails.tasks.length === 0) ? (
                    <div className="text-center py-6 text-amber-800 text-xs">
                      This student currently has no assigned tasks.
                    </div>
                  ) : (
                    <div className="divide-y divide-amber-100">
                      {studentDetails.tasks.map((task) => (
                        <div key={task.id} className="py-3 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-stone-900">{task.title}</h4>
                              <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                task.status === 'done' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : task.status === 'inprogress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}>
                                {task.status === 'done' ? 'Done' : task.status === 'inprogress' ? 'In Progress' : 'To Do'}
                              </span>
                              <span className={`text-[8px] font-bold uppercase ${
                                task.priority === 'high' 
                                  ? 'text-rose-700 font-extrabold' 
                                  : task.priority === 'medium'
                                  ? 'text-amber-800'
                                  : 'text-amber-600'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                            <p className="text-[10px] text-amber-800/80 mt-1">{task.description || 'No description provided'}</p>
                            <p className="text-[9px] text-amber-700 mt-0.5">
                              Due Date: <span className="text-amber-900 font-medium">{task.dueDate || 'None'}</span> · Est: <span className="text-amber-900 font-medium">{task.estimatedHours}h</span>
                            </p>
                          </div>
                          
                          <button
                            onClick={async () => {
                              if (window.confirm('Delete this task for the student?')) {
                                try {
                                  await api.deleteTask(task.id);
                                  handleSelectStudent(selectedStudent); // Refresh
                                } catch (err) {
                                  setError('Failed to delete task.');
                                }
                              }
                            }}
                            className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[10px] text-rose-750 font-bold px-2.5 py-1.5 rounded cursor-pointer transition-colors"
                          >
                            Delete Task
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Class Schedule / Timetable */}
                <div className="bg-white border border-amber-200 rounded-2xl p-5 space-y-3 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">Class Timetable</h3>
                  {(!studentDetails.schedule || studentDetails.schedule.length === 0) ? (
                    <div className="text-center py-6 text-amber-800 text-xs">
                      No scheduled lectures or labs for this student.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                      {studentDetails.schedule.map((item) => (
                        <div key={item.id} className="bg-amber-50/50 border border-amber-150 rounded-xl p-3 flex justify-between items-center">
                          <div>
                            <p className="text-[9px] font-bold text-amber-900 uppercase tracking-wide">{item.day}</p>
                            <p className="text-xs font-bold text-stone-900 mt-0.5">Room {item.room}</p>
                            <p className="text-[10px] text-amber-700">{item.startTime} - {item.endTime}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                            item.type === 'lab' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>

      </div>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal
            student={adminProfile}
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={handleUpdateAdminProfile}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;
