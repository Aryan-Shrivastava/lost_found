import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  IconButton,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Language as LanguageIcon,
  DarkMode as DarkModeIcon,
  LockReset as LockResetIcon,
} from '@mui/icons-material';
import { auth } from '../firebase';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // User state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Settings states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('English');
  const [privacySettings, setPrivacySettings] = useState('Friends');
  
  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setDisplayName(parsedUser.displayName || '');
      setEmail(parsedUser.email || '');
      setPhoneNumber(parsedUser.phoneNumber || '');
    }
  }, []);
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Update profile in Firebase
      await updateProfile(auth.currentUser, {
        displayName: displayName,
        // Note: Updating phone number requires additional verification in Firebase
      });
      
      // Update user in localStorage
      const updatedUser = {
        ...user,
        displayName: displayName,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccess(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    
    if (!currentPassword) {
      setError('Current password is required to update email');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update email in Firebase
      await updateEmail(auth.currentUser, email);
      
      // Update user in localStorage
      const updatedUser = {
        ...user,
        email: email,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccess(true);
      setCurrentPassword('');
    } catch (error) {
      console.error('Error updating email:', error);
      if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (error.code === 'auth/requires-recent-login') {
        setError('Please log in again before updating your email');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    
    if (!currentPassword) {
      setError('Current password is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password in Firebase
      await updatePassword(auth.currentUser, newPassword);
      
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (error.code === 'auth/requires-recent-login') {
        setError('Please log in again before updating your password');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSuccess(false);
  };
  
  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5">Loading settings...</Typography>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" className="settings-container">
      <Paper 
        elevation={3} 
        className="settings-paper"
      >
        <Typography variant="h4" gutterBottom>
          Account Settings
        </Typography>
        
        <Divider className="settings-divider" />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={4}>
          {/* Left Column - Profile Settings */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom className="settings-section-title">
              <PersonIcon sx={{ mr: 1 }} /> Profile Information
            </Typography>
            
            <Box component="form" onSubmit={handleUpdateProfile} sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={user.photoURL || ""}
                  alt={user.displayName || "User"}
                  className="settings-avatar"
                />
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCameraIcon />}
                  size="small"
                  className="settings-button"
                >
                  Change Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                  />
                </Button>
              </Box>
              
              <TextField
                fullWidth
                label="Display Name"
                variant="outlined"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                margin="normal"
                className="settings-input"
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                }}
              />
              
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                margin="normal"
                className="settings-input"
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                }}
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={loading}
                className="settings-button"
              >
                Save Profile
              </Button>
            </Box>
            
            <Divider className="settings-divider" />
            
            <Typography variant="h5" gutterBottom className="settings-section-title">
              <EmailIcon sx={{ mr: 1 }} /> Email Settings
            </Typography>
            
            <Box component="form" onSubmit={handleUpdateEmail} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                className="settings-input"
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                }}
              />
              
              <TextField
                fullWidth
                label="Current Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                margin="normal"
                className="settings-input"
                InputProps={{
                  startAdornment: <SecurityIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                  endAdornment: (
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={loading}
                className="settings-button"
              >
                Update Email
              </Button>
            </Box>
          </Grid>
          
          {/* Right Column - Security & Preferences */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom className="settings-section-title">
              <SecurityIcon sx={{ mr: 1 }} /> Security
            </Typography>
            
            <Box component="form" onSubmit={handleUpdatePassword} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Current Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                margin="normal"
                className="settings-input"
                InputProps={{
                  startAdornment: <SecurityIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                  endAdornment: (
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label="New Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="normal"
                className="settings-input"
                InputProps={{
                  startAdornment: <LockResetIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                }}
              />
              
              <TextField
                fullWidth
                label="Confirm New Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                className="settings-input"
                InputProps={{
                  startAdornment: <LockResetIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                }}
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={loading}
                className="settings-button"
              >
                Update Password
              </Button>
            </Box>
            
            <Divider className="settings-divider" />
            
            <Typography variant="h5" gutterBottom className="settings-section-title">
              <NotificationsIcon sx={{ mr: 1 }} /> Preferences
            </Typography>
            
            <List>
              <ListItem className="settings-list-item">
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Email Notifications" 
                  secondary="Receive updates about your lost and found items"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications(!emailNotifications)}
                    className="settings-switch"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem className="settings-list-item">
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Push Notifications" 
                  secondary="Receive real-time alerts on your device"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={pushNotifications}
                    onChange={() => setPushNotifications(!pushNotifications)}
                    className="settings-switch"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem className="settings-list-item">
                <ListItemIcon>
                  <DarkModeIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Dark Mode" 
                  secondary="Toggle between light and dark theme"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    className="settings-switch"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem className="settings-list-item">
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Language" 
                  secondary={language}
                />
                <ListItemSecondaryAction>
                  <Button size="small" className="settings-button">Change</Button>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            
            <Divider className="settings-divider" />
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  // Show confirmation dialog before deleting account
                  if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    // Handle account deletion
                  }
                }}
                className="settings-button delete-button"
              >
                Delete Account
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Settings updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings; 