import React, { useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import SignIn from './signInpage';
import SignUp from './signUpPage';

const HomePage = () => {
  const { currentUser } = useAuth();  
  const [showSignUp, setShowSignUp] = useState(true); 

  return (
    <Box
      sx={{
        display: 'flex',                      
        flexDirection: 'column',               
        justifyContent: 'center',              
        alignItems: 'center',                 
        minHeight: '100vh',                    
        padding: { xs: 2, md: 4 },             
        textAlign: 'center',
        margin: '0 auto',                    
        width: { xs: '100%', sm: '80%', md: '60%', lg: '40%' }, 
      }}
    >
      <Typography variant="h4" sx={{  padding: { xs: 2, md: 4 },  }}>
       
      </Typography>

      {!currentUser ? (
        <>
          {/* Conditionally render either the Sign Up or Sign In form */}
          {showSignUp ? <SignUp /> : <SignIn />}

          <Box sx={{ mt: 3, minHeight: '50vh', padding: { xs: 2, md: 4 }, }}>
            {showSignUp ? (
              <Typography>
                Already have an account?{' '}
                <Button 
                  variant="text" 
                  color="primary" 
                  onClick={() => setShowSignUp(false)}
                >
                  Sign in
                </Button>
              </Typography>
            ) : (
              <Typography>
                Don't have an account?{' '}
                <Button 
                  variant="text" 
                  color="primary" 
                  onClick={() => setShowSignUp(true)}
                >
                  Sign up
                </Button>
              </Typography>
            )}
          </Box>
        </>
      ) : (
        <Typography variant="h6">
          Welcome back, {currentUser.email}!
        </Typography>
      )}
    </Box>
  );
};

export default HomePage;
