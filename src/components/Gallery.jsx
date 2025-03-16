import React, { useState, useEffect, useRef } from 'react';
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
  Tabs,
  Tab,
  Zoom,
  Divider,
  useTheme,
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
  FindInPage as LostIcon,
  AddCircle as FoundIcon,
  Category as CategoryIcon,
  Info as InfoIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useItems } from '../context/ItemsContext';
import { useNavigate } from 'react-router-dom';
// import { sendItemSeenEmail, sendItemFoundEmail } from '../utils/emailService';

const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [displayItems, setDisplayItems] = useState([]);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItemForMenu, setSelectedItemForMenu] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [tabValue, setTabValue] = useState(0);
  const { lostItems, foundItems, deleteLostItem, deleteFoundItem } = useItems();
  const [loading, setLoading] = useState(true);
  const [highlightedItemId, setHighlightedItemId] = useState(null);
  const highlightedItemRef = useRef(null);
  const theme = useTheme();
  const [seenDialogOpen, setSeenDialogOpen] = useState(false);
  const [haveDialogOpen, setHaveDialogOpen] = useState(false);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
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
  const [claimFormData, setClaimFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    identifyingDetails: '',
    message: '',
  });

  useEffect(() => {
    // Check if there's a highlighted item from localStorage
    const itemToHighlight = localStorage.getItem('highlightItem');
    if (itemToHighlight) {
      setHighlightedItemId(parseInt(itemToHighlight));
      // Clear the highlight after retrieving it
      localStorage.removeItem('highlightItem');
    }
    
    fetchItems();
  }, [lostItems, foundItems, tabValue]);

  // Scroll to highlighted item when it's rendered
  useEffect(() => {
    if (highlightedItemId && highlightedItemRef.current) {
      setTimeout(() => {
        highlightedItemRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 500);
    }
  }, [highlightedItemId, displayItems]);

  const fetchItems = () => {
    try {
      setLoading(true);
      let itemsToDisplay = [];
      
      // Display items based on selected tab
      if (tabValue === 0) {
        // All items
        itemsToDisplay = [...lostItems, ...foundItems];
      } else if (tabValue === 1) {
        // Lost items only
        itemsToDisplay = [...lostItems];
      } else if (tabValue === 2) {
        // Found items only
        itemsToDisplay = [...foundItems];
      }
      
      // Sort by creation date (newest first)
      itemsToDisplay.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Apply search filter if any
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        itemsToDisplay = itemsToDisplay.filter(item => 
          (item.title && item.title.toLowerCase().includes(query)) ||
          (item.description && item.description.toLowerCase().includes(query)) ||
          (item.location && item.location.toLowerCase().includes(query)) ||
          (item.category && item.category.toLowerCase().includes(query))
        );
      }
      
      setDisplayItems(itemsToDisplay);
      setError(null);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Failed to load items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // Trigger search when typing
    fetchItems();
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
      if (selectedItemForMenu.status === 'pending') {
        // It's a lost item
        deleteLostItem(selectedItemForMenu.id);
      } else if (selectedItemForMenu.status === 'unclaimed') {
        // It's a found item
        deleteFoundItem(selectedItemForMenu.id);
      }
      
      handleMenuClose();
      setSnackbar({
        open: true,
        message: 'Item deleted successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting item',
        severity: 'error',
      });
    }
  };

  const handleReportFound = () => {
    try {
      const updatedItems = displayItems.map(item => {
        if (item.id === selectedItem.id) {
          return { ...item, status: 'found' };
        }
        return item;
      });

      localStorage.setItem('lostItems', JSON.stringify(updatedItems));
      setDisplayItems(updatedItems);
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
      const updatedItems = displayItems.map(item => {
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
      setDisplayItems(updatedItems);
      
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
      const updatedItems = displayItems.map(item => {
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
      setDisplayItems(updatedItems);
      
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

  const handleClaimItem = () => {
    setClaimDialogOpen(true);
  };

  const handleClaimSubmit = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would send this data to a server
      // For now, we'll just show a success message
      
      setTimeout(() => {
        setSnackbar({
          open: true,
          message: 'Your claim has been submitted. The item owner will contact you soon.',
          severity: 'success',
        });
        
        setClaimDialogOpen(false);
        setLoading(false);
        handleCloseDialog();
      }, 1000);
    } catch (error) {
      console.error('Error submitting claim:', error);
      setSnackbar({
        open: true,
        message: 'Error submitting claim. Please try again.',
        severity: 'error',
      });
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const isItemOwner = (item) => item.userEmail === currentUser.email;

  const getItemImage = (item) => {
    if (item.images && item.images.length > 0) {
      return item.images[0];
    }
    return 'https://via.placeholder.com/400x300?text=No+Image+Available';
  };

  // Helper function to determine if the item is a lost or found item
  const getItemType = (item) => {
    return item.status === 'pending' ? 'lost' : 'found';
  };

  // Helper function to get the status label
  const getStatusLabel = (item) => {
    const type = getItemType(item);
    return type === 'lost' ? 'Lost' : 'Found';
  };

  // Helper function to get the status color
  const getStatusColor = (item) => {
    const type = getItemType(item);
    return type === 'lost' ? 'error' : 'success';
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Lost & Found Gallery
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by name, description, location..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
          />
        </Box>
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mt: 2 }}
        >
          <Tab icon={<SearchIcon />} label="All Items" />
          <Tab icon={<LostIcon />} label="Lost Items" />
          <Tab icon={<FoundIcon />} label="Found Items" />
        </Tabs>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {highlightedItemId && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Your item has been successfully added to the gallery!
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : displayItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {searchQuery 
              ? 'No items match your search criteria' 
              : tabValue === 0 
                ? 'No items available' 
                : tabValue === 1 
                  ? 'No lost items available' 
                  : 'No found items available'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {displayItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                <Card 
                  ref={item.id === highlightedItemId ? highlightedItemRef : null}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    },
                    ...(item.id === highlightedItemId && {
                      boxShadow: `0 0 20px ${theme.palette.primary.main}`,
                      border: `2px solid ${theme.palette.primary.main}`,
                    }),
                  }}
                  onClick={() => handleItemClick(item)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.image || "https://via.placeholder.com/300x200?text=No+Image"}
                      alt={item.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                      <Chip 
                        label={getStatusLabel(item)} 
                        color={getStatusColor(item)} 
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                    {isItemOwner(item) && (
                      <IconButton
                        sx={{ position: 'absolute', top: 10, left: 10, bgcolor: 'rgba(0,0,0,0.5)' }}
                        size="small"
                        onClick={(e) => handleMenuClick(e, item)}
                      >
                        <MoreVertIcon sx={{ color: 'white' }} />
                      </IconButton>
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom noWrap>
                      {item.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {item.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(item.date || item.createdAt)}
                      </Typography>
                    </Box>
                    {item.category && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CategoryIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {item.category}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Item Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        {selectedItem && (
          <>
            <DialogTitle sx={{ 
              bgcolor: getItemType(selectedItem) === 'lost' ? 'error.dark' : 'success.dark',
              color: 'white',
              py: 2
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedItem.title}</Typography>
                <Chip 
                  label={getStatusLabel(selectedItem)} 
                  color="default"
                  size="small"
                  sx={{ 
                    bgcolor: 'white', 
                    color: getItemType(selectedItem) === 'lost' ? 'error.dark' : 'success.dark',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
              <Grid container>
                <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
                  <img
                    src={selectedItem.image || "https://via.placeholder.com/600x400?text=No+Image"}
                    alt={selectedItem.title}
                    style={{ width: '100%', height: '100%', minHeight: '300px', objectFit: 'cover' }}
                  />
                  {selectedItem.images && selectedItem.images.length > 1 && (
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 10, 
                      right: 10,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem'
                    }}>
                      +{selectedItem.images.length - 1} more images
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      Description
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                      {selectedItem.description}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      Details
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body1" fontWeight="medium">
                              Location
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ pl: 4 }}>
                            {selectedItem.location}
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarToday color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body1" fontWeight="medium">
                              Date
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ pl: 4 }}>
                            {formatDate(selectedItem.date || selectedItem.createdAt)}
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      {selectedItem.category && (
                        <Grid item xs={12} sm={6}>
                          <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CategoryIcon color="primary" sx={{ mr: 1 }} />
                              <Typography variant="body1" fontWeight="medium">
                                Category
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ pl: 4 }}>
                              {selectedItem.category}
                            </Typography>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      Contact Information
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EmailIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body1" fontWeight="medium">
                              Email
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ pl: 4 }}>
                            {selectedItem.userEmail}
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      {selectedItem.contactInfo && (
                        <Grid item xs={12}>
                          <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <PhoneIcon color="primary" sx={{ mr: 1 }} />
                              <Typography variant="body1" fontWeight="medium">
                                Phone
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ pl: 4 }}>
                              {selectedItem.contactInfo}
                            </Typography>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                    
                    {selectedItem.reward && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: 'warning.light', 
                          borderRadius: 2,
                          border: '1px dashed',
                          borderColor: 'warning.main'
                        }}>
                          <Typography variant="body1" fontWeight="bold" color="warning.dark">
                            Reward: {selectedItem.reward}
                          </Typography>
                        </Box>
                      </>
                    )}
                    
                    {selectedItem.additionalInfo && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                          Additional Information
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {selectedItem.additionalInfo}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
              <Button onClick={handleCloseDialog} variant="outlined">Close</Button>
              <Box>
                {!isItemOwner(selectedItem) && getItemType(selectedItem) === 'lost' && (
                  <>
                    <Button 
                      startIcon={<VisibilityIcon />} 
                      onClick={handleSeenObject}
                      color="info"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    >
                      I've Seen This
                    </Button>
                    <Button 
                      startIcon={<CheckCircleIcon />} 
                      onClick={handleHaveObject}
                      color="success"
                      variant="contained"
                    >
                      I Found This
                    </Button>
                  </>
                )}
                {!isItemOwner(selectedItem) && getItemType(selectedItem) === 'found' && (
                  <Button 
                    startIcon={<CheckCircleIcon />} 
                    onClick={handleClaimItem}
                    color="success"
                    variant="contained"
                  >
                    This Is Mine
                  </Button>
                )}
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>

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

      {/* "This Is Mine" Dialog */}
      <Dialog open={claimDialogOpen} onClose={() => setClaimDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'success.main', color: 'white' }}>
          Claim This Item
        </DialogTitle>
        <DialogContent dividers>
          <Typography paragraph>
            To claim this item, please provide some identifying details that only the true owner would know. This helps verify your ownership.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Name"
                variant="outlined"
                value={claimFormData.name}
                onChange={(e) => setClaimFormData({ ...claimFormData, name: e.target.value })}
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
                value={claimFormData.email}
                onChange={(e) => setClaimFormData({ ...claimFormData, email: e.target.value })}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Phone"
                variant="outlined"
                value={claimFormData.phone}
                onChange={(e) => setClaimFormData({ ...claimFormData, phone: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Identifying Details (describe something specific about the item that proves it's yours)"
                variant="outlined"
                multiline
                rows={3}
                value={claimFormData.identifyingDetails}
                onChange={(e) => setClaimFormData({ ...claimFormData, identifyingDetails: e.target.value })}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Message"
                variant="outlined"
                multiline
                rows={2}
                value={claimFormData.message}
                onChange={(e) => setClaimFormData({ ...claimFormData, message: e.target.value })}
                margin="normal"
                placeholder="Any additional information you'd like to share with the finder"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClaimDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="success" 
            onClick={handleClaimSubmit}
            disabled={loading || !claimFormData.name || !claimFormData.email || !claimFormData.identifyingDetails}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Claim'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu for item actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDeleteItem}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Gallery; 