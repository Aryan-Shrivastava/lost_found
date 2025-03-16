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
  Info as InfoIcon,
} from '@mui/icons-material';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../context/ItemsContext';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [userLostItems, setUserLostItems] = useState([]);
  const [userFoundItems, setUserFoundItems] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { lostItems, foundItems } = useItems();

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Filter items for this user
      if (lostItems && lostItems.length > 0) {
        const filteredLostItems = lostItems.filter(item => 
          item.userId === parsedUser.uid || item.userEmail === parsedUser.email
        );
        setUserLostItems(filteredLostItems);
      }
      
      if (foundItems && foundItems.length > 0) {
        const filteredFoundItems = foundItems.filter(item => 
          item.userId === parsedUser.uid || item.userEmail === parsedUser.email
        );
        setUserFoundItems(filteredFoundItems);
      }
    }
  }, [lostItems, foundItems]);

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

  // Render empty state if no items
  const renderEmptyState = (type) => (
    <Box className="empty-state">
      <InfoIcon className="empty-state-icon" />
      <Typography variant="h6" gutterBottom>
        No {type} items yet
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {type === 'lost' 
          ? "You haven't reported any lost items yet." 
          : "You haven't reported any found items yet."}
      </Typography>
      <Button 
        variant="contained" 
        color="primary"
        onClick={() => navigate(type === 'lost' ? '/report-lost' : '/report-found')}
        sx={{ mt: 2 }}
      >
        Report {type === 'lost' ? 'a Lost Item' : 'a Found Item'}
      </Button>
    </Box>
  );

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

        {/* Tabs for different sections */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          className="profile-tabs"
          sx={{ mb: 3 }}
        >
          <Tab 
            icon={<HistoryIcon />} 
            label="All History" 
            id="tab-0" 
            aria-controls="tabpanel-0" 
          />
          <Tab 
            icon={<LostIcon />} 
            label="Lost Items" 
            id="tab-1" 
            aria-controls="tabpanel-1" 
          />
          <Tab 
            icon={<FoundIcon />} 
            label="Found Items" 
            id="tab-2" 
            aria-controls="tabpanel-2" 
          />
        </Tabs>

        {/* All History Tab */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LostIcon sx={{ mr: 1 }} /> Lost Items
              </Typography>
              {userLostItems.length > 0 ? (
                <List>
                  {userLostItems.map((item) => (
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
                              {formatDate(item.date || item.createdAt)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : renderEmptyState('lost')}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <FoundIcon sx={{ mr: 1 }} /> Found Items
              </Typography>
              {userFoundItems.length > 0 ? (
                <List>
                  {userFoundItems.map((item) => (
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
                              {formatDate(item.date || item.createdAt)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : renderEmptyState('found')}
            </Grid>
          </Grid>
        )}

        {/* Lost Items Tab */}
        {tabValue === 1 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LostIcon sx={{ mr: 1 }} /> Your Lost Items
            </Typography>
            {userLostItems.length > 0 ? (
              <Grid container spacing={3}>
                {userLostItems.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card className="item-card">
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.image || "https://via.placeholder.com/300x200?text=No+Image"}
                        alt={item.title}
                      />
                      <CardContent className="item-card-content">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" component="div">
                            {item.title}
                          </Typography>
                          <Chip 
                            label={item.status} 
                            size="small" 
                            color={getStatusColor(item.status)}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {item.description}
                        </Typography>
                        <Box sx={{ mt: 'auto' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                            {item.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
                            {formatDate(item.date || item.createdAt)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : renderEmptyState('lost')}
          </>
        )}

        {/* Found Items Tab */}
        {tabValue === 2 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <FoundIcon sx={{ mr: 1 }} /> Your Found Items
            </Typography>
            {userFoundItems.length > 0 ? (
              <Grid container spacing={3}>
                {userFoundItems.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card className="item-card">
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.image || "https://via.placeholder.com/300x200?text=No+Image"}
                        alt={item.title}
                      />
                      <CardContent className="item-card-content">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" component="div">
                            {item.title}
                          </Typography>
                          <Chip 
                            label={item.status} 
                            size="small" 
                            color={getStatusColor(item.status)}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {item.description}
                        </Typography>
                        <Box sx={{ mt: 'auto' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                            {item.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
                            {formatDate(item.date || item.createdAt)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : renderEmptyState('found')}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Profile; 