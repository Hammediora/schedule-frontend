import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { addUser } from '../../services/api';

const AddUser = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: 'crew member',  
    hashed_password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const newUser = {
            name: user.name,
            email: user.email,
            role: user.role,
            hashed_password: user.hashed_password,  
          };
          await addUser(newUser);
          alert('User added successfully!');
        } catch (error) {
          console.error('Error adding user:', error);
          alert('Failed to add user.');
        }
      };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" mb={3}>
        Add New User
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={user.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        
        {/* Role Picker */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            id="role"
            name="role"
            value={user.role}
            onChange={handleChange}
            label="Role"
            required
          >
            <MenuItem value="general manager">General Manager</MenuItem>
            <MenuItem value="service manager">Service Manager</MenuItem>
            <MenuItem value="kitchen manager">Kitchen Manager</MenuItem>
            <MenuItem value="crew member">Crew Member</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Password"
          name="hashed_password"
          type="password"
          value={user.hashed_password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Add User
        </Button>
      </form>
    </Box>
  );
};

export default AddUser;
