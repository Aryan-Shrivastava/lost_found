import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Menu,
  MenuItem,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  LocationOn, 
  CalendarToday, 
  ContactPhone,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
// import { sendItemSeenEmail, sendItemFoundEmail } from '../utils/emailService';

const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItemForMenu, setSelectedItemForMenu] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [seenDialogOpen, setSeenDialogOpen] = useState(false);
  const [haveDialogOpen, setHaveDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seenFormData, setSeenFormData] = useState({
    location: '',
    date: new Date().toISOString().split('T')[0],
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [haveFormData, setHaveFormData] = useState({
    location: '',
    date: new Date().toISOString().split('T')[0],
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    try {
      const storedItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
      setItems(storedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setError(null);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Failed to load items. Please try again later.');
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleMenuClick = (event, item) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedItemForMenu(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemForMenu(null);
  };

  const handleDeleteItem = () => {
    try {
      const updatedItems = items.filter(item => item.id !== selectedItemForMenu.id);
      localStorage.setItem('lostItems', JSON.stringify(updatedItems));
      setItems(updatedItems);
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleReportFound = () => {
    try {
      const updatedItems = items.map(item => {
        if (item.id === selectedItem.id) {
          return { ...item, status: 'found' };
        }
        return item;
      });

      localStorage.setItem('lostItems', JSON.stringify(updatedItems));
      setItems(updatedItems);
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const handleSeenObject = () => {
    // Pre-fill with current user's info if available
    if (currentUser && currentUser.email) {
      setSeenFormData({
        ...seenFormData,
        name: currentUser.displayName || '',
        email: currentUser.email || '',
      });
    }
    setSeenDialogOpen(true);
  };

  const handleHaveObject = () => {
    // Pre-fill with current user's info if available
    if (currentUser && currentUser.email) {
      setHaveFormData({
        ...haveFormData,
        name: currentUser.displayName || '',
        email: currentUser.email || '',
      });
    }
    setHaveDialogOpen(true);
  };

  const handleSeenSubmit = async () => {
    setLoading(true);
    try {
      // Update the item in localStorage
      const updatedItems = items.map(item => {
        if (item.id === selectedItem.id) {
          return { 
            ...item, 
            seenCount: (item.seenCount || 0) + 1,
            lastSeen: new Date().toISOString(),
            sightings: [
              ...(item.sightings || []),
              {
                ...seenFormData,
                date: new Date(seenFormData.date).toISOString(),
                reportedAt: new Date().toISOString(),
              }
            ]
          };
        }
        return item;
      });

      localStorage.setItem('lostItems', JSON.stringify(updatedItems));
      setItems(updatedItems);
      
      setSeenDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Thank you for reporting that you have seen this item. The owner has been notified.',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating item:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update item status',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHaveSubmit = async () => {
    setLoading(true);
    try {
      // Update the item in localStorage
      const updatedItems = items.map(item => {
        if (item.id === selectedItem.id) {
          return { 
            ...item, 
            status: 'found',
            foundBy: currentUser.email,
            foundDate: new Date().toISOString(),
            foundDetails: {
              ...haveFormData,
              date: new Date(haveFormData.date).toISOString(),
              reportedAt: new Date().toISOString(),
            }
          };
        }
        return item;
      });

      localStorage.setItem('lostItems', JSON.stringify(updatedItems));
      setItems(updatedItems);
      
      setHaveDialogOpen(false);
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: 'Thank you for reporting that you have this item. The owner has been notified.',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating item:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update item status',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lastSeenLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isItemOwner = (item) => item.userEmail === currentUser.email;

  const getItemImage = (item) => {
    if (item.images && item.images.length > 0) {
      return item.images[0];
    }
    return 'https://via.placeholder.com/400x300?text=No+Image+Available';
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          Lost Items Gallery
        </Typography>
        
        <Paper elevation={2} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
          <TextField
            fullWidth
            label="Search items"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Item Grid */}
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
                onClick={() => handleItemClick(item)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={getItemImage(item)}
                  alt={item.itemName}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {item.itemName}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleMenuClick(e, item)}
                      sx={{ ml: 1 }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {item.description.substring(0, 100)}
                    {item.description.length > 100 ? '...' : ''}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {item.lastSeenLocation}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {new Date(item.lastSeenDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  {item.status === 'found' && (
                    <Chip 
                      icon={<CheckCircleIcon />} 
                      label="Found" 
                      color="success" 
                      size="small"
                      sx={{ mt: 2 }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Item Detail Dialog */}
        {selectedItem && (
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>
              <Typography variant="h5">{selectedItem.itemName}</Typography>
              {selectedItem.status === 'found' && (
                <Chip 
                  icon={<CheckCircleIcon />} 
                  label="Found" 
                  color="success" 
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <img 
                    src={getItemImage(selectedItem)} 
                    alt={selectedItem.itemName} 
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Description</Typography>
                  <Typography paragraph>{selectedItem.description}</Typography>
                  
                  <Typography variant="h6" gutterBottom>Details</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn color="primary" />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      Last seen at: {selectedItem.lastSeenLocation}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday color="primary" />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      Date: {new Date(selectedItem.lastSeenDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ContactPhone color="primary" />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      Contact: {selectedItem.contactInfo}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon color="primary" />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      Email: {selectedItem.email}
                    </Typography>
                  </Box>
                  
                  {selectedItem.reward && (
                    <Typography variant="body1" color="primary" sx={{ mt: 2, fontWeight: 'bold' }}>
                      Reward: {selectedItem.reward}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
              <Box>
                {isItemOwner(selectedItem) && selectedItem.status !== 'found' && (
                  <Button 
                    variant="contained" 
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleReportFound}
                  >
                    Mark as Found
                  </Button>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {!isItemOwner(selectedItem) && selectedItem.status !== 'found' && (
                  <>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      startIcon={<VisibilityIcon />}
                      onClick={handleSeenObject}
                    >
                      I've Seen This
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={<CheckCircleIcon />}
                      onClick={handleHaveObject}
                    >
                      I Have This Item
                    </Button>
                  </>
                )}
                <Button onClick={handleCloseDialog}>Close</Button>
              </Box>
            </DialogActions>
          </Dialog>
        )}

        {/* "I've Seen This" Dialog */}
        <Dialog open={seenDialogOpen} onClose={() => setSeenDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Report Sighting</DialogTitle>
          <DialogContent dividers>
            <Typography paragraph>
              Please provide details about where and when you saw this item. This information will be sent to the owner.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Your Name"
                  variant="outlined"
                  value={seenFormData.name}
                  onChange={(e) => setSeenFormData({ ...seenFormData, name: e.target.value })}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Email"
                  variant="outlined"
                  type="email"
                  value={seenFormData.email}
                  onChange={(e) => setSeenFormData({ ...seenFormData, email: e.target.value })}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Phone"
                  variant="outlined"
                  value={seenFormData.phone}
                  onChange={(e) => setSeenFormData({ ...seenFormData, phone: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location Where Seen"
                  variant="outlined"
                  value={seenFormData.location}
                  onChange={(e) => setSeenFormData({ ...seenFormData, location: e.target.value })}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date Seen"
                  variant="outlined"
                  type="date"
                  value={seenFormData.date}
                  onChange={(e) => setSeenFormData({ ...seenFormData, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Details"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={seenFormData.message}
                  onChange={(e) => setSeenFormData({ ...seenFormData, message: e.target.value })}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSeenDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSeenSubmit}
              disabled={loading || !seenFormData.name || !seenFormData.email || !seenFormData.location}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Report'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* "I Have This Item" Dialog */}
        <Dialog open={haveDialogOpen} onClose={() => setHaveDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Report Found Item</DialogTitle>
          <DialogContent dividers>
            <Typography paragraph>
              Great news! Please provide details about how you found this item. This information will be sent to the owner.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Your Name"
                  variant="outlined"
                  value={haveFormData.name}
                  onChange={(e) => setHaveFormData({ ...haveFormData, name: e.target.value })}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Email"
                  variant="outlined"
                  type="email"
                  value={haveFormData.email}
                  onChange={(e) => setHaveFormData({ ...haveFormData, email: e.target.value })}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Phone"
                  variant="outlined"
                  value={haveFormData.phone}
                  onChange={(e) => setHaveFormData({ ...haveFormData, phone: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location Where Found"
                  variant="outlined"
                  value={haveFormData.location}
                  onChange={(e) => setHaveFormData({ ...haveFormData, location: e.target.value })}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date Found"
                  variant="outlined"
                  type="date"
                  value={haveFormData.date}
                  onChange={(e) => setHaveFormData({ ...haveFormData, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Details"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={haveFormData.message}
                  onChange={(e) => setHaveFormData({ ...haveFormData, message: e.target.value })}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setHaveDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleHaveSubmit}
              disabled={loading || !haveFormData.name || !haveFormData.email || !haveFormData.location}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Report'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Menu for item actions */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {selectedItemForMenu && isItemOwner(selectedItemForMenu) && (
            <MenuItem onClick={handleDeleteItem}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          )}
        </Menu>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Gallery; 