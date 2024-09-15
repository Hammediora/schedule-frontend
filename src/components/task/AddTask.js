import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { addTask } from '../../services/api';

const AddTask = () => {
  const [task, setTask] = useState({
    task_name: '',
    description: '',
    priority: 'medium',
    deadline: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTask(task);
      alert('Task added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" mb={3}>
        Add New Task
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Task Name"
          name="task_name"
          value={task.task_name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={task.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          fullWidth
          label="Priority"
          name="priority"
          value={task.priority}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Deadline"
          name="deadline"
          type="date"
          value={task.deadline}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Task
        </Button>
      </form>
    </Box>
  );
};

export default AddTask;
