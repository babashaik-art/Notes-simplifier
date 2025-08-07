import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const DocumentView = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center">
        <Typography variant="h2" sx={{ fontFamily: '"Playfair Display", serif', mb: 2 }}>
          Document View
        </Typography>
        <Typography variant="body1">
          This page will show the document content, simplified text, and generated games.
        </Typography>
      </Box>
    </Container>
  );
};

export default DocumentView;