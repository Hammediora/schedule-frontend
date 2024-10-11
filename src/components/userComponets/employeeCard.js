import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Avatar, Button, Tooltip, Chip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { styled } from '@mui/system';

// Helper to get initials from the employee name
const getInitials = (name) => {
  if (!name) return '';
  const [first, last] = name.split(' ');
  return `${first?.[0]}${last?.[0]}`.toUpperCase();
};

// Color palette for the avatar
const getAvatarColor = (name) => {
  const colors = ['#E57373', '#64B5F6', '#81C784', '#FFD54F', '#4DB6AC', '#BA68C8'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Color palette for the task chips
const getTaskColor = (taskName) => {
  const taskColors = ['#FFCDD2', '#BBDEFB', '#C8E6C9', '#FFE082', '#B2DFDB', '#D1C4E9'];
  const index = taskName.charCodeAt(0) % taskColors.length;
  return taskColors[index];
};

// Employee card component
const EmployeeCard = ({ employee, onEdit, onDelete, onSelect }) => {
  const avatarSrc = employee.profilePicture || '';
  const bgColor = avatarSrc ? 'transparent' : getAvatarColor(employee.name);
  
  const tasks = employee.assignedTasks || [];  

  // Display a limited number of tasks (first 3), with "+X more" if there are additional tasks
  const displayedTasks = tasks.slice(0, 3);
  const extraTaskCount = tasks.length - displayedTasks.length;

  return (
    <ClickableBox onClick={() => onSelect(employee)}>
      <StyledCard>
        <Grid container alignItems="center" sx={{ height: '100%' }}>
          
          {/* Info Section */}
          <Grid item xs={12} md={9}>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '24px',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4E342E' }}>
                {employee.name}
              </Typography>
              <Typography variant="body1" sx={{ color: '#6D4C41' }}>
                {employee.role}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6D4C41' }}>
                Employee ID: {employee.employeeId}
              </Typography>

              {/* Display the assigned tasks */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1, flexWrap: 'wrap' }}>
                {displayedTasks.map((task) => (
                  <Tooltip title={task.task_name} key={task._id}>
                    <Chip
                      label={task.task_name}
                      sx={{
                        maxWidth: '120px', 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',  
                        backgroundColor: getTaskColor(task.task_name), 
                        color: '#333',  
                      }}
                    />
                  </Tooltip>
                ))}
                {extraTaskCount > 0 && (
                  <Typography variant="body2" sx={{ color: '#6D4C41' }}>
                    +{extraTaskCount} more
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Grid>

          {/* Avatar Section */}
          <Grid item xs={12} md={3}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                padding: '24px',
              }}
            >
              <Avatar
                alt={employee.name}
                src={avatarSrc}
                sx={{
                  height: 96,
                  width: 96,
                  backgroundColor: bgColor, 
                  color: '#fff',
                  fontSize: '1.5rem',
                }}
              >
                {!avatarSrc && getInitials(employee.name)}
              </Avatar>
            </Box>
          </Grid>

          {/* Actions Section */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
            <Tooltip title="Edit Employee" arrow>
              <ActionButton onClick={(e) => { e.stopPropagation(); onEdit(employee); }}>
                <Edit fontSize="small" /> Edit
              </ActionButton>
            </Tooltip>
            <Tooltip title="Delete Employee" arrow>
              <ActionButton onClick={(e) => { e.stopPropagation(); onDelete(employee._id); }} color="error">
                <Delete fontSize="small" /> Delete
              </ActionButton>
            </Tooltip>
          </Grid>
        </Grid>
      </StyledCard>
    </ClickableBox>
  );
};

// Wrapper to make the card clickable and change the cursor
const ClickableBox = styled(Box)({
  cursor: 'pointer',
});

// Card design
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 720,
  marginBottom: theme.spacing(4),
  borderRadius: '16px',
  backgroundColor: '#E6D6C2',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
  },
}));

// Button for edit/delete actions
const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#83C5BE',  // Edit button color
  color: '#000000',
  marginLeft: theme.spacing(1),
  borderRadius: '12px',
  textTransform: 'none',
  padding: '6px 16px',
  transition: 'background 0.3s ease',
  fontSize: '0.875rem',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#2A9D8F',  
  },
  '&[color="error"]': {
    backgroundColor: '#F67280', 
    '&:hover': {
      backgroundColor: '#C06C84',  
    },
  },
}));

export default EmployeeCard;
