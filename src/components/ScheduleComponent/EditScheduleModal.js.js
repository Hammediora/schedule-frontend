import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';

const EditScheduleModal = ({ editDialogOpen, handleClose, editSchedule, handleEditFieldChange, handleEditSubmit }) => {
  // Use fallback values to avoid undefined errors
  const shiftStartTime = editSchedule?.shift?.start_time || '';
  const shiftEndTime = editSchedule?.shift?.end_time || '';
  const taskName = editSchedule?.task?.task_name || '';
  const employeeName = editSchedule?.user?.name || 'Unknown Employee';

  return (
    <Dialog open={editDialogOpen} onClose={handleClose}>
      <DialogTitle>Edit Schedule for {employeeName}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          Modify the schedule details for the selected shift.
        </Typography>
        <TextField
          label="Start Time"
          type="time"
          value={shiftStartTime} 
          onChange={(e) => handleEditFieldChange('shift.start_time', e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Time"
          type="time"
          value={shiftEndTime} 
          onChange={(e) => handleEditFieldChange('shift.end_time', e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Task"
          value={taskName} 
          onChange={(e) => handleEditFieldChange('task', { task_name: e.target.value })}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditSubmit} color="primary" variant="contained">
          Save
        </Button>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditScheduleModal;
