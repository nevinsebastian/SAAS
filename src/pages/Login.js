import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Checkbox, FormControlLabel, Container, createTheme, ThemeProvider, CssBaseline
} from '@mui/material';
import { styled } from '@mui/system';

const modernTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f172a',
    },
    primary: {
      main: '#6366f1',
    },
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#1e293b',
            '&:hover fieldset': {
              borderColor: '#6366f1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#94a3b8',
          },
          '& .MuiInputBase-input': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
  },
});

const GlassPaper = styled(Box)(({ theme }) => ({
  background: 'rgba(30, 41, 59, 0.9)',
  backdropFilter: 'blur(12px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '400px',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
  '&:hover': {
    background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
}));

export default function Login({ setUserRole }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const users = [
      { username: "admin", password: "test", role: "admin" },
      { username: "sales", password: "test", role: "sales" },
      { username: "accounts", password: "test", role: "accounts" },
      { username: "rto", password: "test", role: "rto" },
      { username: "manager", password: "test", role: "manager" },
      { username: "stock", password: "test", role: "stock_person" }
    ];

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setUserRole(user.role);
      navigateToRole(user.role);
    } else {
      setError('Invalid credentials. Please try again.');
    }

    setIsLoading(false);
  };

  const navigateToRole = (role) => {
    switch (role) {
      case 'admin': navigate('/admin'); break;
      case 'sales': navigate('/sales-executive'); break;
      case 'accounts': navigate('/accounts'); break;
      case 'rto': navigate('/rto'); break;
      case 'manager': navigate('/manager'); break;
      case 'stock_person': navigate('/stock'); break;
      default: setError('Unknown role.');
    }
  };

  return (
    <ThemeProvider theme={modernTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: { xs: 2, sm: 4 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-150px',
            right: '-150px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
            zIndex: 0,
          }}
        />

        <Container maxWidth="sm" sx={{ zIndex: 1 }}>
          <GlassPaper>
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              NEXA
            </Typography>
            <Typography
              variant="body2"
              align="center"
              sx={{ color: 'text.secondary', mb: 4 }}
            >
              Popular Vehicles & Services, Alappuzha, Punnapra
            </Typography>

            <Box component="form" onSubmit={handleLogin} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                type='username'
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: '8px' },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: '8px' },
                }}
              />
              {error && (
                <Typography
                  color="error"
                  align="center"
                  sx={{ mt: 2, fontSize: '0.875rem' }}
                >
                  {error}
                </Typography>
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    value={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: '#94a3b8',
                      '&.Mui-checked': { color: '#6366f1' },
                    }}
                  />
                }
                label="Remember me"
                sx={{ mt: 1, color: 'text.secondary' }}
              />
              <GradientButton
                type="submit"
                fullWidth
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? 'Logging in...' : 'Sign In'}
              </GradientButton>
              <Typography
                variant="body2"
                align="center"
                sx={{ color: 'text.secondary', mt: 2 }}
              >
                Need help?{' '}
                <Box
                  component="span"
                  sx={{
                    color: '#6366f1',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Contact Support
                </Box>
              </Typography>
            </Box>
          </GlassPaper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}