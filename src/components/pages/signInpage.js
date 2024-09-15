import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";  // Import useAuth from your AuthContext
import { TextField, Button, Box, Typography, Container } from '@mui/material';

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, authError } = useAuth();  // Use the login method from AuthContext
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      setLoading(true);
      // Call the login function from AuthContext
      await login(emailRef.current.value, passwordRef.current.value);  // This will handle both Firebase login and backend token verification
      window.location.href = '/dashboard';  // Redirect after successful login
    } catch (error) {
      setError("Failed to log in. Please check your credentials.");
      console.error("Login error: ", error);
    }

    setLoading(false);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: 'background.default',
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>
        Sign In
      </Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {authError && <Typography color="error" sx={{ mb: 2 }}>{authError}</Typography>}  {/* Show Firebase Auth Errors */}
      <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Email Address"
          inputRef={emailRef}
          autoComplete="email"
          autoFocus
          InputLabelProps={{ style: { color: '#451400' } }}
          InputProps={{ style: { color: '#451400' } }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          inputRef={passwordRef}
          autoComplete="current-password"
          InputLabelProps={{ style: { color: '#451400' } }}
          InputProps={{ style: { color: '#451400' } }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? "Logging in..." : "Sign In"}
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
