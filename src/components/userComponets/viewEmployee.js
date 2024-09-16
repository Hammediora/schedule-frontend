import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Helper function to format time to 12-hour AM/PM
const formatTime = (time) => {
  if (!time) return 'Off';  // If time is not provided, return "Off"
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
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

  return (
    <Box>
      <Typography variant="h5" align="center" mb={3} sx={{ fontWeight: 'bold' }}>
        Employee Details
      </Typography>

      <Typography variant="h6">Name: {employee.name}</Typography>
      <Typography variant="h6">Role: {employee.role}</Typography>

      <Typography variant="h6" mt={2} mb={2}>Availability</Typography>

      {/* Table layout for availability */}
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
