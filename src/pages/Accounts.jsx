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
} from '@chakra-ui/react';
import { HamburgerIcon, BellIcon, EditIcon, ArrowBackIcon, DeleteIcon, WarningTwoIcon, SearchIcon, CheckIcon, ViewIcon, FilterIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
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

  const glassEffect = {
    backdropFilter: 'blur(10px)',
    bg: cardBg,
    border: '1px solid',
    borderColor: borderColor,
    boxShadow: 'lg',
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

  useEffect(() => {
    fetchCustomers();
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
      p={6}
      borderRadius="xl"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
      transition="all 0.2s"
      animation={`${fadeIn} 0.5s ease-out`}
      cursor="pointer"
      onClick={() => handleCustomerClick(customer)}
    >
      <VStack align="stretch" spacing={4}>
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              {customer.customer_name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {customer.phone_number}
            </Text>
          </VStack>
          <Badge
            colorScheme={customer.accounts_verified ? 'green' : 'yellow'}
            p={2}
            borderRadius="md"
            fontSize="sm"
          >
            {customer.accounts_verified ? 'Verified' : 'Pending'}
          </Badge>
        </Flex>
        
        <Divider />
        
        <VStack align="start" spacing={2}>
          <Text fontSize="sm" color="gray.500">
            Vehicle: {customer.vehicle}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Price: ₹{customer.price?.toLocaleString() || 'N/A'}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Payment: {customer.payment_mode || 'N/A'}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );

  const renderCustomerDetails = () => (
    <Box
      {...glassEffect}
      p={6}
      borderRadius="xl"
      mx={{ base: 0, md: 4 }}
      mt={{ base: 4, md: 4 }}
    >
      <Flex justify="space-between" align="center" mb={6}>
        <HStack spacing={3}>
          <IconButton
            icon={<ArrowBackIcon />}
            variant="ghost"
            onClick={() => setSelectedCustomer(null)}
            aria-label="Back to list"
            size="sm"
          />
          <Heading size="lg" color={textColor}>{selectedCustomer.customer_name}</Heading>
        </HStack>
        <Badge
          colorScheme={selectedCustomer.accounts_verified ? 'green' : 'yellow'}
          p={2}
          borderRadius="md"
          fontSize="sm"
        >
          {selectedCustomer.accounts_verified ? 'Verified' : 'Pending'}
        </Badge>
      </Flex>

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
            <Box>
              <Text fontSize="sm" color="gray.500">Price</Text>
              <Text fontSize="md">₹{selectedCustomer.price?.toLocaleString() || 'N/A'}</Text>
            </Box>
          </VStack>
        </Box>

        {/* Payment Information */}
        <Box>
          <Heading size="md" color={textColor} mb={4}>Payment Information</Heading>
          <VStack align="stretch" spacing={3}>
            <Box>
              <Text fontSize="sm" color="gray.500">Payment Mode</Text>
              <Text fontSize="md">{selectedCustomer.payment_mode || 'N/A'}</Text>
            </Box>
            {selectedCustomer.payment_mode === 'Finance' && (
              <>
                <Box>
                  <Text fontSize="sm" color="gray.500">Finance Company</Text>
                  <Text fontSize="md">{selectedCustomer.finance_company || 'N/A'}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">Finance Amount</Text>
                  <Text fontSize="md">₹{selectedCustomer.finance_amount?.toLocaleString() || 'N/A'}</Text>
                </Box>
              </>
            )}
            <Box>
              <Text fontSize="sm" color="gray.500">Amount Paid</Text>
              <Text fontSize="md">₹{selectedCustomer.amount_paid?.toLocaleString() || 'N/A'}</Text>
            </Box>
          </VStack>
        </Box>

        {/* Documents */}
        <Box>
          <Heading size="md" color={textColor} mb={4}>Documents</Heading>
          <SimpleGrid columns={2} spacing={4}>
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
    </Box>
  );

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
          />
          <Heading size="md" color={accentColor}>{selectedScreen}</Heading>
        </HStack>
        <HStack spacing={4}>
          <Menu>
            <MenuButton as={IconButton} icon={<BellIcon />} variant="ghost" aria-label="Notifications" position="relative">
              {/* Notifications logic */}
            </MenuButton>
            <MenuList maxH="300px" overflowY="auto">
              {/* Notifications content */}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton>
              <Avatar name="Account User" size="sm" />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={toggleColorMode}>{colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}</MenuItem>
              <MenuItem onClick={() => navigate('/login')}>Sign Out</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Main Layout */}
      <Box maxW="1400px" mx="auto" mt={4} px={{ base: 2, md: 4 }} pb={{ base: 16, md: 8 }}>
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
              <TabList mb={4} bg={cardBg} p={1} borderRadius="xl">
                <Tab _selected={{ bg: 'purple.500', color: 'white' }}>Pending</Tab>
                <Tab _selected={{ bg: 'purple.500', color: 'white' }}>Done</Tab>
              </TabList>
            </Tabs>
            
            <HStack mb={6} spacing={4}>
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
                placeholder="Payment Type" 
                size="md" 
                w="150px"
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
              spacing={4} 
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
              <Flex justify="center" align="center" mt={6} gap={2}>
                <IconButton
                  icon={<ChevronLeftIcon />}
                  onClick={() => handlePageChange(currentPage - 1)}
                  isDisabled={currentPage === 1}
                  variant="ghost"
                  colorScheme="purple"
                />
                <HStack spacing={2}>
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index + 1}
                      size="sm"
                      variant={currentPage === index + 1 ? 'solid' : 'ghost'}
                      colorScheme="purple"
                      onClick={() => handlePageChange(index + 1)}
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
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={4}>
              <Button variant="ghost" colorScheme="blue" isActive={selectedScreen === 'Accounts'} onClick={() => handleScreenSelect('Accounts')}>Accounts</Button>
              <Button variant="ghost" colorScheme="blue" isActive={selectedScreen === 'Dashboard'} onClick={() => handleScreenSelect('Dashboard')}>Dashboard</Button>
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