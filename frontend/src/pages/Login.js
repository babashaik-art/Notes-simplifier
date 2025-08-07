import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  LoginOutlined,
  PersonAdd,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../App';

const MotionPaper = motion(Paper);

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <MotionPaper
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        elevation={8}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCF8 100%)',
          border: '1px solid rgba(139, 69, 19, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #8B4513 0%, #D2691E 100%)',
          },
        }}
      >
        {/* Header */}
        <Box textAlign="center" sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'rgba(139, 69, 19, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              border: '3px solid rgba(139, 69, 19, 0.2)',
            }}
          >
            <LoginOutlined sx={{ fontSize: 40, color: '#8B4513' }} />
          </Box>
          
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              color: '#3E2723',
              mb: 1,
            }}
          >
            Welcome Back
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: '#5D4037',
              fontSize: '1.1rem',
            }}
          >
            Sign in to continue your learning journey
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontFamily: '"Crimson Text", serif',
              },
            }}
          >
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#8B4513' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              '& .MuiInputLabel-root': {
                fontFamily: '"Crimson Text", serif',
                fontSize: '1.1rem',
              },
              '& .MuiInputBase-input': {
                fontFamily: '"Crimson Text", serif',
                fontSize: '1.1rem',
              },
            }}
          />

          <TextField
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#8B4513' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#8B4513' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 4,
              '& .MuiInputLabel-root': {
                fontFamily: '"Crimson Text", serif',
                fontSize: '1.1rem',
              },
              '& .MuiInputBase-input': {
                fontFamily: '"Crimson Text", serif',
                fontSize: '1.1rem',
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 600,
              mb: 3,
              position: 'relative',
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          <Divider sx={{ mb: 3, borderColor: 'rgba(139, 69, 19, 0.2)' }}>
            <Typography
              variant="body2"
              sx={{
                color: '#5D4037',
                fontFamily: '"Crimson Text", serif',
                px: 2,
              }}
            >
              New to Notes Simplifier?
            </Typography>
          </Divider>

          <Button
            component={Link}
            to="/register"
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<PersonAdd />}
            sx={{
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            Create Account
          </Button>
        </Box>

        {/* Footer Links */}
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography
            variant="body2"
            sx={{
              color: '#5D4037',
              fontFamily: '"Crimson Text", serif',
            }}
          >
            Forgot your password?{' '}
            <MuiLink
              component={Link}
              to="/feedback"
              sx={{
                color: '#8B4513',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Contact Support
            </MuiLink>
          </Typography>
        </Box>
      </MotionPaper>
    </Container>
  );
};

export default Login;