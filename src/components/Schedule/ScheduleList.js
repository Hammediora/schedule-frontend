import React, { useEffect, useState } from 'react';
import { getSchedules } from '../../services/api';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const response = await getSchedules();
      setSchedules(response.data);
    };
    fetchSchedules();
  }, []);

  return (
    <div>
      <Typography variant="h5" mt={5} mb={3}>
        Schedule List
      </Typography>
      <List>
        {schedules.map((schedule) => (
          <ListItem key={schedule._id}>
            <ListItemText
              primary={`User: ${schedule.user.name}, Task: ${schedule.task.task_name}`}
              secondary={`Date: ${schedule.date}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ScheduleList;
