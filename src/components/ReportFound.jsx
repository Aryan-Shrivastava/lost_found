import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Fade,
  Zoom,
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon, 
  AddAPhoto as AddAPhotoIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useItems } from '../context/ItemsContext';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Electronics',
  'Jewelry',
  'Clothing',
  'Accessories',
  'Documents',
  'Keys',
  'Wallet/Purse',
  'Bag/Backpack',
  'Book',
  'Toy',
  'Other'
];

const ReportFound = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const { addFoundItem, debugStorage } = useItems();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    description: '',
    foundLocation: '',
    foundDate: new Date().toISOString().split('T')[0],
    contactInfo: currentUser.phoneNumber || '',
    images: [],
    additionalInfo: '',
  });
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    
    const files = Array.from(e.target.files);
    
    if (files.length + imagePreviewUrls.length > 5) {
      setError('You can upload a maximum of 5 images');
      return;
    }
    
    const newImagePreviewUrls = [...imagePreviewUrls];
    
    files.forEach(file => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        newImagePreviewUrls.push(reader.result);
        setImagePreviewUrls([...newImagePreviewUrls]);
        
        setFormData({
          ...formData,
          images: [...formData.images, reader.result],
        });
      };
      
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    
    const newImagePreviewUrls = [...imagePreviewUrls];
    newImagePreviewUrls.splice(index, 1);
    
    setFormData({
      ...formData,
      images: newImages,
    });
    
    setImagePreviewUrls(newImagePreviewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.itemName || !formData.category || !formData.description || !formData.foundLocation) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Creating new found item with data:', formData);
      
      // Create a new found item object
      const newFoundItem = {
        title: formData.itemName,
        category: formData.category,
        description: formData.description,
        location: formData.foundLocation,
        date: formData.foundDate,
        contactInfo: formData.contactInfo,
        image: formData.images.length > 0 ? formData.images[0] : '',
        images: formData.images,
        additionalInfo: formData.additionalInfo,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || '',
      };
      
      console.log('Submitting new found item:', newFoundItem);
      
      // Add the item to context
      const savedItem = addFoundItem(newFoundItem);
      console.log('Item saved successfully:', savedItem);
      
      // Debug localStorage after saving
      debugStorage();
      
      // Show success message
      setSuccess(true);
      setSnackbar({
        open: true,
        message: 'Found item reported successfully! Redirecting to gallery...',
        severity: 'success',
      });
      setLoading(false);
      
      // Reset form
      setFormData({
        itemName: '',
        category: '',
        description: '',
        foundLocation: '',
        foundDate: '',
        contactInfo: '',
        images: [],
        additionalInfo: '',
      });
      setImagePreviewUrls([]);
      
      // Store the newly added item ID in localStorage to highlight it in Gallery
      localStorage.setItem('highlightItem', savedItem.id);
      
      // Navigate to gallery after a short delay
      setTimeout(() => {
        navigate('/gallery');
      }, 2000);
    } catch (error) {
      console.error('Error reporting found item:', error);
      setError('Failed to report found item. Please try again.');
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Fade in={true} timeout={800}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: 4, 
              fontWeight: 'bold',
              color: 'primary.main',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            Report a Found Item
          </Typography>
        </Fade>
        
        <Zoom in={true} style={{ transitionDelay: '300ms' }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <CheckCircleIcon sx={{ mr: 1 }} />
                Item reported successfully! Thank you for helping someone find their lost item.
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Item Name"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <CategoryIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      label="Category"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Please provide a detailed description of the item you found"
                    InputProps={{
                      startAdornment: (
                        <DescriptionIcon color="action" sx={{ mr: 1, mt: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location Where Found"
                    name="foundLocation"
                    value={formData.foundLocation}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    placeholder="e.g., Central Park, Main Street"
                    InputProps={{
                      startAdornment: (
                        <LocationIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date Found"
                    name="foundDate"
                    type="date"
                    value={formData.foundDate}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <CalendarIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contact Information"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Phone number or alternative contact method"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Upload Images (Max 5)
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    {imagePreviewUrls.map((url, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: 'relative',
                          width: 100,
                          height: 100,
                          borderRadius: 2,
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          onClick={() => removeImage(index)}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            minWidth: '30px',
                            width: '30px',
                            height: '30px',
                            p: 0,
                            borderRadius: '0 0 0 8px',
                          }}
                        >
                          X
                        </Button>
                      </Box>
                    ))}
                    
                    {imagePreviewUrls.length < 5 && (
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<AddAPhotoIcon />}
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: 2,
                          borderStyle: 'dashed',
                        }}
                      >
                        Add
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={handleImageChange}
                        />
                      </Button>
                    )}
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    Adding clear images will help the owner identify their item
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Information"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    variant="outlined"
                    placeholder="Any other details that might help identify the owner"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={24} /> : <CloudUploadIcon />}
                    sx={{
                      py: 1.5,
                      mt: 2,
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 15px rgba(63, 81, 181, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(63, 81, 181, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {loading ? 'Submitting...' : 'Report Found Item'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Zoom>
        
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

export default ReportFound; 