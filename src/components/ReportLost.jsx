import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  Grid,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useItems } from '../context/ItemsContext';
import { useNavigate } from 'react-router-dom';

const ReportLost = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const { addLostItem } = useItems();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    contactInfo: '',
    email: currentUser.email || '',
    name: currentUser.displayName || '',
    reward: '',
  });
  const [images, setImages] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [previewImages, setPreviewImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) {
      setSnackbar({
        open: true,
        message: 'You can only upload up to 3 images',
        severity: 'error',
      });
      return;
    }

    // Create preview URLs for the images
    const newPreviewImages = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviewImages]);
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviewImages = [...previewImages];
    newImages.splice(index, 1);
    newPreviewImages.splice(index, 1);
    setImages(newImages);
    setPreviewImages(newPreviewImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Check if user is logged in
      if (!currentUser || !currentUser.email) {
        setSnackbar({
          open: true,
          message: 'You must be logged in to report a lost item',
          severity: 'error',
        });
        return;
      }

      // Convert images to base64 strings
      const imagePromises = images.map(image => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
      });

      const base64Images = await Promise.all(imagePromises);
      
      // Use the first image as the main image
      const mainImage = base64Images.length > 0 ? base64Images[0] : '';

      // Create a new lost item object
      const newLostItem = {
        ...formData,
        image: mainImage,
        images: base64Images,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || 'Anonymous',
      };

      // Add the item to context
      addLostItem(newLostItem);

      // Show success message
      setSnackbar({
        open: true,
        message: 'Lost item reported successfully!',
        severity: 'success',
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        date: '',
        contactInfo: '',
        email: currentUser.email || '',
        name: currentUser.displayName || '',
        reward: '',
      });
      setImages([]);
      setPreviewImages([]);
      
      // Navigate to profile after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Error reporting lost item:', error);
      setSnackbar({
        open: true,
        message: 'Error reporting lost item. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          Report a Lost Item
        </Typography>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Item Name"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Seen Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date Lost"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Information"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  placeholder="Phone number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  placeholder="Your email for notifications"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Reward (Optional)"
                  name="reward"
                  value={formData.reward}
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="e.g. $50"
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Upload Images (Optional)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AddIcon />}
                    sx={{ mr: 2 }}
                  >
                    Add Image
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                      multiple
                    />
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    {images.length}/3 images uploaded
                  </Typography>
                </Box>

                {previewImages.length > 0 && (
                  <Grid container spacing={2}>
                    {previewImages.map((preview, index) => (
                      <Grid item xs={12} sm={4} key={index}>
                        <Card>
                          <CardMedia
                            component="img"
                            height="140"
                            image={preview}
                            alt={`Preview ${index + 1}`}
                          />
                          <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => removeImage(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ px: 4, py: 1 }}
                  >
                    Submit Report
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>

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
    </Container>
  );
};

export default ReportLost; 