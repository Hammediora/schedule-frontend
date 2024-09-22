import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/features/layout';
import HomePage from './components/pages/landingPage';
import EmployeePage from './components/pages/employeepage';
import SchedulePage from './components/pages/schedulepage';
import theme from './style/theme';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoutes';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
      <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* Protected routes for authenticated users only */}
              <Route
                path="/employees"
                element={
                  <ProtectedRoute>
                    <EmployeePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schedules"
                element={
                  <ProtectedRoute>
                    <SchedulePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
       </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
