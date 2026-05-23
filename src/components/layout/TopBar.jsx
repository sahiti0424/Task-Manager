import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const pageTitles = {
  '/': 'Dashboard',
  '/tasks': 'My Tasks',
  '/progress': 'Progress & Analytics',
  '/schedule': 'Weekly Schedule',
  '/profile': 'Profile & Settings',
};

const TopBar = ({ onAddTask, sidebarCollapsed, onMobileMenuToggle, isMobile }) => {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || 'StudyDesk';

  return (
    <header
      className="h-14 bg-amber-50 border-b border-amber-200 flex items-center justify-between px-3 md:px-6 sticky top-0 z-30 transition-all duration-300"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {isMobile && (
          <motion.button
            onClick={onMobileMenuToggle}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md text-amber-700 hover:bg-amber-100 transition-colors"
            title="Toggle Menu"
          >
            <i className="fa-solid fa-bars text-sm"></i>
          </motion.button>
        )}
        
        <motion.h1
          key={title}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm font-semibold text-stone-900 truncate"
        >
          {title}
        </motion.h1>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search - hidden on mobile */}
        <div className="relative hidden md:block">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 text-[11px]"></i>
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-8 pr-4 py-1.5 text-sm bg-amber-50 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent w-40 md:w-48 transition-all duration-200"
          />
        </div>

        {/* Notification */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative w-8 h-8 flex items-center justify-center rounded-md text-amber-700 hover:bg-amber-100 transition-colors flex-shrink-0"
        >
          <i className="fa-regular fa-bell text-sm"></i>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, delay: 0.5 }}
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-900 rounded-full"
          ></motion.span>
        </motion.button>

        <div className="w-px h-5 bg-amber-200 mx-1 flex-shrink-0"></div>

        {/* Add Task */}
        <motion.button
          onClick={onAddTask}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 bg-amber-900 hover:bg-amber-700 text-white text-xs font-medium px-2 md:px-3 py-2 rounded-md transition-colors flex-shrink-0"
        >
          <i className="fa-solid fa-plus text-[10px]"></i>
          <span className="hidden sm:inline">Add Task</span>
        </motion.button>
      </div>
    </header>
  );
};

export default TopBar;
