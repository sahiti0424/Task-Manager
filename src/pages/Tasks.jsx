import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TaskCard from '../components/features/TaskCard';
import Badge from '../components/ui/Badge';
import { subjects as mockSubjects, personalCategories, priorityMeta, statusMeta } from '../data/mock';

const cardStyle = { boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' };

const STATUSES = ['All', 'To Do', 'In Progress', 'Done'];
const PRIORITIES = ['All', 'High', 'Medium', 'Low'];

const KanbanCol = ({ title, tasks, onStatusToggle }) => (
  <div className="flex-1 min-w-80 md:min-w-64 bg-amber-50 rounded-lg border border-amber-200 p-4" style={cardStyle}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wide">{title}</h3>
      <span className="text-xs font-bold text-amber-500 bg-white border border-amber-200 w-5 h-5 rounded flex items-center justify-center">{tasks.length}</span>
    </div>
    <div className="space-y-2">
      {tasks.map((t, i) => <TaskCard key={t.id} task={t} onStatusToggle={onStatusToggle} index={i} />)}
      {tasks.length === 0 && (
        <div className="text-center py-8 text-xs text-amber-500">
          <i className="fa-regular fa-rectangle-list text-2xl mb-2 text-amber-200 block"></i>
          No tasks
        </div>
      )}
    </div>
  </div>
);

const Tasks = ({ tasks, onStatusToggle, onAddTask, subjects = mockSubjects }) => {
  const [view, setView] = useState('list');
  const [typeFilter, setTypeFilter] = useState('All'); // All, Subject, Personal
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = tasks.filter(t => {
    const statusMap = { 'To Do': 'todo', 'In Progress': 'inprogress', 'Done': 'done' };
    if (statusFilter !== 'All' && t.status !== statusMap[statusFilter]) return false;
    if (priorityFilter !== 'All' && t.priority !== priorityFilter.toLowerCase()) return false;
    if (typeFilter === 'Subject' && !t.subject) return false;
    if (typeFilter === 'Personal' && !t.personalCategory) return false;
    if (subjectFilter !== 'All' && t.subject !== subjectFilter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    todo: tasks.filter(t => t.status === 'todo').length,
    inprogress: tasks.filter(t => t.status === 'inprogress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  const personalCount = tasks.filter(t => t.personalCategory).length;

  return (
    <div className="p-3 md:p-6 space-y-5 max-w-7xl">
      {/* Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4">
        {[
          { label: 'To Do', count: counts.todo, icon: 'fa-circle' },
          { label: 'In Progress', count: counts.inprogress, icon: 'fa-circle-half-stroke' },
          { label: 'Done', count: counts.done, icon: 'fa-circle-check' },
          { label: 'Personal', count: personalCount, icon: 'fa-user-check' },
        ].map(({ label, count, icon }) => (
          <div key={label} className="bg-amber-50 rounded-lg border border-amber-200 px-3 md:px-5 py-3 md:py-4 flex flex-col md:flex-row md:items-center md:gap-3">
            <i className={`fa-solid ${icon} text-amber-500 text-sm`}></i>
            <div className="mt-1 md:mt-0">
              <p className="text-lg font-bold text-stone-900 leading-none">{count}</p>
              <p className="text-xs text-amber-600 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* View toggle */}
        <div className="flex bg-amber-100 rounded-md p-0.5 gap-0.5">
          <button onClick={() => setView('list')} className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded text-xs font-medium transition-all ${view === 'list' ? 'bg-white shadow-sm text-stone-900' : 'text-amber-700'}`}>
            <i className="fa-solid fa-list"></i> <span className="hidden sm:inline">List</span>
          </button>
          <button onClick={() => setView('kanban')} className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded text-xs font-medium transition-all ${view === 'kanban' ? 'bg-white shadow-sm text-stone-900' : 'text-amber-700'}`}>
            <i className="fa-solid fa-table-columns"></i> <span className="hidden sm:inline">Kanban</span>
          </button>
        </div>

        {/* Search - hidden on very small screens */}
        <div className="relative hidden sm:block">
          <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-500 text-[10px]"></i>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."
            className="pl-7 pr-3 py-1.5 text-xs border border-amber-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-900 w-36 md:w-40" />
        </div>

        {/* Type filter */}
        <div className="flex bg-amber-100 rounded-md p-0.5 gap-0.5 flex-wrap">
          {['All', ...(subjects.length > 0 ? ['Subject'] : []), 'Personal'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-2 py-1.5 rounded text-xs font-medium transition-all whitespace-nowrap ${typeFilter === t ? 'bg-white shadow-sm text-stone-900' : 'text-amber-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Status + Priority filters */}
        {[
          { val: statusFilter, set: setStatusFilter, opts: STATUSES },
          { val: priorityFilter, set: setPriorityFilter, opts: PRIORITIES },
        ].map((f, i) => (
          <select key={i} value={f.val} onChange={e => f.set(e.target.value)}
            className="px-2 py-1.5 text-xs border border-amber-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-900 text-stone-700">
            {f.opts.map(o => <option key={o}>{o}</option>)}
          </select>
        ))}

        {/* Subject filter — only show when not filtering Personal */}
        {typeFilter !== 'Personal' && (
          <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}
            className="px-2 py-1.5 text-xs border border-amber-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-900 text-stone-700">
            <option value="All">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.code}</option>)}
          </select>
        )}

        <span className="text-xs text-amber-500 ml-auto">{filtered.length} tasks</span>

        <button onClick={onAddTask}
          className="flex items-center gap-1.5 bg-amber-900 hover:bg-amber-700 text-white text-xs font-medium px-2 md:px-3 py-1.5 rounded-md transition-colors flex-shrink-0">
          <i className="fa-solid fa-plus text-[10px]"></i> <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>

      {/* Content */}
      {view === 'list' ? (
        <div className="bg-white rounded-lg border border-amber-200 overflow-hidden" style={cardStyle}>
          {filtered.length > 0 ? (
            <div className="divide-y divide-amber-100">
              {filtered.map((task, i) => (
                <div key={task.id} className="px-3 md:px-4 py-1.5">
                  <TaskCard task={task} onStatusToggle={onStatusToggle} index={i} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-amber-500">
              <i className="fa-solid fa-inbox text-4xl mb-3 text-amber-200"></i>
              <p className="text-sm font-medium text-amber-600">No tasks match your filters</p>
              <p className="text-xs text-amber-500 mt-1">Try adjusting or clearing your filters</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          <KanbanCol title="To Do" tasks={filtered.filter(t => t.status === 'todo')} onStatusToggle={onStatusToggle} />
          <KanbanCol title="In Progress" tasks={filtered.filter(t => t.status === 'inprogress')} onStatusToggle={onStatusToggle} />
          <KanbanCol title="Done" tasks={filtered.filter(t => t.status === 'done')} onStatusToggle={onStatusToggle} />
        </div>
      )}
    </div>
  );
};

export default Tasks;
