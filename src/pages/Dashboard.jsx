import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatCard from '../components/ui/StatCard';
import ActivityFeed from '../components/features/ActivityFeed';
import TaskCard from '../components/features/TaskCard';
import { subjects as mockSubjects, student as mockStudent, subjectMeta } from '../data/mock';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const today = new Date();
const todayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;
const greetHour = today.getHours();
const greeting = greetHour < 12 ? 'Good morning' : greetHour < 17 ? 'Good afternoon' : 'Good evening';

// Reusable section fade-in
const Section = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {children}
  </motion.div>
);

// Card shadow level 1 — subtle resting state
const cardStyle = { boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' };

const Dashboard = ({ tasks, onStatusToggle, onAddTask, student = mockStudent, subjects = mockSubjects, activities }) => {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const dueToday = tasks.filter(t =>
    t.dueDate && new Date(t.dueDate).toDateString() === today.toDateString() && t.status !== 'done'
  ).length;

  const todayFocus = tasks
    .filter(t => t.status !== 'done')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  const upcomingTasks = tasks
    .filter(t => t.status !== 'done')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  return (
    <div className="p-3 md:p-6 space-y-6 max-w-7xl">

      {/* Welcome Bar */}
      <Section delay={0}>
        <div className="bg-amber-900 rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
          <div>
            <p className="text-amber-200 text-xs font-medium">{greeting}</p>
            <h2 className="text-lg md:text-xl font-bold text-white mt-0.5 flex items-center gap-2">
              <i className="fa-solid fa-hand-wave text-amber-300 text-base"></i>
              <span className="truncate">{student.name}</span>
            </h2>
            {(student.department || student.semester) ? (
              <p className="text-amber-200 text-xs mt-1">
                {[student.department, student.semester].filter(Boolean).join(' · ')}
              </p>
            ) : (
              <p className="text-amber-200 text-xs mt-1">Universal Task Workspace</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 md:px-4 py-2">
              <i className="fa-solid fa-bolt text-amber-300 text-sm"></i>
              <span className="text-sm font-medium text-amber-200 truncate">{student.streakDays || 0}-day streak</span>
            </div>
            <button onClick={onAddTask}
              className="flex items-center gap-2 bg-white text-stone-900 text-xs font-semibold px-3 md:px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors duration-200 cursor-pointer whitespace-nowrap">
              <i className="fa-solid fa-plus text-[10px]"></i> Add Task
            </button>
          </div>
        </div>
      </Section>

      {/* KPI Cards */}
      <Section delay={0.08}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard index={0} icon="fa-solid fa-layer-group" label="Total Tasks" value={total} sub="All projects" trend={12} />
          <StatCard index={1} icon="fa-solid fa-circle-check" label="Completed" value={done} sub={`${total > 0 ? Math.round((done / total) * 100) : 0}% done`} trend={8} />
          <StatCard index={2} icon="fa-regular fa-clock" label="Due Today" value={dueToday} sub="Needs attention" />
          <StatCard index={3} icon="fa-solid fa-star"
            label={student.department ? "Current GPA" : "Performance Rating"}
            value={student.department ? (student.gpa || '0.00') : (total > 0 ? (done / total * 10).toFixed(1) : '0.0')}
            sub={student.department ? "Out of 10.0" : "Productivity rating"}
            trend={5}
          />
        </div>
      </Section>

      {/* Week Strip */}
      <Section delay={0.16}>
        <div className="bg-white rounded-lg border border-amber-200 p-3 md:p-5" style={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-stone-900">This Week</h2>
            <Link to="/schedule" className="text-xs font-medium text-amber-500 hover:text-stone-900 transition-colors flex items-center gap-1">
              View schedule <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </Link>
          </div>
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {DAYS.map((day, i) => {
              const isToday = i === todayIdx;
              const weekDate = new Date(today);
              weekDate.setDate(today.getDate() - todayIdx + i);
              const count = tasks.filter(t =>
                t.dueDate && new Date(t.dueDate).toDateString() === weekDate.toDateString() && t.status !== 'done'
              ).length;
              return (
                <div key={day} className={`flex flex-col items-center gap-1 md:gap-1.5 py-2 md:py-3 px-1 rounded-lg ${isToday ? 'bg-amber-900' : 'bg-amber-50'}`}>
                  <span className="text-[10px] font-medium text-amber-500">{day}</span>
                  <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-stone-900'}`}>{weekDate.getDate()}</span>
                  {count > 0 && (
                    <span className={`w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center ${isToday ? 'bg-white text-stone-900' : 'bg-amber-200 text-amber-700'}`}>
                      {count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Today's Focus + Activity */}
      <Section delay={0.22}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-lg border border-amber-200 p-4 md:p-5" style={cardStyle}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-stone-900">Today's Focus</h2>
              <Link to="/tasks" className="text-xs font-medium text-amber-500 hover:text-stone-900 transition-colors">View all</Link>
            </div>
            {todayFocus.length > 0 ? (
              <div className="space-y-2">
                {todayFocus.map((task, i) => (
                  <TaskCard key={task.id} task={task} onStatusToggle={onStatusToggle} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-amber-500">
                <i className="fa-solid fa-circle-check text-3xl mb-2 text-amber-200"></i>
                <p className="text-xs font-medium">All clear for today</p>
              </div>
            )}
          </div>
          <ActivityFeed limit={5} activities={activities} />
        </div>
      </Section>

      {/* Subject Progress */}
      {subjects.length > 0 ? (
        <Section delay={0.28}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-stone-900">Project & Subject Progress</h2>
            <Link to="/progress" className="text-xs font-medium text-amber-500 hover:text-stone-900 transition-colors flex items-center gap-1">
              Analytics <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {subjects.map((s, i) => {
              const m = subjectMeta[s.id] || { barColor: '#71717a' };
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: 0.28 + i * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
                  className="bg-white rounded-lg border border-amber-200 p-4"
                  style={cardStyle}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-stone-900">{s.code}</p>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">{s.grade}</span>
                  </div>
                  <p className="text-[10px] text-amber-500 mb-2 truncate">{s.name}</p>
                  <div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${s.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
                      style={{ backgroundColor: m.barColor }}
                    />
                  </div>
                  <p className="text-[10px] text-amber-500 mt-1.5 text-right">{s.progress}%</p>
                </motion.div>
              );
            })}
          </div>
        </Section>
      ) : (
        <Section delay={0.28}>
          <div className="bg-white rounded-xl border border-amber-200 p-8 text-center" style={cardStyle}>
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-100">
              <i className="fa-solid fa-folder-plus text-amber-300 text-lg"></i>
            </div>
            <h3 className="text-sm font-semibold text-stone-900">Welcome to your new productivity suite!</h3>
            <p className="text-xs text-amber-500 mt-1 max-w-sm mx-auto">
              Start by adding tasks under different personal categories below. It's built for college, projects, work, hobbies, or daily life!
            </p>
            <button onClick={onAddTask}
              className="mt-4 bg-amber-900 text-white hover:bg-amber-800 text-[10px] font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-sm">
              <i className="fa-solid fa-plus text-[8px]"></i> Add Your First Task
            </button>
          </div>
        </Section>
      )}

      {/* Upcoming Deadlines */}
      <Section delay={0.34}>
        <div className="bg-white rounded-lg border border-amber-200 p-5" style={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-stone-900">Upcoming Deadlines</h2>
            <Link to="/tasks" className="text-xs font-medium text-amber-500 hover:text-stone-900 transition-colors">View all</Link>
          </div>
          <div className="space-y-2">
            {upcomingTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} onStatusToggle={onStatusToggle} index={i} />
            ))}
          </div>
        </div>
      </Section>

    </div>
  );
};

export default Dashboard;
