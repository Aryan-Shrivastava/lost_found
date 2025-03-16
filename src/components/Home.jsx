import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Report as ReportIcon, PhotoLibrary as GalleryIcon } from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Lost Something?",
      description: "Report your lost items and find them quickly with our help.",
      image: "https://images.unsplash.com/photo-1616077168712-fc6c788bc4dc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      action: () => navigate('/report-lost')
    },
    {
      title: "Found Something?",
      description: "Help others by reporting items you've found on campus.",
      image: "https://images.unsplash.com/photo-1586892477838-2b96e85e0f96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
      action: () => navigate('/report-found')
    },
    {
      title: "Browse Lost & Found Items",
      description: "Check our gallery of reported items to find what you're looking for.",
      image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      action: () => navigate('/gallery')
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);
  
  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };
  
  return (
    <Box sx={{ py: 6 }}>
      {/* Hero Slider */}
      <Box className="slider-container" sx={{ height: { xs: '50vh', md: '60vh' }, mb: 6 }}>
        <Box 
          className="slider" 
          sx={{ 
            height: '100%',
            transform: `translateX(-${currentSlide * 100}%)` 
          }}
        >
          {slides.map((slide, index) => (
            <Box 
              key={index} 
              className="slide glass-container"
              sx={{
                height: '100%',
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: 4,
                color: 'white'
              }}
            >
              <Typography 
                variant="h2" 
                component="h1" 
                className="animated-text"
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                {slide.title}
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4,
                  maxWidth: '800px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}
                className="fade-in"
              >
                {slide.description}
              </Typography>
              <Button 
                variant="contained" 
                size="large" 
                onClick={slide.action}
                className="animated-button slide-up"
                sx={{
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  borderRadius: '30px',
                  fontSize: '1.1rem',
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Get Started
              </Button>
            </Box>
          ))}
        </Box>
        
        {/* Slider Navigation Dots */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          position: 'absolute', 
          bottom: '20px', 
          width: '100%' 
        }}>
          {slides.map((_, index) => (
            <Box 
              key={index}
              onClick={() => handleSlideChange(index)}
              sx={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                mx: 1,
                backgroundColor: currentSlide === index ? 'primary.main' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: currentSlide === index ? 'primary.main' : 'rgba(255,255,255,0.8)',
                }
              }}
            />
          ))}
        </Box>
      </Box>
      
      {/* Features Section */}
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          className="animated-text"
          sx={{ 
            mb: 6, 
            fontWeight: 'bold',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              width: '100px',
              height: '4px',
              backgroundColor: 'primary.main',
              transform: 'translateX(-50%)',
              borderRadius: '2px'
            }
          }}
        >
          Our Services
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card className="card-hover glass-container" sx={{ height: '100%' }}>
              <CardActionArea onClick={() => navigate('/report-lost')} sx={{ height: '100%' }}>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h3" gutterBottom>
                    Report Lost Items
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Quickly report your lost items with detailed descriptions to increase chances of recovery.
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card className="card-hover glass-container" sx={{ height: '100%' }}>
              <CardActionArea onClick={() => navigate('/report-found')} sx={{ height: '100%' }}>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <ReportIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h3" gutterBottom>
                    Report Found Items
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Help others by reporting items you've found. Be a hero in someone's story!
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card className="card-hover glass-container" sx={{ height: '100%' }}>
              <CardActionArea onClick={() => navigate('/gallery')} sx={{ height: '100%' }}>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <GalleryIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h3" gutterBottom>
                    Browse Gallery
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Browse through our comprehensive gallery of lost and found items to find what you're looking for.
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
        
        {/* Call to Action */}
        <Box 
          className="glass-container" 
          sx={{ 
            mt: 8, 
            p: 6, 
            textAlign: 'center',
            backgroundImage: 'linear-gradient(135deg, rgba(63, 81, 181, 0.1) 0%, rgba(63, 81, 181, 0.2) 100%)'
          }}
        >
          <Typography variant="h4" component="h3" gutterBottom className="animated-text">
            Ready to Find What You've Lost?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
            Our platform connects people who have lost items with those who have found them. Join our community today!
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/gallery')}
            className="animated-button"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '30px',
              fontSize: '1.1rem',
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Explore Gallery
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 