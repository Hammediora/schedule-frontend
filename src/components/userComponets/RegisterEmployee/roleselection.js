import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const RoleSelection = ({ user, setUser, error }) => {
  const handleChange = (e) => {
    setUser((prevUser) => ({ ...prevUser, role: e.target.value }));
  };

  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      <InputLabel id="role-label">Role</InputLabel>
      <Select
        labelId="role-label"
        id="role"
        name="role"
        value={user.role}
        onChange={handleChange}
        label="Role"
        required
      >
        <MenuItem value="general manager">General Manager</MenuItem>
        <MenuItem value="service manager">Service Manager</MenuItem>
        <MenuItem value="kitchen manager">Kitchen Manager</MenuItem>
        <MenuItem value="crew member">Crew Member</MenuItem>
      </Select>
    </FormControl>
  );
};

export default RoleSelection;
