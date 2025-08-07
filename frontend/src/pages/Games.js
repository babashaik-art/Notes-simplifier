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
  Paper,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import {
  Games as GamesIcon,
  Quiz,
  School,
  Lightbulb,
  TrendingUp,
  EmojiEvents,
  PlayArrow,
  Star,
  Timer,
  Psychology,
  Extension,
  Shuffle,
  ViewModule,
  Close,
  Leaderboard,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../App';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`games-tabpanel-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const Games = () => {
  const { user } = useAuth();
  
  const [tabValue, setTabValue] = useState(0);
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameDialog, setGameDialog] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState({
    totalGamesPlayed: 0,
    totalScore: 0,
    averageScore: 0,
    favoriteGame: 'Quiz',
  });

  const gameTypes = [
    {
      id: 'quiz',
      title: 'Quiz Challenge',
      description: 'Test your knowledge with multiple choice questions generated from your documents',
      icon: <Quiz sx={{ fontSize: 40, color: '#2196F3' }} />,
      color: '#E3F2FD',
      difficulty: 'Medium',
      estimatedTime: '5-10 min',
      players: 1247,
      category: 'Knowledge',
    },
    {
      id: 'wordPuzzle',
      title: 'Word Search',
      description: 'Find hidden words and key terms from your study materials',
      icon: <Extension sx={{ fontSize: 40, color: '#4CAF50' }} />,
      color: '#E8F5E8',
      difficulty: 'Easy',
      estimatedTime: '3-7 min',
      players: 892,
      category: 'Vocabulary',
    },
    {
      id: 'fillBlanks',
      title: 'Fill the Blanks',
      description: 'Complete sentences with missing words from your documents',
      icon: <Lightbulb sx={{ fontSize: 40, color: '#FF9800' }} />,
      color: '#FFF3E0',
      difficulty: 'Medium',
      estimatedTime: '4-8 min',
      players: 634,
      category: 'Comprehension',
    },
    {
      id: 'memory',
      title: 'Memory Match',
      description: 'Match pairs of related concepts and terms',
      icon: <Psychology sx={{ fontSize: 40, color: '#9C27B0' }} />,
      color: '#F3E5F5',
      difficulty: 'Hard',
      estimatedTime: '6-12 min',
      players: 456,
      category: 'Memory',
    },
    {
      id: 'crossword',
      title: 'Smart Crossword',
      description: 'Solve crossword puzzles with clues from your study content',
      icon: <ViewModule sx={{ fontSize: 40, color: '#FF5722' }} />,
      color: '#FBE9E7',
      difficulty: 'Hard',
      estimatedTime: '10-20 min',
      players: 321,
      category: 'Logic',
    },
    {
      id: 'sequence',
      title: 'Sequence Order',
      description: 'Arrange events, steps, or concepts in the correct order',
      icon: <Shuffle sx={{ fontSize: 40, color: '#607D8B' }} />,
      color: '#ECEFF1',
      difficulty: 'Medium',
      estimatedTime: '5-10 min',
      players: 287,
      category: 'Logic',
    },
  ];

  const achievements = [
    { title: 'First Steps', description: 'Play your first game', icon: '🎯', earned: true },
    { title: 'Quiz Master', description: 'Score 100% on a quiz', icon: '🧠', earned: true },
    { title: 'Speed Demon', description: 'Complete a game in under 2 minutes', icon: '⚡', earned: false },
    { title: 'Consistent Learner', description: 'Play games 7 days in a row', icon: '📅', earned: false },
    { title: 'Perfect Score', description: 'Get perfect scores on 5 different games', icon: '⭐', earned: false },
    { title: 'Game Explorer', description: 'Try all available game types', icon: '🎮', earned: false },
  ];

  const mockLeaderboard = [
    { rank: 1, name: 'Alex Chen', score: 2847, games: 45, avatar: 'A' },
    { rank: 2, name: 'Sarah Johnson', score: 2634, games: 38, avatar: 'S' },
    { rank: 3, name: 'Mike Wilson', score: 2421, games: 42, avatar: 'M' },
    { rank: 4, name: 'Emma Davis', score: 2198, games: 31, avatar: 'E' },
    { rank: 5, name: 'James Brown', score: 2056, games: 29, avatar: 'J' },
    { rank: 6, name: user?.name || 'You', score: 1834, games: 23, avatar: user?.name?.charAt(0) || 'U' },
  ];

  useEffect(() => {
    // Fetch user game statistics and leaderboard
    fetchGameData();
  }, []);

  const fetchGameData = async () => {
    try {
      // This would fetch real data from the API
      setLeaderboard(mockLeaderboard);
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePlayGame = (game) => {
    setSelectedGame(game);
    setGameDialog(true);
  };

  const handleCloseGame = () => {
    setGameDialog(false);
    setSelectedGame(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const GameCard = ({ game }) => (
    <MotionCard
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      sx={{ height: '100%', position: 'relative', overflow: 'visible' }}
    >
      <Badge
        badgeContent={game.players}
        color="primary"
        sx={{
          '& .MuiBadge-badge': {
            right: 16,
            top: 16,
            fontSize: '0.7rem',
          },
        }}
      >
        <CardHeader
          avatar={
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: game.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              {game.icon}
            </Box>
          }
          title={game.title}
          subheader={game.category}
          sx={{
            '& .MuiCardHeader-title': {
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              fontSize: '1.3rem',
            },
            '& .MuiCardHeader-subheader': {
              fontWeight: 500,
            },
          }}
        />
      </Badge>
      
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6 }}>
          {game.description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          <Chip
            size="small"
            label={game.difficulty}
            sx={{
              backgroundColor: getDifficultyColor(game.difficulty),
              color: 'white',
              fontWeight: 600,
            }}
          />
          <Chip
            size="small"
            label={game.estimatedTime}
            icon={<Timer />}
            variant="outlined"
          />
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<PlayArrow />}
          onClick={() => handlePlayGame(game)}
          sx={{
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            background: 'linear-gradient(45deg, #8B4513 30%, #D2691E 90%)',
          }}
        >
          Play Now
        </Button>
      </CardContent>
    </MotionCard>
  );

  const StatsCard = ({ title, value, icon, color }) => (
    <Paper
      sx={{
        p: 3,
        textAlign: 'center',
        borderRadius: 3,
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCF8 100%)',
        border: '1px solid rgba(139, 69, 19, 0.1)',
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h4"
        sx={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
          color: '#8B4513',
          mb: 1,
        }}
      >
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              color: '#3E2723',
              mb: 2,
            }}
          >
            Educational Games
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#5D4037',
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Learn through play with AI-generated games based on your study materials. 
            Challenge yourself and compete with others!
          </Typography>
        </Box>

        {/* User Stats */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={6} md={3}>
            <StatsCard
              title="Games Played"
              value={userStats.totalGamesPlayed || 23}
              icon={<GamesIcon sx={{ fontSize: 30, color: '#8B4513' }} />}
              color="rgba(139, 69, 19, 0.1)"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatsCard
              title="Total Score"
              value={userStats.totalScore || 1834}
              icon={<Star sx={{ fontSize: 30, color: '#FFD700' }} />}
              color="rgba(255, 215, 0, 0.1)"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatsCard
              title="Average Score"
              value={userStats.averageScore || 79}
              icon={<TrendingUp sx={{ fontSize: 30, color: '#4CAF50' }} />}
              color="rgba(76, 175, 80, 0.1)"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatsCard
              title="Rank"
              value="#6"
              icon={<EmojiEvents sx={{ fontSize: 30, color: '#FF9800' }} />}
              color="rgba(255, 152, 0, 0.1)"
            />
          </Grid>
        </Grid>

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
            <Tab label="All Games" />
            <Tab label="Leaderboard" />
            <Tab label="Achievements" />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            {gameTypes.map((game, index) => (
              <Grid item xs={12} md={6} lg={4} key={game.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GameCard game={game} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCF8 100%)',
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    background: 'linear-gradient(90deg, #8B4513 0%, #D2691E 100%)',
                    color: 'white',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Leaderboard sx={{ mr: 2 }} />
                    Top Players This Week
                  </Typography>
                </Box>
                
                <List>
                  {leaderboard.map((player, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        py: 2,
                        borderBottom: index < leaderboard.length - 1 ? '1px solid rgba(139, 69, 19, 0.1)' : 'none',
                        backgroundColor: player.name === user?.name ? 'rgba(139, 69, 19, 0.05)' : 'transparent',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: player.rank <= 3 ? '#FFD700' : '#8B4513',
                            fontWeight: 700,
                          }}
                        >
                          {player.rank <= 3 ? (
                            player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'
                          ) : (
                            player.avatar
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontFamily: '"Playfair Display", serif',
                                fontWeight: 600,
                              }}
                            >
                              {player.name}
                            </Typography>
                            {player.name === user?.name && (
                              <Chip label="You" size="small" color="primary" />
                            )}
                          </Box>
                        }
                        secondary={`${player.games} games played`}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: '"Playfair Display", serif',
                          fontWeight: 700,
                          color: '#8B4513',
                        }}
                      >
                        {player.score.toLocaleString()}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCF8 100%)',
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  Your Progress
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Progress to next rank
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={65}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(139, 69, 19, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#8B4513',
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    234 points to Rank #5
                  </Typography>
                </Box>

                <Divider sx={{ my: 3, borderColor: 'rgba(139, 69, 19, 0.2)' }} />

                <Typography variant="body2" color="text.secondary">
                  Keep playing to climb the leaderboard and unlock new achievements!
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {achievements.map((achievement, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      textAlign: 'center',
                      background: achievement.earned 
                        ? 'linear-gradient(135deg, #FFF3E0 0%, #FFECB3 100%)'
                        : 'linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%)',
                      border: achievement.earned 
                        ? '2px solid #FFD700' 
                        : '2px solid #E0E0E0',
                      opacity: achievement.earned ? 1 : 0.7,
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{ mb: 2, filter: achievement.earned ? 'none' : 'grayscale(100%)' }}
                    >
                      {achievement.icon}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {achievement.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {achievement.description}
                    </Typography>
                    {achievement.earned && (
                      <Chip
                        label="Earned"
                        size="small"
                        sx={{
                          mt: 2,
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </MotionBox>

      {/* Game Dialog */}
      <Dialog
        open={gameDialog}
        onClose={handleCloseGame}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCF8 100%)',
          },
        }}
      >
        {selectedGame && (
          <>
            <DialogTitle
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: '"Playfair Display", serif',
                fontSize: '1.5rem',
                fontWeight: 600,
              }}
            >
              {selectedGame.title}
              <IconButton onClick={handleCloseGame}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    backgroundColor: selectedGame.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  {React.cloneElement(selectedGame.icon, { sx: { fontSize: 60 } })}
                </Box>
                
                <Typography variant="h5" sx={{ mb: 2, fontFamily: '"Playfair Display", serif' }}>
                  Game Feature Coming Soon!
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  The {selectedGame.title} game is currently in development. 
                  It will feature interactive gameplay with content from your uploaded documents.
                </Typography>

                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                  <Typography variant="body2">
                    <strong>What to expect:</strong><br/>
                    • {selectedGame.description}<br/>
                    • Difficulty: {selectedGame.difficulty}<br/>
                    • Estimated time: {selectedGame.estimatedTime}<br/>
                    • Score tracking and leaderboards
                  </Typography>
                </Alert>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseGame} variant="outlined" size="large">
                Close
              </Button>
              <Button variant="contained" size="large" disabled>
                Coming Soon
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Games;