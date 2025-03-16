import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    console.log('Login component mounted');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is already logged in:', user.email);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/app/gallery');
      } else {
        console.log('No user logged in');
        localStorage.removeItem('user');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    console.log('Starting Google login process...');

    try {
      // Configure Google provider to always show account selection
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google login successful:', result.user.email);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Navigate to gallery
      console.log('Navigating to gallery...');
      navigate('/app/gallery');
    } catch (error) {
      console.error('Google login error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Google login was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Please allow popups for this site to use Google login.');
      } else {
        setError(`Failed to log in with Google: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
            Lost & Found
          </Typography>
          
          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            Sign in with your Google account to continue
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            disabled={loading}
            sx={{
              backgroundColor: '#4285f4',
              color: 'white',
              '&:hover': {
                backgroundColor: '#357ae8',
              },
              py: 1.5
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign in with Google'}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 