import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Games = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center">
        <Typography variant="h2" sx={{ fontFamily: '"Playfair Display", serif', mb: 2 }}>
          Educational Games
        </Typography>
        <Typography variant="body1">
          Interactive games and puzzles will be displayed here based on your uploaded content.
        </Typography>
      </Box>
    </Container>
  );
};

export default Games;