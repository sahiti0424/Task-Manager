import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { student as mockStudent } from '../../data/mock';

const navItems = [
  { to: '/', icon: 'fa-solid fa-gauge-high', label: 'Dashboard' },
  { to: '/tasks', icon: 'fa-solid fa-list-check', label: 'Tasks' },
  { to: '/progress', icon: 'fa-solid fa-chart-line', label: 'Progress' },
  { to: '/schedule', icon: 'fa-solid fa-calendar-days', label: 'Schedule' },
  { to: '/profile', icon: 'fa-solid fa-circle-user', label: 'Profile' },
];

const Sidebar = ({ collapsed, onToggle, onLogout, student = mockStudent, isMobileDrawer = false }) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed && !isMobileDrawer ? 64 : 256 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className={`${isMobileDrawer ? 'w-64' : 'fixed top-0 left-0'} h-screen bg-amber-50 border-r border-amber-200 flex flex-col z-40 overflow-hidden`}
      style={isMobileDrawer ? {} : { minWidth: collapsed ? 64 : 256 }}
    >
      {/* Brand */}
      <div className={`h-14 flex items-center border-b border-amber-100 shrink-0 transition-all duration-300 ${collapsed && !isMobileDrawer ? 'px-4 justify-center' : 'px-4 gap-3'}`}>
        <div className="w-8 h-8 bg-amber-900 rounded-lg flex items-center justify-center shrink-0">
          <i className={`fa-solid ${student.department ? 'fa-graduation-cap' : 'fa-cubes'} text-white text-xs`}></i>
        </div>

        {!collapsed && !isMobileDrawer && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden whitespace-nowrap flex-1"
          >
            <p className="text-sm font-bold text-stone-900 leading-none">StudyDesk</p>
            <p className="text-[10px] text-amber-500 mt-0.5">{student.semester || 'Active Workspace'}</p>
          </motion.div>
        )}

        {!collapsed && !isMobileDrawer && (
          <motion.button
            onClick={onToggle}
            whileHover={{ scale: 1.1, backgroundColor: '#f4f4f5' }}
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 rounded-md flex items-center justify-center text-amber-600 hover:text-amber-950 transition-colors"
            title="Collapse Sidebar"
          >
            <i className="fa-solid fa-chevron-left text-[10px]"></i>
          </motion.button>
        )}

        {isMobileDrawer && (
          <div className="flex-1">
            <p className="text-sm font-bold text-stone-900 leading-none">StudyDesk</p>
            <p className="text-[10px] text-amber-500 mt-0.5">{student.semester || 'Active Workspace'}</p>
          </div>
        )}

        {isMobileDrawer && (
          <motion.button
            onClick={onToggle}
            whileHover={{ scale: 1.1, backgroundColor: '#f4f4f5' }}
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 rounded-md flex items-center justify-center text-amber-600 hover:text-amber-950 transition-colors"
            title="Close Menu"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </motion.button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && !isMobileDrawer && (
        <div className="flex justify-center py-2 border-b border-amber-50">
          <motion.button
            onClick={onToggle}
            whileHover={{ scale: 1.1, backgroundColor: '#f4f4f5' }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-md flex items-center justify-center text-amber-600 hover:text-amber-950 transition-colors"
            title="Expand Sidebar"
          >
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
          </motion.button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto overflow-x-hidden">
        {(!collapsed || isMobileDrawer) && (
          <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest px-3 mb-2 whitespace-nowrap">
            Navigation
          </p>
        )}
        <ul className="space-y-0.5">
          {navItems.map(({ to, icon, label }, idx) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                onClick={isMobileDrawer ? onToggle : undefined}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 group overflow-hidden ${isActive ? 'bg-amber-900 text-white' : 'text-amber-700 hover:bg-amber-100 hover:text-amber-950'
                  } ${collapsed && !isMobileDrawer ? 'justify-center' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <i className={`${icon} text-[13px] shrink-0`} />
                    <motion.span
                      animate={{ opacity: collapsed && !isMobileDrawer ? 0 : 1, width: collapsed && !isMobileDrawer ? 0 : 'auto' }}
                      transition={{ duration: 0.2, delay: collapsed && !isMobileDrawer ? 0 : idx * 0.025 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {label}
                    </motion.span>
                    {collapsed && !isMobileDrawer && (
                      <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-amber-900 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
                        {label}
                        <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-amber-900" />
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User card and Logout */}
      <div className="px-2 pb-4 shrink-0 flex flex-col gap-1">
        <div className={`flex items-center gap-3 p-3 rounded-md border border-amber-200 bg-amber-50 overflow-hidden ${collapsed && !isMobileDrawer ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-user text-amber-700 text-xs"></i>
          </div>
          <motion.div
            animate={{ opacity: collapsed && !isMobileDrawer ? 0 : 1, width: collapsed && !isMobileDrawer ? 0 : 'auto' }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap min-w-0"
          >
            <p className="text-sm font-semibold text-stone-900 leading-none truncate max-w-[140px]">{student.name}</p>
            <p className="text-xs text-amber-500 mt-0.5">{student.rollNo || 'Standard Account'}</p>
          </motion.div>
        </div>

        {(!collapsed || isMobileDrawer) && onLogout && (
          <button
            onClick={onLogout}
            className="w-full bg-amber-100 hover:bg-amber-200/80 border border-amber-200 text-amber-700 font-semibold text-xs py-2 rounded-md transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer mt-1"
          >
            Sign Out <i className="fa-solid fa-arrow-right-from-bracket text-[10px]"></i>
          </button>
        )}

        {collapsed && !isMobileDrawer && onLogout && (
          <button
            onClick={onLogout}
            title="Sign Out"
            className="w-8 h-8 rounded-md bg-amber-100 hover:bg-amber-200 border border-amber-200 flex items-center justify-center text-amber-700 hover:text-amber-950 transition-colors mx-auto cursor-pointer mt-1"
          >
            <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
          </button>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
