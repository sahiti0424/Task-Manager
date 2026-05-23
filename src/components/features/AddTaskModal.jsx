import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalCategories } from '../../data/mock';

const inputCls = "w-full px-3 py-2 border border-amber-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all";

const AddTaskModal = ({ onClose, onAdd, subjects = [] }) => {
  const hasSubjects = subjects && subjects.length > 0;
  const [tab, setTab] = useState(hasSubjects ? 'subject' : 'personal');
  const [form, setForm] = useState({
    title: '',
    subject: hasSubjects ? subjects[0].id : '',
    personalCategory: personalCategories[0]?.id || '',
    priority: 'medium',
    dueDate: '',
    description: '',
    status: 'todo',
    estimatedHours: 1,
  });
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Task title is required.'); return; }
    const taskData = {
      ...form,
      taskType: tab,
      subject: tab === 'subject' ? form.subject : null,
      personalCategory: tab === 'personal' ? form.personalCategory : null,
    };
    onAdd(taskData);
    onClose();
  };

  const tabsList = [
    ...(hasSubjects ? [{ key: 'subject',  label: 'Academic / Subject', icon: 'fa-graduation-cap' }] : []),
    { key: 'personal', label: 'Personal / Other Task', icon: 'fa-user-check' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="bg-amber-50 rounded-xl shadow-2xl w-full max-w-md border border-amber-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100">
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Add New Task</h3>
            <p className="text-xs text-amber-600 mt-0.5">Fill in the details below</p>
          </div>
          <motion.button onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.15 }}
            className="w-7 h-7 rounded-md hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-colors">
            <i className="fa-solid fa-xmark text-xs"></i>
          </motion.button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4">
          <div className="flex bg-amber-100 rounded-lg p-1 gap-1">
            {tabsList.map(t => (
              <button key={t.key} type="button" onClick={() => { setTab(t.key); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold transition-all ${
                  tab === t.key ? 'bg-white shadow text-stone-900' : 'text-amber-700 hover:text-amber-900'
                }`}>
                <i className={`fa-solid ${t.icon} text-[10px]`}></i>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-xs text-amber-700 bg-amber-100 border border-amber-200 rounded-md px-3 py-2">
                <i className="fa-solid fa-triangle-exclamation text-amber-600"></i>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1.5">Task Title *</label>
            <input value={form.title} onChange={e => { set('title', e.target.value); setError(''); }} autoFocus
              placeholder={tab === 'subject' ? 'e.g. Complete DS Assignment' : 'e.g. Apply to 3 companies'}
              className={inputCls + " placeholder:text-amber-200"} />
          </div>

          <AnimatePresence mode="wait">
            {tab === 'subject' ? (
              <motion.div key="subject-row" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}
                className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1.5">Subject</label>
                  <select value={form.subject} onChange={e => set('subject', e.target.value)} className={inputCls + " bg-white text-stone-900"}>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1.5">Priority</label>
                  <select value={form.priority} onChange={e => set('priority', e.target.value)} className={inputCls + " bg-white text-stone-900"}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </motion.div>
            ) : (
              <motion.div key="personal-row" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}
                className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {personalCategories.map(c => (
                      <button key={c.id} type="button" onClick={() => set('personalCategory', c.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          form.personalCategory === c.id ? 'text-white border-transparent shadow-sm' : 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-300'
                        }`}
                        style={form.personalCategory === c.id ? { backgroundColor: c.color, borderColor: c.color } : {}}>
                        <i className={`fa-solid ${c.icon} text-[10px]`}></i>
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1.5">Priority</label>
                  <select value={form.priority} onChange={e => set('priority', e.target.value)} className={inputCls + " bg-white text-stone-900"}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1.5">Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} className={inputCls + " text-stone-900"} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1.5">Est. Hours</label>
              <input type="number" min="0.5" max="24" step="0.5" value={form.estimatedHours}
                onChange={e => set('estimatedHours', parseFloat(e.target.value))} className={inputCls + " text-stone-900"} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={3} placeholder="Optional notes..." className={inputCls + " resize-none placeholder:text-amber-200"}>
            </textarea>
          </div>

          <div className="flex gap-2 pt-1">
            <motion.button type="button" onClick={onClose} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex-1 py-2 rounded-md border border-amber-200 text-sm font-medium text-amber-700 hover:bg-amber-50 transition-colors">
              Cancel
            </motion.button>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex-1 py-2 rounded-md bg-amber-900 hover:bg-amber-700 text-white text-sm font-medium transition-colors">
              Add Task
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddTaskModal;
