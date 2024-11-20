import axios from 'axios';
import { getAuth } from 'firebase/auth';

// Base API URL from environment variables or fallback to localhost
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
    const token = await getToken();  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------- User API Calls --------------------
export const getEmployeeById = (id) => api.get(`/users/${id}`);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getUsers = () => api.get('/users'); 
export const addUser = (userData) => api.post('/users', userData); 
export const addEmployee = (employeeData) => api.post('/users/addEmployee', employeeData);
export const updateEmployee = (id, updatedData) => api.put(`/users/${id}`, updatedData);
export const assignTasksToUser = (userId, taskIds) => api.post(`/users/${userId}/tasks`, { taskIds });
export const getTasksForUser = (userId) => api.get(`/users/${userId}/tasks`);
export const loginUser = (token) => api.get('/users/login', {
  headers: { Authorization: `Bearer ${token}` },  
});

// -------------------- Task API Calls --------------------
export const getTasks = () => api.get('/tasks');
export const addTask = (taskData) => api.post('/tasks', taskData);

// -------------------- Schedule API Calls --------------------


export const getWeeklySchedules = (weekStart) => api.get(`/schedules`, { params: { weekStart } });
export const generateWeeklySchedules = (salesData) => api.post('/schedules/generate-weekly', salesData);
export const createSchedule = (scheduleData) => api.post('/schedules', scheduleData);
export const updateSchedule = (scheduleId, scheduleData) => api.put(`/schedules/${scheduleId}`, scheduleData);
export const deleteSchedule = (scheduleId) => api.delete(`/schedules/${scheduleId}`);

// -------------------- Time-Off Request API Calls --------------------
export const getTimeOffRequests = () => api.get('/timeoff');
export const addTimeOffRequest = (requestData) => api.post('/timeoff', requestData);
export const approveTimeOffRequest = (id) => api.put(`/timeoff/${id}/approve`);

export default api;
