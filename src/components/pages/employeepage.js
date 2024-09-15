import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../../services/api';  // Import delete API
import EmployeeCard from '../userComponets/employeeCard';
import { Box, Typography, Grid, CircularProgress, Alert, Button } from '@mui/material';

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);  
  const [loading, setLoading] = useState(true);    
  const [error, setError] = useState('');          

  useEffect(() => {
    fetchEmployees();  // Fetch employees on component mount
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getUsers();  // Use the getUsers function from api.js
      setEmployees(response.data);
    } catch (error) {
      setError('Failed to load employees.');
    } finally {
      setLoading(false);  // Always stop loading when the request is done
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);  // Call delete API function
      setEmployees(employees.filter(employee => employee._id !== id));  // Remove employee from state
    } catch (error) {
      setError('Failed to delete employee.');
    }
  };

  const handleAddEmployee = () => {
    console.log('Add Employee clicked!');
    // Handle add employee functionality
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Employees</Typography>

      <Button variant="contained" onClick={handleAddEmployee} sx={{ mb: 3, fontFamily: "'Orbitron', sans-serif" }}>
        Add Employee
      </Button>

      <Grid container spacing={2}>
        {employees.length > 0 ? (
          employees.map((employee) => (
            <Grid item xs={12} sm={6} md={4} key={employee._id}>
              <EmployeeCard 
                employee={employee} 
                onDelete={handleDelete}  // Pass delete handler to EmployeeCard
              />
            </Grid>
          ))
        ) : (
          <Typography variant="h6">No employees found.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default EmployeePage;
