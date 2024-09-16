import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Navbar from './navbar';
import Sidebar from './sidebar';
import Footer from './footer';

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setCollapsed(!collapsed); 
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      {/* Navbar */}
      <Navbar handleDrawerToggle={handleDrawerToggle} />

      {/* Content Area with Sidebar */}
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} handleCollapse={handleDrawerToggle} />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            transition: 'margin 0.3s ease', 
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Layout;
