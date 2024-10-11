import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Chip, Typography } from '@mui/material';

const TaskSelection = ({ user, setUser, tasks }) => {
  console.log('User assignedTasks:', user.tasks);  

  const handleTaskChange = (event) => {
    const selectedTaskIds = event.target.value;

    // Map selected IDs back to full task objects from the tasks list
    const selectedTasks = selectedTaskIds.map(id => tasks.find(task => task._id === id));
    console.log('Newly selected task objects:', selectedTasks);  

    // Set the user state with the selected task objects
    setUser((prevUser) => ({
      ...prevUser,
      tasks: selectedTasks, 
    }));
  };

  const handleTaskDelete = (taskId) => {
    // Filter out the task with the matching taskId from the selected tasks
    const updatedTasks = user.tasks.filter((task) => task._id !== taskId);
    setUser((prevUser) => ({
      ...prevUser,
      tasks: updatedTasks, 
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
          width: '100%'  
        }}
      >
        Assign Task (Station)
      </InputLabel>
      <Select
        labelId="task-label"
        id="tasks"
        name="tasks"
        multiple
        value={user.tasks.map(task => task._id)}  
        onChange={handleTaskChange}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selected.map((taskId) => {
              const task = tasks.find((task) => task._id === taskId);
              console.log('Selected task object:', task); 
              return task ? (
                <Chip
                  key={taskId}
                  label={task.task_name}
                  onDelete={() => handleTaskDelete(taskId)}  
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
        sx={{ mt: 2 }}  
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
