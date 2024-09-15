import React, { useEffect, useState } from 'react';
import { getUsers } from '../../services/api';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getUsers();
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <Typography variant="h5" mt={5} mb={3}>
        User List
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user._id}>
            <ListItemText
              primary={user.name}
              secondary={`Email: ${user.email} - Role: ${user.role}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default UserList;
