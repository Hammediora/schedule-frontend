import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Snackbar } from '@mui/material';
import { addEmployee, updateEmployee, getTasks} from '../../../services/api'
import NameField from './nameField';
import RoleSelection from './roleselection';
import TaskSelection from './taskSelection';
import AvailabilitySection from './availabilitySection';

const UserForm = ({ employee, onClose }) => {
  const [user, setUser] = useState({
    name: '',
    role: 'crew member',
    availability: {
      monday: { start: '', end: '', off: false },
      tuesday: { start: '', end: '', off: false },
      wednesday: { start: '', end: '', off: false },
      thursday: { start: '', end: '', off: false },
      friday: { start: '', end: '', off: false },
      saturday: { start: '', end: '', off: false },
      sunday: { start: '', end: '', off: false },
    },
    tasks: [], 
  });

  const [tasks, setTasks] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errors, setErrors] = useState({}); 

  useEffect(() => {
    if (employee) {
      console.log('Prefilling form with employee data:', employee); 
      setUser({
        name: employee.name || '',
        role: employee.role || 'crew member',
        availability: employee.availability || {
          monday: { start: '', end: '', off: false },
          tuesday: { start: '', end: '', off: false },
          wednesday: { start: '', end: '', off: false },
          thursday: { start: '', end: '', off: false },
          friday: { start: '', end: '', off: false },
          saturday: { start: '', end: '', off: false },
          sunday: { start: '', end: '', off: false },
        },
        tasks: employee.assignedTasks || [],
      });
    }
    fetchTasks();
  }, [employee]);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      console.log('Fetched Tasks:', response.data);
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  // Validate form fields
  const validate = () => {
    const newErrors = {};

    // Validate name
    if (!user.name) {
      newErrors.name = 'Name is required';
    }

    // Validate role
    if (!user.role) {
      newErrors.role = 'Role is required';
    }

    // Validate availability (each day should either have a time or be marked as off)
    let hasValidAvailability = true;

    Object.keys(user.availability).forEach((day) => {
      const { start, end, off } = user.availability[day];

      if (!off && (!start || !end)) {
        newErrors.availability = `Please provide valid times or mark ${day} as off.`;
        hasValidAvailability = false;
      }
    });

    if (!hasValidAvailability) {
      newErrors.availability = 'Each day must have a valid time or be marked as off.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const userToSubmit = {
      ...user,
      tasks: user.tasks.map(task => task._id), 
    };

    try {
      if (employee) {
        await updateEmployee(employee._id, userToSubmit);
        setSnackbarMessage('Employee updated successfully!');
      } else {
        await addEmployee(userToSubmit);
        setSnackbarMessage('Employee added successfully!');
      }
      setSnackbarOpen(true);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error submitting employee:', error);
      setSnackbarMessage('Failed to submit employee.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', p: { xs: 2, sm: 4 }, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h5" align="center" mb={3} sx={{ fontWeight: 'bold' }}>
        {employee ? 'Edit Employee' : 'Add New Employee'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <NameField user={user} setUser={setUser} error={errors.name} />
        <RoleSelection user={user} setUser={setUser} error={errors.role} />
        <TaskSelection user={user} setUser={setUser} tasks={tasks} />
        <AvailabilitySection user={user} setUser={setUser} error={errors.availability} />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem', mb: 5 }}
        >
          {employee ? 'Update Employee' : 'Add Employee'}
        </Button>
      </form>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose} message={snackbarMessage} />
    </Box>
  );
};

export default UserForm;
