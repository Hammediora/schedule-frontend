import React, { useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, Typography, CircularProgress
} from '@mui/material';
import { updateSchedule } from '../../services/api';
import EditScheduleModal from './EditScheduleModal.js';
import { format, addDays, isWithinInterval } from 'date-fns';
import { formatShiftTime, calculateShiftDuration } from './shiftHelpers';

const WeeklyScheduleTable = ({ schedules, fetchSchedules, weekStart }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editSchedule, setEditSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Generate the days of the week for the given start date
  const daysOfWeek = Array(7).fill(0).map((_, i) => ({
    dayName: format(addDays(new Date(weekStart), i), 'EEEE'),
    date: format(addDays(new Date(weekStart), i), 'yyyy-MM-dd')
  }));

  // Define the start and end of the current week for validation
  const weekEnd = addDays(new Date(weekStart), 6);

  // Role priority for sorting
  const rolePriority = {
    'general manager': 1,
    'service manager': 2,
    'kitchen manager': 3,
    'crew member': 4,
  };

  // Group schedules by employee for display
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const userId = schedule.user._id;
    if (!acc[userId]) {
      acc[userId] = { 
        name: schedule.user.name, 
        role: schedule.user.role,  // Add the role here
        shifts: {}, 
        totalHours: 0 
      };
    }

    const shiftDuration = calculateShiftDuration(schedule.shift.start_time, schedule.shift.end_time);
    const shiftDate = new Date(schedule.shift.date);

    // Ensure we're only counting shifts within the selected week
    if (isWithinInterval(shiftDate, { start: new Date(weekStart), end: weekEnd })) {
      const dayOfShift = schedule.shift.date.split('T')[0];
      acc[userId].shifts[dayOfShift] = {
        time: `${schedule.shift.start_time} - ${schedule.shift.end_time}`,
        formattedTime: formatShiftTime(schedule.shift.start_time, schedule.shift.end_time),
        task: schedule.task?.task_name || 'No task',
        scheduleId: schedule._id,
        duration: shiftDuration, // Daily shift duration
      };

      // Add the shift duration to the total hours worked by the employee for the current week
      acc[userId].totalHours += shiftDuration;
    }

    return acc;
  }, {});

  // Sort groupedSchedules based on the role priority
  const sortedSchedules = Object.keys(groupedSchedules).sort((a, b) => {
    const roleA = groupedSchedules[a].role.toLowerCase();
    const roleB = groupedSchedules[b].role.toLowerCase();
    return rolePriority[roleA] - rolePriority[roleB];
  });

  // Handle shift edit (open the modal)
  const handleEditClick = (userId, day, shiftData) => {
    setEditSchedule({ userId, day, ...shiftData });
    setEditDialogOpen(true);
  };

  // Save updated shift and send to backend
  const handleSave = async (updatedSchedule) => {
    const { scheduleId, shift } = updatedSchedule;
    const { start_time, end_time, task } = shift;
    try {
      setLoading(true);
      await updateSchedule(scheduleId, { shift: { start_time, end_time }, task });
      await fetchSchedules();  // Re-fetch schedules after updating
      alert('Schedule updated successfully');
    } catch (err) {
      console.error('Failed to update schedule:', err);
      alert('Error updating schedule');
    } finally {
      setLoading(false);
      setEditDialogOpen(false);
    }
  };

  // Handle field changes in the modal
  const handleEditFieldChange = (field, value) => {
    setEditSchedule((prevSchedule) => ({
      ...prevSchedule,
      [field]: value,
    }));
  };

  // Pagination change handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading) return <CircularProgress />;

  return (
    <>
      <TableContainer 
        component={Paper} 
        sx={{ boxShadow: 3, width: '100%', maxHeight: 700, overflow: 'auto' }} 
      >
        <Table stickyHeader aria-label="Weekly Schedule">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">Employee</Typography>
              </TableCell>
              {daysOfWeek.map(({ dayName, date }) => (
                <TableCell key={date} align="center">
                  <Typography variant="h6">
                    {dayName} <br /> <small>{date}</small>
                  </Typography>
                </TableCell>
              ))}
              <TableCell align="center">
                <Typography variant="h6">Total Hours (Weekly)</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSchedules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((userId) => {
              const employee = groupedSchedules[userId];
              return (
                <TableRow key={userId} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1">{employee.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{employee.role}</Typography> {/* Display role here */}
                  </TableCell>
                  {daysOfWeek.map(({ date }) => {
                    const shiftData = employee.shifts[date];
                    return (
                      <TableCell
                        key={date}
                        align="center"
                        sx={{
                          backgroundColor: shiftData
                            ? `rgba(0, 128, 0, ${shiftData.duration / 12})`
                            : 'transparent',
                          cursor: shiftData ? 'pointer' : 'default',
                          '&:hover': shiftData ? { backgroundColor: 'rgba(0, 128, 0, 0.3)' } : null,
                        }}
                        onClick={shiftData ? () => handleEditClick(userId, date, shiftData) : null}
                      >
                        {shiftData ? (
                          <Box>
                            <Typography variant="body2">{shiftData.formattedTime}</Typography>
                            <Typography variant="caption">{shiftData.task}</Typography>
                            {/* Displaying the daily work hours */}
                            <Typography variant="body2" color="text.secondary">
                              {shiftData.duration.toFixed(2)} hours
                            </Typography>
                          </Box>
                        ) : (
                          'Off'
                        )}
                      </TableCell>
                    );
                  })}
                  {/* Display the total weekly hours for the employee */}
                  <TableCell align="center">
                    <Typography variant="body1">{employee.totalHours.toFixed(2)} hours</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination component */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={sortedSchedules.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Schedule Modal */}
      {editSchedule && (
        <EditScheduleModal
          editDialogOpen={editDialogOpen}
          handleClose={() => setEditDialogOpen(false)}
          editSchedule={editSchedule}
          handleEditFieldChange={handleEditFieldChange}
          handleEditSubmit={() => handleSave(editSchedule)}
        />
      )}
    </>
  );
};

export default WeeklyScheduleTable;
