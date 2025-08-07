import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Tabs,
  Tab,
  Paper,
  Chip,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Description,
  Image,
  Psychology,
  Games,
  Share,
  Download,
  ExpandMore,
  PlayArrow,
  Quiz,
  School,
  Lightbulb,
  TrendingUp,
  Close,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [gameDialog, setGameDialog] = useState({ open: false, game: null });
  const [currentGame, setCurrentGame] = useState(null);

  useEffect(() => {
    if (id) {
      fetchDocument();
    }
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`/api/document/${id}`);
      setDocument(response.data);
    } catch (error) {
      setError('Failed to load document. Please try again.');
      console.error('Error fetching document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderGames = () => {
    if (!document?.games || typeof document.games !== 'object') {
      return (
        <Box textAlign="center" py={4}>
          <Games sx={{ fontSize: 60, color: '#8B4513', opacity: 0.5, mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No games available for this document
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Games are generated automatically based on document content
          </Typography>
        </Box>
      );
    }

    const games = document.games;
    
    return (
      <Grid container spacing={3}>
        {/* Quiz Game */}
        {games.quiz && (
          <Grid item xs={12} md={6}>
            <MotionCard
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader
                avatar={<Quiz sx={{ color: '#2196F3' }} />}
                title="Quiz Challenge"
                subheader="Test your understanding"
                sx={{
                  '& .MuiCardHeader-title': {
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                  },
                }}
              />
              <CardContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Interactive quiz questions based on the document content
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={() => setGameDialog({ open: true, game: 'quiz' })}
                  sx={{ width: '100%' }}
                >
                  Start Quiz
                </Button>
              </CardContent>
            </MotionCard>
          </Grid>
        )}

        {/* Word Puzzle Game */}
        {games.wordPuzzle && (
          <Grid item xs={12} md={6}>
            <MotionCard
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader
                avatar={<School sx={{ color: '#4CAF50' }} />}
                title="Word Puzzle"
                subheader="Find the hidden words"
                sx={{
                  '& .MuiCardHeader-title': {
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                  },
                }}
              />
              <CardContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Word search and crossword puzzles from key terms
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={() => setGameDialog({ open: true, game: 'wordPuzzle' })}
                  sx={{ width: '100%' }}
                >
                  Play Puzzle
                </Button>
              </CardContent>
            </MotionCard>
          </Grid>
        )}

        {/* Fill in the Blanks */}
        {games.fillBlanks && (
          <Grid item xs={12} md={6}>
            <MotionCard
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader
                avatar={<Lightbulb sx={{ color: '#FF9800' }} />}
                title="Fill the Blanks"
                subheader="Complete the sentences"
                sx={{
                  '& .MuiCardHeader-title': {
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                  },
                }}
              />
              <CardContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Fill in missing words to complete key sentences
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={() => setGameDialog({ open: true, game: 'fillBlanks' })}
                  sx={{ width: '100%' }}
                >
                  Start Game
                </Button>
              </CardContent>
            </MotionCard>
          </Grid>
        )}

        {/* Memory Game */}
        <Grid item xs={12} md={6}>
          <MotionCard
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader
              avatar={<TrendingUp sx={{ color: '#9C27B0' }} />}
              title="Memory Challenge"
              subheader="Remember key concepts"
              sx={{
                '& .MuiCardHeader-title': {
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 600,
                },
              }}
            />
            <CardContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Memory card matching game with important terms
              </Typography>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => setGameDialog({ open: true, game: 'memory' })}
                sx={{ width: '100%' }}
              >
                Play Memory
              </Button>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    );
  };

  const renderGameDialog = () => {
    if (!gameDialog.open) return null;

    return (
      <Dialog
        open={gameDialog.open}
        onClose={() => setGameDialog({ open: false, game: null })}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCF8 100%)',
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontFamily: '"Playfair Display", serif',
        }}>
          {gameDialog.game === 'quiz' && 'Quiz Challenge'}
          {gameDialog.game === 'wordPuzzle' && 'Word Puzzle'}
          {gameDialog.game === 'fillBlanks' && 'Fill the Blanks'}
          {gameDialog.game === 'memory' && 'Memory Challenge'}
          <IconButton onClick={() => setGameDialog({ open: false, game: null })}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Games sx={{ fontSize: 80, color: '#8B4513', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Game Feature Coming Soon!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Interactive {gameDialog.game} games are being developed and will be available in the next update.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGameDialog({ open: false, game: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} sx={{ color: '#8B4513' }} />
        </Box>
      </Container>
    );
  }

  if (error || !document) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error || 'Document not found'}
        </Alert>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button variant="contained" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
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
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {document.file_type === 'image' ? (
              <Image sx={{ fontSize: 32, color: '#4CAF50', mr: 2 }} />
            ) : (
              <Description sx={{ fontSize: 32, color: '#2196F3', mr: 2 }} />
            )}
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  color: '#3E2723',
                }}
              >
                {document.filename}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Processed on {formatDate(document.created_at)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={document.file_type.toUpperCase()}
                color="primary"
                size="small"
              />
              <IconButton sx={{ color: '#8B4513' }}>
                <Share />
              </IconButton>
              <IconButton sx={{ color: '#8B4513' }}>
                <Download />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Paper elevation={2} sx={{ borderRadius: 3, mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{
              '& .MuiTab-root': {
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '1.1rem',
                fontWeight: 600,
                minWidth: 120,
              },
            }}
          >
            <Tab label="Original Text" />
            <Tab label="Simplified Text" />
            <Tab label="Educational Games" />
            <Tab label="Analysis" />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardHeader
              title="Original Content"
              subheader="Extracted text from your uploaded file"
              sx={{
                '& .MuiCardHeader-title': {
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 600,
                },
              }}
            />
            <CardContent>
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: '#FAFAFA',
                  borderRadius: 2,
                  border: '1px solid rgba(139, 69, 19, 0.1)',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: '"Crimson Text", serif',
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {document.original_text || 'No text content available'}
                </Typography>
              </Paper>
            </CardContent>
          </MotionCard>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardHeader
              avatar={<Psychology sx={{ color: '#8B4513' }} />}
              title="AI-Simplified Content"
              subheader="Simplified using ChatGPT and Perplexity"
              sx={{
                '& .MuiCardHeader-title': {
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 600,
                },
              }}
            />
            <CardContent>
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: '#F3F8FF',
                  borderRadius: 2,
                  border: '1px solid rgba(33, 150, 243, 0.1)',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: '"Crimson Text", serif',
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {document.simplified_text || 'Simplified text is being generated...'}
                </Typography>
              </Paper>

              {/* Reading Metrics */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: '"Playfair Display", serif' }}>
                  Reading Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" sx={{ color: '#8B4513', fontWeight: 700 }}>
                        {document.original_text?.split(' ').length || 0}
                      </Typography>
                      <Typography variant="caption">Original Words</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" sx={{ color: '#2196F3', fontWeight: 700 }}>
                        {document.simplified_text?.split(' ').length || 0}
                      </Typography>
                      <Typography variant="caption">Simplified Words</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                        {Math.round(((document.original_text?.split(' ').length || 0) - (document.simplified_text?.split(' ').length || 0)) / (document.original_text?.split(' ').length || 1) * 100)}%
                      </Typography>
                      <Typography variant="caption">Reduction</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 700 }}>
                        5-7
                      </Typography>
                      <Typography variant="caption">Reading Level</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </MotionCard>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
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
              Educational Games
            </Typography>
            {renderGames()}
          </MotionBox>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardHeader
              title="Content Analysis"
              subheader="AI-powered insights about your document"
              sx={{
                '& .MuiCardHeader-title': {
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 600,
                },
              }}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
                        Key Topics
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Main topics and themes identified in your document will appear here.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
                        Complexity Score
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          Document Complexity: Medium
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={65}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(139, 69, 19, 0.2)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#FF9800',
                            },
                          }}
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Grid>

                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
                        Learning Recommendations
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        • Start with the simplified version to understand main concepts
                        <br />
                        • Play the quiz game to test comprehension
                        <br />
                        • Use the chat feature to ask questions about specific topics
                        <br />
                        • Review the original text for detailed information
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </CardContent>
          </MotionCard>
        </TabPanel>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            sx={{ mr: 2, mb: 2 }}
            onClick={() => navigate('/chat', { state: { context: document.simplified_text } })}
          >
            Discuss with AI
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ mr: 2, mb: 2 }}
            onClick={() => navigate('/games')}
          >
            More Games
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ mb: 2 }}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </Box>
      </MotionBox>

      {/* Game Dialog */}
      {renderGameDialog()}
    </Container>
  );
};

export default DocumentView;