import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Avatar, Button, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { styled } from '@mui/system';

// Helper to get initials
const getInitials = (name) => {
  if (!name) return '';
  const [first, last] = name.split(' ');
  return `${first?.[0]}${last?.[0]}`.toUpperCase();
};

// Generate consistent color based on name
const getColor = (name) => {
    const greys = ['#f5f5f5', '#e0e0e0', '#cccccc', '#b3b3b3', '#999999', '#808080', '#666666'];
    const index = name.charCodeAt(0) % greys.length;
    return greys[index];
  };

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  const avatarSrc = employee.profilePicture || '';
  const bgColor = avatarSrc ? 'transparent' : getColor(employee.name);

  return (
    <StyledCard>
      <Grid container alignItems="center" sx={{ height: '100%' }} >
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
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
              {employee.name}
            </Typography>
            <Typography variant="body1" sx={{ color: '#333' }}>
              {employee.role}
            </Typography>
            <Typography variant="caption" sx={{ color: '#333' }}>
              Employee ID: {employee.employeeId}
            </Typography>
          </CardContent>
        </Grid>

        {/* Avatar Section */}
        <Grid item xs={12} md={2}>
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
                color: '#37474F',
                fontSize: '1.5rem',
              }}
            >
              {!avatarSrc && getInitials(employee.name)}
            </Avatar>
          </Box>
        </Grid>

        {/* Actions Section */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', padding: '16px'}}>
          <Tooltip title="Edit Employee" arrow>
            <ActionButton onClick={() => onEdit(employee)}>
              <Edit fontSize="small" /> Edit
            </ActionButton>
          </Tooltip>
          <Tooltip title="Delete Employee" arrow>
            <ActionButton onClick={() => onDelete(employee._id)} color="error">
              <Delete fontSize="small" /> Delete
            </ActionButton>
          </Tooltip>
        </Grid>
      </Grid>
    </StyledCard>
  );
};

// Styled Components

// Card with clean design and subtle hover animation
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 720,
  marginBottom: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
  },
}));

// Button for edit/delete actions
const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ECEFF1',
  color: theme.palette.text.primary,
  marginLeft: theme.spacing(1),
  borderRadius: '12px',
  textTransform: 'none',
  padding: '6px 16px',
  transition: 'background 0.3s ease',
  fontSize: '0.875rem',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#CFD8DC',
  },
}));

export default EmployeeCard;
