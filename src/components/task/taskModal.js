import React, { useState } from 'react';
import { Box, Button, Modal, Fade, Backdrop, TextField, Typography } from '@mui/material';
import { addTask } from '../../services/api'; 

const TaskModal = ({ open, onClose, onTaskAdded }) => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!taskName.trim()) {
      setError('Task name is required');
      return;
    }
    setIsSubmitting(true); 
    try {
      await addTask({ task_name: taskName, description });
      onTaskAdded();
      onClose();
      setTaskName('');
      setDescription('');
    } catch (err) {
      setError('Failed to add task');
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Add New Task
          </Typography>
          {error && (
            <Typography variant="body2" color="error" mb={2}>
              {error}
            </Typography>
          )}
          <TextField
            fullWidth
            label="Task Name"
            variant="outlined"
            value={taskName}
            onChange={(e) => {
                setTaskName(e.target.value);
                setError(''); 
              }}
              margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => {
                setDescription(e.target.value);
                setError(''); 
              }}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
            disabled={isSubmitting} 
            >
            {isSubmitting ? 'Adding Task...' : 'Add Task'}
            </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TaskModal;
