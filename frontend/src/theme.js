import { createTheme } from '@mui/material/styles';

const classicalTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#8B4513', // Saddle Brown
      light: '#A0522D',
      dark: '#654321',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D2691E', // Chocolate
      light: '#DEB887',
      dark: '#B8860B',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAF7F2',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#3E2723',
      secondary: '#5D4037',
    },
    success: {
      main: '#8BC34A',
    },
    warning: {
      main: '#FF9800',
    },
    error: {
      main: '#F44336',
    },
    info: {
      main: '#2196F3',
    },
  },
  typography: {
    fontFamily: '"Crimson Text", "Times New Roman", serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      color: '#3E2723',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      color: '#3E2723',
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.4,
      color: '#3E2723',
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: '#3E2723',
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.5,
      color: '#3E2723',
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#3E2723',
    },
    body1: {
      fontFamily: '"Crimson Text", serif',
      fontSize: '1.1rem',
      lineHeight: 1.6,
      color: '#3E2723',
    },
    body2: {
      fontFamily: '"Crimson Text", serif',
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#5D4037',
    },
    button: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 600,
      fontSize: '1rem',
      textTransform: 'none',
      letterSpacing: '0.5px',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(139, 69, 19, 0.1)',
    '0px 4px 8px rgba(139, 69, 19, 0.15)',
    '0px 6px 12px rgba(139, 69, 19, 0.2)',
    '0px 8px 16px rgba(139, 69, 19, 0.25)',
    '0px 10px 20px rgba(139, 69, 19, 0.3)',
    '0px 12px 24px rgba(139, 69, 19, 0.35)',
    '0px 14px 28px rgba(139, 69, 19, 0.4)',
    '0px 16px 32px rgba(139, 69, 19, 0.45)',
    '0px 18px 36px rgba(139, 69, 19, 0.5)',
    '0px 20px 40px rgba(139, 69, 19, 0.55)',
    '0px 22px 44px rgba(139, 69, 19, 0.6)',
    '0px 24px 48px rgba(139, 69, 19, 0.65)',
    '0px 26px 52px rgba(139, 69, 19, 0.7)',
    '0px 28px 56px rgba(139, 69, 19, 0.75)',
    '0px 30px 60px rgba(139, 69, 19, 0.8)',
    '0px 32px 64px rgba(139, 69, 19, 0.85)',
    '0px 34px 68px rgba(139, 69, 19, 0.9)',
    '0px 36px 72px rgba(139, 69, 19, 0.95)',
    '0px 38px 76px rgba(139, 69, 19, 1)',
    '0px 40px 80px rgba(139, 69, 19, 1)',
    '0px 42px 84px rgba(139, 69, 19, 1)',
    '0px 44px 88px rgba(139, 69, 19, 1)',
    '0px 46px 92px rgba(139, 69, 19, 1)',
    '0px 48px 96px rgba(139, 69, 19, 1)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          padding: '12px 32px',
          fontSize: '1.1rem',
          fontWeight: 600,
          boxShadow: '0px 4px 12px rgba(139, 69, 19, 0.3)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 20px rgba(139, 69, 19, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #8B4513 30%, #D2691E 90%)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(45deg, #654321 30%, #B8860B 90%)',
          },
        },
        outlined: {
          borderWidth: '2px',
          borderColor: '#8B4513',
          color: '#8B4513',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'rgba(139, 69, 19, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 8px 24px rgba(139, 69, 19, 0.15)',
          border: '1px solid rgba(139, 69, 19, 0.1)',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCF8 100%)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 32px rgba(139, 69, 19, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCF8 100%)',
          border: '1px solid rgba(139, 69, 19, 0.1)',
        },
        elevation1: {
          boxShadow: '0px 4px 12px rgba(139, 69, 19, 0.1)',
        },
        elevation2: {
          boxShadow: '0px 8px 20px rgba(139, 69, 19, 0.15)',
        },
        elevation3: {
          boxShadow: '0px 12px 28px rgba(139, 69, 19, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: 'rgba(139, 69, 19, 0.3)',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(139, 69, 19, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8B4513',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #8B4513 0%, #D2691E 100%)',
          boxShadow: '0px 4px 20px rgba(139, 69, 19, 0.3)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: '1.1rem',
          fontWeight: 600,
          textTransform: 'none',
          letterSpacing: '0.5px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Cormorant Garamond", serif',
          fontWeight: 500,
          borderRadius: 20,
        },
        colorPrimary: {
          backgroundColor: '#8B4513',
          color: '#FFFFFF',
        },
      },
    },
  },
});

export default classicalTheme;