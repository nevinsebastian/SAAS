import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import SalesExecutive from './pages/SalesExecutive';
import Login from './pages/Login';
import Admin from './pages/Admin';
import CustomerDetails from './pages/CustomerDetails';
import Accounts from './pages/Accounts';
import RtoDashboard from './pages/RtoDashboard';

// Chakra UI Theme
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

const App = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserRole(parsedUser.role);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={userRole ? <Navigate to={`/${userRole}`} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route
          path="/sales-executive"
          element={
            <ChakraProvider theme={chakraTheme}>
              {userRole === 'sales' ? <SalesExecutive /> : <Navigate to="/login" />}
            </ChakraProvider>
          }
        />
        <Route path="/admin" element={userRole === 'admin' ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/customer-details/:customerId" element={<CustomerDetails />} />
        <Route path='accounts' element={
          <ChakraProvider theme={chakraTheme}>
            {userRole === 'accounts'? <Accounts/>:<Navigate to="/login"/>}
          </ChakraProvider>
        }/>
         <Route path='rto' element={
          <ChakraProvider theme={chakraTheme}>
            {userRole === 'rto'? <RtoDashboard/>:<Navigate to="/login"/>}
          </ChakraProvider>
        }/>
      </Routes>
    </Router>
  );
};

export default App;