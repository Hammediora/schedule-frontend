import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../../services/api';
import EmployeeCard from '../userComponets/employeeCard';
import { Box, Typography, Grid, CircularProgress, Alert, Button, Modal, Fade, Backdrop } from '@mui/material';
import UserForm from '../userComponets/AddEmployee';
import ViewEmployee from '../userComponets/viewEmployee';

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openAddEditModal, setOpenAddEditModal] = useState(false); 
  const [openViewModal, setOpenViewModal] = useState(false); 
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getUsers();
      setEmployees(response.data);
    } catch (error) {
      setError('Failed to load employees.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setEmployees(employees.filter((employee) => employee._id !== id));
    } catch (error) {
      setError('Failed to delete employee.');
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null); 
    setOpenAddEditModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setOpenAddEditModal(true); 
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee); 
    setOpenViewModal(true); 
  };

  const handleCloseAddEditModal = () => {
    setOpenAddEditModal(false); 
    setSelectedEmployee(null); 
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false); 
    setSelectedEmployee(null); 
  };

  const handleEmployeeAddedOrUpdated = () => {
    fetchEmployees(); 
    handleCloseAddEditModal(); 
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

      {/* Button to open Add Employee form */}
      <Button variant="contained" onClick={handleAddEmployee} sx={{ mb: 3, fontFamily: "'Orbitron', sans-serif" }}>
        Add Employee
      </Button>

      {/* Modal for adding or editing employee */}
      <Modal
        open={openAddEditModal}  
        onClose={handleCloseAddEditModal} 
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openAddEditModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90vw',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              overflowX: 'hidden',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 3,
              borderRadius: 2,
            }}
          >
            {/* Pass selectedEmployee to the UserForm for edit or null for adding */}
            <UserForm employee={selectedEmployee} onClose={handleEmployeeAddedOrUpdated} />
          </Box>
        </Fade>
      </Modal>

      {/* Modal for viewing employee details */}
      <Modal
        open={openViewModal}  
        onClose={handleCloseViewModal} 
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openViewModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80vw',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 3,
              borderRadius: 2,
            }}
          >
            {/* Pass selectedEmployee to the ViewEmployee component */}
            <ViewEmployee employee={selectedEmployee} open={openViewModal} onClose={handleCloseViewModal} />
          </Box>
        </Fade>
      </Modal>

      <Grid container spacing={2}>
        {employees.length > 0 ? (
          employees.map((employee) => (
            <Grid item xs={12} sm={6} md={4} key={employee._id}>
              <EmployeeCard
                employee={employee}
                onDelete={handleDelete}
                onEdit={() => handleEditEmployee(employee)}
                onSelect={() => handleViewEmployee(employee)} 
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
