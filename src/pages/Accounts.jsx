import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  IconButton,
  Button,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useColorMode,
  Radio,
  RadioGroup,
  Image,
  Tooltip,
  Divider,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { 
  HamburgerIcon, 
  BellIcon, 
  EditIcon, 
  ArrowBackIcon, 
  DeleteIcon, 
  WarningTwoIcon, 
  SearchIcon, 
  CheckIcon, 
  ViewIcon, 
  FilterIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChartIcon,
  SettingsIcon 
} from '@chakra-ui/icons';
import { Chart as ChartJS, ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from '../components/AccountDashboard';
import api from '../api';
import { keyframes } from '@emotion/react';

ChartJS.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Title, ChartTooltip, Legend);

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Accounts = () => {
  const navigate = useNavigate();
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isVerifyOpen, onOpen: onVerifyOpen, onClose: onVerifyClose } = useDisclosure();
  const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();
  const { isOpen: isDeletOpen, onOpen: onDeletOpen, onClose: onDeletClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  const bgGradient = useColorModeValue(
    'linear(to-br, purple.50, pink.50)',
    'linear(to-br, gray.900, purple.900)'
  );
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const accentColor = 'purple.500';
  const borderColor = useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(255, 255, 255, 0.1)');
  const scrollbarColor = useColorModeValue('purple.200', 'purple.700');
  const paymentBoxBg = useColorModeValue('white', 'gray.800');

  const glassEffect = {
    backdropFilter: 'blur(10px)',
    bg: cardBg,
    border: '1px solid',
    borderColor: borderColor,
    boxShadow: 'lg',
    borderRadius: { base: '0', md: 'lg' },
    borderLeft: { base: 'none', md: '1px solid' },
    borderRight: { base: 'none', md: '1px solid' }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [tabIndex, setTabIndex] = useState(0); // Done, Pending, Errors tabs
  const [isEditing, setIsEditing] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState('Accounts'); // Track selected screen
  const [customerData, setCustomerData] = useState({
    fullName: '', address: '', fathersName: '', panNumber: '', aadharNumber: '', photo: '',
    name: '', vehicle: '', variant: '', color: '', exShowroom: '', tax: '', onRoad: '', insurance: '',
    bookingCharge: '', deliveryCharge: '', hasFinance: false, financeProvider: '', financeAmount: '', emi: '', tenure: '',
  });
  const [reportMessage, setReportMessage] = useState('');
  const [customReport, setCustomReport] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [customDelete, setCustomDelete] = useState('');
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 7;

  const user = JSON.parse(localStorage.getItem('user')) || { username: 'account_user' };

  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [financeData, setFinanceData] = useState({
    payment_mode: '',
    finance_company: '',
    finance_amount: '',
    emi: '',
    tenure: '',
    amount_paid: ''
  });

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchCustomers();
    fetchNotifications();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/accounts/customers');
      setCustomers(response.data.customers);
      setFilteredCustomers(response.data.customers);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      toast.error('Failed to load customers');
    }
  };

  const fetchNotifications = async () => {
    try {
      if (!user || !user.id) {
        console.error('User data not found');
        return;
      }
      const response = await api.get(`/notifications/employee/${user.id}`);
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.notifications.filter(n => !n.read_at).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch notifications',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = customers.filter(
      c =>
        c.customer_name.toLowerCase().includes(query) ||
        c.phone_number.includes(query) ||
        c.vehicle.toLowerCase().includes(query)
    );
    setFilteredCustomers(filtered);
  };

  const handleCustomerClick = async (customer) => {
    try {
      const response = await api.get(`/accounts/customers/${customer.id}`);
      setSelectedCustomer(response.data.customer);
      onVerifyOpen();
    } catch (err) {
      console.error('Failed to fetch customer details:', err);
      toast.error('Failed to load customer details');
    }
  };

  const handleVerifyCustomer = async (customerId) => {
    try {
      await api.put(`/accounts/customers/${customerId}/verify`);
      toast.success('Customer verified successfully!');
      fetchCustomers(); // Refresh the list
      onVerifyClose(); // Close the modal
    } catch (err) {
      console.error('Failed to verify customer:', err);
      toast.error('Failed to verify customer');
    }
  };

  const handleScreenSelect = (screen) => {
    setSelectedScreen(screen);
    if (screen !== 'Accounts') setSelectedCustomer(null); // Reset customer selection when switching screens
    onMenuClose();
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setCustomerData({
      fullName: customer.customer_name,
      address: customer.address,
      fathersName: customer.fathers_name,
      panNumber: customer.pan_number,
      aadharNumber: customer.aadhar_number,
      photo: customer.front_photo_base64 ? `data:image/jpeg;base64,${customer.front_photo_base64}` : '',
      name: customer.customer_name,
      vehicle: customer.vehicle,
      variant: customer.variant,
      color: customer.color,
      exShowroom: customer.ex_showroom,
      tax: customer.tax,
      onRoad: customer.on_road,
      insurance: customer.insurance,
      bookingCharge: customer.booking_charge,
      deliveryCharge: customer.delivery_charge,
      hasFinance: customer.has_finance,
      financeProvider: customer.finance_provider,
      financeAmount: customer.finance_amount,
      emi: customer.emi,
      tenure: customer.tenure,
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const handleFinanceToggle = () => {
    setCustomerData(prev => ({ ...prev, hasFinance: !prev.hasFinance }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Customer details saved!', { position: 'top-center' });
  };

  const handleCancelVerify = () => {
    setSelectedCustomer(null);
    onVerifyClose();
  };

  const handleDelete = () => {
    const finalMessage = customDelete || deleteMessage;
    if (finalMessage) {
      toast.success(`Deleted: ${finalMessage}`, { position: 'top-center' });
      setDeleteMessage('');
      setCustomDelete('');
      onDeletClose();
      setSelectedCustomer(null);
    } else {
      toast.error('Please select or enter a reason!', { position: 'top-center' });
    }
  };

  const handleReportSubmit = () => {
    const finalMessage = customReport || reportMessage;
    if (finalMessage) {
      toast.success(`Reported: ${finalMessage}`, { position: 'top-center' });
      setReportMessage('');
      setCustomReport('');
      onReportClose();
    } else {
      toast.error('Please select or enter a report message!', { position: 'top-center' });
    }
  };

  const getFilteredCustomers = () => {
    let filtered = filteredCustomers.filter(customer => 
      activeTab === 'pending' ? !customer.accounts_verified : customer.accounts_verified
    );

    // Apply payment type filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(customer => {
        if (paymentFilter === 'finance') {
          return customer.payment_mode?.toLowerCase() === 'finance';
        } else if (paymentFilter === 'cash') {
          // Show all customers that are not finance
          return customer.payment_mode?.toLowerCase() !== 'finance';
        }
        return true;
      });
    }

    return filtered;
  };

  const getCurrentPageCustomers = () => {
    const filtered = getFilteredCustomers();
    const startIndex = (currentPage - 1) * customersPerPage;
    return filtered.slice(startIndex, startIndex + customersPerPage);
  };

  const totalPages = Math.ceil(getFilteredCustomers().length / customersPerPage);

  const handlePaymentFilterChange = (e) => {
    setPaymentFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderCustomerCard = (customer) => (
    <Box
      key={customer.id}
      {...glassEffect}
      p={4}
      borderRadius={{ base: '0', md: 'xl' }}
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
      transition="all 0.2s"
      animation={`${fadeIn} 0.5s ease-out`}
      cursor="pointer"
      onClick={() => handleCustomerClick(customer)}
      mb={{ base: 2, md: 4 }}
      mx={{ base: 0, md: 4 }}
    >
      <VStack align="stretch" spacing={3}>
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color={textColor}>
              {customer.customer_name}
            </Text>
            <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.500">
              {customer.phone_number}
            </Text>
          </VStack>
          <Badge
            colorScheme={customer.accounts_verified ? 'green' : 'yellow'}
            p={2}
            borderRadius="md"
            fontSize={{ base: 'xs', md: 'sm' }}
          >
            {customer.accounts_verified ? 'Verified' : 'Pending'}
          </Badge>
        </Flex>
        
        <Divider />
        
        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
          <Box>
            <Text fontSize="xs" color="gray.500" mb={1}>Vehicle</Text>
            <Text fontSize={{ base: 'sm', md: 'md' }}>{customer.vehicle}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500" mb={1}>Price</Text>
            <Text fontSize={{ base: 'sm', md: 'md' }}>₹{customer.price?.toLocaleString() || 'N/A'}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500" mb={1}>Payment</Text>
            <Text fontSize={{ base: 'sm', md: 'md' }}>{customer.payment_mode || 'N/A'}</Text>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );

  const handleFinanceSubmit = async () => {
    try {
      await api.put(`/accounts/customers/${selectedCustomer.id}/finance`, financeData);
      toast.success('Finance details updated successfully!');
      setIsFinanceModalOpen(false);
      handleCustomerClick(selectedCustomer); // Refresh customer details
    } catch (err) {
      console.error('Failed to update finance details:', err);
      toast.error('Failed to update finance details');
    }
  };

  const handleRemoveFinance = async () => {
    try {
      await api.delete(`/accounts/customers/${selectedCustomer.id}/finance`);
      toast.success('Finance details removed successfully!');
      handleCustomerClick(selectedCustomer); // Refresh customer details
    } catch (err) {
      console.error('Failed to remove finance details:', err);
      toast.error('Failed to remove finance details');
    }
  };

  const handlePaymentSubmit = async () => {
    try {
      await api.put(`/accounts/customers/${selectedCustomer.id}/payment`, {
        amount_paid: financeData.amount_paid
      });
      toast.success('Payment amount updated successfully!');
      setIsPaymentModalOpen(false);
      handleCustomerClick(selectedCustomer); // Refresh customer details
    } catch (err) {
      console.error('Failed to update payment amount:', err);
      toast.error('Failed to update payment amount');
    }
  };

  const handleFinanceInputChange = (e) => {
    const { name, value } = e.target;
    setFinanceData(prev => ({ ...prev, [name]: value }));
  };

  const renderCustomerDetails = () => (
    <Box
      {...glassEffect}
      p={{ base: 4, md: 6 }}
      borderRadius="xl"
      mx={{ base: 0, md: 4 }}
      mt={{ base: 4, md: 4 }}
    >
      {/* Header Section */}
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align={{ base: 'stretch', md: 'center' }} 
        mb={6}
        gap={4}
      >
        <HStack spacing={3}>
          <IconButton
            icon={<ArrowBackIcon />}
            variant="ghost"
            onClick={() => setSelectedCustomer(null)}
            aria-label="Back to list"
            size="sm"
          />
          <Heading size={{ base: 'md', md: 'lg' }} color={textColor}>{selectedCustomer.customer_name}</Heading>
        </HStack>
        <HStack spacing={2}>
          <Button
            colorScheme="purple"
            size="sm"
            onClick={() => {
              setFinanceData({
                payment_mode: selectedCustomer.payment_mode || '',
                finance_company: selectedCustomer.finance_company || '',
                finance_amount: selectedCustomer.finance_amount || '',
                emi: selectedCustomer.emi || '',
                tenure: selectedCustomer.tenure || '',
                amount_paid: selectedCustomer.amount_paid || ''
              });
              setIsFinanceModalOpen(true);
            }}
          >
            Edit Finance
          </Button>
          <Button
            colorScheme="purple"
            size="sm"
            onClick={() => {
              setFinanceData({
                amount_paid: selectedCustomer.amount_paid || ''
              });
              setIsPaymentModalOpen(true);
            }}
          >
            Update Payment
          </Button>
          <Badge
            colorScheme={selectedCustomer.accounts_verified ? 'green' : 'yellow'}
            p={2}
            borderRadius="md"
            fontSize="sm"
          >
            {selectedCustomer.accounts_verified ? 'Verified' : 'Pending'}
          </Badge>
        </HStack>
      </Flex>

      {/* Main Content Grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {/* Personal Information */}
        <Box>
          <Heading size="md" color={textColor} mb={4}>Personal Information</Heading>
          <VStack align="stretch" spacing={3}>
            <Box>
              <Text fontSize="sm" color="gray.500">Phone Number</Text>
              <Text fontSize="md">{selectedCustomer.phone_number}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Date of Birth</Text>
              <Text fontSize="md">{selectedCustomer.dob || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Address</Text>
              <Text fontSize="md">{selectedCustomer.address || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Email</Text>
              <Text fontSize="md">{selectedCustomer.email || 'N/A'}</Text>
            </Box>
          </VStack>
        </Box>

        {/* Vehicle Information */}
        <Box>
          <Heading size="md" color={textColor} mb={4}>Vehicle Information</Heading>
          <VStack align="stretch" spacing={3}>
            <Box>
              <Text fontSize="sm" color="gray.500">Vehicle</Text>
              <Text fontSize="md">{selectedCustomer.vehicle}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Variant</Text>
              <Text fontSize="md">{selectedCustomer.variant || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Color</Text>
              <Text fontSize="md">{selectedCustomer.color || 'N/A'}</Text>
            </Box>
          </VStack>
        </Box>

        {/* Payment Breakdown */}
        <Box gridColumn={{ base: '1 / -1', md: '1 / -1' }}>
          <Heading size="md" color={textColor} mb={4}>Payment Breakdown</Heading>
          <Box 
            bg={paymentBoxBg}
            p={4} 
            borderRadius="lg" 
            boxShadow="sm"
          >
            <VStack align="stretch" spacing={3}>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.500">Ex-Showroom Price</Text>
                <Text fontSize="md">₹{selectedCustomer.ex_showroom?.toLocaleString() || '0'}</Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.500">Tax</Text>
                <Text fontSize="md">₹{selectedCustomer.tax?.toLocaleString() || '0'}</Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.500">Insurance</Text>
                <Text fontSize="md">₹{selectedCustomer.insurance?.toLocaleString() || '0'}</Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.500">Booking Charge</Text>
                <Text fontSize="md">₹{selectedCustomer.booking_charge?.toLocaleString() || '0'}</Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.500">Delivery Charge</Text>
                <Text fontSize="md">₹{selectedCustomer.delivery_charge?.toLocaleString() || '0'}</Text>
              </Flex>
              <Divider />
              <Flex justify="space-between" align="center">
                <Text fontSize="lg" fontWeight="bold" color={textColor}>Total Amount</Text>
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  ₹{(Number(selectedCustomer.ex_showroom || 0) + 
                     Number(selectedCustomer.tax || 0) + 
                     Number(selectedCustomer.insurance || 0) + 
                     Number(selectedCustomer.booking_charge || 0) + 
                     Number(selectedCustomer.delivery_charge || 0)).toLocaleString()}
                </Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.500">Amount Paid</Text>
                <Text fontSize="md" color="green.500">₹{selectedCustomer.amount_paid?.toLocaleString() || '0'}</Text>
              </Flex>
              <Divider />
              <Flex justify="space-between" align="center">
                <Text fontSize="lg" fontWeight="bold" color={textColor}>Remaining Amount</Text>
                <Text fontSize="lg" fontWeight="bold" color="red.500">
                  ₹{(Number(selectedCustomer.ex_showroom || 0) + 
                     Number(selectedCustomer.tax || 0) + 
                     Number(selectedCustomer.insurance || 0) + 
                     Number(selectedCustomer.booking_charge || 0) + 
                     Number(selectedCustomer.delivery_charge || 0) - 
                     Number(selectedCustomer.amount_paid || 0)).toLocaleString()}
                </Text>
              </Flex>
            </VStack>
          </Box>
        </Box>

        {/* Finance Information */}
        {selectedCustomer.payment_mode === 'Finance' && (
          <Box gridColumn={{ base: '1 / -1', md: '1 / -1' }}>
            <Heading size="md" color={textColor} mb={4}>Finance Details</Heading>
            <Box 
              bg={paymentBoxBg}
              p={4} 
              borderRadius="lg" 
              boxShadow="sm"
            >
              <VStack align="stretch" spacing={3}>
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.500">Finance Company</Text>
                  <Text fontSize="md">{selectedCustomer.finance_company || 'N/A'}</Text>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.500">Finance Amount</Text>
                  <Text fontSize="md">₹{selectedCustomer.finance_amount?.toLocaleString() || '0'}</Text>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.500">EMI</Text>
                  <Text fontSize="md">₹{selectedCustomer.emi?.toLocaleString() || '0'}</Text>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.500">Tenure</Text>
                  <Text fontSize="md">{selectedCustomer.tenure || 'N/A'} months</Text>
                </Flex>
              </VStack>
            </Box>
          </Box>
        )}

        {/* Documents */}
        <Box gridColumn={{ base: '1 / -1', md: '1 / -1' }}>
          <Heading size="md" color={textColor} mb={4}>Documents</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {selectedCustomer.aadhar_front_base64 && (
              <Box>
                <Text fontSize="sm" color="gray.500" mb={2}>Aadhar Front</Text>
                <Image
                  src={`data:image/jpeg;base64,${selectedCustomer.aadhar_front_base64}`}
                  alt="Aadhar Front"
                  borderRadius="md"
                  objectFit="cover"
                  cursor="pointer"
                  onClick={() => window.open(`data:image/jpeg;base64,${selectedCustomer.aadhar_front_base64}`, '_blank')}
                />
              </Box>
            )}
            {selectedCustomer.aadhar_back_base64 && (
              <Box>
                <Text fontSize="sm" color="gray.500" mb={2}>Aadhar Back</Text>
                <Image
                  src={`data:image/jpeg;base64,${selectedCustomer.aadhar_back_base64}`}
                  alt="Aadhar Back"
                  borderRadius="md"
                  objectFit="cover"
                  cursor="pointer"
                  onClick={() => window.open(`data:image/jpeg;base64,${selectedCustomer.aadhar_back_base64}`, '_blank')}
                />
              </Box>
            )}
            {selectedCustomer.passport_photo_base64 && (
              <Box>
                <Text fontSize="sm" color="gray.500" mb={2}>Passport Photo</Text>
                <Image
                  src={`data:image/jpeg;base64,${selectedCustomer.passport_photo_base64}`}
                  alt="Passport Photo"
                  borderRadius="md"
                  objectFit="cover"
                  cursor="pointer"
                  onClick={() => window.open(`data:image/jpeg;base64,${selectedCustomer.passport_photo_base64}`, '_blank')}
                />
              </Box>
            )}
          </SimpleGrid>
        </Box>
      </SimpleGrid>

      {!selectedCustomer.accounts_verified && (
        <Button
          colorScheme="green"
          size="lg"
          onClick={() => handleVerifyCustomer(selectedCustomer.id)}
          w="full"
          mt={6}
        >
          Verify Customer
        </Button>
      )}

      {/* Finance Modal */}
      <Modal isOpen={isFinanceModalOpen} onClose={() => setIsFinanceModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Finance Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Payment Mode</FormLabel>
                <Select
                  name="payment_mode"
                  value={financeData.payment_mode}
                  onChange={handleFinanceInputChange}
                >
                  <option value="">Select Payment Mode</option>
                  <option value="Cash">Cash</option>
                  <option value="Finance">Finance</option>
                </Select>
              </FormControl>

              {financeData.payment_mode === 'Finance' && (
                <>
                  <FormControl>
                    <FormLabel>Finance Company</FormLabel>
                    <Input
                      name="finance_company"
                      value={financeData.finance_company}
                      onChange={handleFinanceInputChange}
                      placeholder="Enter finance company name"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Finance Amount</FormLabel>
                    <Input
                      name="finance_amount"
                      type="number"
                      value={financeData.finance_amount}
                      onChange={handleFinanceInputChange}
                      placeholder="Enter finance amount"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>EMI</FormLabel>
                    <Input
                      name="emi"
                      type="number"
                      value={financeData.emi}
                      onChange={handleFinanceInputChange}
                      placeholder="Enter EMI amount"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Tenure (months)</FormLabel>
                    <Input
                      name="tenure"
                      type="number"
                      value={financeData.tenure}
                      onChange={handleFinanceInputChange}
                      placeholder="Enter tenure in months"
                    />
                  </FormControl>
                </>
              )}

              <FormControl>
                <FormLabel>Amount Paid</FormLabel>
                <Input
                  name="amount_paid"
                  type="number"
                  value={financeData.amount_paid}
                  onChange={handleFinanceInputChange}
                  placeholder="Enter amount paid"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsFinanceModalOpen(false)}>
              Cancel
            </Button>
            {selectedCustomer.payment_mode === 'Finance' && (
              <Button colorScheme="red" mr={3} onClick={handleRemoveFinance}>
                Remove Finance
              </Button>
            )}
            <Button colorScheme="blue" onClick={handleFinanceSubmit}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Payment Amount</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Amount Paid</FormLabel>
              <Input
                name="amount_paid"
                type="number"
                value={financeData.amount_paid}
                onChange={handleFinanceInputChange}
                placeholder="Enter amount paid"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handlePaymentSubmit}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );

  const markNotificationAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" bg={bgGradient} position="relative">
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        {...glassEffect}
        borderRadius={{ base: 0, md: 'lg' }}
        p={4}
        position="sticky"
        top={0}
        zIndex={10}
        mx={{ base: 0, md: 4 }}
        mt={{ base: 0, md: 4 }}
      >
        <HStack spacing={3}>
          <IconButton 
            icon={<HamburgerIcon />} 
            variant="ghost" 
            onClick={onMenuOpen} 
            aria-label="Open menu"
            size="sm"
            color={accentColor}
          />
          <Heading size={{ base: 'md', md: 'lg' }} color={accentColor}>{selectedScreen}</Heading>
        </HStack>
        <HStack spacing={4}>
          <Menu>
            <MenuButton 
              as={IconButton} 
              icon={<BellIcon />} 
              variant="ghost" 
              aria-label="Notifications" 
              position="relative"
              _hover={{ 
                bg: 'whiteAlpha.200',
                transform: 'scale(1.1)'
              }}
              transition="all 0.2s"
            >
              {unreadCount > 0 && (
                <Badge 
                  colorScheme="red" 
                  borderRadius="full" 
                  position="absolute" 
                  top="-1" 
                  right="-1"
                  boxShadow="lg"
                >
                  {unreadCount}
                </Badge>
              )}
            </MenuButton>
            <MenuList 
              maxH="400px" 
              overflowY="auto" 
              bg={cardBg} 
              borderColor={borderColor}
              boxShadow="xl"
              borderRadius="xl"
            >
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <MenuItem 
                    key={notification.id} 
                    bg={notification.read_at ? cardBg : 'blue.50'} 
                    _hover={{ 
                      bg: 'whiteAlpha.200',
                      transform: 'translateX(5px)'
                    }}
                    transition="all 0.2s"
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <VStack align="start" spacing={1} width="100%">
                      <Text fontWeight="bold" fontSize="sm">{notification.title}</Text>
                      <Text fontSize="sm" color="gray.600">{notification.message}</Text>
                      <Text fontSize="xs" color="gray.500">
                        From: {notification.sender_name} • {new Date(notification.created_at).toLocaleString()}
                      </Text>
                    </VStack>
                  </MenuItem>
                ))
              ) : (
                <MenuItem bg={cardBg}>No notifications</MenuItem>
              )}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton>
              <Avatar name="Account User" size="sm" bg={accentColor} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={toggleColorMode}>{colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}</MenuItem>
              <MenuItem onClick={() => navigate('/login')}>Sign Out</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Main Layout */}
      <Box maxW="1400px" mx="auto" mt={4} px={{ base: 0, md: 4 }} pb={{ base: 16, md: 8 }}>
        {selectedScreen === 'Dashboard' ? (
          <Dashboard onClose={() => setSelectedScreen('Accounts')} user={user} onMenuOpen={onMenuOpen} />
        ) : selectedCustomer ? (
          renderCustomerDetails()
        ) : (
          // Customer List (Default Mobile View)
          <Box>
            <Tabs 
              variant="soft-rounded" 
              colorScheme="purple" 
              index={activeTab} 
              onChange={(index) => setActiveTab(index === 0 ? 'pending' : 'done')}
              mb={6}
            >
              <TabList mb={4} bg={cardBg} p={1} borderRadius="xl" mx={{ base: 2, md: 0 }}>
                <Tab _selected={{ bg: 'purple.500', color: 'white' }}>Pending</Tab>
                <Tab _selected={{ bg: 'purple.500', color: 'white' }}>Done</Tab>
              </TabList>
            </Tabs>
            
            <HStack mb={6} spacing={4} px={{ base: 2, md: 0 }}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input 
                  placeholder="Search customers..." 
                  value={searchQuery} 
                  onChange={handleSearch}
                  bg={cardBg}
                  border="none"
                  _focus={{ border: 'none', boxShadow: 'outline', boxShadowColor: 'purple.500' }}
                />
              </InputGroup>
              <Select 
                placeholder="all" 
                size="md" 
                w={{ base: "120px", md: "150px" }}
                bg={cardBg}
                border="none"
                value={paymentFilter}
                onChange={handlePaymentFilterChange}
                _focus={{ border: 'none', boxShadow: 'outline', boxShadowColor: 'purple.500' }}
              >
                <option value="all">All</option>
                <option value="cash">Cash</option>
                <option value="finance">Finance</option>
              </Select>
            </HStack>

            <VStack 
              spacing={0} 
              align="stretch" 
              maxH={{ base: 'calc(100vh - 200px)', md: '70vh' }} 
              overflowY="auto"
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: scrollbarColor,
                  borderRadius: '24px',
                },
              }}
            >
              {getCurrentPageCustomers().map(renderCustomerCard)}
            </VStack>

            {/* Pagination */}
            {totalPages > 1 && (
              <Flex justify="center" align="center" mt={6} gap={2} px={{ base: 2, md: 0 }}>
                <IconButton
                  icon={<ChevronLeftIcon />}
                  onClick={() => handlePageChange(currentPage - 1)}
                  isDisabled={currentPage === 1}
                  variant="ghost"
                  colorScheme="purple"
                  size="sm"
                />
                <HStack spacing={1}>
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index + 1}
                      size="sm"
                      variant={currentPage === index + 1 ? 'solid' : 'ghost'}
                      colorScheme="purple"
                      onClick={() => handlePageChange(index + 1)}
                      minW="32px"
                      h="32px"
                      p={0}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </HStack>
                <IconButton
                  icon={<ChevronRightIcon />}
                  onClick={() => handlePageChange(currentPage + 1)}
                  isDisabled={currentPage === totalPages}
                  variant="ghost"
                  colorScheme="purple"
                  size="sm"
                />
              </Flex>
            )}
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Flex
        justify="space-between"
        align="center"
        {...glassEffect}
        p={4}
        position={{ base: 'fixed', md: 'static' }}
        bottom={0}
        left={0}
        right={0}
        zIndex={10}
        mx={{ base: 0, md: 4 }}
        mb={{ base: 0, md: 4 }}
        borderRadius={{ base: 0, md: 'lg' }}
      >
        <Text fontSize="sm" color="gray.500">Customers Verified Today: 5</Text>
      </Flex>

      {/* Sidebar Drawer */}
      <Drawer isOpen={isMenuOpen} placement="left" onClose={onMenuClose}>
        <DrawerOverlay />
        <DrawerContent w={{ base: 'full', md: '200px' }}>
          <DrawerCloseButton />
          <DrawerHeader bg={accentColor} color="white">Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={4} mt={4}>
              <Button 
                variant="ghost" 
                colorScheme="purple" 
                isActive={selectedScreen === 'Accounts'} 
                onClick={() => handleScreenSelect('Accounts')}
                justifyContent="flex-start"
                leftIcon={<ViewIcon />}
              >
                Accounts
              </Button>
              <Button 
                variant="ghost" 
                colorScheme="purple" 
                isActive={selectedScreen === 'Dashboard'} 
                onClick={() => handleScreenSelect('Dashboard')}
                justifyContent="flex-start"
                leftIcon={<SettingsIcon />}
              >
                Dashboard
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Report Customer Modal */}
      <Modal isOpen={isReportOpen} onClose={onReportClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={textColor}>Report Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <RadioGroup value={reportMessage} onChange={setReportMessage}>
                <VStack align="start" spacing={2}>
                  <Radio value="Payment Pending">Payment Pending</Radio>
                  <Radio value="Can't Confirm Payment">Can't Confirm Payment</Radio>
                  <Radio value="Wrong Transaction ID">Wrong Transaction ID</Radio>
                  <Radio value="Payment Not Received">Payment Not Received</Radio>
                </VStack>
              </RadioGroup>
              <Input
                placeholder="Or type a custom message..."
                value={customReport}
                onChange={e => setCustomReport(e.target.value)}
                bg={useColorModeValue('gray.100', 'gray.700')}
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                _focus={{ borderColor: accentColor }}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="orange" onClick={handleReportSubmit}>Submit</Button>
            <Button variant="ghost" ml={2} onClick={onReportClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Customer Modal */}
      <Modal isOpen={isDeletOpen} onClose={onDeletClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={textColor}>Delete Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text>Why deleting customer?</Text>
              <RadioGroup value={deleteMessage} onChange={setDeleteMessage}>
                <VStack align="start" spacing={2}>
                  <Radio value="Payment Not Received">Payment Not Received</Radio>
                  <Radio value="Canceled Booking">Canceled Booking</Radio>
                  <Radio value="Customer doesn't exist">Customer doesn't exist</Radio>
                </VStack>
              </RadioGroup>
              <Input
                placeholder="Or type a custom message..."
                value={customDelete}
                onChange={e => setCustomDelete(e.target.value)}
                bg={useColorModeValue('gray.100', 'gray.700')}
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                _focus={{ borderColor: accentColor }}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Text fontSize="sm" color="gray.500">Once deleted, only admin can restore the customer</Text>
            <Button colorScheme="red" onClick={handleDelete} ml={4}>Delete</Button>
            <Button variant="ghost" ml={2} onClick={onDeletClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ToastContainer 
        position="top-center" 
        autoClose={2000} 
        style={{ zIndex: 1500 }}
        theme={colorMode}
      />
    </Box>
  );
};

export default Accounts;