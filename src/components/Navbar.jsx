import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log('Logging out user...');
      await signOut(auth);
      localStorage.removeItem('user');
      console.log('User logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: 'bold' }}
            >
              Lost & Found Portal
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                color="inherit"
                onClick={() => navigate('/app')}
                sx={{ textTransform: 'none' }}
              >
                Home
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/app/report')}
                sx={{ textTransform: 'none' }}
              >
                Report Lost
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/app/gallery')}
                sx={{ textTransform: 'none' }}
              >
                Gallery
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{ textTransform: 'none' }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Navbar; 