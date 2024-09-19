import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser, getTasks, assignTasksToUser } from '../../services/api'; // Import task and user-related APIs
import EmployeeCard from '../userComponets/employeeCard';
import { Box, Typography, Grid, CircularProgress, Alert, Button, Modal, Fade, Backdrop } from '@mui/material';
import UserForm from '../userComponets/RegisterEmployee/AddEmployee';
import ViewEmployee from '../userComponets/viewEmployee';
import TaskModal from '../task/taskModal';
import EmployeeSearchAndFilter from '../userComponets/EmployeeSearchAndFilter';

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]); 
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState('');  
  const [filteredEmployees, setFilteredEmployees] = useState([]); 
  const [openAddEditModal, setOpenAddEditModal] = useState(false); 
  const [openViewModal, setOpenViewModal] = useState(false); 
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null); 

  // Fetch employees and tasks when the component mounts
  useEffect(() => {
    fetchEmployees();
    fetchTasks(); // Fetch tasks (stations) on page load
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getUsers();
      setEmployees(response.data);
      setFilteredEmployees(response.data);  // Initialize filtered employees with the full list
    } catch (error) {
      setError('Failed to load employees.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await getTasks(); // Fetch tasks from the backend
      setTasks(response.data); // Store tasks
    } catch (error) {
      setError('Failed to load tasks.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      const updatedEmployees = employees.filter((employee) => employee._id !== id);
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);  // Update filtered employees after deletion
    } catch (error) {
      setError('Failed to delete employee.');
    }
  };

  const handleAssignTask = async (employee, taskId) => {
    try {
      await assignTasksToUser(employee._id, [taskId]); // Assign the task using API
    } catch (error) {
      console.error('Failed to assign task:', error);
    }
  };

  const handleSearchAndFilter = (searchTerm, roleFilter) => {
    let filtered = employees;

    if (searchTerm) {
      const lowerCasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (employee) =>
          employee.name.toLowerCase().includes(lowerCasedSearchTerm) ||
          employee.employeeId.toLowerCase().includes(lowerCasedSearchTerm)
      );
    }

    if (roleFilter) {
      filtered = filtered.filter((employee) => employee.role === roleFilter);
    }

    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null); 
    setOpenAddEditModal(true); 
  };

  const handleEditEmployee = (employee) => {
    const employeeTasks = employee.tasks || [];
    const fullTaskObjects = employeeTasks.map(taskId => tasks.find(task => task._id === taskId));
    const updatedEmployee = { ...employee, tasks: fullTaskObjects };
  
    setSelectedEmployee(updatedEmployee); 
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

  const handleOpenTaskModal = () => {
    setOpenTaskModal(true); 
  };

  const handleCloseTaskModal = () => {
    setOpenTaskModal(false); 
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
      {/* Grid Layout for Search and Buttons */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8} mt={3} mb={3}>
          <EmployeeSearchAndFilter onSearch={handleSearchAndFilter} />
        </Grid>

        <Grid item xs={12} md={4} sx={{ mb: 3, mt: 3, display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleAddEmployee}
            disabled={openAddEditModal || openTaskModal}
            sx={{ fontFamily: "'Orbitron', sans-serif", mb: { xs: 2, md: 0 },
              height: '40px',
              padding: '8px 16px', 
              fontSize:'0.875rem'
            }}         
          >
            {selectedEmployee ? 'Edit Employee' : 'Add Employee'}
          </Button>

          <Button
            variant="contained"
            onClick={handleOpenTaskModal}
            disabled={openTaskModal || openAddEditModal}
            sx={{ fontFamily: "'Orbitron', sans-serif", mb: { xs: 2, md: 0 },
              height: '40px',
              padding: '8px 16px', 
              fontSize: '0.875rem', 
            }}       
          >
            {openTaskModal ? 'Adding Task...' : 'Add Task'}
          </Button>
        </Grid>
      </Grid>

      <TaskModal
        open={openTaskModal}
        onClose={handleCloseTaskModal}
        onTaskAdded={() => {
          handleCloseTaskModal();
          fetchTasks();
        }}
      />

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
            <ViewEmployee
              employee={selectedEmployee}
              tasks={tasks}
              onAssignTask={handleAssignTask}
            />
          </Box>
        </Fade>
      </Modal>

      {/* Employee Cards */}
      <Grid container spacing={2}>
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
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
