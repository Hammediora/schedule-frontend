import axios from 'axios';
import { getAuth } from 'firebase/auth';  // Ensure Firebase auth is imported

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'; 

// Axios instance for API requests
const api = axios.create({
  baseURL: API_URL,
});

// Function to get the Firebase ID token (and refresh it if needed)
const getToken = async () => {
  console.log('Requesting Firebase token...');
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (currentUser) {
    try {
      const token = await currentUser.getIdToken();
      console.log('Token received:', token);
      return token;
    } catch (error) {
      console.error('Error getting Firebase token:', error);
      throw error;
    }
  } else {
    console.error('No user is currently signed in.');
    return null;
  }
};
// Axios request interceptor to add the Firebase ID token to the request headers
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();  // Get the refreshed token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API Calls for users
export const getUsers = () => api.get('/users');  // Get all users (requires token)
export const deleteUser = (id) => api.delete(`/users/${id}`);  // Delete a user by ID
export const addUser = async (userData) => {
  const token = await getToken();
  return api.post('/users', userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Add employee (no email/password needed)
export const addEmployee = async (employeeData) => {
  const token = await getToken();  // Get the Firebase ID token of the current authenticated user
  return api.post('/users/addEmployee', employeeData, {
    headers: {
      Authorization: `Bearer ${token}`,  // Pass the Firebase token to authorize the manager
    },
  });
};

// Get an employee by ID (view details)
export const getEmployeeById = (id) => api.get(`/users/${id}`);  // Fetch a single employee's details by ID

// Update an employee by ID (edit employee)
export const updateEmployee = (id, updatedData) => api.put(`/users/${id}`, updatedData);

// API Call for logging in user using Firebase token (verify on backend)
export const loginUser = (token) => api.get('/users/login', {
  headers: {
    Authorization: `Bearer ${token}`,  // Pass the Firebase token to the backend
  },
});

// API Calls for tasks
export const getTasks = () => api.get('/tasks');  // Get all tasks
export const addTask = (taskData) => api.post('/tasks', taskData);  // Add a new task

// API Calls for schedules
export const getSchedules = () => api.get('/schedules');  // Get all schedules
export const addSchedule = (scheduleData) => api.post('/schedules', scheduleData);  // Add new schedule
export const approveSchedule = (id) => api.put(`/schedules/${id}/approve`);  // Approve a schedule by ID

// API Calls for time-off requests
export const getTimeOffRequests = () => api.get('/timeoff');  // Get all time-off requests
export const addTimeOffRequest = (requestData) => api.post('/timeoff', requestData);  // Add new time-off request
export const approveTimeOffRequest = (id) => api.put(`/timeoff/${id}/approve`);  // Approve time-off request by ID

export default api;
