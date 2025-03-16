import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Grid,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  FindInPage as LostIcon,
  AddCircle as FoundIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

// Mock data for lost items history
const mockLostItems = [
  {
    id: 1,
    title: 'Lost Wallet',
    description: 'Black leather wallet with ID cards',
    location: 'University Library',
    date: '2023-03-15',
    time: '14:30',
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1627843240167-b1f9a9f9c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    title: 'Lost Headphones',
    description: 'Sony WH-1000XM4 noise cancelling headphones',
    location: 'Campus Cafeteria',
    date: '2023-03-10',
    time: '12:15',
    status: 'found',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8aGVhZHBob25lc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 3,
    title: 'Lost Textbook',
    description: 'Computer Science Algorithms textbook',
    location: 'Computer Lab',
    date: '2023-02-28',
    time: '16:45',
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dGV4dGJvb2t8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
  }
];

// Mock data for found items history
const mockFoundItems = [
  {
    id: 1,
    title: 'Found Keys',
    description: 'Set of keys with a blue keychain',
    location: 'Student Center',
    date: '2023-03-18',
    time: '09:45',
    status: 'claimed',
    image: 'https://images.unsplash.com/photo-1582550740000-5643a2213e9d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8a2V5c3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    title: 'Found Water Bottle',
    description: 'Metal water bottle, blue color',
    location: 'Gym',
    date: '2023-03-05',
    time: '18:30',
    status: 'unclaimed',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8d2F0ZXIlMjBib3R0bGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
  }
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [lostItems, setLostItems] = useState(mockLostItems);
  const [foundItems, setFoundItems] = useState(mockFoundItems);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // In a real app, you would fetch the user's lost and found items from a database
    // For now, we're using mock data
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'found':
      case 'claimed':
        return 'success';
      case 'pending':
      case 'unclaimed':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5">Loading profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="profile-container">
      <Paper 
        elevation={3} 
        className="profile-header"
      >
        {/* Profile Header */}
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'center' : 'flex-start', mb: 4 }}>
          <Avatar
            src={user.photoURL || ""}
            alt={user.displayName || "User"}
            className="profile-avatar"
            sx={{
              mb: isMobile ? 2 : 0,
              mr: isMobile ? 0 : 3,
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {user.displayName || "User"}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since: {formatDate(new Date(user.metadata?.creationTime || Date.now()).toISOString().split('T')[0])}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />}
                onClick={() => navigate('/settings')}
                sx={{ mr: 1 }}
              >
                Edit Profile
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* History Tabs */}
        <Box sx={{ width: '100%' }}>
          <Box className="profile-tabs" sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              centered={!isMobile}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons={isMobile ? "auto" : false}
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-selected': {
                    color: '#fff',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            >
              <Tab 
                icon={<HistoryIcon />} 
                label="All History" 
                iconPosition="start" 
              />
              <Tab 
                icon={<LostIcon />} 
                label="Lost Items" 
                iconPosition="start" 
              />
              <Tab 
                icon={<FoundIcon />} 
                label="Found Items" 
                iconPosition="start" 
              />
            </Tabs>
          </Box>

          {/* All History Tab */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <LostIcon sx={{ mr: 1 }} /> Lost Items
                </Typography>
                <List>
                  {lostItems.map((item) => (
                    <ListItem 
                      key={item.id}
                      sx={{ 
                        mb: 2, 
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: 2,
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          src={item.image} 
                          variant="rounded"
                          sx={{ width: 60, height: 60, mr: 1 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">{item.title}</Typography>
                            <Chip 
                              label={item.status} 
                              size="small" 
                              color={getStatusColor(item.status)}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary" component="span">
                              <LocationIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                              {item.location}
                            </Typography>
                            <br />
                            <Typography variant="body2" color="text.secondary" component="span">
                              <CalendarIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                              {formatDate(item.date)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <FoundIcon sx={{ mr: 1 }} /> Found Items
                </Typography>
                <List>
                  {foundItems.map((item) => (
                    <ListItem 
                      key={item.id}
                      sx={{ 
                        mb: 2, 
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: 2,
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          src={item.image} 
                          variant="rounded"
                          sx={{ width: 60, height: 60, mr: 1 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">{item.title}</Typography>
                            <Chip 
                              label={item.status} 
                              size="small" 
                              color={getStatusColor(item.status)}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary" component="span">
                              <LocationIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                              {item.location}
                            </Typography>
                            <br />
                            <Typography variant="body2" color="text.secondary" component="span">
                              <CalendarIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                              {formatDate(item.date)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}

          {/* Lost Items Tab */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              {lostItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card 
                    key={item.id} 
                    className="item-card"
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: 2,
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.image}
                      alt={item.title}
                    />
                    <CardContent className="item-card-content">
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="div">
                          {item.title}
                        </Typography>
                        <span className={`item-status status-${item.status}`}>
                          {item.status}
                        </span>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {item.description}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                          {item.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                          {formatDate(item.date)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                          <TimeIcon fontSize="small" sx={{ mr: 1 }} />
                          {item.time}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Found Items Tab */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              {foundItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card 
                    key={item.id} 
                    className="item-card"
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: 2,
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.image}
                      alt={item.title}
                    />
                    <CardContent className="item-card-content">
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="div">
                          {item.title}
                        </Typography>
                        <span className={`item-status status-${item.status}`}>
                          {item.status}
                        </span>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {item.description}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                          {item.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                          {formatDate(item.date)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                          <TimeIcon fontSize="small" sx={{ mr: 1 }} />
                          {item.time}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Empty State */}
          {tabValue === 1 && lostItems.length === 0 && (
            <Box className="empty-state">
              <LostIcon className="empty-state-icon" />
              <Typography variant="h6" gutterBottom>
                No Lost Items
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                You haven't reported any lost items yet.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<LostIcon />}
                onClick={() => navigate('/report-lost')}
                sx={{ mt: 2 }}
              >
                Report Lost Item
              </Button>
            </Box>
          )}

          {tabValue === 2 && foundItems.length === 0 && (
            <Box className="empty-state">
              <FoundIcon className="empty-state-icon" />
              <Typography variant="h6" gutterBottom>
                No Found Items
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                You haven't reported any found items yet.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<FoundIcon />}
                onClick={() => navigate('/report-found')}
                sx={{ mt: 2 }}
              >
                Report Found Item
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 