import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import AddTaskModal from './components/features/AddTaskModal';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Progress from './pages/Progress';
import Schedule from './pages/Schedule';
import Profile from './pages/Profile';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { api } from './services/api';

// Page transition wrapper
const PageWrapper = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

const AppShell = ({ user, onLogout, onProfileUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [activities, setActivities] = useState([]);
  const [studentProfile, setStudentProfile] = useState(user);

  const handleUpdateProfile = async (updatedData) => {
    const updated = await api.updateProfile(updatedData);
    setStudentProfile(updated);
    if (onProfileUpdate) {
      onProfileUpdate(updated);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);

  // Handle mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      // Fetch details from backend
      const tasksData = await api.getTasks();
      const subjectsData = await api.getSubjects();
      const scheduleData = await api.getSchedule();
      const profileData = await api.getMe();
      const activitiesData = await api.getActivities();

      setTasks(tasksData);
      setSubjects(subjectsData);
      setSchedule(scheduleData);
      setStudentProfile(profileData);
      setActivities(activitiesData);
    } catch (err) {
      console.error('Failed to load student data from MySQL backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleAddTask = async (task) => {
    try {
      const created = await api.createTask({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        estimatedHours: parseFloat(task.estimatedHours) || 0,
        subjectId: task.subject || null,
        personalCategory: task.personalCategory || null
      });
      // Prepend to tasks
      setTasks(prev => [created, ...prev]);

      // Re-fetch profile and activities dynamically for real-time counters and streak
      const updatedProfile = await api.getMe();
      const updatedActivities = await api.getActivities();
      setStudentProfile(updatedProfile);
      setActivities(updatedActivities);
    } catch (err) {
      alert('Error creating task: ' + err.message);
    }
  };

  const handleStatusToggle = async (id) => {
    try {
      const updated = await api.toggleTask(id);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));

      // Re-fetch profile and activities dynamically for real-time counters and streak
      const updatedProfile = await api.getMe();
      const updatedActivities = await api.getActivities();
      setStudentProfile(updatedProfile);
      setActivities(updatedActivities);
    } catch (err) {
      alert('Error updating task: ' + err.message);
    }
  };

  const sidebarWidth = sidebarCollapsed ? 64 : 256;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff7ed] flex flex-col items-center justify-center text-stone-900 gap-3">
        <i className="fa-solid fa-spinner animate-spin text-2xl text-amber-800"></i>
        <p className="text-xs font-semibold text-stone-900/80">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-amber-50">
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          onLogout={onLogout}
          student={studentProfile}
        />
      </div>

      {/* Mobile sidebar overlay - shown only on mobile when opened */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-30 md:hidden"
            />
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 left-0 h-screen w-64 z-40 md:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                collapsed={false}
                onToggle={() => setSidebarOpen(false)}
                onLogout={onLogout}
                student={studentProfile}
                isMobileDrawer={true}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ paddingLeft: isMobile ? 0 : sidebarWidth }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1 flex flex-col min-h-screen"
      >
        <TopBar 
          onAddTask={() => setShowAddModal(true)} 
          sidebarCollapsed={sidebarCollapsed}
          onMobileMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          isMobile={isMobile}
        />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <PageWrapper>
                  <Dashboard
                    tasks={tasks}
                    onStatusToggle={handleStatusToggle}
                    onAddTask={() => setShowAddModal(true)}
                    student={studentProfile}
                    subjects={subjects}
                    activities={activities}
                  />
                </PageWrapper>
              } />
              <Route path="/tasks" element={
                <PageWrapper>
                  <Tasks
                    tasks={tasks}
                    onStatusToggle={handleStatusToggle}
                    onAddTask={() => setShowAddModal(true)}
                    subjects={subjects}
                  />
                </PageWrapper>
              } />
              <Route path="/progress" element={
                <PageWrapper>
                  <Progress
                    tasks={tasks}
                    student={studentProfile}
                    subjects={subjects}
                  />
                </PageWrapper>
              } />
              <Route path="/schedule" element={
                <PageWrapper>
                  <Schedule
                    tasks={tasks}
                    schedule={schedule}
                    subjects={subjects}
                  />
                </PageWrapper>
              } />
              <Route path="/profile" element={
                <PageWrapper>
                  <Profile
                    student={studentProfile}
                    subjects={subjects}
                    onUpdateProfile={handleUpdateProfile}
                  />
                </PageWrapper>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </motion.div>

      <AnimatePresence>
        {showAddModal && (
          <AddTaskModal onClose={() => setShowAddModal(false)} onAdd={handleAddTask} subjects={subjects} />
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const checkAuth = async () => {
    if (api.isAuthenticated()) {
      try {
        const currentUser = await api.getMe();
        setUser(currentUser);
      } catch (err) {
        console.error('Session expired or connection failed');
        api.logout();
        setUser(null);
      }
    }
    setInitializing(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-[#fff7ed] flex items-center justify-center text-stone-900">
        <i className="fa-solid fa-spinner animate-spin text-xl mr-2 text-amber-800"></i> Initializing Academica...
      </div>
    );
  }

  return (
    <BrowserRouter>
      {user ? (
        user.role === 'admin' ? (
          <AdminDashboard user={user} onLogout={handleLogout} onProfileUpdate={handleLoginSuccess} />
        ) : (
          <AppShell user={user} onLogout={handleLogout} onProfileUpdate={handleLoginSuccess} />
        )
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </BrowserRouter>
  );
}

export default App;
