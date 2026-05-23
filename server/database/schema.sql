-- MySQL Workbench Database Setup Script for Student Task Management System
-- Drop database if exists and create new
CREATE DATABASE IF NOT EXISTS student_management_db;
USE student_management_db;

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student', -- 'student' or 'admin'
    rollNo VARCHAR(50),
    department VARCHAR(100),
    semester VARCHAR(50),
    degree VARCHAR(50),
    year VARCHAR(50),
    streakDays INT DEFAULT 0,
    gpa DECIMAL(3,2) DEFAULT 0.00,
    avatar VARCHAR(255) DEFAULT NULL
);

-- 2. Create Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    credits INT NOT NULL,
    grade VARCHAR(5) DEFAULT NULL,
    gradePoints INT DEFAULT 0,
    progress INT DEFAULT 0,
    studentId VARCHAR(50) NOT NULL,
    FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Create Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'high', 'medium', 'low'
    status VARCHAR(20) NOT NULL DEFAULT 'todo', -- 'todo', 'inprogress', 'done'
    dueDate DATE,
    estimatedHours DECIMAL(4,2) DEFAULT 0.00,
    createdAt DATE,
    subjectId VARCHAR(50),
    personalCategory VARCHAR(50) DEFAULT NULL,
    studentId VARCHAR(50) NOT NULL,
    FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE SET NULL
);

-- 4. Create Schedule Table
CREATE TABLE IF NOT EXISTS schedule (
    id VARCHAR(50) PRIMARY KEY,
    subjectId VARCHAR(50) NOT NULL,
    day VARCHAR(20) NOT NULL, -- 'Monday', 'Tuesday', etc.
    startTime VARCHAR(10) NOT NULL, -- '09:00'
    endTime VARCHAR(10) NOT NULL, -- '10:00'
    room VARCHAR(50),
    type VARCHAR(20) NOT NULL DEFAULT 'lecture', -- 'lecture', 'lab'
    studentId VARCHAR(50) NOT NULL,
    FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE
);

-- 5. Create Activities Table
CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'completed', 'added', 'started', etc.
    text VARCHAR(255) NOT NULL,
    time VARCHAR(50) NOT NULL, -- '2 hours ago'
    icon VARCHAR(50) NOT NULL, -- 'fa-circle-check'
    studentId VARCHAR(50) NOT NULL,
    FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- SEED MOCK DATA
-- Note: Passwords are bcrypt hashed
-- student123 -> $2a$10$vUBNZj.NIxGSsTcAilVBTeHg5uiRfiSWW5kYWG2.ICzwC6BcWXrYC
-- admin123   -> $2a$10$9fNU.2z04G7Zd0ganpd01.eNx7Ynw0axcHiGxf.hN.4/q.zd.JPUy
-- ==========================================

-- Seed Users (1 Admin, 1 Student)
INSERT INTO users (id, name, email, password, role, rollNo, department, semester, degree, year, streakDays, gpa, avatar)
VALUES 
('admin1', 'Admin Officer', 'admin@college.edu', '$2a$10$9fNU.2z04G7Zd0ganpd01.eNx7Ynw0axcHiGxf.hN.4/q.zd.JPUy', 'admin', NULL, 'Administration', NULL, NULL, NULL, 0, 0.0, NULL),
('u1', 'Sahiti', 'sahiti@college.edu', '$2a$10$vUBNZj.NIxGSsTcAilVBTeHg5uiRfiSWW5kYWG2.ICzwC6BcWXrYC', 'student', '21CS043', 'Computer Science & Engineering', '5th Semester', 'B.Tech', '3rd Year', 7, 8.7, NULL);

-- Seed Subjects for Student 'u1'
INSERT INTO subjects (id, name, code, credits, grade, gradePoints, progress, studentId)
VALUES
('s1', 'Data Structures', 'CS301', 4, 'A', 9, 78, 'u1'),
('s2', 'Computer Networks', 'CS302', 3, 'A+', 10, 92, 'u1'),
('s3', 'Database Systems', 'CS303', 3, 'B+', 8, 65, 'u1'),
('s4', 'Operating Systems', 'CS304', 4, 'A', 9, 55, 'u1'),
('s5', 'Software Engineering', 'CS305', 3, 'B+', 8, 80, 'u1'),
('s6', 'Machine Learning', 'CS306', 3, 'A+', 10, 45, 'u1');

-- Seed Tasks for Student 'u1'
INSERT INTO tasks (id, title, description, priority, status, dueDate, estimatedHours, createdAt, subjectId, studentId)
VALUES
('t1', 'Complete DS Assignment #3', 'Implement AVL tree with rotations', 'high', 'todo', '2026-05-08', 3.00, '2026-05-06', 's1', 'u1'),
('t2', 'Read Chapter 7 — TCP/IP', 'Focus on flow control and congestion', 'medium', 'inprogress', '2026-05-09', 2.00, '2026-05-06', 's2', 'u1'),
('t3', 'SQL Lab Exercise', 'Joins, nested queries, and indexing', 'high', 'todo', '2026-05-08', 2.00, '2026-05-07', 's3', 'u1'),
('t4', 'OS Process Scheduling Notes', 'Summarise FCFS, SJF, Round Robin', 'low', 'todo', '2026-05-12', 1.50, '2026-05-05', 's4', 'u1'),
('t5', 'SRS Document Draft', 'Software Requirements Specification for mini project', 'high', 'inprogress', '2026-05-10', 4.00, '2026-05-04', 's5', 'u1'),
('t6', 'ML Lab — Linear Regression', 'Implement and evaluate on housing dataset', 'medium', 'done', '2026-05-07', 2.00, '2026-05-03', 's6', 'u1'),
('t7', 'Revise DS Unit 4', 'Heaps and Graphs', 'medium', 'done', '2026-05-06', 2.00, '2026-05-01', 's1', 'u1'),
('t8', 'Network Topology Diagram', 'Draw and label all 5 topology types', 'low', 'done', '2026-05-05', 1.00, '2026-04-30', 's2', 'u1'),
('t9', 'ER Diagram for Library DB', 'Create entity-relationship model', 'medium', 'todo', '2026-05-14', 2.50, '2026-05-07', 's3', 'u1'),
('t10', 'Prepare for Internal Exam', 'Chapters 1–5 revision', 'high', 'inprogress', '2026-05-11', 6.00, '2026-05-07', 's4', 'u1');

-- Seed Schedule for Student 'u1'
INSERT INTO schedule (id, subjectId, day, startTime, endTime, room, type, studentId)
VALUES
('sc1', 's1', 'Monday', '09:00', '10:00', 'CSE-201', 'lecture', 'u1'),
('sc2', 's2', 'Monday', '11:00', '12:00', 'CSE-301', 'lecture', 'u1'),
('sc3', 's3', 'Tuesday', '09:00', '11:00', 'DB-Lab', 'lab', 'u1'),
('sc4', 's4', 'Tuesday', '14:00', '15:00', 'CSE-202', 'lecture', 'u1'),
('sc5', 's5', 'Wednesday', '10:00', '11:00', 'CSE-301', 'lecture', 'u1'),
('sc6', 's1', 'Wednesday', '14:00', '16:00', 'DS-Lab', 'lab', 'u1'),
('sc7', 's6', 'Thursday', '09:00', '10:00', 'ML-Lab', 'lecture', 'u1'),
('sc8', 's2', 'Thursday', '11:00', '12:00', 'CSE-201', 'lecture', 'u1'),
('sc9', 's4', 'Friday', '09:00', '10:00', 'CSE-202', 'lecture', 'u1'),
('sc10', 's6', 'Friday', '13:00', '15:00', 'ML-Lab', 'lab', 'u1');

-- Seed Activities for Student 'u1'
INSERT INTO activities (id, type, text, time, icon, studentId)
VALUES
('a1', 'completed', 'Completed ML Lab — Linear Regression', '2 hours ago', 'fa-circle-check', 'u1'),
('a2', 'added', 'Added task: ER Diagram for Library DB', '3 hours ago', 'fa-circle-plus', 'u1'),
('a3', 'started', 'Started: Prepare for Internal Exam', '5 hours ago', 'fa-circle-play', 'u1'),
('a4', 'due', 'SQL Lab Exercise due tomorrow', 'Yesterday', 'fa-clock', 'u1'),
('a5', 'completed', 'Completed Network Topology Diagram', '2 days ago', 'fa-circle-check', 'u1'),
('a6', 'completed', 'Completed Revise DS Unit 4', '2 days ago', 'fa-circle-check', 'u1');
