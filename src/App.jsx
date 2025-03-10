import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import SalesExecutive from './pages/SalesExecutive';
import Login from './pages/Login';
import Admin from './pages/Admin';
import CustomerDetails from './pages/CustomerDetails';
import Accounts from './pages/Accounts';
import RtoDashboard from './pages/RtoDashboard';

// Chakra UI Theme (unchanged)
const chakraTheme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  colors: {
    primary: {
      500: '#6366f1',
    },
    gray: {
      700: '#1e293b',
      800: '#0f172a',
    },
  },
});

// ProtectedRoute Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  let userRole;

  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      userRole = decoded.role;
    } catch (err) {
      console.error('Invalid token', err);
      localStorage.removeItem('token'); // Clear invalid token
    }
  }

  if (!token || !userRole) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decoded.role);
      } catch (err) {
        console.error('Token parsing failed', err);
        localStorage.removeItem('token'); // Clear invalid token
        setUserRole(null);
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Root path: Redirect based on role or to login */}
        <Route
          path="/"
          element={
            userRole ? <Navigate to={`/${userRole === 'sales' ? 'sales-executive' : userRole}`} replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Login page */}
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />

        {/* Protected Routes */}
        <Route
          path="/sales-executive"
          element={
            <ProtectedRoute allowedRoles={['sales']}>
              <ChakraProvider theme={chakraTheme}>
                <SalesExecutive />
              </ChakraProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <ProtectedRoute allowedRoles={['accounts']}>
              <ChakraProvider theme={chakraTheme}>
                <Accounts />
              </ChakraProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rto"
          element={
            <ProtectedRoute allowedRoles={['rto']}>
              <ChakraProvider theme={chakraTheme}>
                <RtoDashboard />
              </ChakraProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer-details/:customerId"
          element={
            <ProtectedRoute allowedRoles={['sales', 'accounts', 'rto', 'admin']}>
              <CustomerDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;