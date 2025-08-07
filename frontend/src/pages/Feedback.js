import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  Feedback as FeedbackIcon,
  Star,
  Send,
  Psychology,
  BugReport,
  Lightbulb,
  School,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../App';

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

const Feedback = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: '',
    rating: 0,
    category: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'general', label: 'General Feedback', icon: <FeedbackIcon /> },
    { value: 'bug', label: 'Bug Report', icon: <BugReport /> },
    { value: 'feature', label: 'Feature Request', icon: <Lightbulb /> },
    { value: 'ai', label: 'AI Performance', icon: <Psychology /> },
    { value: 'education', label: 'Educational Content', icon: <School /> },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError('');
  };

  const handleRatingChange = (event, newValue) => {
    setFormData({
      ...formData,
      rating: newValue,
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Please enter your name';
    }
    if (!formData.email || !formData.email.includes('@')) {
      return 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) {
      return 'Please enter a subject';
    }
    if (!formData.message.trim()) {
      return 'Please enter your feedback message';
    }
    if (formData.message.length < 10) {
      return 'Please provide more detailed feedback (at least 10 characters)';
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

    try {
      await axios.post('/api/feedback', formData);
      setSuccess(true);
      
      // Reset form if not logged in
      if (!user) {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          rating: 0,
          category: '',
        });
      } else {
        setFormData({
          ...formData,
          subject: '',
          message: '',
          rating: 0,
          category: '',
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <MotionPaper
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          elevation={8}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCF8 100%)',
            border: '1px solid rgba(139, 69, 19, 0.1)',
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              border: '3px solid rgba(76, 175, 80, 0.2)',
            }}
          >
            <Send sx={{ fontSize: 50, color: '#4CAF50' }} />
          </Box>
          
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              color: '#3E2723',
              mb: 2,
            }}
          >
            Thank You!
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: '#5D4037',
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Your feedback has been submitted successfully. We appreciate your input and will use it to improve Notes Simplifier.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => setSuccess(false)}
            sx={{
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              mr: 2,
            }}
          >
            Submit Another Feedback
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            href="/"
            sx={{
              px: 4,
              py: 2,
              fontSize: '1.1rem',
            }}
          >
            Back to Home
          </Button>
        </MotionPaper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4}>
        {/* Form Section */}
        <Grid item xs={12} md={8}>
          <MotionPaper
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
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
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(139, 69, 19, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  border: '3px solid rgba(139, 69, 19, 0.2)',
                }}
              >
                <FeedbackIcon sx={{ fontSize: 40, color: '#8B4513' }} />
              </Box>
              
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  color: '#3E2723',
                  mb: 2,
                }}
              >
                We Value Your Feedback
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: '#5D4037',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                }}
              >
                Help us improve Notes Simplifier by sharing your thoughts, suggestions, or reporting any issues you've encountered.
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

            {/* Feedback Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    sx={{
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
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    sx={{
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
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel
                      sx={{
                        fontFamily: '"Crimson Text", serif',
                        fontSize: '1.1rem',
                      }}
                    >
                      Category
                    </InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      label="Category"
                      sx={{
                        '& .MuiSelect-select': {
                          fontFamily: '"Crimson Text", serif',
                          fontSize: '1.1rem',
                        },
                      }}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {cat.icon}
                            {cat.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: '"Crimson Text", serif',
                        fontSize: '1.1rem',
                        mb: 1,
                        color: '#5D4037',
                      }}
                    >
                      Overall Rating
                    </Typography>
                    <Rating
                      name="rating"
                      value={formData.rating}
                      onChange={handleRatingChange}
                      size="large"
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: '#FFD700',
                        },
                        '& .MuiRating-iconHover': {
                          color: '#FFC107',
                        },
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="subject"
                    label="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    sx={{
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
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="message"
                    label="Your Feedback"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Please share your detailed feedback, suggestions, or report any issues..."
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontFamily: '"Crimson Text", serif',
                        fontSize: '1.1rem',
                      },
                      '& .MuiInputBase-input': {
                        fontFamily: '"Crimson Text", serif',
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={<Send />}
                  sx={{
                    px: 5,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </Box>
            </Box>
          </MotionPaper>
        </Grid>

        {/* Info Section */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <MotionCard
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              sx={{ mb: 3 }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                    color: '#3E2723',
                    mb: 2,
                  }}
                >
                  Why Your Feedback Matters
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: '#5D4037',
                    lineHeight: 1.6,
                    mb: 2,
                  }}
                >
                  Your input helps us understand what's working well and what needs improvement. Every piece of feedback is carefully reviewed by our team.
                </Typography>

                <Divider sx={{ my: 2, borderColor: 'rgba(139, 69, 19, 0.2)' }} />

                <Typography
                  variant="body2"
                  sx={{
                    color: '#8B4513',
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  📧 Response Time: 24-48 hours
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#8B4513',
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  🔒 Privacy: Your data is secure
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#8B4513',
                    fontWeight: 600,
                  }}
                >
                  💡 Impact: Direct influence on features
                </Typography>
              </CardContent>
            </MotionCard>

            <MotionCard
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                    color: '#3E2723',
                    mb: 2,
                  }}
                >
                  Need Immediate Help?
                </Typography>
                
                <Typography
                  variant="body2"
                  sx={{
                    color: '#5D4037',
                    mb: 3,
                  }}
                >
                  For urgent issues or technical support, you can also reach us through our chat feature.
                </Typography>

                <Button
                  variant="outlined"
                  fullWidth
                  href="/chat"
                  startIcon={<Psychology />}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                  }}
                >
                  Chat with AI Support
                </Button>
              </CardContent>
            </MotionCard>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Feedback;