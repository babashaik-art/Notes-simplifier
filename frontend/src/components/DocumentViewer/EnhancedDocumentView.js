import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
  Fab,
  Tooltip
} from '@mui/material';
import {
  ExpandMore,
  Psychology,
  Quiz,
  Search,
  Lightbulb,
  TrendingUp,
  Share,
  Download,
  QuestionAnswer,
  Analytics,
  Visibility,
  AutoStories
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import axios from 'axios';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const EnhancedDocumentView = ({ document, onClose }) => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [conceptDialog, setConceptDialog] = useState({ open: false, concept: '' });
  const [explanation, setExplanation] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`/api/document/${document.id}/search`, {
        query: searchQuery
      });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExplainConcept = async () => {
    if (!conceptDialog.concept.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`/api/document/${document.id}/explain`, {
        concept: conceptDialog.concept
      });
      setExplanation(response.data.explanation);
    } catch (error) {
      console.error('Explanation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/document/${document.id}/generate-questions`);
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Questions generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create visualization data
  const createSentimentData = () => {
    const sentiment = document.sentiment_score || 0;
    return [
      { name: 'Positive', value: Math.max(0, sentiment * 100), fill: '#4CAF50' },
      { name: 'Neutral', value: Math.max(0, (1 - Math.abs(sentiment)) * 100), fill: '#FFC107' },
      { name: 'Negative', value: Math.max(0, -sentiment * 100), fill: '#F44336' }
    ];
  };

  const createReadingLevelData = () => {
    const level = parseFloat(document.reading_level?.replace('Grade ', '') || '0');
    return [
      { name: 'Elementary (1-5)', value: level <= 5 ? level : 0 },
      { name: 'Middle (6-8)', value: level > 5 && level <= 8 ? level - 5 : 0 },
      { name: 'High School (9-12)', value: level > 8 && level <= 12 ? level - 8 : 0 },
      { name: 'College (13+)', value: level > 12 ? Math.min(level - 12, 4) : 0 }
    ];
  };

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', p: 2 }}>
      {/* Header */}
      <MotionCard
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ mb: 3, background: 'linear-gradient(135deg, #f5f3f0 0%, #e8e2d4 100%)' }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', mb: 1 }}>
                📄 {document.filename}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={`${document.word_count || 0} words`} color="primary" size="small" />
                <Chip label={document.reading_level || 'N/A'} color="secondary" size="small" />
                <Chip label={document.file_type?.toUpperCase()} color="default" size="small" />
                {document.sentiment_score && (
                  <Chip
                    label={`Sentiment: ${document.sentiment_score > 0 ? 'Positive' : document.sentiment_score < 0 ? 'Negative' : 'Neutral'}`}
                    color={document.sentiment_score > 0 ? 'success' : document.sentiment_score < 0 ? 'error' : 'default'}
                    size="small"
                  />
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Share Document">
                <Fab size="small" color="primary">
                  <Share />
                </Fab>
              </Tooltip>
              <Tooltip title="Download">
                <Fab size="small" color="secondary">
                  <Download />
                </Fab>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </MotionCard>

      {/* Navigation Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<Visibility />} label="Overview" />
          <Tab icon={<AutoStories />} label="Original Text" />
          <Tab icon={<Psychology />} label="Simplified" />
          <Tab icon={<Analytics />} label="Analysis" />
          <Tab icon={<Search />} label="Search" />
          <Tab icon={<QuestionAnswer />} label="Q&A" />
          <Tab icon={<Quiz />} label="Games" />
        </Tabs>
      </Card>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Summary */}
            <Grid item xs={12} md={8}>
              <MotionCard
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoStories /> Document Summary
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {document.summary || 'No summary available.'}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12} md={4}>
              <MotionCard
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📊 Quick Stats
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Word Count"
                        secondary={document.word_count || 0}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Reading Level"
                        secondary={document.reading_level || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="File Type"
                        secondary={document.file_type?.toUpperCase()}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </MotionCard>
            </Grid>

            {/* Key Concepts */}
            {document.key_concepts && document.key_concepts.length > 0 && (
              <Grid item xs={12} md={6}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Lightbulb /> Key Concepts
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {document.key_concepts.slice(0, 10).map((concept, index) => (
                        <Chip
                          key={index}
                          label={concept}
                          onClick={() => setConceptDialog({ open: true, concept })}
                          sx={{ cursor: 'pointer' }}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            )}

            {/* Word Cloud */}
            {document.word_cloud && (
              <Grid item xs={12} md={6}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      ☁️ Word Cloud
                    </Typography>
                    <Box sx={{ textAlign: 'center' }}>
                      <img
                        src={document.word_cloud}
                        alt="Word Cloud"
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                      />
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Original Text Tab */}
        <TabPanel value={tabValue} index={1}>
          <MotionCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📄 Original Document
              </Typography>
              <Paper
                sx={{
                  p: 3,
                  maxHeight: '600px',
                  overflow: 'auto',
                  backgroundColor: '#fafafa',
                  fontFamily: '"Georgia", serif',
                  lineHeight: 1.8
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {document.original_text}
                </ReactMarkdown>
              </Paper>
            </CardContent>
          </MotionCard>
        </TabPanel>

        {/* Simplified Text Tab */}
        <TabPanel value={tabValue} index={2}>
          <MotionCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Psychology /> Simplified Version
              </Typography>
              <Paper
                sx={{
                  p: 3,
                  maxHeight: '600px',
                  overflow: 'auto',
                  backgroundColor: '#f8f9fa',
                  border: '2px solid #e3f2fd',
                  fontFamily: '"Open Sans", sans-serif',
                  lineHeight: 1.8
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {document.simplified_text}
                </ReactMarkdown>
              </Paper>
            </CardContent>
          </MotionCard>
        </TabPanel>

        {/* Analysis Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            {/* Sentiment Analysis */}
            <Grid item xs={12} md={6}>
              <MotionCard
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    😊 Sentiment Analysis
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={createSentimentData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {createSentimentData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </MotionCard>
            </Grid>

            {/* Reading Level */}
            <Grid item xs={12} md={6}>
              <MotionCard
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📚 Reading Level Analysis
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={createReadingLevelData()}>
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="value" fill="#8B4513" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </MotionCard>
            </Grid>

            {/* Entities */}
            {document.entities && Object.keys(document.entities).length > 0 && (
              <Grid item xs={12}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      🏷️ Named Entities
                    </Typography>
                    {Object.entries(document.entities).map(([type, entities]) => (
                      <Accordion key={type}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle1">
                            {type} ({entities.length})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {entities.map((entity, index) => (
                              <Chip key={index} label={entity} size="small" />
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </CardContent>
                </MotionCard>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Search Tab */}
        <TabPanel value={tabValue} index={4}>
          <MotionCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Search /> Semantic Search
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search within the document..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  disabled={loading}
                  sx={{ minWidth: '120px' }}
                >
                  {loading ? <CircularProgress size={20} /> : 'Search'}
                </Button>
              </Box>

              {searchResults.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Search Results ({searchResults.length})
                  </Typography>
                  {searchResults.map((result, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Similarity: {(result.similarity * 100).toFixed(1)}%</strong>
                      </Typography>
                      <Typography variant="body1">
                        {result.text}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </MotionCard>
        </TabPanel>

        {/* Q&A Tab */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <MotionCard
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    💡 Generate Study Questions
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={generateQuestions}
                    disabled={loading}
                    sx={{ mb: 2 }}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Generate Questions'}
                  </Button>
                  
                  {questions.length > 0 && (
                    <List>
                      {questions.map((question, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Quiz color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={question} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <MotionCard
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🔍 Concept Explanation
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter a concept to explain..."
                    value={conceptDialog.concept}
                    onChange={(e) => setConceptDialog({ ...conceptDialog, concept: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleExplainConcept}
                    disabled={loading || !conceptDialog.concept.trim()}
                    sx={{ mb: 2 }}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Explain'}
                  </Button>
                  
                  {explanation && (
                    <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {explanation}
                      </ReactMarkdown>
                    </Paper>
                  )}
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Games Tab */}
        <TabPanel value={tabValue} index={6}>
          <MotionCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Quiz /> Educational Games
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Interactive games will be loaded here based on the document content.
              </Alert>
              {/* Games content will be rendered here */}
            </CardContent>
          </MotionCard>
        </TabPanel>
      </AnimatePresence>
    </Box>
  );
};

export default EnhancedDocumentView;