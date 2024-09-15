import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { TextField, Button, Box, Typography, Container, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from "../../services/api";  // Import the API service for Axios

const SignUp = () => {
  const nameRef = useRef();  // Reference for the name input
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const { signup } = useAuth();  // Use the signup method from AuthContext
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);

      // Step 1: Sign up the user using Firebase Auth
      const userCredential = await signup(emailRef.current.value, passwordRef.current.value);
      const firebaseUser = userCredential.user;  // Get the Firebase user object

      // Step 2: Send user data to the backend API to save in your database
      await api.post('/users', {   // Use relative path with Axios instance
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name: nameRef.current.value,  // Send name to the backend
      });

      // Step 3: Optionally, redirect the user after signing up
      window.location.href = '/dashboard';  // Redirect to dashboard
    } catch (error) {
      // Firebase or backend error handling
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);  // Backend error
      } else {
        setError("Failed to create an account. Please try again.");  // General error
      }
      console.error("Error during signup: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '60vh',
        justifyContent: 'center',
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: 'background.default',
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>
        Sign Up
      </Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Full Name"
          inputRef={nameRef}
          autoComplete="name"
          autoFocus
          InputLabelProps={{ style: { color: '#451400' } }}
          InputProps={{ style: { color: '#451400' } }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Email Address"
          inputRef={emailRef}
          autoComplete="email"
          InputLabelProps={{ style: { color: '#451400' } }}
          InputProps={{ style: { color: '#451400' } }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          inputRef={passwordRef}
          autoComplete="current-password"
          InputLabelProps={{ style: { color: '#451400' } }}
          InputProps={{
            style: { color: '#451400' },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          inputRef={confirmPasswordRef}
          InputLabelProps={{ style: { color: '#451400' } }}
          InputProps={{
            style: { color: '#451400' },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </Box>
    </Container>
  );
};

export default SignUp;
