import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
  TextField,
  IconButton,
  InputAdornment,
  Paper,
  Link,
} from '@mui/material';
import { 
  Google as GoogleIcon, 
  Email as EmailIcon, 
  Phone as PhoneIcon,
  Visibility, 
  VisibilityOff,
  ArrowForward,
  ArrowBack,
  Person,
  Lock,
} from '@mui/icons-material';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const carouselRef = useRef(null);
  
  // State for authentication
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // State for carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/');
      } else {
        // Initialize 3D carousel
        initCarousel();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Initialize 3D carousel
  const initCarousel = () => {
    if (!carouselRef.current) return;
    
    const carousel = carouselRef.current;
    const items = carousel.querySelectorAll('.carousel__item');
    const itemCount = items.length;
    const theta = 2 * Math.PI / itemCount;
    let radius = 250;
    
    if (isMobile) {
      radius = 180;
    }

    items.forEach((item, i) => {
      const angle = theta * i;
      item.style.transform = `rotateY(${angle}rad) translateZ(${radius}px)`;
    });

    rotateCarousel(currentSlide);
  };

  const rotateCarousel = (slideIndex) => {
    if (!carouselRef.current) return;
    
    const carousel = carouselRef.current;
    const angle = slideIndex * -120; // 360 degrees / 3 items = 120 degrees per item
    carousel.style.transform = `translateZ(-250px) rotateY(${angle}deg)`;
  };

  const nextSlide = () => {
    const newSlide = (currentSlide + 1) % totalSlides;
    setCurrentSlide(newSlide);
    rotateCarousel(newSlide);
  };

  const prevSlide = () => {
    const newSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    setCurrentSlide(newSlide);
    rotateCarousel(newSlide);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      initCarousel();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Configure Google provider to always show account selection
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, googleProvider);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Navigate to home
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Google login was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Please allow popups for this site to use Google login.');
      } else {
        setError(`Failed to log in with Google: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (isSignUp) {
      if (!email || !password || !confirmPassword || !name) {
        setError('Please fill in all required fields');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (password.length < 6) {
        setError('Password should be at least 6 characters');
        return;
      }
    } else {
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }
    }
    
    setLoading(true);

    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update user profile with name
        await result.user.updateProfile({
          displayName: name
        });
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify({
          ...result.user,
          displayName: name,
          phoneNumber: phone || null
        }));
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      
      navigate('/');
    } catch (error) {
      console.error('Authentication error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-container">
      <div className="background-blur"></div>
      
      <Container maxWidth="lg" className="main-container">
        <Grid container spacing={0} sx={{ height: '100%' }}>
          {/* Left side - 3D Carousel */}
          <Grid item xs={12} md={6} className="carousel-container">
            <Box className="carousel-wrapper">
              <div className="scene">
                <div className="carousel" ref={carouselRef}>
                  <div className="carousel__item carousel__item--1">
                    <div className="carousel-content">
                      <Typography variant="h4" className="carousel-title">Lost Something?</Typography>
                      <img src="https://images.unsplash.com/photo-1616077168712-fc6c788bc4dc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Lost items" className="carousel-image" />
                      <Typography variant="body2" className="carousel-description">
                        Report your lost items and let the community help you find them
                      </Typography>
                    </div>
                  </div>
                  <div className="carousel__item carousel__item--2">
                    <div className="carousel-content">
                      <Typography variant="h4" className="carousel-title">Found Something?</Typography>
                      <img src="https://images.unsplash.com/photo-1586892477838-2b96e85e0f96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" alt="Found items" className="carousel-image" />
                      <Typography variant="body2" className="carousel-description">
                        Help others by reporting items you've found
                      </Typography>
                    </div>
                  </div>
                  <div className="carousel__item carousel__item--3">
                    <div className="carousel-content">
                      <Typography variant="h4" className="carousel-title">Connect & Recover</Typography>
                      <img src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Connect" className="carousel-image" />
                      <Typography variant="body2" className="carousel-description">
                        Our smart matching system connects lost items with found reports
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="carousel-controls">
                <IconButton onClick={prevSlide} className="carousel-control" size="small">
                  <ArrowBack fontSize="small" />
                </IconButton>
                <div className="carousel-indicators">
                  {[...Array(totalSlides)].map((_, index) => (
                    <div 
                      key={index} 
                      className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentSlide(index);
                        rotateCarousel(index);
                      }}
                    />
                  ))}
                </div>
                <IconButton onClick={nextSlide} className="carousel-control" size="small">
                  <ArrowForward fontSize="small" />
                </IconButton>
              </div>
            </Box>
          </Grid>
          
          {/* Right side - Auth Forms */}
          <Grid item xs={12} md={6} sx={{ height: '100%' }}>
            <Fade in={true} timeout={800}>
              <Paper
                elevation={24}
                className="auth-container glass-container"
                sx={{
                  backdropFilter: 'blur(10px)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: { xs: 2, sm: 4 },
                }}
              >
                <Typography 
                  variant="h4" 
                  component="h1" 
                  align="center" 
                  gutterBottom
                  className="app-title"
                >
                  Lost & Found
                </Typography>
                <Typography variant="body2" className="app-subtitle">
                  The easiest way to recover lost items and help others
                </Typography>

                {/* Login/Signup Toggle Slider */}
                <Box className="auth-toggle-container">
                  <div className="auth-toggle">
                    <span className={!isSignUp ? 'active' : ''}>LOG IN</span>
                    <div className="slider-container">
                      <div className="slider-button" onClick={() => setIsSignUp(!isSignUp)}>
                        <div className={`slider-circle ${isSignUp ? 'right' : 'left'}`}>
                          <span>{isSignUp ? 'UP' : 'IN'}</span>
                        </div>
                      </div>
                    </div>
                    <span className={isSignUp ? 'active' : ''}>SIGN UP</span>
                  </div>
                </Box>

                {error && (
                  <Alert 
                    severity="error" 
                    className="error-alert"
                    sx={{ 
                      mb: 2, 
                      backgroundColor: 'rgba(211, 47, 47, 0.1)', 
                      color: '#f44336',
                      border: '1px solid rgba(211, 47, 47, 0.2)',
                      '& .MuiAlert-icon': {
                        color: '#f44336'
                      }
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} className="auth-form">
                  {isSignUp && (
                    <TextField
                      fullWidth
                      label="Your Name"
                      variant="outlined"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="form-input"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: 'rgba(255, 255, 255, 0.7)' }} fontSize="small" />
                          </InputAdornment>
                        ),
                        className: "cyberpunk-input"
                      }}
                    />
                  )}
                  
                  <TextField
                    fullWidth
                    label="Your Email"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} fontSize="small" />
                        </InputAdornment>
                      ),
                      className: "cyberpunk-input"
                    }}
                  />
                  
                  {isSignUp && (
                    <TextField
                      fullWidth
                      label="Phone (Optional)"
                      variant="outlined"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} fontSize="small" />
                          </InputAdornment>
                        ),
                        className: "cyberpunk-input"
                      }}
                    />
                  )}
                  
                  <TextField
                    fullWidth
                    label="Your Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-input"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'rgba(255, 255, 255, 0.7)' }} fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                            size="small"
                          >
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      className: "cyberpunk-input"
                    }}
                  />
                  
                  {isSignUp && (
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      variant="outlined"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="form-input"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: 'rgba(255, 255, 255, 0.7)' }} fontSize="small" />
                          </InputAdornment>
                        ),
                        className: "cyberpunk-input"
                      }}
                    />
                  )}

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    className="auth-button"
                    size="small"
                  >
                    {loading ? (
                      <CircularProgress size={20} sx={{ color: '#fff' }} />
                    ) : (
                      isSignUp ? 'SUBMIT' : 'LOGIN'
                    )}
                  </Button>

                  <div className="divider">
                    <span>OR</span>
                  </div>
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon fontSize="small" />}
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="google-button"
                    size="small"
                  >
                    {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
                  </Button>

                  {!isSignUp && (
                    <Link 
                      href="#" 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        marginTop: 1,
                        fontSize: '0.8rem',
                        '&:hover': {
                          color: '#e50914',
                          textDecoration: 'none',
                        }
                      }}
                    >
                      Forgot Password?
                    </Link>
                  )}
                  
                  <Typography 
                    variant="caption" 
                    className="terms-text"
                  >
                    By signing in/up, you agree to our Terms of Service and Privacy Policy
                  </Typography>
                </Box>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login; 