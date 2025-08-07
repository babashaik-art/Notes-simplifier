import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Profile = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center">
        <Typography variant="h2" sx={{ fontFamily: '"Playfair Display", serif', mb: 2 }}>
          User Profile
        </Typography>
        <Typography variant="body1">
          User profile settings and account management will be displayed here.
        </Typography>
      </Box>
    </Container>
  );
};

export default Profile;