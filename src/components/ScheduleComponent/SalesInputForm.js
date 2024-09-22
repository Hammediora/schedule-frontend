// components/SalesInputForm.js
import React from 'react';
import { Box, Grid, TextField, Button, Typography } from '@mui/material';

const SalesInputForm = ({ salesData, handleSalesInputChange, handleGenerateSchedules }) => {
  const isFormValid = Object.values(salesData).every(value => value !== ''); // Ensure all fields are filled

  return (
    <Box sx={{ marginBottom: 3 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Projected Sales Input
      </Typography>
      <Grid container spacing={2}>
        {Object.keys(salesData).map((day) => (
          <Grid item xs={12} sm={6} md={3} key={day}>
            <TextField
              label={`Projected Sales for ${day.charAt(0).toUpperCase() + day.slice(1)}`}
              type="number"
              value={salesData[day]}
              onChange={(e) => handleSalesInputChange(day, e.target.value)}
              fullWidth
              InputProps={{ inputProps: { min: 0 } }} // Prevent negative sales input
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        onClick={handleGenerateSchedules}
        disabled={!isFormValid} // Disable button if form is incomplete
      >
        Generate Weekly Schedule
      </Button>
    </Box>
  );
};

export default SalesInputForm;
