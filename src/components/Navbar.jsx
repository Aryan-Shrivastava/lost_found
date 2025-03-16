import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  ListItemButton,
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Report as ReportIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ExpandMore as ExpandMoreIcon,
  PhotoLibrary as GalleryIcon,
  QuestionAnswer as FAQIcon,
  Info as AboutIcon,
  FindInPage as LostIcon,
  AddCircle as FoundIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const menuItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Report Lost', path: '/report-lost', icon: <SearchIcon /> },
    { text: 'Report Found', path: '/report-found', icon: <FoundIcon /> },
    { text: 'Gallery', path: '/gallery', icon: <GalleryIcon /> },
    { text: 'FAQ', path: '/faq', icon: <FAQIcon /> },
    { text: 'About', path: '/about', icon: <AboutIcon /> },
  ];

  const drawer = (
    <Box sx={{ 
      width: 250, 
      height: '100%',
      background: 'rgba(15, 14, 22, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 2,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <Typography 
          variant="h6" 
          component="div" 
          className="animated-text neon-text"
          sx={{ 
            fontWeight: 'bold',
            letterSpacing: '1px',
            mb: 1
          }}
        >
          Lost & Found
        </Typography>
      </Box>
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            disablePadding
            sx={{ mb: 1 }}
          >
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: '10px',
                backgroundColor: activeTab === item.path ? 'rgba(63, 81, 181, 0.15)' : 'transparent',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  backgroundColor: 'rgba(63, 81, 181, 0.1)',
                },
                '&:before': activeTab === item.path ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: '4px',
                  background: 'linear-gradient(to bottom, #3f51b5, #00bcd4)',
                  borderRadius: '0 4px 4px 0',
                } : {},
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: activeTab === item.path ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.7)',
                  minWidth: '40px',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  color: activeTab === item.path ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                  '& .MuiTypography-root': {
                    fontWeight: activeTab === item.path ? 'bold' : 'normal',
                  }
                }}
              />
              {activeTab === item.path && (
                <Box
                  sx={{
                    position: 'absolute',
                    right: '10px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    boxShadow: `0 0 10px ${theme.palette.primary.main}`,
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        className={scrolled ? 'glass-container' : ''}
        sx={{
          background: scrolled ? 'rgba(15, 14, 22, 0.75)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile Menu Icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo for Desktop */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              className="animated-text"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 'bold',
                letterSpacing: '1px',
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              Lost & Found
            </Typography>

            {/* Logo for Mobile */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              className="animated-text"
              sx={{
                flexGrow: 1,
                display: { xs: 'flex', md: 'none' },
                fontWeight: 'bold',
                letterSpacing: '1px',
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              L&F
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    mx: 1,
                    my: 2,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '6px 16px',
                    transition: 'all 0.3s ease',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: activeTab === item.path ? '100%' : '0%',
                      height: '3px',
                      background: 'linear-gradient(90deg, #3f51b5, #00bcd4)',
                      transition: 'all 0.3s ease',
                      transform: 'translateX(-50%)',
                      borderRadius: '3px 3px 0 0',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '&:after': {
                        width: '80%',
                      },
                    },
                  }}
                >
                  <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </Box>
                  {item.text}
                </Button>
              ))}
            </Box>

            {/* User Menu */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar 
                    alt="User" 
                    src="/static/images/avatar/2.jpg" 
                    sx={{ 
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 0 15px rgba(63, 81, 181, 0.5)',
                      }
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{
                  mt: '45px',
                  '& .MuiPaper-root': {
                    background: 'rgba(15, 14, 22, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                  },
                }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu} sx={{ color: '#fff' }}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </ListItemIcon>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu} sx={{ color: '#fff' }}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </ListItemIcon>
                  <Typography textAlign="center">Settings</Typography>
                </MenuItem>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                <MenuItem onClick={handleLogout} sx={{ color: '#fff' }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </ListItemIcon>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default Navbar; 