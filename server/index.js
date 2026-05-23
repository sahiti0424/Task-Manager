import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool, { testConnection } from './config/db.js';
import { verifyToken, restrictToAdmin } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Run DB Diagnostic
testConnection();

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'student_management_secret_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Remove password from response
    delete user.password;

    res.json({
      token,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, rollNo, department, semester, degree, year } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    // Check if email already exists
    const [emailCheck] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (emailCheck.length > 0) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const userId = `u${Date.now()}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert User Account (100% fresh - no default subjects seeded!)
    await pool.query(
      'INSERT INTO users (id, name, email, password, role, rollNo, department, semester, degree, year, streakDays, gpa) VALUES (?, ?, ?, ?, "student", ?, ?, ?, ?, ?, 0, 0.00)',
      [userId, name, email, hashedPassword, rollNo || null, department || null, semester || null, degree || null, year || null]
    );

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    const user = rows[0];
    delete user.password;

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'student_management_secret_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      token,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    delete user.password;

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});


// ==========================================
// STUDENT TASK ENDPOINTS
// ==========================================

// GET /api/tasks
app.get('/api/tasks', verifyToken, async (req, res) => {
  const studentId = req.user.role === 'admin' && req.query.studentId ? req.query.studentId : req.user.id;
  try {
    const [rows] = await pool.query('SELECT *, subjectId as subject FROM tasks WHERE studentId = ? ORDER BY dueDate ASC', [studentId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// POST /api/tasks
app.post('/api/tasks', verifyToken, async (req, res) => {
  const { title, description, priority, status, dueDate, estimatedHours, subjectId, personalCategory } = req.body;
  const studentId = req.user.role === 'admin' && req.body.studentId ? req.body.studentId : req.user.id;

  if (!title) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  const taskId = `t${Date.now()}`;
  const createdAt = new Date().toISOString().split('T')[0];

  try {
    await pool.query(
      'INSERT INTO tasks (id, title, description, priority, status, dueDate, estimatedHours, createdAt, subjectId, personalCategory, studentId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [taskId, title, description || null, priority || 'medium', status || 'todo', dueDate || null, estimatedHours || 0.00, createdAt, subjectId || null, personalCategory || null, studentId]
    );

    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    
    // Log Activity
    const actId = `a${Date.now()}`;
    await pool.query(
      'INSERT INTO activities (id, type, text, time, icon, studentId) VALUES (?, ?, ?, ?, ?, ?)',
      [actId, 'added', `Added task: ${title}`, 'Just now', 'fa-circle-plus', studentId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// PUT /api/tasks/:id
app.put('/api/tasks/:id', verifyToken, async (req, res) => {
  const taskId = req.params.id;
  const { title, description, priority, status, dueDate, estimatedHours, subjectId, personalCategory } = req.body;
  const studentId = req.user.role === 'admin' ? req.body.studentId : req.user.id;

  try {
    // Verify ownership if not admin
    if (req.user.role !== 'admin') {
      const [ownerCheck] = await pool.query('SELECT id FROM tasks WHERE id = ? AND studentId = ?', [taskId, studentId]);
      if (ownerCheck.length === 0) {
        return res.status(403).json({ message: 'Forbidden. You do not own this task.' });
      }
    }

    await pool.query(
      'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, dueDate = ?, estimatedHours = ?, subjectId = ?, personalCategory = ? WHERE id = ?',
      [title, description || null, priority || 'medium', status || 'todo', dueDate || null, estimatedHours || 0.00, subjectId || null, personalCategory || null, taskId]
    );

    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// PUT /api/tasks/:id/toggle
app.put('/api/tasks/:id/toggle', verifyToken, async (req, res) => {
  const taskId = req.params.id;
  const studentId = req.user.id;

  try {
    // Verify ownership
    const [ownerCheck] = await pool.query('SELECT status, title FROM tasks WHERE id = ? AND studentId = ?', [taskId, studentId]);
    if (ownerCheck.length === 0) {
      return res.status(403).json({ message: 'Forbidden. You do not own this task.' });
    }

    const currentStatus = ownerCheck[0].status;
    const taskTitle = ownerCheck[0].title;
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';

    await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [newStatus, taskId]);

    // Log Activity & Update Streak
    if (newStatus === 'done') {
      // Increment streakDays
      await pool.query('UPDATE users SET streakDays = streakDays + 1 WHERE id = ?', [studentId]);

      const actId = `a${Date.now()}`;
      await pool.query(
        'INSERT INTO activities (id, type, text, time, icon, studentId) VALUES (?, ?, ?, ?, ?, ?)',
        [actId, 'completed', `Completed: ${taskTitle}`, 'Just now', 'fa-circle-check', studentId]
      );
    } else {
      // Decrement streakDays (ensuring it doesn't go below 0)
      await pool.query('UPDATE users SET streakDays = GREATEST(0, CAST(streakDays AS SIGNED) - 1) WHERE id = ?', [studentId]);
    }

    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error toggling task' });
  }
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', verifyToken, async (req, res) => {
  const taskId = req.params.id;
  const studentId = req.user.id;

  try {
    // Verify ownership if not admin
    if (req.user.role !== 'admin') {
      const [ownerCheck] = await pool.query('SELECT id FROM tasks WHERE id = ? AND studentId = ?', [taskId, studentId]);
      if (ownerCheck.length === 0) {
        return res.status(403).json({ message: 'Forbidden. You do not own this task.' });
      }
    }

    await pool.query('DELETE FROM tasks WHERE id = ?', [taskId]);
    res.json({ message: 'Task deleted successfully', taskId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting task' });
  }
});


// ==========================================
// STUDENT SUBJECTS ENDPOINTS
// ==========================================

// GET /api/subjects
app.get('/api/subjects', verifyToken, async (req, res) => {
  const studentId = req.user.role === 'admin' && req.query.studentId ? req.query.studentId : req.user.id;
  try {
    const [rows] = await pool.query('SELECT * FROM subjects WHERE studentId = ?', [studentId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching subjects' });
  }
});


// ==========================================
// STUDENT SCHEDULE ENDPOINTS
// ==========================================

// GET /api/schedule
app.get('/api/schedule', verifyToken, async (req, res) => {
  const studentId = req.user.role === 'admin' && req.query.studentId ? req.query.studentId : req.user.id;
  try {
    const [rows] = await pool.query('SELECT *, subjectId as subject FROM schedule WHERE studentId = ?', [studentId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching schedule' });
  }
});


// ==========================================
// STUDENT ACTIVITIES ENDPOINTS
// ==========================================

// GET /api/activities
app.get('/api/activities', verifyToken, async (req, res) => {
  const studentId = req.user.role === 'admin' && req.query.studentId ? req.query.studentId : req.user.id;
  try {
    const [rows] = await pool.query('SELECT * FROM activities WHERE studentId = ? ORDER BY id DESC LIMIT 20', [studentId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching activities' });
  }
});


// ==========================================
// STUDENT PROFILE ENDPOINTS
// ==========================================

// PUT /api/profile
app.put('/api/profile', verifyToken, async (req, res) => {
  const studentId = req.user.id;
  const { name, email, department, semester, degree, year, password, oldPassword } = req.body;

  try {
    // If updating email, check for uniqueness
    if (email) {
      const [emailCheck] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, studentId]);
      if (emailCheck.length > 0) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    // Verify current password if changing password
    if (password && password.trim() !== '') {
      if (!oldPassword || oldPassword.trim() === '') {
        return res.status(400).json({ message: 'Old password is required to change password' });
      }

      const [userRows] = await pool.query('SELECT password FROM users WHERE id = ?', [studentId]);
      if (userRows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(oldPassword, userRows[0].password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }
    }

    // Build update query dynamically
    let query = 'UPDATE users SET name = ?, email = ?, department = ?, semester = ?, degree = ?, year = ?';
    const params = [name, email, department, semester, degree, year];

    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(studentId);

    await pool.query(query, params);

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [studentId]);
    const updatedUser = rows[0];
    delete updatedUser.password;

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});


// ==========================================
// ADMIN DASHBOARD & MANAGEMENT ENDPOINTS (Admin Only)
// ==========================================

// GET /api/admin/students (List students with task counts & GPA info)
app.get('/api/admin/students', verifyToken, restrictToAdmin, async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.name, u.email, u.rollNo, u.department, u.semester, u.degree, u.year, u.streakDays, u.gpa,
             (SELECT COUNT(*) FROM tasks t WHERE t.studentId = u.id) as totalTasks,
             (SELECT COUNT(*) FROM tasks t WHERE t.studentId = u.id AND t.status = 'done') as completedTasks
      FROM users u
      WHERE u.role = 'student'
      ORDER BY u.name ASC
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching student list' });
  }
});

// GET /api/admin/students/:id (Full student profile details)
app.get('/api/admin/students/:id', verifyToken, restrictToAdmin, async (req, res) => {
  const studentId = req.params.id;
  try {
    const [studentRows] = await pool.query('SELECT id, name, email, rollNo, department, semester, degree, year, streakDays, gpa FROM users WHERE id = ? AND role = "student"', [studentId]);
    
    if (studentRows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentProfile = studentRows[0];

    const [tasks] = await pool.query('SELECT *, subjectId as subject FROM tasks WHERE studentId = ?', [studentId]);
    const [subjects] = await pool.query('SELECT * FROM subjects WHERE studentId = ?', [studentId]);
    const [schedule] = await pool.query('SELECT *, subjectId as subject FROM schedule WHERE studentId = ?', [studentId]);

    res.json({
      profile: studentProfile,
      tasks,
      subjects,
      schedule
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching student details' });
  }
});

// POST /api/admin/students (Create a new student with default subjects & schedule!)
app.post('/api/admin/students', verifyToken, restrictToAdmin, async (req, res) => {
  const { name, email, password, rollNo, department, semester, degree, year } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    // Check if email already exists
    const [emailCheck] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (emailCheck.length > 0) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const studentId = `u${Date.now()}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert Student Account
    await pool.query(
      'INSERT INTO users (id, name, email, password, role, rollNo, department, semester, degree, year, streakDays, gpa) VALUES (?, ?, ?, ?, "student", ?, ?, ?, ?, ?, 0, 8.00)',
      [studentId, name, email, hashedPassword, rollNo || null, department || null, semester || null, degree || null, year || null]
    );

    // Seed default subjects so they have academic structure immediately!
    const defaultSubjects = [
      { id: `s1_${studentId}`, name: 'Data Structures', code: 'CS301', credits: 4, progress: 0 },
      { id: `s2_${studentId}`, name: 'Computer Networks', code: 'CS302', credits: 3, progress: 0 },
      { id: `s3_${studentId}`, name: 'Database Systems', code: 'CS303', credits: 3, progress: 0 }
    ];

    for (const sub of defaultSubjects) {
      await pool.query(
        'INSERT INTO subjects (id, name, code, credits, grade, gradePoints, progress, studentId) VALUES (?, ?, ?, ?, "A", 9, ?, ?)',
        [sub.id, sub.name, sub.code, sub.credits, sub.progress, studentId]
      );
    }

    // Seed basic schedule classes
    const defaultSchedule = [
      { id: `sc1_${studentId}`, subjectId: `s1_${studentId}`, day: 'Monday', startTime: '09:00', endTime: '10:00', room: 'CSE-201', type: 'lecture' },
      { id: `sc2_${studentId}`, subjectId: `s2_${studentId}`, day: 'Wednesday', startTime: '11:00', endTime: '12:00', room: 'CSE-301', type: 'lecture' },
      { id: `sc3_${studentId}`, subjectId: `s3_${studentId}`, day: 'Friday', startTime: '09:00', endTime: '11:00', room: 'DB-Lab', type: 'lab' }
    ];

    for (const sc of defaultSchedule) {
      await pool.query(
        'INSERT INTO schedule (id, subjectId, day, startTime, endTime, room, type, studentId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [sc.id, sc.subjectId, sc.day, sc.startTime, sc.endTime, sc.room, sc.type, studentId]
      );
    }

    // Insert Welcome Task
    const taskId = `t_${studentId}_welcome`;
    const todayStr = new Date().toISOString().split('T')[0];
    await pool.query(
      'INSERT INTO tasks (id, title, description, priority, status, dueDate, estimatedHours, createdAt, subjectId, studentId) VALUES (?, "Complete your profile setup", "Fill in any missing details on your profile settings tab.", "high", "todo", ?, 1.00, ?, ?, ?)',
      [taskId, todayStr, todayStr, `s1_${studentId}`, studentId]
    );

    // Fetch and return the newly created student profile
    const [rows] = await pool.query('SELECT id, name, email, rollNo, department, semester, degree, year, streakDays, gpa FROM users WHERE id = ?', [studentId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering student' });
  }
});

// DELETE /api/admin/students/:id (Delete student and all their nested assets)
app.delete('/api/admin/students/:id', verifyToken, restrictToAdmin, async (req, res) => {
  const studentId = req.params.id;
  try {
    // Delete account
    const [result] = await pool.query('DELETE FROM users WHERE id = ? AND role = "student"', [studentId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student account not found or is an admin.' });
    }
    res.json({ message: 'Student account and all associated academic records deleted successfully.', studentId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting student' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
