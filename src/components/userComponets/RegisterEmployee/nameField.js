import { TextField } from '@mui/material';

const NameField = ({ user, setUser, error }) => {
  const handleChange = (e) => {
    setUser((prevUser) => ({ ...prevUser, name: e.target.value }));
  };

  return (
    <TextField
      fullWidth
      label="Name"
      name="name"
      value={user.name}
      onChange={handleChange}
      margin="normal"
      required
      error={!!error}
      helperText={error}
    />
  );
};

export default NameField;
