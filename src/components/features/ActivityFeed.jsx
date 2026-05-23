import React from 'react';
import { motion } from 'framer-motion';
import { activities as mockActivities } from '../../data/mock';

const ActivityFeed = ({ limit = 6, activities = mockActivities }) => {
  const items = activities.slice(0, limit);
  return (
    <div className="bg-white rounded-lg border border-amber-200 p-5">
      <h2 className="text-sm font-semibold text-stone-900 mb-4">Recent Activity</h2>
      <ul className="space-y-3">
        {items.map((act, i) => (
          <motion.li
            key={act.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            className="flex items-start gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
              <i className={`fa-solid ${act.icon} text-amber-600 text-[9px]`}></i>
            </div>
            <div>
              <p className="text-xs text-amber-800 leading-snug">{act.text}</p>
              <p className="text-[10px] text-amber-500 mt-0.5">{act.time}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;
