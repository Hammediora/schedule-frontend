import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Chip, Typography } from '@mui/material';

const TaskSelection = ({ user, setUser, tasks }) => {
  console.log('User assignedTasks:', user.tasks);  // Log selected tasks

  const handleTaskChange = (event) => {
    const selectedTaskIds = event.target.value;

    // Map selected IDs back to full task objects from the tasks list
    const selectedTasks = selectedTaskIds.map(id => tasks.find(task => task._id === id));
    console.log('Newly selected task objects:', selectedTasks);  // Log selected task objects

    // Set the user state with the selected task objects
    setUser((prevUser) => ({
      ...prevUser,
      tasks: selectedTasks,  // Store the full task objects
    }));
  };

  const handleTaskDelete = (taskId) => {
    // Filter out the task with the matching taskId from the selected tasks
    const updatedTasks = user.tasks.filter((task) => task._id !== taskId);
    setUser((prevUser) => ({
      ...prevUser,
      tasks: updatedTasks,  // Update the user tasks by removing the selected task
    }));
  };

  return (
    <FormControl fullWidth margin="normal" sx={{ position: 'relative', minWidth: 120 }}>
      <InputLabel 
        id="task-label" 
        sx={{ 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          width: '100%'  // Ensure the label doesn't overflow
        }}
      >
        Assign Task (Station)
      </InputLabel>
      <Select
        labelId="task-label"
        id="tasks"
        name="tasks"
        multiple
        value={user.tasks.map(task => task._id)}  // Use task IDs for selection
        onChange={handleTaskChange}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selected.map((taskId) => {
              const task = tasks.find((task) => task._id === taskId);
              console.log('Selected task object:', task);  // Log task object
              return task ? (
                <Chip
                  key={taskId}
                  label={task.task_name}
                  onDelete={() => handleTaskDelete(taskId)}  // Handle task deletion
                  sx={{
                    backgroundColor: '#f0f4f8',
                    color: '#333',
                    '& .MuiChip-deleteIcon': {
                      color: '#f44336',
                    },
                    '&:hover': {
                      backgroundColor: '#e3e9ef',
                    },
                  }}
                />
              ) : null;
            })}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 200,
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
            },
          },
        }}
        sx={{ mt: 2 }}  // Add margin to create space between label and field
      >
        {tasks.map((task) => (
          <MenuItem key={task._id} value={task._id}>
            <Typography sx={{ fontWeight: 'bold', color: '#333' }}>{task.task_name}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TaskSelection;
