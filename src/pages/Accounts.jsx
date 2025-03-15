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
import { HamburgerIcon, BellIcon, EditIcon, ArrowBackIcon, DeleteIcon, WarningTwoIcon, SearchIcon, CheckIcon, ViewIcon } from '@chakra-ui/icons';
import { Chart as ChartJS, ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from '../components/AccountDashboard';
import api from '../api';

ChartJS.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Title, ChartTooltip, Legend);

const Accounts = () => {
  const navigate = useNavigate();
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isVerifyOpen, onOpen: onVerifyOpen, onClose: onVerifyClose } = useDisclosure();
  const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();
  const { isOpen: isDeletOpen, onOpen: onDeletOpen, onClose: onDeletClose } = useDisclosure();

  const { colorMode, toggleColorMode } = useColorMode();
  const bgGradient = useColorModeValue('linear(to-br, purple.50, pink.50)', 'linear(to-br, gray.900, purple.900)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const accentColor = 'blue.500';
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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
    return filteredCustomers.filter(customer => 
      activeTab === 'pending' ? !customer.accounts_verified : customer.accounts_verified
    );
  };

  const renderCustomerCard = (customer) => (
    <Box
      key={customer.id}
      bg={cardBg}
      p={6}
      borderRadius="xl"
      boxShadow="lg"
      border="1px solid"
      borderColor={borderColor}
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
      transition="all 0.2s"
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
        </VStack>

        <HStack spacing={2} justify="flex-end">
          <Tooltip label="View Details">
            <IconButton
              icon={<ViewIcon />}
              colorScheme="purple"
              variant="ghost"
              onClick={() => handleCustomerClick(customer)}
            />
          </Tooltip>
          {!customer.accounts_verified && (
            <Tooltip label="Verify Customer">
              <IconButton
                icon={<CheckIcon />}
                colorScheme="green"
                variant="ghost"
                onClick={() => handleVerifyCustomer(customer.id)}
              />
            </Tooltip>
          )}
        </HStack>
      </VStack>
    </Box>
  );

  const renderCustomerModal = () => (
    <Modal isOpen={isVerifyOpen} onClose={onVerifyClose} size="6xl">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={cardBg}>
        <ModalHeader color={textColor}>Customer Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {selectedCustomer && (
            <VStack spacing={6} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                  <VStack align="start" spacing={4}>
                    <Heading size="md" color={textColor}>Personal Information</Heading>
                    <SimpleGrid columns={2} spacing={4} w="full">
                      <VStack align="start">
                        <Text fontWeight="bold" color="gray.500">Name</Text>
                        <Text>{selectedCustomer.customer_name}</Text>
                      </VStack>
                      <VStack align="start">
                        <Text fontWeight="bold" color="gray.500">Phone</Text>
                        <Text>{selectedCustomer.phone_number}</Text>
                      </VStack>
                      <VStack align="start">
                        <Text fontWeight="bold" color="gray.500">Vehicle</Text>
                        <Text>{selectedCustomer.vehicle}</Text>
                      </VStack>
                      <VStack align="start">
                        <Text fontWeight="bold" color="gray.500">Price</Text>
                        <Text>₹{selectedCustomer.price?.toLocaleString() || 'N/A'}</Text>
                      </VStack>
                    </SimpleGrid>
                  </VStack>
                </Box>

                <Box>
                  <VStack align="start" spacing={4}>
                    <Heading size="md" color={textColor}>Vehicle Details</Heading>
                    <SimpleGrid columns={2} spacing={4} w="full">
                      <VStack align="start">
                        <Text fontWeight="bold" color="gray.500">Variant</Text>
                        <Text>{selectedCustomer.variant || 'N/A'}</Text>
                      </VStack>
                      <VStack align="start">
                        <Text fontWeight="bold" color="gray.500">Color</Text>
                        <Text>{selectedCustomer.color || 'N/A'}</Text>
                      </VStack>
                    </SimpleGrid>
                  </VStack>
                </Box>
              </SimpleGrid>

              <Divider />

              <Box>
                <Heading size="md" mb={4} color={textColor}>Documents</Heading>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                  {selectedCustomer.front_photo_base64 && (
                    <VStack>
                      <Text fontWeight="bold" color="gray.500">Front Photo</Text>
                      <Image
                        src={`data:image/jpeg;base64,${selectedCustomer.front_photo_base64}`}
                        alt="Front"
                        borderRadius="md"
                        objectFit="cover"
                      />
                    </VStack>
                  )}
                  {selectedCustomer.back_photo_base64 && (
                    <VStack>
                      <Text fontWeight="bold" color="gray.500">Back Photo</Text>
                      <Image
                        src={`data:image/jpeg;base64,${selectedCustomer.back_photo_base64}`}
                        alt="Back"
                        borderRadius="md"
                        objectFit="cover"
                      />
                    </VStack>
                  )}
                  {selectedCustomer.aadhar_photo_base64 && (
                    <VStack>
                      <Text fontWeight="bold" color="gray.500">Aadhar Card</Text>
                      <Image
                        src={`data:image/jpeg;base64,${selectedCustomer.aadhar_photo_base64}`}
                        alt="Aadhar"
                        borderRadius="md"
                        objectFit="cover"
                      />
                    </VStack>
                  )}
                  {selectedCustomer.pan_photo_base64 && (
                    <VStack>
                      <Text fontWeight="bold" color="gray.500">PAN Card</Text>
                      <Image
                        src={`data:image/jpeg;base64,${selectedCustomer.pan_photo_base64}`}
                        alt="PAN"
                        borderRadius="md"
                        objectFit="cover"
                      />
                    </VStack>
                  )}
                  {selectedCustomer.bank_photo_base64 && (
                    <VStack>
                      <Text fontWeight="bold" color="gray.500">Bank Details</Text>
                      <Image
                        src={`data:image/jpeg;base64,${selectedCustomer.bank_photo_base64}`}
                        alt="Bank"
                        borderRadius="md"
                        objectFit="cover"
                      />
                    </VStack>
                  )}
                </SimpleGrid>
              </Box>

              {!selectedCustomer.accounts_verified && (
                <Button
                  colorScheme="green"
                  size="lg"
                  onClick={() => handleVerifyCustomer(selectedCustomer.id)}
                  w="full"
                  mt={4}
                >
                  Verify Customer
                </Button>
              )}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  return (
    <Box minH="100vh" bg={bgGradient} position="relative">
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        bg={cardBg}
        borderRadius={{ base: 0, md: 'lg' }}
        p={3}
        boxShadow="md"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <HStack spacing={3}>
          <IconButton icon={<HamburgerIcon />} variant="ghost" onClick={onMenuOpen} aria-label="Open menu" />
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
          // Full-Screen Customer Details (Mobile)
          <Flex direction="column" h={{ base: 'calc(100vh - 70px)', md: 'auto' }} position={{ base: 'fixed', md: 'static' }} top={{ base: '70px', md: 'auto' }} left={0} right={0} bottom={0} bg={cardBg} zIndex={9}>
            {/* Fixed Header with Back Button */}
            <Flex
              justify="space-between"
              align="center"
              bg={cardBg}
              p={3}
              borderRadius={{ base: 0, md: 'lg' }}
              boxShadow="md"
              position="sticky"
              top={0}
              zIndex={10}
              borderBottom="1px"
              borderColor={borderColor}
            >
              <HStack spacing={2}>
                <IconButton
                  icon={<ArrowBackIcon />}
                  variant="ghost"
                  onClick={() => setSelectedCustomer(null)}
                  aria-label="Back to list"
                />
                <Heading size="md" color={textColor}>{selectedCustomer.customer_name} - {selectedCustomer.id}</Heading>
              </HStack>
              <Button size="sm" leftIcon={<EditIcon />} variant="outline" colorScheme="blue" onClick={handleEditToggle}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </Flex>

            {/* Scrollable Details */}
            <Flex direction="column" flex="1" overflowY="auto" p={4} pb={200}>
              <VStack spacing={6} align="stretch">
                {/* Personal Information */}
                <Box>
                  <Text fontWeight="bold" mb={2}>Personal Information</Text>
                  <HStack spacing={4} align="start">
                    <Box flex="1">
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Full Name</Text>
                          <Input name="fullName" value={customerData.fullName} onChange={handleInputChange} isDisabled={!isEditing} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Address</Text>
                          <Input name="address" value={customerData.address} onChange={handleInputChange} isDisabled={!isEditing} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Father's Name</Text>
                          <Input name="fathersName" value={customerData.fathersName} onChange={handleInputChange} isDisabled={!isEditing} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">PAN Number</Text>
                          <Input name="panNumber" value={customerData.panNumber} onChange={handleInputChange} isDisabled={!isEditing} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Aadhar Number</Text>
                          <Input name="aadharNumber" value={customerData.aadharNumber} onChange={handleInputChange} isDisabled={!isEditing} />
                        </Box>
                      </SimpleGrid>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={2}>Passport Photo</Text>
                      <Image
                        src={customerData.photo}
                        alt="Customer Photo"
                        boxSize={{ base: '100px', md: '120px' }}
                        objectFit="cover"
                        borderRadius="md"
                        fallbackSrc="https://via.placeholder.com/100?text=No+Photo"
                      />
                    </Box>
                  </HStack>
                </Box>

                {/* Vehicle Details */}
                <Box>
                  <Text fontWeight="bold" mb={2}>Vehicle Details</Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Vehicle</Text>
                      <Input name="vehicle" value={customerData.vehicle} onChange={handleInputChange} isDisabled={!isEditing} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Variant</Text>
                      <Input name="variant" value={customerData.variant} onChange={handleInputChange} isDisabled={!isEditing} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Color</Text>
                      <Input name="color" value={customerData.color} onChange={handleInputChange} isDisabled={!isEditing} />
                    </Box>
                  </SimpleGrid>
                </Box>

                {/* Pricing */}
                <Box>
                  <Text fontWeight="bold" mb={2}>Pricing</Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Ex-Showroom</Text>
                      <Input name="exShowroom" value={customerData.exShowroom} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Tax</Text>
                      <Input name="tax" value={customerData.tax} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">On-Road</Text>
                      <Input name="onRoad" value={customerData.onRoad} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Insurance</Text>
                      <Input name="insurance" value={customerData.insurance} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Booking Charge</Text>
                      <Input name="bookingCharge" value={customerData.bookingCharge} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Delivery Charge</Text>
                      <Input name="deliveryCharge" value={customerData.deliveryCharge} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                    </Box>
                  </SimpleGrid>
                </Box>

                {/* Finance Options */}
                <Box>
                  <HStack justify="space-between">
                    <Text fontWeight="bold">Finance Options</Text>
                    <Checkbox
                      isChecked={customerData.hasFinance}
                      onChange={handleFinanceToggle}
                      isDisabled={!isEditing}
                    >
                      Has Finance?
                    </Checkbox>
                  </HStack>
                  {customerData.hasFinance && (
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} mt={2}>
                      <Box>
                        <Text fontSize="sm" color="gray.500">Finance Provider</Text>
                        <Input name="financeProvider" value={customerData.financeProvider} onChange={handleInputChange} isDisabled={!isEditing} />
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500">Finance Amount</Text>
                        <Input name="financeAmount" value={customerData.financeAmount} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500">EMI</Text>
                        <Input name="emi" value={customerData.emi} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500">Tenure (months)</Text>
                        <Input name="tenure" value={customerData.tenure} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                      </Box>
                    </SimpleGrid>
                  )}
                </Box>
              </VStack>
              <Box mt={4}>
                {isEditing ? (
                  <Button colorScheme="blue" w="full" onClick={handleSave}>Save</Button>
                ) : (
                  <HStack spacing={4} justify="center">
                    <Button colorScheme="green" w="full" size="lg" onClick={onVerifyOpen}>Verify</Button>
                    <Button colorScheme="red" w="full" size="lg" leftIcon={<DeleteIcon />} onClick={onDeletOpen}>Delete</Button>
                    <Button colorScheme="orange" w="full" size="lg" leftIcon={<WarningTwoIcon />} onClick={onReportOpen}>Report</Button>
                  </HStack>
                )}
              </Box>
            </Flex>
          </Flex>
        ) : (
          // Customer List (Default Mobile View)
          <Box>
            <Tabs variant="soft-rounded" colorScheme="purple" index={activeTab} onChange={(index) => setActiveTab(index === 0 ? 'pending' : 'done')}>
              <TabList mb={4}>
                <Tab>Pending</Tab>
                <Tab>Done</Tab>
              </TabList>
            </Tabs>
            <HStack mb={4}>
              <Select placeholder="Sort by" size="sm" w="150px">
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="status">Status</option>
              </Select>
              <Input placeholder="Search..." value={searchQuery} onChange={handleSearch} size="sm" />
            </HStack>
            <VStack spacing={2} align="stretch" maxH={{ base: 'calc(100vh - 200px)', md: '70vh' }} overflowY="auto">
              {getFilteredCustomers().map(renderCustomerCard)}
            </VStack>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Flex
        justify="space-between"
        align="center"
        bg={cardBg}
        p={2}
        position={{ base: 'fixed', md: 'static' }}
        bottom={0}
        left={0}
        right={0}
        boxShadow="md"
        zIndex={10}
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

      {renderCustomerModal()}
      <ToastContainer position="top-center" autoClose={2000} style={{ zIndex: 1500 }} />
    </Box>
  );
};

export default Accounts;