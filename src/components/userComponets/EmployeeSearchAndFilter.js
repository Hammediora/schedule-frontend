import React, { useState } from 'react';
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material';

const EmployeeSearchAndFilter = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value, roleFilter);
  };

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
    onSearch(searchTerm, event.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    onSearch('', '');
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        label="Search by Name or ID"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ minWidth: '250px', height: '40px', mt: 1 }}
      />
      <FormControl variant="outlined" sx={{ minWidth: '250px', height: '40px', mt: 1 }}>
        <InputLabel id="role-filter-label">Filter by Role</InputLabel>
        <Select
          labelId="role-filter-label"
          id="role-filter"
          value={roleFilter}
          onChange={handleRoleFilterChange}
          label="Filter by Role"
        >
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="crew member">Crew Member</MenuItem>
          <MenuItem value="service manager">Service Manager</MenuItem>
          <MenuItem value="kitchen manager">Kitchen Manager</MenuItem>
          <MenuItem value="general manager">General Manager</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        onClick={handleClearFilters}
        sx={{
          color: 'white',
          ml: 2,
          mt: 2,
          padding: '8px 16px', 
          fontSize: '0.875rem',
          minWidth: '120px',
          height: '40px', 
        }}
      >
        Clear
      </Button>
    </Box>
  );
};

export default EmployeeSearchAndFilter;
