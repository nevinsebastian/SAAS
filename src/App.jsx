import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import SalesExecutive from './pages/SalesExecutive';
import Login from './pages/Login';
import Admin from './pages/Admin';
import CustomerDetails from './pages/CustomerDetails'; // Import updated component
import CustomerManagement from './pages/CustomerManagement'; // New import
import Accounts from './pages/Accounts';
import RtoDashboard from './pages/RtoDashboard';
import ServiceDashboard from './pages/ServiceDashboard';
import ServiceEmployeeManagement from './pages/ServiceEmployeeManagement';

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
    primary: { 500: '#6366f1' },
    gray: { 700: '#1e293b', 800: '#0f172a' },
  },
});

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  let userRole;

  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      userRole = decoded.role;
    } catch (err) {
      console.error('Invalid token', err);
      localStorage.removeItem('token');
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
        localStorage.removeItem('token');
        setUserRole(null);
      }
    }
  }, []);

  return (
    <Router>
      <ChakraProvider theme={chakraTheme}>
        <Routes>
          <Route path="/" element={userRole ? <Navigate to={`/${userRole === 'sales' ? 'sales-executive' : userRole}`} replace /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<Login setUserRole={setUserRole} />} />
          <Route path="/sales-executive" element={<ProtectedRoute allowedRoles={['sales']}><SalesExecutive /></ProtectedRoute>} />
          <Route path="/customer-management/:customerId" element={<ProtectedRoute allowedRoles={['sales']}><CustomerManagement /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>} />
          <Route path="/accounts" element={<ProtectedRoute allowedRoles={['accounts']}><Accounts /></ProtectedRoute>} />
          <Route path="/rto" element={<ProtectedRoute allowedRoles={['rto']}><RtoDashboard /></ProtectedRoute>} />
          <Route path="/service" element={<ProtectedRoute allowedRoles={['service']}><ServiceDashboard /></ProtectedRoute>} />
          <Route path="/admin/service-employees" element={<ProtectedRoute allowedRoles={['admin']}><ServiceEmployeeManagement /></ProtectedRoute>} />
          <Route path="/customer-details/:customerId" element={<CustomerDetails />} /> {/* Public route */}
        </Routes>
      </ChakraProvider>
    </Router>
  );
};

export default App;