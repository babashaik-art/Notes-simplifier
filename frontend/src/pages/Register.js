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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  PersonAdd,
  LoginOutlined,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../App';

const MotionPaper = motion(Paper);

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'agreeToTerms' ? checked : value,
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Please enter your full name';
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      return 'Please enter a valid email address';
    }
    
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      return 'Please agree to the terms and conditions';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
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
            <PersonAdd sx={{ fontSize: 40, color: '#8B4513' }} />
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
            Join Notes Simplifier
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: '#5D4037',
              fontSize: '1.1rem',
            }}
          >
            Create your account and start simplifying your learning
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

        {/* Registration Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="name"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: '#8B4513' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
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
              mb: 2,
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
            helperText="Minimum 6 characters"
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
              mb: 2,
              '& .MuiInputLabel-root': {
                fontFamily: '"Crimson Text", serif',
                fontSize: '1.1rem',
              },
              '& .MuiInputBase-input': {
                fontFamily: '"Crimson Text", serif',
                fontSize: '1.1rem',
              },
              '& .MuiFormHelperText-root': {
                fontFamily: '"Crimson Text", serif',
              },
            }}
          />

          <TextField
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    sx={{ color: '#8B4513' }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
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

          <FormControlLabel
            control={
              <Checkbox
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                sx={{
                  color: '#8B4513',
                  '&.Mui-checked': {
                    color: '#8B4513',
                  },
                }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{
                  fontFamily: '"Crimson Text", serif',
                  color: '#5D4037',
                }}
              >
                I agree to the{' '}
                <MuiLink
                  href="#"
                  sx={{
                    color: '#8B4513',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Terms and Conditions
                </MuiLink>
                {' '}and{' '}
                <MuiLink
                  href="#"
                  sx={{
                    color: '#8B4513',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Privacy Policy
                </MuiLink>
              </Typography>
            }
            sx={{ mb: 3 }}
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
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
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
              Already have an account?
            </Typography>
          </Divider>

          <Button
            component={Link}
            to="/login"
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<LoginOutlined />}
            sx={{
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            Sign In Instead
          </Button>
        </Box>
      </MotionPaper>
    </Container>
  );
};

export default Register;