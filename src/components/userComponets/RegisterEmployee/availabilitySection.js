import { Grid, TextField, FormControlLabel, Checkbox, Typography } from '@mui/material';

const AvailabilitySection = ({ user, setUser, error }) => {
    const handleAvailabilityChange = (day, field, value) => {
      setUser((prevUser) => ({
        ...prevUser,
        availability: {
          ...prevUser.availability,
          [day]: { ...prevUser.availability[day], [field]: value, off: false },
        },
      }));
    };
  
    const handleDayOffChange = (day, checked) => {
      setUser((prevUser) => ({
        ...prevUser,
        availability: {
          ...prevUser.availability,
          [day]: {
            off: checked,
            start: checked ? '' : prevUser.availability[day].start,
            end: checked ? '' : prevUser.availability[day].end,
          },
        },
      }));
    };
  
    return (
      <>
        <Typography variant="h6" mt={3} mb={1} sx={{ fontWeight: 'medium' }}>
          Availability
        </Typography>
  
        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
          <Grid container spacing={2} key={day} sx={{ mt: 1 }}>
            <Grid item xs={3}>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                {day}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="time"
                label="Start"
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                value={user.availability[day].start}
                onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                disabled={user.availability[day].off}
                error={!!error}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="time"
                label="End"
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                value={user.availability[day].end}
                onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                disabled={user.availability[day].off}
                error={!!error}
              />
            </Grid>
            <Grid item xs={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={user.availability[day].off}
                    onChange={(e) => handleDayOffChange(day, e.target.checked)}
                  />
                }
                label="Off"
              />
            </Grid>
          </Grid>
        ))}
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </>
    );
  };

export default AvailabilitySection;
