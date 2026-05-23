import React from 'react';

const Badge = ({ children, bg = 'bg-amber-100', text = 'text-amber-700' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-semibold tracking-wide ${bg} ${text}`}>
    {children}
  </span>
);

export default Badge;
