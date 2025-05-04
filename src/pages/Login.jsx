import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import { styled } from '@mui/system';

// Modern theme (unchanged)
const modernTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0f172a' },
    primary: { main: '#6366f1' },
    text: { primary: '#ffffff', secondary: '#94a3b8' },
  },
  typography: { fontFamily: "'Inter', sans-serif" },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#1e293b',
            '&:hover fieldset': { borderColor: '#6366f1' },
            '&.Mui-focused fieldset': { borderColor: '#6366f1' },
          },
          '& .MuiInputLabel-root': { color: '#94a3b8' },
          '& .MuiInputBase-input': { color: '#ffffff' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: '8px', textTransform: 'none', fontWeight: 600, padding: '10px 24px' },
      },
    },
  },
});

// Styled components (unchanged)
const DesktopGlassPaper = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: 'rgba(30, 41, 59, 0.9)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '600px',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'inherit',
    backdropFilter: 'blur(12px)',
    zIndex: -1,
  },
  '& > *': { position: 'relative', zIndex: 1 },
}));

const MobileFullScreen = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  padding: theme.spacing(4),
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
  color: '#ffffcc',
  '&:hover': {
    background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
}));

export default function Login({ setUserRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      console.log('Starting login process...'); // Debug log
      const data = await authApi.login(email, password);
      console.log('Login successful:', data); // Debug log
  
      if (!data.token) {
        throw new Error('No token received from server');
      }
  
      // Save token to localStorage
      localStorage.setItem('token', data.token);
  
      // Decode role from token
      const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
      const role = decodedToken.role;
  
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: decodedToken.id,
        email: decodedToken.email,
        role: decodedToken.role
      }));
  
      // Set role in parent component
      setUserRole(role);
  
      // Navigate based on role
      navigateToRole(role);
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Show more specific error message
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (err.response?.status === 404) {
        setError('Login service not found. Please contact support.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.response?.data?.error || err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRole = (role) => {
    switch (role) {
      case 'admin': navigate('/admin'); break;
      case 'sales': navigate('/sales-executive'); break;
      case 'accounts': navigate('/accounts'); break;
      case 'rto': navigate('/rto'); break;
      case 'service': navigate('/service'); break;
      default: setError('Unknown role.');
    }
  };

  return (
    <ThemeProvider theme={modernTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          height: '100%',
          width: '100vw',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: { xs: 0, sm: 4 },
          position: 'relative',
          overflow: 'hidden',
          margin: 0,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
            zIndex: 0,
            display: { xs: 'none', sm: 'block' },
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
            display: { xs: 'none', sm: 'block' },
          }}
        />
        <Box
          sx={{
            width: { xs: '100%', sm: 'auto' },
            height: { xs: '100vh', sm: 'auto' },
            zIndex: 1,
          }}
        >
          {window.innerWidth < 600 ? (
            <MobileFullScreen>
              <Typography variant="h4" align="center" sx={{ fontWeight: 700, background: 'linear-gradient(45deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
                DealerSync
              </Typography>
              <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 4 }}>
                Seamlessly syncs all dealership operations
              </Typography>
              <Box component="form" onSubmit={handleLogin} noValidate sx={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: '8px' } }}
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
                  InputProps={{ sx: { borderRadius: '8px' } }}
                />
                {error && <Typography color="error" align="center" sx={{ mt: 2, fontSize: '0.875rem' }}>{error}</Typography>}
                <FormControlLabel
                  control={<Checkbox value={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#6366f1' } }} />}
                  label="Remember me"
                  sx={{ mt: 1, color: 'text.secondary' }}
                />
                <GradientButton type="submit" fullWidth disabled={isLoading} sx={{ mt: 3, mb: 2 }}>
                  {isLoading ? 'Logging in...' : 'Sign In'}
                </GradientButton>
                <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 2 }}>
                  Need help? <Box component="span" sx={{ color: '#6366f1', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Contact Support</Box>
                </Typography>
              </Box>
            </MobileFullScreen>
          ) : (
            <DesktopGlassPaper>
              <Typography variant="h4" align="center" sx={{ fontWeight: 700, background: 'linear-gradient(45deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
                DealerSync
              </Typography>
              <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 4 }}>
                Seamlessly syncs all dealership operations
              </Typography>
              <Box component="form" onSubmit={handleLogin} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: '8px' } }}
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
                  InputProps={{ sx: { borderRadius: '8px' } }}
                />
                {error && <Typography color="error" align="center" sx={{ mt: 2, fontSize: '0.875rem' }}>{error}</Typography>}
                <FormControlLabel
                  control={<Checkbox value={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#6366f1' } }} />}
                  label="Remember me"
                  sx={{ mt: 1, color: 'text.secondary' }}
                />
                <GradientButton type="submit" fullWidth disabled={isLoading} sx={{ mt: 3, mb: 2 }}>
                  {isLoading ? 'Logging in...' : 'Sign In'}
                </GradientButton>
                <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 2 }}>
                  Need help? <Box component="span" sx={{ color: '#6366f1', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Contact Support</Box>
                </Typography>
              </Box>
            </DesktopGlassPaper>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}