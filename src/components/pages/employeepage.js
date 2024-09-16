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
  const [openAddEditModal, setOpenAddEditModal] = useState(false); // Add/Edit User modal state
  const [openViewModal, setOpenViewModal] = useState(false); // View Employee modal state
  const [selectedEmployee, setSelectedEmployee] = useState(null); // State for selected employee

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
    setSelectedEmployee(null); // Clear selected employee for adding new employee
    setOpenAddEditModal(true); // Open the Add/Edit UserForm modal
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee); // Set the employee to be edited
    setOpenAddEditModal(true); // Open the UserForm modal
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee); // Set the employee for viewing
    setOpenViewModal(true); // Open the ViewEmployee modal
  };

  const handleCloseAddEditModal = () => {
    setOpenAddEditModal(false); // Close the UserForm modal
    setSelectedEmployee(null); // Clear selected employee after closing
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false); // Close the ViewEmployee modal
    setSelectedEmployee(null); // Clear selected employee after closing
  };

  const handleEmployeeAddedOrUpdated = () => {
    fetchEmployees(); // Refresh the employee list after add/update
    handleCloseAddEditModal(); // Close the modal
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
        open={openAddEditModal}  // Pass the open prop
        onClose={handleCloseAddEditModal} // Close the modal
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
        open={openViewModal}  // Fix: Pass the open prop for the View modal
        onClose={handleCloseViewModal} // Close the modal
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
                onSelect={() => handleViewEmployee(employee)}  // Pass onSelect to handle viewing
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
