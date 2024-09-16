import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel, Grid, Checkbox, FormControlLabel, Snackbar } from '@mui/material';
import { addEmployee, updateEmployee } from '../../services/api';  

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
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Check if we're editing an employee; if so, pre-fill the form
  useEffect(() => {
    if (employee) {
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
      });
    }
  }, [employee]);

  // Handle input changes for regular fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Handle availability changes
  const handleAvailabilityChange = (day, field, value) => {
    setUser({
      ...user,
      availability: {
        ...user.availability,
        [day]: {
          ...user.availability[day],
          [field]: value,
        },
      },
    });
  };

  // Handle Day Off checkbox toggle
  const handleDayOffChange = (day, checked) => {
    setUser({
      ...user,
      availability: {
        ...user.availability,
        [day]: {
          off: checked,
          start: checked ? '' : user.availability[day].start,
          end: checked ? '' : user.availability[day].end,
        },
      },
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (employee) {
        // Edit existing employee
        await updateEmployee(employee._id, user);
        setSnackbarMessage('Employee updated successfully!');
      } else {
        // Add new employee
        await addEmployee(user);
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
    <Box 
      sx={{ 
        maxWidth: '100%', 
        mx: 'auto', 
        p: { xs: 2, sm: 4 },  
        bgcolor: 'background.paper', 
        borderRadius: 2, 
        maxHeight: '90vh',
      }}
    >
      <Typography variant="h5" align="center" mb={3} sx={{ fontWeight: 'bold' }}>
        {employee ? 'Edit Employee' : 'Add New Employee'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={user.name}
          onChange={handleChange}
          margin="normal"
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            id="role"
            name="role"
            value={user.role}
            onChange={handleChange}
            label="Role"
            required
          >
            <MenuItem value="general manager">General Manager</MenuItem>
            <MenuItem value="service manager">Service Manager</MenuItem>
            <MenuItem value="kitchen manager">Kitchen Manager</MenuItem>
            <MenuItem value="crew member">Crew Member</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="h6" mt={3} mb={1} sx={{ fontWeight: 'medium' }}>
          Availability
        </Typography>

        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
          <Grid container spacing={2} key={day} sx={{ mt: 1 }}>
            <Grid item xs={3} sm={3}>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                {day}
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              <TextField
                fullWidth
                type="time"
                label="Start"
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                value={user.availability[day].start}
                onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                disabled={user.availability[day].off}
              />
            </Grid>
            <Grid item xs={4} sm={4}>
              <TextField
                fullWidth
                type="time"
                label="End"
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                value={user.availability[day].end}
                onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                disabled={user.availability[day].off}
              />
            </Grid>
            <Grid item xs={1} sm={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={user.availability[day].off}
                    onChange={(e) => handleDayOffChange(day, e.target.checked)}
                  />
                }
                label="Off"
              />
            </Grid>
          </Grid>
        ))}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem',mb: 5 }}
        >
          {employee ? 'Update Employee' : 'Add Employee'}
        </Button>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  );
};

export default UserForm;
