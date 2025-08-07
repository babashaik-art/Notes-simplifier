import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MenuBook,
  AccountCircle,
  Home,
  Dashboard,
  Games,
  Chat,
  Feedback,
  ExitToApp,
  Menu as MenuIcon,
  Person,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/', public: true },
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', private: true },
    { text: 'Games', icon: <Games />, path: '/games', private: true },
    { text: 'Chat', icon: <Chat />, path: '/chat', private: true },
    { text: 'Feedback', icon: <Feedback />, path: '/feedback', public: true },
  ];

  const visibleMenuItems = menuItems.filter(item => 
    item.public || (item.private && user)
  );

  const NavButton = ({ item }) => (
    <Button
      component={Link}
      to={item.path}
      color="inherit"
      startIcon={item.icon}
      sx={{
        mx: 1,
        px: 2,
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: location.pathname === item.path ? 700 : 500,
        backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.2)',
          transform: 'translateY(-1px)',
        },
        transition: 'all 0.3s ease',
      }}
    >
      {item.text}
    </Button>
  );

  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: 280,
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCF8 100%)',
          border: '1px solid rgba(139, 69, 19, 0.1)',
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Playfair Display", serif',
            color: '#8B4513',
            fontWeight: 700,
            mb: 2,
          }}
        >
          📚 Notes Simplifier
        </Typography>
        <Divider sx={{ mb: 2, borderColor: 'rgba(139, 69, 19, 0.2)' }} />
        
        <List>
          {visibleMenuItems.map((item) => (
            <ListItem
              key={item.text}
              button
              component={Link}
              to={item.path}
              onClick={() => setMobileDrawerOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: location.pathname === item.path ? 'rgba(139, 69, 19, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(139, 69, 19, 0.15)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#8B4513', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontFamily: '"Crimson Text", serif',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: '#3E2723',
                }}
              />
            </ListItem>
          ))}
          
          {user && (
            <>
              <Divider sx={{ my: 2, borderColor: 'rgba(139, 69, 19, 0.2)' }} />
              <ListItem
                button
                component={Link}
                to="/profile"
                onClick={() => setMobileDrawerOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(139, 69, 19, 0.15)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#8B4513', minWidth: 40 }}>
                  <Person />
                </ListItemIcon>
                <ListItemText 
                  primary="Profile"
                  primaryTypographyProps={{
                    fontFamily: '"Crimson Text", serif',
                    color: '#3E2723',
                  }}
                />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  handleLogout();
                }}
                sx={{
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#F44336', minWidth: 40 }}>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout"
                  primaryTypographyProps={{
                    fontFamily: '"Crimson Text", serif',
                    color: '#F44336',
                  }}
                />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" elevation={3}>
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                transform: 'scale(1.02)',
              },
              transition: 'transform 0.3s ease',
            }}
          >
            <MenuBook sx={{ fontSize: 32, mr: 1 }} />
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                letterSpacing: '1px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              Notes Simplifier
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {visibleMenuItems.map((item) => (
                <NavButton key={item.text} item={item} />
              ))}
            </Box>
          )}

          {user ? (
            <Box sx={{ ml: 2 }}>
              <IconButton
                onClick={handleMenuOpen}
                size="large"
                sx={{
                  p: 0,
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                  transition: 'transform 0.3s ease',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: '#FFFFFF',
                    color: '#8B4513',
                    fontWeight: 700,
                    border: '2px solid rgba(255,255,255,0.8)',
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 3,
                    minWidth: 200,
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCF8 100%)',
                    border: '1px solid rgba(139, 69, 19, 0.1)',
                    boxShadow: '0px 8px 24px rgba(139, 69, 19, 0.15)',
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 600,
                      color: '#3E2723',
                    }}
                  >
                    {user.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#5D4037',
                      fontSize: '0.9rem',
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(139, 69, 19, 0.1)' }} />
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate('/profile');
                  }}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(139, 69, 19, 0.05)',
                    },
                  }}
                >
                  <Person sx={{ mr: 2, color: '#8B4513' }} />
                  <Typography sx={{ fontFamily: '"Crimson Text", serif' }}>
                    Profile
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(244, 67, 54, 0.05)',
                    },
                  }}
                >
                  <ExitToApp sx={{ mr: 2, color: '#F44336' }} />
                  <Typography sx={{ fontFamily: '"Crimson Text", serif', color: '#F44336' }}>
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            !isMobile && (
              <Box sx={{ ml: 2 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  sx={{
                    mr: 1,
                    borderColor: '#FFFFFF',
                    color: '#FFFFFF',
                    '&:hover': {
                      borderColor: '#FFFFFF',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#8B4513',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    },
                  }}
                >
                  Register
                </Button>
              </Box>
            )
          )}
        </Toolbar>
      </AppBar>
      
      <MobileDrawer />
    </>
  );
};

export default Navbar;