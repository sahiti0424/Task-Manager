const API_BASE_URL = 'https://task-manager-backend-vjl0.onrender.com'/api;

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('student_mgmt_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || `Request failed with status ${response.status}`;
    
    if (response.status === 401 || response.status === 403) {
      // Auto-logout if unauthorized/token expired
      localStorage.removeItem('student_mgmt_token');
      localStorage.removeItem('student_mgmt_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    throw new Error(message);
  }
  return response.json();
};

export const api = {
  // Authentication
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(res);
    localStorage.setItem('student_mgmt_token', data.token);
    localStorage.setItem('student_mgmt_user', JSON.stringify(data.user));
    return data;
  },

  register: async (registerData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData),
    });
    const data = await handleResponse(res);
    localStorage.setItem('student_mgmt_token', data.token);
    localStorage.setItem('student_mgmt_user', JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    localStorage.removeItem('student_mgmt_token');
    localStorage.removeItem('student_mgmt_user');
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const user = await handleResponse(res);
    localStorage.setItem('student_mgmt_user', JSON.stringify(user));
    return user;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('student_mgmt_user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('student_mgmt_token');
  },

  // Student Tasks
  getTasks: async (studentId = '') => {
    const url = studentId ? `${API_BASE_URL}/tasks?studentId=${studentId}` : `${API_BASE_URL}/tasks`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createTask: async (taskData) => {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });
    return handleResponse(res);
  },

  updateTask: async (taskId, taskData) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });
    return handleResponse(res);
  },

  toggleTask: async (taskId) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/toggle`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  deleteTask: async (taskId) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Student Academic Assets
  getSubjects: async (studentId = '') => {
    const url = studentId ? `${API_BASE_URL}/subjects?studentId=${studentId}` : `${API_BASE_URL}/subjects`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getSchedule: async (studentId = '') => {
    const url = studentId ? `${API_BASE_URL}/schedule?studentId=${studentId}` : `${API_BASE_URL}/schedule`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getActivities: async (studentId = '') => {
    const url = studentId ? `${API_BASE_URL}/activities?studentId=${studentId}` : `${API_BASE_URL}/activities`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Profile management
  updateProfile: async (profileData) => {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(res);
  },

  // Admin Management Endpoints
  adminGetStudents: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/students`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  adminGetStudentDetails: async (studentId) => {
    const res = await fetch(`${API_BASE_URL}/admin/students/${studentId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  adminCreateStudent: async (studentData) => {
    const res = await fetch(`${API_BASE_URL}/admin/students`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(studentData),
    });
    return handleResponse(res);
  },

  adminDeleteStudent: async (studentId) => {
    const res = await fetch(`${API_BASE_URL}/admin/students/${studentId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
