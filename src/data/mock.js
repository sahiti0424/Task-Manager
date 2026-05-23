// Mock data for Student Task Management System

export const student = {
  name: "Sahiti",
  rollNo: "21CS043",
  department: "Computer Science & Engineering",
  semester: "5th Semester",
  gpa: 8.7,
  degree: "B.Tech",
  year: "3rd Year",
  avatar: null,
  email: "sahiti@college.edu",
  streakDays: 7,
};

export const subjects = [
  { id: "s1", name: "Data Structures", code: "CS301", credits: 4, grade: "A",  gradePoints: 9,  progress: 78 },
  { id: "s2", name: "Computer Networks", code: "CS302", credits: 3, grade: "A+", gradePoints: 10, progress: 92 },
  { id: "s3", name: "Database Systems", code: "CS303", credits: 3, grade: "B+", gradePoints: 8,  progress: 65 },
  { id: "s4", name: "Operating Systems", code: "CS304", credits: 4, grade: "A",  gradePoints: 9,  progress: 55 },
  { id: "s5", name: "Software Engineering", code: "CS305", credits: 3, grade: "B+", gradePoints: 8,  progress: 80 },
  { id: "s6", name: "Machine Learning", code: "CS306", credits: 3, grade: "A+", gradePoints: 10, progress: 45 },
];

export const initialTasks = [
  { id: "t1",  title: "Complete DS Assignment #3",    subject: "s1", priority: "high",   status: "todo",       dueDate: "2026-05-08", estimatedHours: 3,   description: "Implement AVL tree with rotations",                createdAt: "2026-05-06" },
  { id: "t2",  title: "Read Chapter 7 — TCP/IP",      subject: "s2", priority: "medium", status: "inprogress", dueDate: "2026-05-09", estimatedHours: 2,   description: "Focus on flow control and congestion",             createdAt: "2026-05-06" },
  { id: "t3",  title: "SQL Lab Exercise",              subject: "s3", priority: "high",   status: "todo",       dueDate: "2026-05-08", estimatedHours: 2,   description: "Joins, nested queries, and indexing",              createdAt: "2026-05-07" },
  { id: "t4",  title: "OS Process Scheduling Notes",  subject: "s4", priority: "low",    status: "todo",       dueDate: "2026-05-12", estimatedHours: 1.5, description: "Summarise FCFS, SJF, Round Robin",                 createdAt: "2026-05-05" },
  { id: "t5",  title: "SRS Document Draft",            subject: "s5", priority: "high",   status: "inprogress", dueDate: "2026-05-10", estimatedHours: 4,   description: "Software Requirements Specification for mini project", createdAt: "2026-05-04" },
  { id: "t6",  title: "ML Lab — Linear Regression",   subject: "s6", priority: "medium", status: "done",       dueDate: "2026-05-07", estimatedHours: 2,   description: "Implement and evaluate on housing dataset",        createdAt: "2026-05-03" },
  { id: "t7",  title: "Revise DS Unit 4",              subject: "s1", priority: "medium", status: "done",       dueDate: "2026-05-06", estimatedHours: 2,   description: "Heaps and Graphs",                                 createdAt: "2026-05-01" },
  { id: "t8",  title: "Network Topology Diagram",      subject: "s2", priority: "low",    status: "done",       dueDate: "2026-05-05", estimatedHours: 1,   description: "Draw and label all 5 topology types",             createdAt: "2026-04-30" },
  { id: "t9",  title: "ER Diagram for Library DB",    subject: "s3", priority: "medium", status: "todo",       dueDate: "2026-05-14", estimatedHours: 2.5, description: "Create entity-relationship model",                 createdAt: "2026-05-07" },
  { id: "t10", title: "Prepare for Internal Exam",    subject: "s4", priority: "high",   status: "inprogress", dueDate: "2026-05-11", estimatedHours: 6,   description: "Chapters 1–5 revision",                           createdAt: "2026-05-07" },
];

export const schedule = [
  { id: "sc1",  subject: "s1", day: "Monday",    startTime: "09:00", endTime: "10:00", room: "CSE-201", type: "lecture" },
  { id: "sc2",  subject: "s2", day: "Monday",    startTime: "11:00", endTime: "12:00", room: "CSE-301", type: "lecture" },
  { id: "sc3",  subject: "s3", day: "Tuesday",   startTime: "09:00", endTime: "11:00", room: "DB-Lab",  type: "lab"     },
  { id: "sc4",  subject: "s4", day: "Tuesday",   startTime: "14:00", endTime: "15:00", room: "CSE-202", type: "lecture" },
  { id: "sc5",  subject: "s5", day: "Wednesday", startTime: "10:00", endTime: "11:00", room: "CSE-301", type: "lecture" },
  { id: "sc6",  subject: "s1", day: "Wednesday", startTime: "14:00", endTime: "16:00", room: "DS-Lab",  type: "lab"     },
  { id: "sc7",  subject: "s6", day: "Thursday",  startTime: "09:00", endTime: "10:00", room: "ML-Lab",  type: "lecture" },
  { id: "sc8",  subject: "s2", day: "Thursday",  startTime: "11:00", endTime: "12:00", room: "CSE-201", type: "lecture" },
  { id: "sc9",  subject: "s4", day: "Friday",    startTime: "09:00", endTime: "10:00", room: "CSE-202", type: "lecture" },
  { id: "sc10", subject: "s6", day: "Friday",    startTime: "13:00", endTime: "15:00", room: "ML-Lab",  type: "lab"     },
];

export const activities = [
  { id: "a1", type: "completed", text: "Completed ML Lab — Linear Regression",  time: "2 hours ago",  icon: "fa-circle-check"  },
  { id: "a2", type: "added",     text: "Added task: ER Diagram for Library DB",  time: "3 hours ago",  icon: "fa-circle-plus"   },
  { id: "a3", type: "started",   text: "Started: Prepare for Internal Exam",     time: "5 hours ago",  icon: "fa-circle-play"   },
  { id: "a4", type: "due",       text: "SQL Lab Exercise due tomorrow",           time: "Yesterday",    icon: "fa-clock"         },
  { id: "a5", type: "completed", text: "Completed Network Topology Diagram",      time: "2 days ago",   icon: "fa-circle-check"  },
  { id: "a6", type: "completed", text: "Completed Revise DS Unit 4",              time: "2 days ago",   icon: "fa-circle-check"  },
];

export const completionByDay = [
  { day: "Apr 28", count: 1 },
  { day: "Apr 29", count: 0 },
  { day: "Apr 30", count: 2 },
  { day: "May 1",  count: 1 },
  { day: "May 2",  count: 3 },
  { day: "May 3",  count: 1 },
  { day: "May 4",  count: 0 },
  { day: "May 5",  count: 2 },
  { day: "May 6",  count: 3 },
  { day: "May 7",  count: 2 },
];

// Mono palette — all subjects use zinc/slate tones, differentiated by shade
export const subjectMeta = {
  s1: { short: "DS",  barColor: "#6366f1" },
  s2: { short: "CN",  barColor: "#0ea5e9" },
  s3: { short: "DB",  barColor: "#f59e0b" },
  s4: { short: "OS",  barColor: "#10b981" },
  s5: { short: "SE",  barColor: "#f43f5e" },
  s6: { short: "ML",  barColor: "#a855f7" },
};

export const priorityMeta = {
  high:   { label: "High",   bg: "bg-rose-50",   text: "text-rose-700"   },
  medium: { label: "Medium", bg: "bg-amber-50",  text: "text-amber-700"  },
  low:    { label: "Low",    bg: "bg-amber-50",  text: "text-amber-600"  },
};

export const statusMeta = {
  todo:       { label: "To Do",       bg: "bg-amber-50",   text: "text-amber-600"   },
  inprogress: { label: "In Progress", bg: "bg-blue-50",     text: "text-blue-700"    },
  done:       { label: "Done",        bg: "bg-emerald-50",  text: "text-emerald-700" },
};

export const getSubjectById = (id) => subjects.find(s => s.id === id);

// Personal / custom task categories (not tied to a semester subject)
export const personalCategories = [
  { id: "p1", name: "Personal",      icon: "fa-user",            color: "#64748b" },
  { id: "p2", name: "Placement Prep",icon: "fa-briefcase",       color: "#6366f1" },
  { id: "p3", name: "Health",        icon: "fa-heart-pulse",     color: "#f43f5e" },
  { id: "p4", name: "Project",       icon: "fa-diagram-project", color: "#10b981" },
  { id: "p5", name: "Reading",       icon: "fa-book-open",       color: "#f59e0b" },
  { id: "p6", name: "Other",         icon: "fa-ellipsis",        color: "#a855f7" },
];

export const personalCategoryMeta = Object.fromEntries(
  personalCategories.map(c => [c.id, c])
);

export const getPersonalCategoryById = (id) => personalCategories.find(c => c.id === id);
