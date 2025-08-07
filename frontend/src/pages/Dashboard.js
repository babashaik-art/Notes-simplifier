import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload,
  Description,
  Image,
  Visibility,
  Delete,
  Games,
  Chat,
  TrendingUp,
  School,
  Psychology,
  Assessment,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../App';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, docId: null });

  // Fetch user documents
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/api/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    setUploadProgress(0);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      setSuccess('File uploaded and processed successfully!');
      fetchDocuments(); // Refresh the documents list
      
      // Navigate to the document view after a short delay
      setTimeout(() => {
        navigate(`/document/${response.data.id}`);
      }, 1000);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'image/*': ['.png', '.jpg', '.jpeg', '.bmp', '.tiff']
    },
    maxSize: 16 * 1024 * 1024, // 16MB
    multiple: false,
  });

  const handleDeleteDocument = async () => {
    // This would be implemented with a delete endpoint
    setDeleteDialog({ open: false, docId: null });
    // For now, just refresh the list
    fetchDocuments();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stats = [
    {
      title: 'Documents Processed',
      value: documents.length,
      icon: <Description sx={{ fontSize: 40, color: '#8B4513' }} />,
      color: '#E3F2FD',
    },
    {
      title: 'Text Files',
      value: documents.filter(doc => doc.file_type === 'text').length,
      icon: <Description sx={{ fontSize: 40, color: '#2196F3' }} />,
      color: '#E3F2FD',
    },
    {
      title: 'Images Processed',
      value: documents.filter(doc => doc.file_type === 'image').length,
      icon: <Image sx={{ fontSize: 40, color: '#4CAF50' }} />,
      color: '#E8F5E8',
    },
    {
      title: 'Learning Sessions',
      value: documents.length * 3, // Estimated
      icon: <School sx={{ fontSize: 40, color: '#FF9800' }} />,
      color: '#FFF3E0',
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} sx={{ color: '#8B4513' }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Welcome Header */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              color: '#3E2723',
              mb: 2,
            }}
          >
            Welcome back, {user?.name}!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#5D4037',
              fontWeight: 400,
            }}
          >
            Ready to simplify some complex content today?
          </Typography>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionCard
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 700,
                      color: '#8B4513',
                      mb: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#5D4037',
                      fontWeight: 500,
                    }}
                  >
                    {stat.title}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* File Upload Section */}
          <Grid item xs={12} md={6}>
            <MotionCard
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              sx={{ height: 400 }}
            >
              <CardContent sx={{ p: 3, height: '100%' }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                    color: '#3E2723',
                    mb: 3,
                  }}
                >
                  Upload New Document
                </Typography>

                <Paper
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed',
                    borderColor: isDragActive ? '#8B4513' : 'rgba(139, 69, 19, 0.3)',
                    borderRadius: 3,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backgroundColor: isDragActive ? 'rgba(139, 69, 19, 0.05)' : 'transparent',
                    height: 240,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    '&:hover': {
                      borderColor: '#8B4513',
                      backgroundColor: 'rgba(139, 69, 19, 0.02)',
                    },
                  }}
                >
                  <input {...getInputProps()} />
                  
                  {uploading ? (
                    <Box>
                      <CircularProgress sx={{ color: '#8B4513', mb: 2 }} />
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        Processing your file...
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(139, 69, 19, 0.2)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#8B4513',
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {uploadProgress}%
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <CloudUpload sx={{ fontSize: 60, color: '#8B4513', mb: 2 }} />
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: '"Playfair Display", serif',
                          fontWeight: 600,
                          color: '#3E2723',
                          mb: 1,
                        }}
                      >
                        {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#5D4037', mb: 2 }}>
                        or click to browse
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8B860B' }}>
                        Supports: Text files (.txt, .md) and Images (.png, .jpg, .jpeg, .bmp, .tiff)
                        <br />
                        Max size: 16MB
                      </Typography>
                    </>
                  )}
                </Paper>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Recent Documents */}
          <Grid item xs={12} md={6}>
            <MotionCard
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              sx={{ height: 400 }}
            >
              <CardContent sx={{ p: 3, height: '100%' }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                    color: '#3E2723',
                    mb: 3,
                  }}
                >
                  Recent Documents
                </Typography>

                <Box sx={{ height: 280, overflow: 'auto' }}>
                  {documents.length === 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#5D4037',
                      }}
                    >
                      <Description sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                      <Typography variant="body1" textAlign="center">
                        No documents yet.
                        <br />
                        Upload your first file to get started!
                      </Typography>
                    </Box>
                  ) : (
                    <List>
                      {documents.slice(0, 5).map((doc) => (
                        <ListItem
                          key={doc.id}
                          sx={{
                            borderRadius: 2,
                            mb: 1,
                            '&:hover': {
                              backgroundColor: 'rgba(139, 69, 19, 0.05)',
                            },
                          }}
                        >
                          <ListItemIcon>
                            {doc.file_type === 'image' ? (
                              <Image sx={{ color: '#4CAF50' }} />
                            ) : (
                              <Description sx={{ color: '#2196F3' }} />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={doc.filename}
                            secondary={formatDate(doc.created_at)}
                            primaryTypographyProps={{
                              fontFamily: '"Crimson Text", serif',
                              fontWeight: 600,
                            }}
                            secondaryTypographyProps={{
                              fontFamily: '"Crimson Text", serif',
                            }}
                          />
                          <ListItemSecondaryAction>
                            <Chip
                              label={doc.file_type}
                              size="small"
                              sx={{
                                backgroundColor: doc.file_type === 'image' ? '#E8F5E8' : '#E3F2FD',
                                color: doc.file_type === 'image' ? '#4CAF50' : '#2196F3',
                                mr: 1,
                              }}
                            />
                            <IconButton
                              component={Link}
                              to={`/document/${doc.id}`}
                              sx={{ color: '#8B4513' }}
                            >
                              <Visibility />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          sx={{ mt: 6 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              color: '#3E2723',
              mb: 3,
              textAlign: 'center',
            }}
          >
            Quick Actions
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Button
                component={Link}
                to="/games"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Games />}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #388E3C 30%, #689F38 90%)',
                  },
                }}
              >
                Play Learning Games
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                component={Link}
                to="/chat"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Chat />}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #2196F3 30%, #03A9F4 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #0288D1 90%)',
                  },
                }}
              >
                Chat with AI
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                component={Link}
                to="/feedback"
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<Assessment />}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                }}
              >
                Give Feedback
              </Button>
            </Grid>
          </Grid>
        </MotionBox>
      </MotionBox>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, docId: null })}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCF8 100%)',
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif' }}>
          Delete Document
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: '"Crimson Text", serif' }}>
            Are you sure you want to delete this document? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, docId: null })}
            sx={{ fontFamily: '"Crimson Text", serif' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteDocument}
            color="error"
            variant="contained"
            sx={{ fontFamily: '"Crimson Text", serif' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;