import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  MenuBook,
  Chat,
  Games,
  School,
  Assessment
} from '@mui/icons-material';
import axios from 'axios';

const MotionCard = motion(Card);

const COLORS = ['#8B4513', '#D2691E', '#DEB887', '#CD853F', '#F4A460'];

const UserAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/analytics/user');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Typography variant="h6" color="text.secondary" align="center">
        No analytics data available
      </Typography>
    );
  }

  const statsCards = [
    {
      title: 'Documents Uploaded',
      value: analytics.documents_uploaded,
      icon: <MenuBook />,
      color: COLORS[0]
    },
    {
      title: 'Chat Interactions',
      value: analytics.chat_interactions,
      icon: <Chat />,
      color: COLORS[1]
    },
    {
      title: 'Average Game Score',
      value: `${analytics.average_game_score}%`,
      icon: <Games />,
      color: COLORS[2]
    },
    {
      title: 'Average Reading Level',
      value: `Grade ${analytics.average_reading_level}`,
      icon: <School />,
      color: COLORS[3]
    }
  ];

  const activityData = [
    { name: 'Documents', value: analytics.documents_uploaded },
    { name: 'Chats', value: analytics.chat_interactions },
    { name: 'Games', value: analytics.total_game_sessions }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontFamily: '"Playfair Display", serif' }}>
        📊 Your Learning Analytics
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              sx={{
                background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                border: `2px solid ${stat.color}30`,
                height: '100%'
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: stat.color,
                    color: 'white',
                    mb: 2
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Activity Overview */}
        <Grid item xs={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            sx={{ height: '400px' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp /> Activity Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FAF7F2',
                      border: '1px solid #8B4513',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Activity Distribution */}
        <Grid item xs={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            sx={{ height: '400px' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment /> Activity Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={activityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Progress Indicators */}
        <Grid item xs={12}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎯 Learning Progress
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" sx={{ color: COLORS[0], fontWeight: 'bold' }}>
                      {analytics.documents_uploaded}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Documents Processed
                    </Typography>
                    <Chip
                      label={analytics.documents_uploaded > 5 ? "Expert" : "Beginner"}
                      color={analytics.documents_uploaded > 5 ? "success" : "default"}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" sx={{ color: COLORS[1], fontWeight: 'bold' }}>
                      {analytics.average_game_score.toFixed(0)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Game Performance
                    </Typography>
                    <Chip
                      label={analytics.average_game_score > 80 ? "Excellent" : analytics.average_game_score > 60 ? "Good" : "Improving"}
                      color={analytics.average_game_score > 80 ? "success" : analytics.average_game_score > 60 ? "warning" : "default"}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" sx={{ color: COLORS[2], fontWeight: 'bold' }}>
                      {analytics.average_reading_level.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Reading Level
                    </Typography>
                    <Chip
                      label={`Grade ${analytics.average_reading_level.toFixed(0)} Level`}
                      color="primary"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserAnalytics;