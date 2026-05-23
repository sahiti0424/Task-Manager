import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '../ui/Badge';
import { priorityMeta, statusMeta, getSubjectById, getPersonalCategoryById } from '../../data/mock';

const TaskCard = ({ task, onStatusToggle, index = 0 }) => {
  const subject = task.subject ? getSubjectById(task.subject) : null;
  const personalCat = task.personalCategory ? getPersonalCategoryById(task.personalCategory) : null;
  const priority = priorityMeta[task.priority];
  const status = statusMeta[task.status];
  const isDone = task.status === 'done';

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isDone;
  const dueDateLabel = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDone ? 0.45 : 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.38, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ boxShadow: '0 4px 16px rgba(0,0,0,0.07)', borderColor: '#a1a1aa' }}
      layout
      className="flex items-center gap-4 p-3.5 rounded-lg border border-amber-200 bg-white transition-colors cursor-default"
    >
      {/* Checkbox */}
      <motion.button
        onClick={() => onStatusToggle && onStatusToggle(task.id)}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        className={`w-4 h-4 shrink-0 rounded border-2 flex items-center justify-center transition-all ${
          isDone ? 'bg-emerald-600 border-emerald-600' : 'border-amber-200 hover:border-amber-400'
        }`}
      >
        <AnimatePresence>
          {isDone && (
            <motion.i
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500 }}
              className="fa-solid fa-check text-white text-[7px]"
            ></motion.i>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <motion.p
          animate={{ opacity: isDone ? 0.5 : 1 }}
          className={`text-sm font-medium truncate ${isDone ? 'line-through text-amber-400' : 'text-stone-900'}`}
        >
          {task.title}
        </motion.p>
        <div className="flex items-center gap-3 mt-1">
          {subject && <span className="text-xs text-amber-500 font-medium">{subject.code}</span>}
          {personalCat && (
            <span className="text-xs font-medium flex items-center gap-1" style={{ color: personalCat.color }}>
              <i className={`fa-solid ${personalCat.icon} text-[9px]`}></i>
              {personalCat.name}
            </span>
          )}
          {dueDateLabel && (
            <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-amber-800 font-semibold' : 'text-amber-500'}`}>
              <i className="fa-regular fa-calendar text-[10px]"></i>
              {isOverdue ? 'Overdue · ' : ''}{dueDateLabel}
            </span>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Badge bg={priority.bg} text={priority.text}>{priority.label}</Badge>
        <Badge bg={status.bg} text={status.text}>{status.label}</Badge>
      </div>
    </motion.div>
  );
};

export default TaskCard;
