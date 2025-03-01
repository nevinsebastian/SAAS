import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';

const SalesExecutive = () => {
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'sales_user' };
  const navigate = useNavigate();

  const dummyData = {
    customerCounts: { total_count: 25, total_pending: 8, total_submitted: 17 },
    reviewCounts: { reviews_pending: 5, reviews_done: 20 },
    customers: [
      { customer_id: 1, name: 'John Doe', phone_number: '123-456-7890', status: 'pending', sales_verified: false, registered: false },
      { customer_id: 2, name: 'Jane Smith', phone_number: '098-765-4321', status: 'submitted', sales_verified: true, registered: false },
      { customer_id: 3, name: 'Mike Johnson', phone_number: '555-555-5555', status: 'verified', sales_verified: true, registered: true },
    ],
  };

  const [customerCounts] = useState(dummyData.customerCounts);
  const [reviewCounts] = useState(dummyData.reviewCounts);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    alternate_phone_number: '',
    vehicle_name: '',
    vehicle_variant: '',
    vehicle_color: '',
    ex_showroom_price: '',
    tax: '',
    insurance: '',
    tp_registration: '',
    man_accessories: '',
    optional_accessories: '',
    booking: '',
    total_price: '',
    finance_amount: '',
    finance_id: '',
  });
  const [generatedLink, setGeneratedLink] = useState('');
  const [customers, setCustomers] = useState(dummyData.customers);
  const [filteredCustomers, setFilteredCustomers] = useState(dummyData.customers);
  const [expanded, setExpanded] = useState(false);

  const bgGradient = useColorModeValue('linear(to-br, gray.800, gray.700)', 'linear(to-br, gray.800, gray.700)');
  const cardBg = 'rgba(30, 41, 59, 0.9)';
  const borderColor = 'rgba(255, 255, 255, 0.1)';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleButtonClick = (status) => {
    const buttons = document.querySelectorAll('.status-button');
    buttons.forEach(button => button.classList.remove('active'));
    document.querySelector(`[data-status="${status}"]`).classList.add('active');

    if (status === 'Add New') {
      setShowForm(true);
      setFormData({
        name: '',
        phone_number: '',
        alternate_phone_number: '',
        vehicle_name: '',
        vehicle_variant: '',
        vehicle_color: '',
        ex_showroom_price: '',
        tax: '',
        insurance: '',
        tp_registration: '',
        man_accessories: '',
        optional_accessories: '',
        booking: '',
        total_price: '',
        finance_amount: '',
        finance_id: '',
      });
    } else {
      setShowForm(false);
      filterCustomers(status);
    }
  };

  const filterCustomers = (status) => {
    let filtered;
    switch (status) {
      case 'All': filtered = customers; break;
      case 'Waiting for data': filtered = customers.filter(c => c.status === 'pending'); break;
      case 'To verify': filtered = customers.filter(c => c.status === 'submitted' && !c.sales_verified); break;
      case 'Verified': filtered = customers.filter(c => c.sales_verified); break;
      case 'Registered': filtered = customers.filter(c => c.registered); break;
      default: filtered = customers;
    }
    setFilteredCustomers(filtered);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCustomer = {
      customer_id: customers.length + 1,
      name: formData.name,
      phone_number: formData.phone_number,
      status: 'pending',
      sales_verified: false,
      registered: false,
    };
    setCustomers(prev => [...prev, newCustomer]);
    setFilteredCustomers(prev => [...prev, newCustomer]);
    setGeneratedLink(`https://example.com/customer/${newCustomer.customer_id}`);
    setShowForm(false);
    toast.success('Customer created successfully!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleCustomerClick = (customerId) => {
    navigate(`/customer-details/${customerId}`);
  };

  return (
    <Box minH="100vh" bg={bgGradient} p={{ base: 4, md: 8 }} color="white">
      <Flex as="nav" justify="space-between" align="center" bg={cardBg} backdropFilter="blur(12px)" borderRadius="lg" border="1px solid" borderColor={borderColor} p={4} mb={8}>
        <Heading size="md">Sales Dashboard</Heading>
        <HStack spacing={4}>
          <Text>{user.username}</Text>
          <Button variant="outline" colorScheme="purple" size="sm" onClick={handleLogout}>Logout</Button>
        </HStack>
      </Flex>

      <Flex wrap="wrap" gap={4} mb={8} justify="center">
        {['All', 'Waiting for data', 'To verify', 'Verified', 'Registered', 'Add New'].map(status => (
          <Button
            key={status}
            data-status={status}
            className="status-button"
            onClick={() => handleButtonClick(status)}
            bg="gray.700"
            color="white"
            _hover={{ bg: 'purple.500', transform: 'translateY(-2px)' }}
            _active={{ bg: 'purple.600' }}
            borderRadius="md"
            px={6}
            py={3}
            transition="all 0.3s"
          >
            {status}
          </Button>
        ))}
      </Flex>

      {!expanded && (
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }} gap={6} mb={8}>
          <Box bg={cardBg} p={4} borderRadius="lg" border="1px solid" borderColor={borderColor} textAlign="center">
            <Text color="gray.400">Total Customers</Text>
            <Heading size="lg">{customerCounts.total_count}</Heading>
          </Box>
          <Box bg={cardBg} p={4} borderRadius="lg" border="1px solid" borderColor={borderColor} textAlign="center">
            <Text color="gray.400">Pending</Text>
            <Heading size="lg">{customerCounts.total_pending}</Heading>
          </Box>
          <Box bg={cardBg} p={4} borderRadius="lg" border="1px solid" borderColor={borderColor} textAlign="center">
            <Text color="gray.400">Submitted</Text>
            <Heading size="lg">{customerCounts.total_submitted}</Heading>
          </Box>
          <Box bg={cardBg} p={4} borderRadius="lg" border="1px solid" borderColor={borderColor} textAlign="center">
            <Text color="gray.400">Reviews Pending</Text>
            <Heading size="lg">{reviewCounts.reviews_pending}</Heading>
          </Box>
          <Box bg={cardBg} p={4} borderRadius="lg" border="1px solid" borderColor={borderColor} textAlign="center">
            <Text color="gray.400">Reviews Done</Text>
            <Heading size="lg">{reviewCounts.reviews_done}</Heading>
          </Box>
        </Grid>
      )}

      {showForm && (
        <Box bg={cardBg} backdropFilter="blur(12px)" borderRadius="lg" border="1px solid" borderColor={borderColor} p={6} mb={8} maxW={{ base: '100%', md: '600px' }} mx="auto">
          <Heading size="md" mb={4}>Add New Customer</Heading>
          <VStack as="form" onSubmit={handleSubmit} spacing={4}>
            {Object.keys(formData).map((key) => (
              <Input
                key={key}
                type="text"
                name={key}
                placeholder={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                value={formData[key]}
                onChange={handleInputChange}
                bg="gray.800"
                borderColor={borderColor}
                _focus={{ borderColor: 'purple.500' }}
                borderRadius="md"
              />
            ))}
            <Button type="submit" bgGradient="linear(to-r, purple.500, purple.700)" color="white" _hover={{ bgGradient: 'linear(to-r, purple.600, purple.800)', transform: 'translateY(-2px)' }} w="full" borderRadius="md">
              Create Customer
            </Button>
          </VStack>
        </Box>
      )}

      <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map(customer => (
            <Box
              key={customer.customer_id}
              bg={cardBg}
              backdropFilter="blur(12px)"
              borderRadius="lg"
              border="1px solid"
              borderColor={borderColor}
              p={4}
              _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
              transition="all 0.3s"
              cursor="pointer"
              onClick={() => handleCustomerClick(customer.customer_id)}
            >
              <Heading size="sm" mb={2}>{customer.name}</Heading>
              <Text color="gray.400">Phone: {customer.phone_number}</Text>
              <Text color="gray.400">Status: {customer.status}</Text>
            </Box>
          ))
        ) : (
          <Text textAlign="center" color="gray.400" w="full">No customers available</Text>
        )}
      </Grid>

      {generatedLink && (
        <Box bg={cardBg} backdropFilter="blur(12px)" borderRadius="lg" border="1px solid" borderColor={borderColor} p={4} mt={8} maxW={{ base: '100%', md: '600px' }} mx="auto">
          <Heading size="sm" mb={2}>Generated Link</Heading>
          <Text wordBreak="break-all" mb={4}>{generatedLink}</Text>
          <Button bg="purple.500" color="white" _hover={{ bg: 'purple.600' }} onClick={() => navigator.clipboard.writeText(generatedLink)}>Copy</Button>
        </Box>
      )}

      <ToastContainer />
    </Box>
  );
};

export default SalesExecutive;