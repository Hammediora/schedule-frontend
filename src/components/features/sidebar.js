import { Box, Toolbar, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { People as PeopleIcon, CalendarToday as CalendarTodayIcon, Dashboard as DashboardIcon } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

const Sidebar = ({ collapsed }) => {
  const { currentUser } = useAuth();
  const location = useLocation();  

  return currentUser ? (
    <Box
      sx={{
        width: collapsed ? 64 : drawerWidth,
        transition: 'width 0.3s ease',
        flexShrink: 0,
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        boxShadow: 3, 
        overflow: 'hidden', 
      }}
    >
      <Toolbar />

      {/* Menu List Items */}
      <List sx={{ padding: 0 }}>
        {/* Dashboard Tab */}
        <ListItem
          button
          component={Link}
          to="/dashboard"
          selected={location.pathname === '/dashboard'}
          sx={{ justifyContent: collapsed ? 'center' : 'initial', padding: '16px' }}
        >
          <ListItemIcon sx={{ justifyContent: 'center', minWidth: 0, mr: collapsed ? 0 : 2 }}>
            <DashboardIcon color={location.pathname === '/dashboard' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Dashboard" />}
        </ListItem>

        {/* Employees Tab */}
        <ListItem
          button
          component={Link}
          to="/employees"
          selected={location.pathname === '/employees'}
          sx={{ justifyContent: collapsed ? 'center' : 'initial', padding: '16px' }}
        >
          <ListItemIcon sx={{ justifyContent: 'center', minWidth: 0, mr: collapsed ? 0 : 2 }}>
            <PeopleIcon color={location.pathname === '/employees' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Employees" />}
        </ListItem>

        {/* Schedules Tab */}
        <ListItem
          button
          component={Link}
          to="/schedules"
          selected={location.pathname === '/schedules'}
          sx={{ justifyContent: collapsed ? 'center' : 'initial', padding: '16px' }}
        >
          <ListItemIcon sx={{ justifyContent: 'center', minWidth: 0, mr: collapsed ? 0 : 2 }}>
            <CalendarTodayIcon color={location.pathname === '/schedules' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Schedules" />}
        </ListItem>
      </List>
    </Box>
  ) : null;
};

export default Sidebar;
