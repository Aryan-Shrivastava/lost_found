import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ReportLost from './components/ReportLost';
import Gallery from './components/Gallery';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { initEmailJS } from './utils/emailService';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  // Initialize EmailJS when the app starts
  useEffect(() => {
    // Initialize EmailJS with your user ID
    initEmailJS();
    console.log('EmailJS initialized');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Navbar />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="report" element={<ReportLost />} />
            <Route path="gallery" element={<Gallery />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
