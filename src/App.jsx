import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import SalesExecutive from './pages/SalesExecutive';
import Login from './pages/Login';
import Admin from './pages/Admin';
import RTO from './pages/RTO';
import Manager from './pages/Manager';
import CustomerForm from './pages/CustomerForm';
import RTODetails from './pages/RTODetails';
import Pdf from './pages/PdfEditor';
import CustomerDetails from './pages/CustomerDetails';
import AccountCustomerDetails from './pages/AccountCustomerDetails';
import Stock from './pages/Stock';
import Chassis from './pages/Chassis';
import NotFound from './pages/NotFound';

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
        <Route path="/rto" element={userRole === 'rto' ? <RTO /> : <Navigate to="/login" />} />
        <Route path="/manager" element={userRole === 'manager' ? <Manager /> : <Navigate to="/login" />} />
        <Route path="/stock" element={userRole === 'stock_person' ? <Stock /> : <Navigate to="/login" />} />
        <Route path="/customer-form/:link_token" element={<CustomerForm />} />
        <Route path="/rto/:customerId" element={<RTODetails />} />
        <Route path="/pdf" element={<Pdf />} />
        <Route path="/customer-details/:customerId" element={<CustomerDetails />} />
        <Route path="/account-customer-details/:customerId" element={<AccountCustomerDetails />} />
        <Route path="/chassis" element={<Chassis />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;