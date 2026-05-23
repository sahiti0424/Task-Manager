import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion';
import ProgressRing from '../components/ui/ProgressRing';
import { subjects as mockSubjects, student as mockStudent, completionByDay, subjectMeta } from '../data/mock';

const PIE_GRAYS = ['#18181b', '#71717a', '#d4d4d8'];
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

const Progress = ({ tasks, student = mockStudent, subjects = mockSubjects }) => {
  const done = tasks.filter(t => t.status === 'done').length;
  const total = tasks.length;
  const completionRate = total ? Math.round((done / total) * 100) : 0;

  const subjectBarData = subjects.map(s => ({
    name: s.code,
    Done: tasks.filter(t => t.subject === s.id && t.status === 'done').length,
    Pending: tasks.filter(t => t.subject === s.id && t.status !== 'done').length,
    fill: (subjectMeta[s.id] && subjectMeta[s.id].barColor) || '#71717a',
  }));

  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length },
  ];

  const tooltipStyle = { borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: 12 };

  return (
    <div className="p-3 md:p-6 space-y-6 max-w-7xl">
      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <Section delay={0.1}>
          <div className="bg-white rounded-lg border border-amber-200 p-4 md:p-6 flex flex-col items-center gap-5" style={cardStyle}>
            <div className="self-start w-full">
              <h2 className="text-sm font-semibold text-stone-900">Overall Completion</h2>
              <p className="text-xs text-amber-500 mt-0.5">{done} of {total} tasks done</p>
            </div>
            <ProgressRing value={completionRate} size={120} stroke={8} />
            <div className="grid grid-cols-2 gap-4 md:gap-6 w-full border-t border-amber-100 pt-4 text-center">
              <div>
                <p className="text-lg md:text-xl font-bold text-stone-900">{done}</p>
                <p className="text-[10px] text-amber-500 mt-0.5 uppercase tracking-wide">Completed</p>
              </div>
              <div>
                <p className="text-lg md:text-xl font-bold text-stone-900">{total - done}</p>
                <p className="text-[10px] text-amber-500 mt-0.5 uppercase tracking-wide">Remaining</p>
              </div>
            </div>
          </div>
        </Section>

        <Section delay={0.18}>
          <div className="bg-white rounded-lg border border-amber-200 p-4 md:p-6 h-full flex flex-col justify-between" style={cardStyle}>
            <div>
              <h2 className="text-sm font-semibold text-stone-900 mb-4">{student.department ? "GPA Tracker" : "Workspace Score"}</h2>
              <div className="flex items-end justify-between mb-5 flex-wrap">
                <div>
                  <p className="text-4xl md:text-5xl font-extrabold text-stone-900 leading-none">
                    {student.department ? student.gpa : (total > 0 ? (done / total * 10).toFixed(1) : '0.0')}
                  </p>
                  <p className="text-xs text-amber-500 mt-1">{student.department ? "CGPA / 10.0" : "Efficiency Score (0-10)"}</p>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 md:px-2.5 py-1.5 rounded-md flex items-center gap-1 whitespace-nowrap">
                  <i className="fa-solid fa-arrow-trend-up text-amber-400"></i> {student.department ? "+0.3 this sem" : "Live Rating"}
                </span>
              </div>
            </div>
            {subjects.length > 0 ? (
              <div className="space-y-2.5">
                {subjects.map(s => (
                  <div key={s.id} className="flex items-center justify-between text-xs">
                    <span className="text-amber-600 truncate flex-1">{s.name}</span>
                    <span className="font-bold text-stone-900 ml-3">{s.grade}</span>
                    <span className="text-amber-500 ml-2 w-5 text-right">{s.gradePoints}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-amber-400 text-xs flex flex-col items-center gap-2">
                <i className="fa-solid fa-gauge text-xl text-amber-300"></i>
                <p>Add personal tasks & finish them to improve your workspace rating!</p>
              </div>
            )}
          </div>
        </Section>

        <Section delay={0.26}>
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-amber-200 p-4 md:p-5 flex items-center gap-4" style={cardStyle}>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                <i className="fa-solid fa-bolt text-amber-600 text-xl"></i>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-stone-900 leading-none">{student.streakDays || 0}</p>
                <p className="text-xs text-amber-500 mt-0.5">Day Streak</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-amber-200 p-4 md:p-5" style={cardStyle}>
              <h2 className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide mb-3">Priority Split</h2>
              <div className="flex items-center gap-3 md:gap-4">
                <PieChart width={70} height={70}>
                  <Pie data={priorityData} cx={30} cy={30} innerRadius={18} outerRadius={32} dataKey="value" stroke="none">
                    {priorityData.map((_, i) => <Cell key={i} fill={PIE_GRAYS[i]} />)}
                  </Pie>
                </PieChart>
                <div className="space-y-2">
                  {priorityData.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PIE_GRAYS[i] }}></span>
                      <span className="text-amber-600">{p.name}</span>
                      <span className="font-bold text-stone-900 ml-auto">{p.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {subjects.length > 0 && (
        <Section delay={0.34}>
          <div className="bg-white rounded-lg border border-amber-200 p-4 md:p-6" style={cardStyle}>
            <h2 className="text-sm font-semibold text-stone-900 mb-5">Tasks by Subject</h2>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width={Math.max(600, typeof window !== 'undefined' ? window.innerWidth - 48 : 600)} height={200}>
                <BarChart data={subjectBarData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#fafafa' }} />
                  <Bar dataKey="Done" fill="#18181b" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="Pending" fill="#e4e4e7" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Section>
      )}

      <Section delay={0.42}>
        <div className="bg-white rounded-lg border border-amber-200 p-6" style={cardStyle}>
          <h2 className="text-sm font-semibold text-stone-900 mb-5">Completion Timeline</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={completionByDay}>
              <defs>
                <linearGradient id="zgrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="count" name="Tasks Done" stroke="#18181b" strokeWidth={2} fill="url(#zgrad)" dot={{ fill: '#18181b', r: 3, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Section>
    </div>
  );
};

export default Progress;
