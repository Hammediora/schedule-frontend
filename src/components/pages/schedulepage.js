import React from 'react';
import { Container, Typography } from '@mui/material';
import ScheduleList from '../Schedule/ScheduleList';

const SchedulePage = () => {
  return (
    <Container>
      <Typography variant="h4" align="center" mt={5} mb={5}>
        Schedule Management
      </Typography>
      <ScheduleList />
    </Container>
  );
};

export default SchedulePage;
