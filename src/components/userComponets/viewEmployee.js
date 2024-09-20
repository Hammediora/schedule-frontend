import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar } from '@mui/material';

// Helper function to format time to 12-hour AM/PM
const formatTime = (time) => {
  if (!time) return 'Off'; 
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
};

// Helper to get initials from task name
const getTaskInitials = (taskName) => {
  if (!taskName) return '';
  return taskName[0].toUpperCase();
};

// Helper to generate consistent color based on task name
const getTaskColor = (taskName) => {
  const colors = ['#FFC107', '#FF5722', '#8BC34A', '#03A9F4', '#E91E63', '#9C27B0'];
  const index = taskName.charCodeAt(0) % colors.length;
  return colors[index];
};

const ViewEmployee = ({ employee }) => {
  if (!employee) return null;  

  // Provide a fallback for availability in case it's missing
  const availability = employee.availability || {
    monday: { start: '', end: '' },
    tuesday: { start: '', end: '' },
    wednesday: { start: '', end: '' },
    thursday: { start: '', end: '' },
    friday: { start: '', end: '' },
    saturday: { start: '', end: '' },
    sunday: { start: '', end: '' },
  };

  // Tasks fallback in case tasks are not provided
  const tasks = employee.assignedTasks || [];

  return (
    <Box>
      <Typography variant="h5" align="center" mb={3} sx={{ fontWeight: 'bold' }}>
        Employee Details
      </Typography>

      <Typography variant="h6">Name: {employee.name}</Typography>
      <Typography variant="h6">Role: {employee.role}</Typography>

      {/* Display tasks section */}
      <Typography variant="h6" mt={2}>Assigned Tasks</Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Chip
              key={task._id}
              label={task.task_name}
              avatar={
                <Avatar sx={{ bgcolor: getTaskColor(task.task_name) }}>
                  {getTaskInitials(task.task_name)}
                </Avatar>
              }
              sx={{ maxWidth: '150px', textOverflow: 'ellipsis', overflow: 'hidden' }}
            />
          ))
        ) : (
          <Typography variant="body2">No tasks assigned.</Typography>
        )}
      </Box>

      {/* Availability table section */}
      <Typography variant="h6" mt={2} mb={2}>Availability</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="h6">Day</Typography></TableCell>
              <TableCell align="center"><Typography variant="h6">Start Time</Typography></TableCell>
              <TableCell align="center"><Typography variant="h6">End Time</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
              <TableRow key={day}>
                <TableCell component="th" scope="row" sx={{ textTransform: 'capitalize' }}>
                  {day}
                </TableCell>
                <TableCell align="center">{formatTime(availability[day]?.start)}</TableCell>
                <TableCell align="center">{formatTime(availability[day]?.end)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ViewEmployee;
