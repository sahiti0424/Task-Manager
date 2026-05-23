import React from 'react';
import { subjects, subjectColors } from '../../data/mock';

const SubjectCard = ({ subject }) => {
  const color = subjectColors[subject.color];
  return (
    <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-stone-900">{subject.name}</p>
          <p className="text-xs text-amber-500 mt-0.5">{subject.code} · {subject.credits} Credits</p>
        </div>
        <span className={`text-sm font-bold ${color.text} ${color.bg} px-2 py-0.5 rounded-md`}>
          {subject.grade}
        </span>
      </div>
      <div>
        <div className="flex justify-between text-xs text-amber-600 mb-1.5">
          <span>Progress</span>
          <span className="font-medium">{subject.progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${subject.progress}%`, backgroundColor: color.bar }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
