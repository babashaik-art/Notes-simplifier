import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Chip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person,
  Email,
  Edit,
  Save,
  Cancel,
  Security,
  Notifications,
  Palette,
  Language,
  Delete,
  Download,
  Upload,
  TrendingUp,
  EmojiEvents,
  School,
  Games,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../App';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const Profile = () => {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Learning enthusiast passionate about simplifying complex topics.',
    location: 'San Francisco, CA',
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    gameNotifications: true,
    darkMode: false,
    autoSave: true,
    language: 'English',
  });

  const stats = [
    { label: 'Documents Processed', value: 47, icon: <School sx={{ color: '#8B4513' }} /> },
    { label: 'Games Played', value: 23, icon: <Games sx={{ color: '#2196F3' }} /> },
    { label: 'Total Score', value: 1834, icon: <TrendingUp sx={{ color: '#4CAF50' }} /> },
    { label: 'Achievements', value: 8, icon: <EmojiEvents sx={{ color: '#FF9800' }} /> },
  ];

  const recentActivity = [
    { action: 'Uploaded document', item: 'Machine Learning Notes.pdf', time: '2 hours ago' },
    { action: 'Completed quiz', item: 'AI Fundamentals Quiz', time: '1 day ago' },
    { action: 'Achieved milestone', item: 'Quiz Master Badge', time: '2 days ago' },
    { action: 'Simplified document', item: 'Complex Research Paper.txt', time: '3 days ago' },
  ];

  const handleSave = () => {
    // API call to update profile
    setEditing(false);
  };

  const handleSettingChange = (setting) => (event) => {
    setSettings({ ...settings, [setting]: event.target.checked });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Grid container spacing={4}>
          {/* Profile Header */}
          <Grid item xs={12}>
            <MotionCard
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: '#8B4513',
                      fontSize: '2.5rem',
                      mr: 3,
                      border: '4px solid rgba(139, 69, 19, 0.1)',
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 700,
                        color: '#3E2723',
                        mb: 1,
                      }}
                    >
                      {user?.name}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      Learning Enthusiast
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label="Active Learner" color="primary" size="small" />
                      <Chip label="Quiz Master" sx={{ bgcolor: '#4CAF50', color: 'white' }} size="small" />
                      <Chip label="Document Expert" sx={{ bgcolor: '#FF9800', color: 'white' }} size="small" />
                    </Box>
                  </Box>
                  <Button
                    variant={editing ? 'contained' : 'outlined'}
                    startIcon={editing ? <Save /> : <Edit />}
                    onClick={editing ? handleSave : () => setEditing(true)}
                    sx={{ ml: 2 }}
                  >
                    {editing ? 'Save' : 'Edit Profile'}
                  </Button>
                  {editing && (
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => setEditing(false)}
                      sx={{ ml: 1 }}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCF8 100%)',
                      }}
                    >
                      <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: '"Playfair Display", serif',
                          fontWeight: 700,
                          color: '#8B4513',
                          mb: 1,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Profile Information */}
          <Grid item xs={12} md={8}>
            <MotionCard
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  Profile Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!editing}
                      InputProps={{ startAdornment: <Person sx={{ mr: 1, color: '#8B4513' }} /> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!editing}
                      InputProps={{ startAdornment: <Email sx={{ mr: 1, color: '#8B4513' }} /> }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      multiline
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={!editing}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  Recent Activity
                </Typography>

                <List>
                  {recentActivity.map((activity, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: '#8B4513',
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography variant="body1" component="span" sx={{ fontWeight: 600 }}>
                              {activity.action}
                            </Typography>
                            <Typography variant="body1" component="span" sx={{ ml: 1 }}>
                              {activity.item}
                            </Typography>
                          </Box>
                        }
                        secondary={activity.time}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Settings */}
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  Settings
                </Typography>

                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Notifications sx={{ color: '#8B4513' }} />
                    </ListItemIcon>
                    <ListItemText primary="Email Notifications" />
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={handleSettingChange('emailNotifications')}
                      color="primary"
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Games sx={{ color: '#8B4513' }} />
                    </ListItemIcon>
                    <ListItemText primary="Game Notifications" />
                    <Switch
                      checked={settings.gameNotifications}
                      onChange={handleSettingChange('gameNotifications')}
                      color="primary"
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Save sx={{ color: '#8B4513' }} />
                    </ListItemIcon>
                    <ListItemText primary="Auto-save Documents" />
                    <Switch
                      checked={settings.autoSave}
                      onChange={handleSettingChange('autoSave')}
                      color="primary"
                    />
                  </ListItem>
                </List>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ mb: 2, fontFamily: '"Playfair Display", serif' }}>
                  Account Actions
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Export Data
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Security />}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                    onClick={() => setDeleteDialog(true)}
                  >
                    Delete Account
                  </Button>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>
      </MotionBox>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCF8 100%)',
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif' }}>
          Delete Account
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. All your documents, game progress, and data will be permanently deleted.
          </Alert>
          <Typography>
            Are you sure you want to delete your account? Type "DELETE" to confirm.
          </Typography>
          <TextField
            fullWidth
            placeholder="Type DELETE to confirm"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button color="error" variant="contained">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;