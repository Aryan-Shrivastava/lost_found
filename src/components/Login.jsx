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
import { 
  signInWithPopup, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

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

    // Apply initial rotation
    rotateCarousel(currentSlide);
  };

  const rotateCarousel = (slideIndex) => {
    if (!carouselRef.current) return;
    
    const carousel = carouselRef.current;
    const items = carousel.querySelectorAll('.carousel__item');
    const itemCount = items.length;
    const theta = 2 * Math.PI / itemCount;
    const angle = slideIndex * theta * -1;
    
    carousel.style.transform = `translateZ(-250px) rotateY(${angle}rad)`;
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
        await updateProfile(result.user, {
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
                      <Typography variant="h4" className="carousel-title">IIIT Hyderabad</Typography>
                      <img src="https://imgs.search.brave.com/ihFSs8Tl5STPzFLd-okd0l5QS99rVw-5nglTi8fL_uI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aWlpdC5hYy5pbi93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMi8w/Ni9JSUlUX0h5ZGVy/YWJhZF9Mb2dvLWUx/NjU1MTE2OTM3OTg2/LmpwZw" alt="IIIT Hyderabad Campus" className="carousel-image" />
                      <Typography variant="body2" className="carousel-description">
                        A premier research institution with a 66-acre campus in Gachibowli
                      </Typography>
                    </div>
                  </div>
                  <div className="carousel__item carousel__item--2">
                    <div className="carousel-content">
                      <Typography variant="h4" className="carousel-title">Academic Excellence</Typography>
                      <img src="https://imgs.search.brave.com/ihFSs8Tl5STPzFLd-okd0l5QS99rVw-5nglTi8fL_uI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aWlpdC5hYy5pbi93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMi8w/Ni9JSUlUX0h5ZGVy/YWJhZF9Mb2dvLWUx/NjU1MTE2OTM3OTg2/LmpwZw" alt="IIIT Hyderabad Library" className="carousel-image" />
                      <Typography variant="body2" className="carousel-description">
                        State-of-the-art facilities for research and education
                      </Typography>
                    </div>
                  </div>
                  <div className="carousel__item carousel__item--3">
                    <div className="carousel-content">
                      <Typography variant="h4" className="carousel-title">Innovation Hub</Typography>
                      <img src="https://imgs.search.brave.com/ihFSs8Tl5STPzFLd-okd0l5QS99rVw-5nglTi8fL_uI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aWlpdC5hYy5pbi93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMi8w/Ni9JSUlUX0h5ZGVy/YWJhZF9Mb2dvLWUx/NjU1MTE2OTM3OTg2/LmpwZw" alt="IIIT Hyderabad Research Center" className="carousel-image" />
                      <Typography variant="body2" className="carousel-description">
                        Leading research in computer science, electronics, and communications
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
          <Grid item xs={12} md={6} sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Fade in={true} timeout={800}>
              <Paper
                elevation={24}
                className="auth-container"
              >
                <Typography 
                  variant="h4" 
                  component="h1" 
                  align="center" 
                  gutterBottom
                  className="app-title"
                  sx={{ mb: 2 }}
                >
                  Apna 
                  Saaman
                </Typography>
                <Typography 
                  variant="body2" 
                  className="app-subtitle"
                  sx={{ mb: 2 }}
                >
                  The easiest way to recover lost items and help others
                </Typography>

                {/* Login/Signup Toggle Slider */}
                <Box className="auth-toggle-container" sx={{ mb: 3 }}>
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
                    sx={{ mb: 3 }}
                  >
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} className="auth-form" sx={{ mt: 1 }}>
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
                    sx={{ mt: 2 }}
                  >
                    {loading ? (
                      <CircularProgress size={20} sx={{ color: '#fff' }} />
                    ) : (
                      isSignUp ? 'SUBMIT' : 'LOGIN'
                    )}
                  </Button>

                  <div className="divider" style={{ margin: '20px 0' }}>
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
                        marginTop: 2,
                        fontSize: '0.75rem',
                        '&:hover': {
                          color: '#ff0000',
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
                    sx={{ mt: 3 }}
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