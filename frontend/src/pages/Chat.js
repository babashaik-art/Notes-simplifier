import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Fade,
  Tooltip,
} from '@mui/material';
import {
  Send,
  Psychology,
  Person,
  Clear,
  Help,
  Lightbulb,
  School,
  QuestionAnswer,
  AutoFixHigh,
  History,
  BookmarkAdd,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const Chat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello ${user?.name || 'there'}! I'm your AI learning assistant. I can help you understand complex topics, answer questions, and provide explanations. How can I assist you today?`,
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [context, setContext] = useState('');

  // Get context from navigation state (from DocumentView)
  useEffect(() => {
    if (location.state?.context) {
      setContext(location.state.context);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "I've loaded the context from your document. I can now answer questions specifically about that content!",
        sender: 'ai',
        timestamp: new Date(),
        type: 'context'
      }]);
    }
  }, [location.state]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestedQuestions = [
    "Explain this in simpler terms",
    "What are the key points?",
    "Can you give me examples?",
    "How does this relate to real life?",
    "What should I study next?",
    "Create a summary for me",
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/chat', {
        message: inputMessage,
        context: context,
      });

      const aiMessage = {
        id: messages.length + 2,
        text: response.data.response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setError('Failed to get response. Please try again.');
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      text: `Hello ${user?.name || 'there'}! I'm your AI learning assistant. How can I help you today?`,
      sender: 'ai',
      timestamp: new Date(),
    }]);
    setContext('');
    setError('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const MessageBubble = ({ message }) => {
    const isAI = message.sender === 'ai';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ListItem
          sx={{
            flexDirection: 'column',
            alignItems: isAI ? 'flex-start' : 'flex-end',
            px: 2,
            py: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              flexDirection: isAI ? 'row' : 'row-reverse',
              maxWidth: '80%',
              mb: 0.5,
            }}
          >
            <Avatar
              sx={{
                bgcolor: isAI ? '#8B4513' : '#2196F3',
                width: 32,
                height: 32,
                mx: 1,
              }}
            >
              {isAI ? <Psychology /> : <Person />}
            </Avatar>
            
            <Paper
              sx={{
                p: 2,
                borderRadius: isAI ? '20px 20px 20px 5px' : '20px 20px 5px 20px',
                backgroundColor: isAI ? '#F5F5F5' : '#8B4513',
                color: isAI ? '#3E2723' : '#FFFFFF',
                maxWidth: '100%',
                position: 'relative',
                ...(message.type === 'context' && {
                  border: '2px solid #4CAF50',
                  backgroundColor: '#E8F5E8',
                }),
              }}
            >
              {message.type === 'context' && (
                <Chip
                  label="Context Loaded"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: 8,
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    fontSize: '0.7rem',
                  }}
                />
              )}
              
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Crimson Text", serif',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {message.text}
              </Typography>
            </Paper>
          </Box>
          
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.75rem',
              alignSelf: isAI ? 'flex-start' : 'flex-end',
              ml: isAI ? 5 : 0,
              mr: isAI ? 0 : 5,
            }}
          >
            {formatTime(message.timestamp)}
          </Typography>
        </ListItem>
      </motion.div>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, height: 'calc(100vh - 120px)' }}>
      <Grid container spacing={3} sx={{ height: '100%' }}>
        {/* Chat Area */}
        <Grid item xs={12} md={8}>
          <MotionPaper
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            elevation={3}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCF8 100%)',
            }}
          >
            {/* Chat Header */}
            <Box
              sx={{
                p: 3,
                background: 'linear-gradient(90deg, #8B4513 0%, #D2691E 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <Psychology />
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 600,
                    }}
                  >
                    AI Learning Assistant
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {context ? 'Context-aware mode' : 'General assistance mode'}
                  </Typography>
                </Box>
              </Box>
              
              <Box>
                <Tooltip title="Clear conversation">
                  <IconButton onClick={clearChat} sx={{ color: 'white' }}>
                    <Clear />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Messages Area */}
            <Box
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                backgroundColor: '#FAFAFA',
              }}
            >
              {error && (
                <Alert severity="error" sx={{ m: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <List sx={{ py: 1 }}>
                <AnimatePresence>
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </AnimatePresence>
                
                {loading && (
                  <ListItem sx={{ justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} sx={{ color: '#8B4513' }} />
                    <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                      AI is thinking...
                    </Typography>
                  </ListItem>
                )}
                
                <div ref={messagesEndRef} />
              </List>
            </Box>

            {/* Input Area */}
            <Box
              sx={{
                p: 2,
                backgroundColor: 'white',
                borderTop: '1px solid rgba(139, 69, 19, 0.1)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your documents or any topic..."
                  variant="outlined"
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: '#FAFAFA',
                      '& fieldset': {
                        borderColor: 'rgba(139, 69, 19, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(139, 69, 19, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#8B4513',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontFamily: '"Crimson Text", serif',
                      fontSize: '1rem',
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={loading || !inputMessage.trim()}
                  sx={{
                    minWidth: 56,
                    height: 56,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #8B4513 30%, #D2691E 90%)',
                  }}
                >
                  <Send />
                </Button>
              </Box>
            </Box>
          </MotionPaper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
            {/* Context Info */}
            {context && (
              <MotionPaper
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                elevation={2}
                sx={{ p: 3, borderRadius: 3 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BookmarkAdd sx={{ color: '#4CAF50', mr: 1 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 600,
                      color: '#3E2723',
                    }}
                  >
                    Document Context
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  I have access to your document content and can answer specific questions about it.
                </Typography>
                <Chip
                  label="Context Active"
                  size="small"
                  sx={{
                    backgroundColor: '#E8F5E8',
                    color: '#4CAF50',
                    fontWeight: 600,
                  }}
                />
              </MotionPaper>
            )}

            {/* Suggested Questions */}
            <MotionPaper
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              elevation={2}
              sx={{ p: 3, borderRadius: 3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Help sx={{ color: '#8B4513', mr: 1 }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                    color: '#3E2723',
                  }}
                >
                  Suggested Questions
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {suggestedQuestions.map((question, index) => (
                  <Chip
                    key={index}
                    label={question}
                    onClick={() => handleSuggestedQuestion(question)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(139, 69, 19, 0.1)',
                      },
                      fontFamily: '"Crimson Text", serif',
                    }}
                  />
                ))}
              </Box>
            </MotionPaper>

            {/* Chat Features */}
            <MotionPaper
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              elevation={2}
              sx={{ p: 3, borderRadius: 3, flexGrow: 1 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 600,
                  color: '#3E2723',
                  mb: 2,
                }}
              >
                What I Can Help With
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <School sx={{ color: '#2196F3', mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Explain Concepts
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Break down complex topics into simple explanations
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <QuestionAnswer sx={{ color: '#4CAF50', mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Answer Questions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Provide detailed answers about your documents
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Lightbulb sx={{ color: '#FF9800', mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Study Tips
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Suggest learning strategies and study methods
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AutoFixHigh sx={{ color: '#9C27B0', mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Create Summaries
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Generate concise summaries of complex content
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2, borderColor: 'rgba(139, 69, 19, 0.1)' }} />

              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                💡 Tip: Ask follow-up questions to dive deeper into any topic!
              </Typography>
            </MotionPaper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;