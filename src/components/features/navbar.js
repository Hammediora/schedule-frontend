import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Box, Badge, CircularProgress,
  Modal, Fade, Backdrop, Tooltip
} from '@mui/material';
import { ChevronLeft as ChevronLeftIcon  } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../contexts/AuthContext';  // Updated: useAuth now has MongoDB profile data
import { styled } from '@mui/material/styles';

const Navbar = ({ handleDrawerToggle }) => {
  const { currentUser, userProfile, logout, authError, isAuthenticated } = useAuth();  // Use isAuthenticated from useAuth()
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [hover, setHover] = useState(false);

  // Function to open the avatar menu
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to close the avatar menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Function to handle logout
  const handleLogout = async () => {
    setLoadingLogout(true);
    await logout();
    setLoadingLogout(false);
    handleMenuClose();
  };

  // Helper function to get user initials for avatar
  const getUserInitials = () => {
    if (userProfile?.name) {
      const nameParts = userProfile.name.split(' ');
      return nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : '');
    } else if (currentUser?.email) {
      const emailParts = currentUser.email.split('@')[0].split('.');
      return emailParts[0][0] + (emailParts[1] ? emailParts[1][0] : '');
    }
    return '';
  };

  useEffect(() => {
    const fetchNotifications = () => {
      // Simulate fetching notifications from an API
      setTimeout(() => {
        setNotifications(3); // Example, can be replaced with real data
      }, 2000);
    };
    fetchNotifications();
  }, []);

  // Styled modal for account info
  const StyledModal = styled(Modal)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Conditionally show the mobile menu button (hamburger icon) only if the user is authenticated */}
        {isAuthenticated() && (  // Check if the user is authenticated before rendering the menu
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle} // Toggle the sidebar when clicked
            sx={{ mr: 2 }}
          >
            {handleDrawerToggle ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}

        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Employee Scheduling App
        </Typography>

        {isAuthenticated() && currentUser && userProfile && ( // Ensure both Firebase user and MongoDB profile are loaded
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Account Settings" arrow>
              <IconButton
                onClick={handleMenuClick}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                sx={{
                  p: 0,
                  transition: 'transform 0.3s ease-in-out',
                  transform: hover ? 'scale(1.1)' : 'scale(1.0)',
                }}
              >
                <Badge badgeContent={notifications} color="error" overlap="circular">
                  <Avatar
                    src={currentUser.photoURL}
                    sx={{
                      bgcolor: currentUser.photoURL ? 'transparent' : '#451400',
                      color: currentUser.photoURL ? 'inherit' : '#FFFAF0',
                    }}
                  >
                    {!currentUser.photoURL && getUserInitials()}
                  </Avatar>
                </Badge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ mt: '45px' }}
            >
              <MenuItem disabled>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {userProfile.name || currentUser.email} {/* Show name from MongoDB profile or email */}
                </Typography>
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); setOpenModal(true); }}>
                <Typography>Account Info</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                {loadingLogout ? <CircularProgress size={20} /> : <Typography>Logout</Typography>}
              </MenuItem>
            </Menu>

            {/* Account Info Modal */}
            <StyledModal
              open={openModal}
              onClose={() => setOpenModal(false)}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{ timeout: 500 }}
            >
              <Fade in={openModal}>
                <Box
                  sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    width: 400,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Account Information
                  </Typography>
                  <Typography variant="body1">Name: {userProfile.name || 'N/A'}</Typography>
                  <Typography variant="body1">Email: {currentUser.email}</Typography>
                  <Typography variant="body1">Role: {userProfile.role || 'Employee'}</Typography>
                  <Typography variant="body1">Employee ID: {userProfile.employeeId || 'N/A'}</Typography> {/* Show employee ID */}
                </Box>
              </Fade>
            </StyledModal>
          </Box>
        )}
      </Toolbar>
      {/* Handle errors */}
      {authError && (
        <Box sx={{ padding: 2, backgroundColor: 'red', color: 'white', textAlign: 'center' }}>
          <Typography variant="body2">Error: {authError}</Typography>
        </Box>
      )}
    </AppBar>
  );
};

export default Navbar;
