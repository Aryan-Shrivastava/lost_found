import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Lost & Found
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          Helping you find what you've lost
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/report-lost')}
            sx={{ mr: 2 }}
          >
            Report Lost Item
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/gallery')}
          >
            Browse Lost Items
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 