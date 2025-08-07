import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CloudUpload,
  Psychology,
  Games,
  Chat,
  Feedback,
  AutoFixHigh,
  School,
  Security,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../App';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const Home = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <CloudUpload sx={{ fontSize: 40, color: '#8B4513' }} />,
      title: 'Smart File Upload',
      description: 'Upload text files or images and extract content using advanced OCR technology.',
      color: '#E3F2FD',
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: '#D2691E' }} />,
      title: 'AI Simplification',
      description: 'Transform complex text into simple, understandable content using ChatGPT and Perplexity.',
      color: '#FFF3E0',
    },
    {
      icon: <Games sx={{ fontSize: 40, color: '#8BC34A' }} />,
      title: 'Educational Games',
      description: 'Interactive games and puzzles generated from your content to enhance learning.',
      color: '#E8F5E8',
    },
    {
      icon: <Chat sx={{ fontSize: 40, color: '#2196F3' }} />,
      title: 'AI Chatbot',
      description: 'Discuss topics and get answers to your questions with our intelligent chatbot.',
      color: '#E3F2FD',
    },
    {
      icon: <AutoFixHigh sx={{ fontSize: 40, color: '#9C27B0' }} />,
      title: 'Rich Experience',
      description: 'Beautiful classical UI design with modern functionality and smooth interactions.',
      color: '#F3E5F5',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#F44336' }} />,
      title: 'Secure & Private',
      description: 'Your documents and data are securely stored with user authentication.',
      color: '#FFEBEE',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Documents Processed' },
    { number: '5K+', label: 'Happy Users' },
    { number: '50K+', label: 'Games Played' },
    { number: '99.9%', label: 'Uptime' },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          textAlign="center"
          sx={{ mb: 8 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              mb: 3,
              background: 'linear-gradient(45deg, #8B4513 30%, #D2691E 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
            }}
          >
            Notes Simplifier
          </Typography>
          
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              color: '#5D4037',
              fontWeight: 400,
              fontSize: { xs: '1.2rem', md: '1.8rem' },
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.4,
            }}
          >
            Transform complex documents into simple, understandable content with the power of AI
          </Typography>

          <Box sx={{ mb: 6 }}>
            <Chip
              label="✨ Powered by ChatGPT & Perplexity"
              sx={{
                fontSize: '1.1rem',
                py: 2,
                px: 3,
                backgroundColor: 'rgba(139, 69, 19, 0.1)',
                color: '#8B4513',
                fontWeight: 600,
                border: '2px solid rgba(139, 69, 19, 0.2)',
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Button
                component={Link}
                to="/dashboard"
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.2rem',
                  minWidth: 200,
                }}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: '1.2rem',
                    minWidth: 150,
                  }}
                >
                  Get Started
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: '1.2rem',
                    minWidth: 150,
                  }}
                >
                  Sign In
                </Button>
              </>
            )}
          </Box>
        </MotionBox>

        {/* Stats Section */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          sx={{ mb: 8 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCF8 100%)',
            }}
          >
            <Grid container spacing={4}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Box textAlign="center">
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 700,
                        color: '#8B4513',
                        mb: 1,
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#5D4037',
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </MotionBox>

        {/* Features Section */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          sx={{ mb: 8 }}
        >
          <Typography
            variant="h2"
            textAlign="center"
            sx={{ mb: 6, color: '#3E2723' }}
          >
            Powerful Features
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <MotionCard
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  sx={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${feature.icon.props.style?.color || '#8B4513'} 0%, #D2691E 100%)`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, pb: 2 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: feature.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        mx: 'auto',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    
                    <Typography
                      variant="h5"
                      textAlign="center"
                      sx={{
                        mb: 2,
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 600,
                        color: '#3E2723',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    
                    <Typography
                      variant="body1"
                      textAlign="center"
                      sx={{
                        color: '#5D4037',
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </MotionBox>

        {/* CTA Section */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              borderRadius: 4,
              background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
              color: '#FFFFFF',
            }}
          >
            <School sx={{ fontSize: 60, mb: 3, opacity: 0.9 }} />
            
            <Typography
              variant="h3"
              sx={{
                mb: 2,
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
              }}
            >
              Ready to Simplify Your Learning?
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.5,
              }}
            >
              Join thousands of students and professionals who are already using Notes Simplifier to understand complex content better.
            </Typography>

            {!user && (
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1.3rem',
                  backgroundColor: '#FFFFFF',
                  color: '#8B4513',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                  },
                  boxShadow: '0px 8px 20px rgba(0,0,0,0.3)',
                }}
              >
                Start Your Journey
              </Button>
            )}
          </Paper>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Home;