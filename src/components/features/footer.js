import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { LinkedIn, GitHub, Twitter } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 1, 
        textAlign: 'center',
        height: 'auto',
        backgroundColor: '#451400',
        color: '#FFFFFF',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
        <IconButton
          aria-label="LinkedIn"
          href="https://linkedin.com"
          target="_blank"
          sx={{ color: '#FFFFFF', fontSize: 'small' }} 
        >
          <LinkedIn />
        </IconButton>
        <IconButton
          aria-label="GitHub"
          href="https://github.com"
          target="_blank"
          sx={{ color: '#FFFFFF', fontSize: 'small' }}
        >
          <GitHub />
        </IconButton>
        <IconButton
          aria-label="Twitter"
          href="https://twitter.com"
          target="_blank"
          sx={{ color: '#FFFFFF', fontSize: 'small' }}
        >
          <Twitter />
        </IconButton>
      </Box>
      <Typography variant="body2" color="inherit">
        © 2024 Employee Scheduling App. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
