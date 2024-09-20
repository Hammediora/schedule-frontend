import React, { useEffect, useState } from 'react';
import { getTasks } from '../../services/api';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await getTasks();
      setTasks(response.data);
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <Typography variant="h5" mt={5} mb={3}>
        Task List
      </Typography>
      <List>
        {tasks.map((task) => (
          <ListItem key={task._id}>
            <ListItemText
              primary={task.task_name}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TaskList;
