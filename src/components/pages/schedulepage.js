import React, { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress, Alert, Typography, TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SalesInputForm from '../ScheduleComponent/SalesInputForm';
import WeeklyScheduleTable from '../ScheduleComponent/WeeklyScheduleTable';
import { getWeeklySchedules, generateWeeklySchedules } from '../../services/api';
import { formatISO, startOfWeek, } from 'date-fns'; 

const SchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [salesData, setSalesData] = useState({
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: '',
  });

  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch schedules wrapped in useCallback
  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError('');  
    try {
      const formattedWeekStart = formatISO(weekStart); 
      const response = await getWeeklySchedules(formattedWeekStart);
      setSchedules(response.data);
    } catch (err) {
      setError('Failed to load weekly schedules.');
    } finally {
      setLoading(false);
    }
  }, [weekStart]);

  useEffect(() => {
    fetchSchedules();
  }, [weekStart, fetchSchedules]);  

  const handleGenerateSchedules = async () => {
    setLoading(true);
    setError(''); 
    const numericSalesData = Object.keys(salesData).reduce((acc, day) => {
      acc[day] = Number(salesData[day]);
      return acc;
    }, {});

    try {
      await generateWeeklySchedules({ salesData: numericSalesData, weekStart: formatISO(weekStart) });
      fetchSchedules(); 
    } catch (err) {
      setError('Failed to generate schedules.');
    } finally {
      setLoading(false);
    }
  };

  const handleSalesInputChange = (day, value) => {
    setSalesData({ ...salesData, [day]: value });
  };

  // Handle date change from DatePicker
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);  
    const newWeekStart = startOfWeek(newDate, { weekStartsOn: 1 });
    setWeekStart(newWeekStart); 
    setError(''); 
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      {/* Heading with week information */}
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Weekly Schedule for {formatISO(weekStart, { representation: 'date' })}
      </Typography>

      {/* DatePicker to navigate between weeks */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          label="Select Any Date"
          value={selectedDate}  
          onChange={handleDateChange} 
          renderInput={(params) => (
            <Box sx={{ marginBottom: 3 }}>
              <TextField {...params} fullWidth />
            </Box>
          )}
          disableFuture={false}
        />
      </LocalizationProvider>

      {/* Display error messages if necessary */}
      {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

      <SalesInputForm
        salesData={salesData}
        handleSalesInputChange={handleSalesInputChange}
        handleGenerateSchedules={handleGenerateSchedules}
      />

      {schedules.length > 0 ? (
        <WeeklyScheduleTable schedules={schedules} fetchSchedules={fetchSchedules} weekStart={weekStart} />
      ) : (
        <Typography variant="body1" sx={{ marginTop: 3 }}>
          No schedules available for this week.
        </Typography>
      )}
    </Box>
  );
};

export default SchedulePage;
