import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Paper, Checkbox, FormControlLabel, Container, createTheme, ThemeProvider, CssBaseline
} from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'linear-gradient(135deg, #1f1f2e, #282846)',
    },
    primary: {
      main: '#1db954',
    },
    text: {
      primary: '#eaeaea',
      secondary: '#aaa',
    },
  },
});

export default function Login({ setUserRole }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Hardcoded credentials
    const users = [
      { username: "admin", password: "test", role: "admin" },
      { username: "sales", password: "test", role: "sales" },
      { username: "accounts", password: "test", role: "accounts" },
      { username: "rto", password: "test", role: "rto" },
      { username: "manager", password: "test", role: "manager" },
      { username: "stock", password: "test", role: "stock_person" }
    ];

    // Check if credentials match
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(user));
      setUserRole(user.role);

      // Navigate to dashboard
      navigateToRole(user.role);
    } else {
      setError('Invalid username or password.');
    }

    setIsLoading(false);
  };

  const navigateToRole = (role) => {
    switch (role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'sales':
        navigate('/sales-executive');
        break;
      case 'accounts':
        navigate('/accounts');
        break;
      case 'rto':
        navigate('/rto');
        break;
      case 'manager':
        navigate('/manager');
        break;
      case 'stock_person':
        navigate('/stock');
        break;
      default:
        setError('Unknown role.');
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: 'transparent',
          backgroundImage: 'linear-gradient(135deg, #1f1f2e, #282846)',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={6}
            sx={{
              padding: 4,
              borderRadius: 4,
              backgroundColor: '#161b22',
              boxShadow: '0px 4px 12px rgba(0,0,0,0.5)',
              transition: 'background-color 0.3s ease-in-out',
            }}
          >
            <Typography variant="h5" align="center">
              NEXA
            </Typography>
            <Typography variant="body1" align="center" sx={{ mt: 1 }}>
              Popular Vehicles & Services, Alappuzha, Punnapra
            </Typography>

            <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                type='username'
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              />
              {error && <Typography color="error">{error}</Typography>}
              <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
              <Button type="submit" fullWidth variant="contained" disabled={isLoading}
                sx={{ mt: 3, mb: 2, backgroundColor: '#1db954', '&:hover': { backgroundColor: '#1db954a3' } }}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
