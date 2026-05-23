import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon, label, value, sub, trend, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
    className="bg-white rounded-lg border border-amber-200 p-5 flex flex-col gap-3 cursor-default"
    style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
  >
    <div className="flex items-start justify-between">
      <div className="w-8 h-8 bg-amber-100 rounded-md flex items-center justify-center">
        <i className={`${icon} text-amber-600 text-[13px]`}></i>
      </div>
      {trend !== undefined && (
        <span className="text-[11px] font-medium flex items-center gap-1 text-amber-500">
          <i className={`fa-solid ${trend >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-[9px]`}></i>
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div>
      <motion.p
        key={value}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-bold text-stone-900 leading-none"
      >
        {value}
      </motion.p>
      <p className="text-xs font-medium text-amber-600 mt-1">{label}</p>
      {sub && <p className="text-[10px] text-amber-500 mt-0.5">{sub}</p>}
    </div>
  </motion.div>
);

export default StatCard;
