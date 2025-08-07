import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Chat = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center">
        <Typography variant="h2" sx={{ fontFamily: '"Playfair Display", serif', mb: 2 }}>
          AI Chat Assistant
        </Typography>
        <Typography variant="body1">
          Chat interface with AI assistant for discussing topics and getting help will be here.
        </Typography>
      </Box>
    </Container>
  );
};

export default Chat;