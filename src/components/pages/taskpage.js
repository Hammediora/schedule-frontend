import React from 'react';
import { Container, Typography } from '@mui/material';
import AddTask from '../task/AddTask';
import TaskList from '../task/TaskList';

const TaskPage = () => {
  return (
    <Container>
      <Typography variant="h4" align="center" mt={5} mb={5}>
        Task Management
      </Typography>
      <AddTask />
      <TaskList />
    </Container>
  );
};

export default TaskPage;
