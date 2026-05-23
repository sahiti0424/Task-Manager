import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { schedule as mockSchedule, subjects as mockSubjects } from '../data/mock';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8);
const cardStyle = { boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' };

const Section = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {children}
  </motion.div>
);

const today = new Date();
const todayName = DAYS[today.getDay() === 0 ? 6 : today.getDay() - 1];

const Schedule = ({ tasks, schedule = mockSchedule, subjects = mockSubjects }) => {
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekStart = (offset = 0) => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - (day === 0 ? 6 : day - 1) + offset * 7;
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const weekStart = getWeekStart(weekOffset);
  const weekDates = DAYS.map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const fmtTime = (t) => {
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
  };

  return (
    <div className="p-3 md:p-6 space-y-6 max-w-7xl">
      <Section delay={0.1}>
        <div className="flex items-center justify-between bg-white border border-amber-200 rounded-lg px-3 md:px-5 py-2.5 md:py-3.5" style={cardStyle}>
          <button onClick={() => setWeekOffset(w => w - 1)}
            className="w-7 md:w-8 h-7 md:h-8 rounded-md hover:bg-amber-100 flex items-center justify-center text-amber-600 hover:text-amber-900 transition-colors flex-shrink-0">
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <div className="text-center flex-1 px-2 min-w-0">
            <p className="text-xs md:text-sm font-semibold text-stone-900 truncate">
              {weekStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {weekDates[6].toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
            <p className="text-[10px] text-amber-500 mt-0.5">
              {weekOffset === 0 ? 'Current week' : weekOffset > 0 ? `+${weekOffset} week` : `${weekOffset} week`}
            </p>
          </div>
          <button onClick={() => setWeekOffset(w => w + 1)}
            className="w-7 md:w-8 h-7 md:h-8 rounded-md hover:bg-amber-100 flex items-center justify-center text-amber-600 hover:text-amber-900 transition-colors flex-shrink-0">
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </Section>

      <Section delay={0.2}>
        <div className="bg-white rounded-lg border border-amber-200 overflow-hidden" style={cardStyle}>
          <div className="overflow-x-auto">
            <div className="grid border-b border-amber-200 min-w-max md:min-w-0" style={{ gridTemplateColumns: 'auto repeat(7, minmax(60px, 1fr))' }}>
              <div className="p-2 md:p-3 border-r border-amber-100 bg-amber-50 w-12 md:w-16"></div>
              {DAYS.slice(0, 7).map((day, i) => {
                const isToday = weekOffset === 0 && day === todayName;
                return (
                  <div key={day} className={`p-2 md:p-3 text-center border-r border-amber-100 last:border-0 ${isToday ? 'bg-amber-900' : 'bg-amber-50'}`}>
                    <p className="text-[9px] md:text-[10px] font-medium uppercase tracking-wide text-amber-500">{day.slice(0, 3)}</p>
                    <p className={`text-xs md:text-sm font-bold mt-1 ${isToday ? 'text-white' : 'text-stone-900'}`}>{weekDates[i].getDate()}</p>
                  </div>
                );
              })}
            </div>

            <div className="overflow-y-auto max-h-[60vh]">
              {HOURS.map(hour => (
                <div key={hour} className="grid border-b border-amber-50 min-h-12 md:min-h-[60px] min-w-max md:min-w-0" style={{ gridTemplateColumns: 'auto repeat(7, minmax(60px, 1fr))' }}>
                  <div className="p-2 border-r border-amber-100 bg-amber-50/50 flex items-start w-12 md:w-16">
                    <span className="text-[8px] md:text-[10px] text-amber-500 font-medium">{hour % 12 || 12}{hour < 12 ? 'a' : 'p'}</span>
                  </div>
                  {DAYS.slice(0, 7).map((day, di) => {
                    const isToday = weekOffset === 0 && day === todayName;
                    const slots = schedule.filter(s => parseInt(s.startTime.split(':')[0]) === hour && s.day === day);
                    const dayDate = weekDates[di];
                    const deadlines = hour === 9 ? tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === dayDate.toDateString() && t.status !== 'done') : [];

                    return (
                      <div key={day} className={`border-r border-amber-50 last:border-0 p-1 ${isToday ? 'bg-amber-50/40' : ''}`}>
                        {slots.map(slot => {
                          const sub = subjects.find(s => s.id === slot.subject);
                          return (
                            <motion.div
                              key={slot.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="rounded-md p-1 mb-1 bg-amber-900 text-white shadow-sm"
                            >
                              <p className="text-[8px] md:text-[10px] font-bold truncate">{sub?.code || 'Class'}</p>
                              <p className="text-[7px] md:text-[8px] text-amber-300 hidden md:block">{slot.startTime}–{slot.endTime}</p>
                            </motion.div>
                          );
                        })}
                        {deadlines.map(t => (
                          <div key={t.id} className="rounded-md p-1 mb-1 bg-white border border-amber-200 shadow-sm">
                            <p className="text-[7px] md:text-[9px] font-semibold text-stone-900 truncate">
                              <i className="fa-solid fa-flag-checkered mr-0.5 text-amber-400"></i><span className="hidden md:inline">{t.title}</span>
                            </p>
                          </div>
                        ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {schedule.length > 0 && (
        <Section delay={0.3}>
          <div className="bg-white rounded-lg border border-amber-200 p-4 md:p-6" style={cardStyle}>
            <h2 className="text-sm font-semibold text-stone-900 mb-5">Weekly Class Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {schedule.map((s, i) => {
                const sub = subjects.find(sub => sub.id === s.subject);
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 md:p-4 rounded-lg border border-amber-100 bg-amber-50/50"
                  >
                    <div className="w-9 md:w-10 h-9 md:h-10 bg-amber-900 rounded-lg flex items-center justify-center shrink-0 shadow-md">
                      <span className="text-[10px] md:text-[11px] font-bold text-white">{sub?.code ? sub.code.slice(2) : 'CL'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-semibold text-stone-900 truncate">{sub?.name || 'Class / Event'}</p>
                      <p className="text-xs text-amber-600">{s.room} · <span className="capitalize">{s.type}</span></p>
                    </div>
                    <div className="text-right shrink-0 text-xs">
                      <p className="font-bold text-stone-900">{s.day.slice(0, 3)}</p>
                      <p className="text-[10px] text-amber-500">{fmtTime(s.startTime)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>
      )}
    </div>
  );
};

export default Schedule;
