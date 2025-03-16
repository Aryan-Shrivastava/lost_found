import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  Fade,
  Zoom,
  Divider,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import {
  Security as SecurityIcon,
  FindInPage as FindIcon,
  Favorite as FavoriteIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

const teamMembers = [
  {
    name: "Alex Johnson",
    role: "Founder & CEO",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Alex founded Lost & Found with a mission to help people reconnect with their lost belongings using technology."
  },
  {
    name: "Sarah Chen",
    role: "Lead Developer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Sarah leads our development team and is responsible for building our matching algorithm and user experience."
  },
  {
    name: "Michael Rodriguez",
    role: "Community Manager",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    bio: "Michael works with our user community to ensure the platform meets their needs and helps resolve complex cases."
  },
  {
    name: "Priya Patel",
    role: "UX Designer",
    image: "https://randomuser.me/api/portraits/women/63.jpg",
    bio: "Priya designs our user interfaces with a focus on accessibility and intuitive navigation for all users."
  }
];

const features = [
  {
    title: "Smart Matching",
    description: "Our advanced algorithm connects lost items with found reports using category matching and keyword analysis.",
    icon: <FindIcon fontSize="large" color="primary" />
  },
  {
    title: "Secure & Private",
    description: "Your personal information is protected and only shared when necessary to facilitate item returns.",
    icon: <SecurityIcon fontSize="large" color="primary" />
  },
  {
    title: "Community Driven",
    description: "Built by and for a community of people who believe in helping each other recover lost belongings.",
    icon: <PeopleIcon fontSize="large" color="primary" />
  },
  {
    title: "Free Service",
    description: "Our platform is completely free to use because we believe helping others shouldn't come with a price tag.",
    icon: <FavoriteIcon fontSize="large" color="primary" />
  }
];

const About = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Hero Section */}
        <Fade in={true} timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                textShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              About Lost & Found
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}
            >
              We're on a mission to help people reconnect with their lost belongings and build a more helpful community.
            </Typography>
          </Box>
        </Fade>

        {/* Our Story Section */}
        <Zoom in={true} style={{ transitionDelay: '200ms' }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              mb: 6, 
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h4" component="h2" gutterBottom color="primary.main">
                  Our Story
                </Typography>
                <Typography variant="body1" paragraph>
                  Lost & Found began in 2023 when our founder lost his laptop at a university campus and realized how difficult it was to connect with the person who found it.
                </Typography>
                <Typography variant="body1" paragraph>
                  After eventually recovering his laptop through a series of coincidences, he decided to build a platform that would make it easier for people to reconnect with their lost items.
                </Typography>
                <Typography variant="body1">
                  Today, our platform has helped thousands of people recover their lost belongings, from keys and wallets to pets and sentimental items.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
                  alt="Team collaboration"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Zoom>

        {/* Features Section */}
        <Box sx={{ mb: 6 }}>
          <Fade in={true} timeout={1000}>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom 
              align="center" 
              color="primary.main"
              sx={{ mb: 4 }}
            >
              What Makes Us Different
            </Typography>
          </Fade>
          
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom in={true} style={{ transitionDelay: `${200 + index * 100}ms` }}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: 4,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team Section */}
        <Box sx={{ mb: 6 }}>
          <Fade in={true} timeout={1000}>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom 
              align="center" 
              color="primary.main"
              sx={{ mb: 4 }}
            >
              Meet Our Team
            </Typography>
          </Fade>
          
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom in={true} style={{ transitionDelay: `${300 + index * 100}ms` }}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      overflow: 'hidden',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={member.image}
                      alt={member.name}
                    />
                    <CardContent>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {member.name}
                      </Typography>
                      <Typography variant="subtitle2" color="primary.main" gutterBottom>
                        {member.role}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.bio}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Mission Section */}
        <Zoom in={true} style={{ transitionDelay: '400ms' }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.05) 0%, rgba(63, 81, 181, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom color="primary.main">
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph sx={{ maxWidth: '800px', mx: 'auto' }}>
              We believe in the power of community and technology to solve everyday problems. Our mission is to create a world where lost items find their way back home, where strangers help each other, and where technology brings people together rather than driving them apart.
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', fontStyle: 'italic' }}>
              "Every lost item has a story. We're here to help write the happy ending."
            </Typography>
          </Paper>
        </Zoom>
      </Box>
    </Container>
  );
};

export default About; 