import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { customerApi, notificationApi } from '../api';
import { keyframes } from '@emotion/react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  IconButton,
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
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Progress,
} from '@chakra-ui/react';
import { AddIcon, CopyIcon, HamburgerIcon, SearchIcon, SettingsIcon, BellIcon, ChatIcon, ArrowBackIcon, CheckIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { FaWhatsapp } from 'react-icons/fa';
import { MdPersonAddAlt1 } from "react-icons/md";
import Analytics from '../components/Analytics';
import Notifications from '../components/Notifications';
import Messages from '../components/Messages';

// Success animation keyframes
const checkmarkAnimation = keyframes`
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 3px rgba(99, 102, 241, 0.4), 0 0 6px rgba(99, 102, 241, 0.3), 0 0 9px rgba(99, 102, 241, 0.2); }
  50% { box-shadow: 0 0 6px rgba(99, 102, 241, 0.5), 0 0 12px rgba(99, 102, 241, 0.4), 0 0 18px rgba(99, 102, 241, 0.3); }
  100% { box-shadow: 0 0 3px rgba(99, 102, 241, 0.4), 0 0 6px rgba(99, 102, 241, 0.3), 0 0 9px rgba(99, 102, 241, 0.2); }
`;

const SuccessAnimation = () => {
  return (
    <Box
      w="80px"
      h="80px"
      borderRadius="full"
      bg="green.500"
      display="flex"
      alignItems="center"
      justifyContent="center"
      mx="auto"
      mb={4}
      animation={`${checkmarkAnimation} 0.5s ease-in-out`}
    >
      <CheckIcon w={40} h={40} color="white" />
    </Box>
  );
};

const SalesExecutive = () => {
  const navigate = useNavigate();
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const { isOpen: isAnalyticsOpen, onOpen: onAnalyticsOpen, onClose: onAnalyticsClose } = useDisclosure();
  const { isOpen: isNotificationsOpen, onOpen: onNotificationsOpen, onClose: onNotificationsClose } = useDisclosure();
  const { isOpen: isMessagesOpen, onOpen: onMessagesOpen, onClose: onMessagesClose } = useDisclosure();
  const { isOpen: isSuccessModalOpen, onOpen: onSuccessModalOpen, onClose: onSuccessModalClose } = useDisclosure();

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone_number: '',
    vehicle: '',
    variant: '',
    color: '',
    price: '',
  });
  const [generatedLink, setGeneratedLink] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCustomerPage, setCurrentCustomerPage] = useState(1);
  const notificationsPerPage = 6;
  const customersPerPage = 6;

  const bgGradient = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const accentGradient = useColorModeValue(
    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)'
  );

  const user = JSON.parse(localStorage.getItem('user')) || { username: 'sales_user' };

  const formSteps = [
    { name: 'customer_name', label: 'Customer Name', required: true },
    { name: 'phone_number', label: 'Phone Number', required: true },
    { name: 'vehicle', label: 'Vehicle', required: true },
    { name: 'variant', label: 'Variant (optional)', required: false },
    { name: 'color', label: 'Color (optional)', required: false },
    { name: 'price', label: 'Price (optional)', required: false },
  ];

  // Fetch customers on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await customerApi.getCustomers();
        const fetchedCustomers = response.customers.map(c => ({
          id: c.id,
          name: c.customer_name,
          phone: c.phone_number,
          vehicle: c.vehicle,
          status: c.status,
          date: new Date(c.created_at).toISOString().split('T')[0],
        }));
        setCustomers(fetchedCustomers);
        setFilteredCustomers(fetchedCustomers);
      } catch (err) {
        console.error('Failed to fetch customers:', err);
        toast.error('Failed to load customers', { position: 'top-center' });
        if (err.response?.status === 401) {
          handleLogout();
        }
      }
    };

    fetchCustomers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array for mount-only fetch

  // Fetch notifications
  useEffect(() => {
    let isSubscribed = true;
    let intervalId = null;

    const fetchNotifications = async () => {
      try {
        if (!user || !user.id) {
          console.error('User data not found');
          return;
        }
        const response = await notificationApi.getEmployeeNotifications(user.id);
        if (isSubscribed) {
          setNotifications(response.notifications);
          setUnreadCount(response.notifications.filter(n => !n.read_at).length);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        if (isSubscribed) {
          toast({
            title: 'Error',
            description: 'Failed to fetch notifications',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };

    // Only fetch notifications if we have user data
    if (user && user.id) {
      fetchNotifications();
      // Set up polling for new notifications every 60 seconds
      intervalId = setInterval(fetchNotifications, 60000);
    }

    // Cleanup function
    return () => {
      isSubscribed = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user?.id]); // Only depend on user.id instead of the entire user object

  const markNotificationAsRead = async (notificationId) => {
    try {
      await notificationApi.markNotificationAsRead(notificationId);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleFilter = (status) => {
    const filtered = status === 'All' ? customers : customers.filter(c => c.status === status);
    setFilteredCustomers(
      filtered.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setCurrentCustomerPage(1); // Reset to first page when filter changes
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = customers.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query) ||
      c.vehicle.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setCurrentCustomerPage(1); // Reset to first page when search changes
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Add a small delay to ensure the new input is rendered
      setTimeout(() => {
        const nextInput = document.querySelector(`input[name="${formSteps[currentStep + 1].name}"]`);
        if (nextInput) {
          nextInput.focus();
        }
      }, 100);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    setCurrentStep(0);
    setFormData({
      customer_name: '',
      phone_number: '',
      vehicle: '',
      variant: '',
      color: '',
      price: '',
    });
    onDrawerClose();
  };

  // Add success sound and vibration
  const playSuccessSound = () => {
    const audio = new Audio('/success.mp3'); // You'll need to add this sound file to your public folder
    audio.play().catch(err => console.log('Audio play failed:', err));
  };

  const triggerVibration = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([0, 50, 0]);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      const response = await customerApi.createCustomer({
        customer_name: formData.customer_name,
        phone_number: formData.phone_number,
        vehicle: formData.vehicle,
        variant: formData.variant || undefined,
        color: formData.color || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
      });

      const newCustomer = {
        id: response.customer.id,
        name: response.customer.customer_name,
        phone: response.customer.phone_number,
        vehicle: response.customer.vehicle,
        status: response.customer.status,
        date: new Date(response.customer.created_at).toISOString().split('T')[0],
      };

      setCustomers(prev => [...prev, newCustomer]);
      setFilteredCustomers(prev => [...prev, newCustomer]);
      setGeneratedLink(`https://tvs-dev-server.netlify.app/customer-details/${response.customer.id}`);
      setFormData({ customer_name: '', phone_number: '', vehicle: '', variant: '', color: '', price: '' });
      setCurrentStep(0);

      // Show success animation and trigger effects
      setShowSuccessAnimation(true);
      playSuccessSound();
      triggerVibration();

      // Close the form modal and open success modal
      onDrawerClose();
      onSuccessModalOpen();

      // Reset animation after 2 seconds
      setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 2000);

    } catch (err) {
      console.error('Failed to add customer:', err);
      toast.error(err.response?.data?.error || 'Failed to add customer', { position: 'top-center' });
    }
  };

  const handleVerifyCustomer = async (customerId) => {
    try {
      const response = await customerApi.verifyCustomer(customerId);
      const updatedCustomer = {
        id: response.customer.id,
        name: response.customer.customer_name,
        phone: response.customer.phone_number,
        vehicle: response.customer.vehicle,
        status: response.customer.status,
        date: new Date(response.customer.created_at).toISOString().split('T')[0],
      };

      setCustomers(prev =>
        prev.map(c => (c.id === customerId ? updatedCustomer : c))
      );
      setFilteredCustomers(prev =>
        prev.map(c => (c.id === customerId ? updatedCustomer : c))
      );
      toast.success('Customer verified successfully!', { position: 'top-center' });
    } catch (err) {
      console.error('Failed to verify customer:', err);
      toast.error(err.response?.data?.error || 'Failed to verify customer', { position: 'top-center' });
    }
  };

  const handleCustomerClick = (customerId) => {
    navigate(`/customer-management/${customerId}`);
  };

  const handleCopyLink = () => {
    if (!generatedLink) {
      toast.error('No link available to copy', { position: 'top-center' });
      return;
    }
  
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(generatedLink)
        .then(() => {
          toast.success('Link copied to clipboard!', { position: 'top-center' });
        })
        .catch(() => {
          toast.error('Failed to copy link. Please copy manually.', { position: 'top-center' });
        });
    } else {
      // Fallback for older browsers
      const tempInput = document.createElement('input');
      tempInput.value = generatedLink;
      document.body.appendChild(tempInput);
      tempInput.select();
      tempInput.setSelectionRange(0, 99999);
      
      try {
        document.execCommand('copy');
        toast.success('Link copied to clipboard!', { position: 'top-center' });
      } catch (err) {
        toast.error('Failed to copy link. Please copy manually.', { position: 'top-center' });
      }
  
      document.body.removeChild(tempInput);
    }
  };
  

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(generatedLink)}`;
    window.open(whatsappUrl, '_blank');
  };

  const isHomeActive = !isAnalyticsOpen && !isNotificationsOpen && !isMessagesOpen;

  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * notificationsPerPage,
    currentPage * notificationsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedCustomers = filteredCustomers.slice(
    (currentCustomerPage - 1) * customersPerPage,
    currentCustomerPage * customersPerPage
  );

  const handleCustomerPageChange = (page) => {
    setCurrentCustomerPage(page);
  };

  return (
    <Box minH="100vh" bg={bgGradient} p={{ base: 2, md: 4 }} transition="filter 0.3s" filter={isDrawerOpen || isAnalyticsOpen || isNotificationsOpen || isMessagesOpen ? 'blur(4px)' : 'none'} position="relative">
      {/* Header */}
      <Flex justify="space-between" align="center" bg={cardBg} borderRadius="lg" p={3} mb={4} boxShadow="sm" position="sticky" top={0} zIndex={10}>
        <HStack spacing={3}>
          <IconButton icon={<HamburgerIcon />} variant="ghost" onClick={onMenuOpen} aria-label="Open menu" />
          <Heading size="md" color="purple.600">Sales Hub</Heading>
        </HStack>
        <HStack spacing={2}>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<BellIcon />}
              variant="ghost"
              color="white"
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
                notifications.slice(0, 3).map(notification => (
                  <MenuItem
                    key={notification.id}
                    bg={notification.read_at ? cardBg : 'blue.50'}
                    _hover={{ 
                      bg: hoverBg,
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
              {notifications.length > 3 && (
                <MenuItem
                  bg={cardBg}
                  onClick={() => {
                    onNotificationsOpen();
                    onMenuClose();
                  }}
                  _hover={{ 
                    bg: hoverBg,
                    transform: 'translateX(5px)'
                  }}
                  transition="all 0.2s"
                >
                  <Text color="purple.500" fontWeight="medium">View all notifications →</Text>
                </MenuItem>
              )}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton>
              <Avatar name="Sales User" size="sm" />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Main Content */}
      <Box maxW="1200px" mx="auto">
        <VStack spacing={3} mb={4} position="sticky" top="80px" zIndex={5} bg={bgGradient} pt={2}>
          <InputGroup>
            <InputLeftElement pointerEvents="none"><SearchIcon color="gray.400" /></InputLeftElement>
            <Input placeholder="Search customers..." value={searchQuery} onChange={handleSearch} variant="filled" borderRadius="md" bg={cardBg} />
          </InputGroup>
          <HStack spacing={2} overflowX="auto" w="full" justify="center" pb={2}>
            {['All', 'Pending', 'Submitted', 'Verified'].map(status => (
              <Button key={status} size="sm" variant={filteredCustomers.some(c => c.status === status) || (status === 'All' && filteredCustomers.length > 0) ? 'solid' : 'outline'} colorScheme="purple" onClick={() => handleFilter(status)} flexShrink={0}>
                {status}
              </Button>
            ))}
          </HStack>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3} mb={{ base: "80px", md: 4 }}>
          {paginatedCustomers.map(customer => (
            <Box key={customer.id} bg={cardBg} borderRadius="lg" p={3} boxShadow="sm" _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }} transition="all 0.2s" cursor="pointer" onClick={() => handleCustomerClick(customer.id)}>
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontWeight="medium" color={textColor} isTruncated>{customer.name}</Text>
                <HStack spacing={2}>
                  <Badge colorScheme={customer.status === 'Pending' ? 'yellow' : customer.status === 'Submitted' ? 'purple' : 'green'} variant="subtle">{customer.status}</Badge>
                  {customer.status === 'Submitted' && (
                    <IconButton
                      icon={<CheckIcon />}
                      size="sm"
                      colorScheme="green"
                      variant="outline"
                      aria-label="Verify customer"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigation
                        handleVerifyCustomer(customer.id);
                      }}
                    />
                  )}
                </HStack>
              </Flex>
              <Text fontSize="sm" color="gray.500">Phone: {customer.phone}</Text>
              <Text fontSize="sm" color="gray.500">Vehicle: {customer.vehicle}</Text>
              <Text fontSize="xs" color="gray.400" mt={1}>{customer.date}</Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* New Customer Button */}
        <Box 
          position={{ base: "fixed", md: "fixed" }}
          bottom={{ base: "80px", md: "40px" }}
          right={{ base: "20px", md: "40px" }}
          zIndex={20}
        >
          <Button 
            colorScheme="purple" 
            size="lg" 
            borderRadius="full" 
            boxShadow="lg" 
            onClick={onDrawerOpen} 
            w="56px"
            h="56px"
            p={0}
            bg="rgba(20, 30, 121, 0.6)"
            backdropFilter="blur(8px)"
            border="1px solid"
            borderColor="whiteAlpha.300"
            animation={`${glowAnimation} 4s infinite`}
            _hover={{ 
              transform: 'scale(1.05)',
              boxShadow: '2xl',
              bg: "rgba(20, 30, 121, 0.7)",
              opacity: 0.9,
              borderColor: "whiteAlpha.400",
              animation: `${glowAnimation} 1s infinite`
            }}
            transition="all 0.2s"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="whiteAlpha.100"
              backdropFilter="blur(4px)"
              borderRadius="full"
            />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              zIndex={1}
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <MdPersonAddAlt1 size={28} />
            </Box>
          </Button>
        </Box>

        {/* Customer List Pagination */}
        {filteredCustomers.length > customersPerPage && (
          <Box 
            position={{ base: "fixed", md: "static" }}
            bottom={{ base: 0, md: "auto" }}
            left={0}
            right={0}
            p={4}
            bg="whiteAlpha.100"
            backdropFilter="blur(10px)"
            borderTop={{ base: "1px solid", md: "none" }}
            borderColor="whiteAlpha.300"
            boxShadow={{ base: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)", md: "none" }}
            zIndex={2}
            mb={{ base: 0, md: 4 }}
          >
            <Flex justify="center">
              <HStack spacing={2}>
                <Button
                  size="sm"
                  onClick={() => handleCustomerPageChange(currentCustomerPage - 1)}
                  isDisabled={currentCustomerPage === 1}
                  colorScheme="purple"
                  variant="outline"
                  borderRadius="full"
                  px={4}
                  bg="whiteAlpha.200"
                  backdropFilter="blur(10px)"
                  borderColor="whiteAlpha.300"
                  _hover={{ 
                    bg: "whiteAlpha.300",
                    borderColor: "whiteAlpha.400"
                  }}
                >
                  Previous
                </Button>
                {[...Array(Math.ceil(filteredCustomers.length / customersPerPage))].map((_, i) => (
                  <Button
                    key={i + 1}
                    size="sm"
                    onClick={() => handleCustomerPageChange(i + 1)}
                    colorScheme="purple"
                    variant={currentCustomerPage === i + 1 ? "solid" : "outline"}
                    borderRadius="full"
                    minW="8"
                    h="8"
                    p={0}
                    bg={currentCustomerPage === i + 1 ? "purple.500" : "whiteAlpha.200"}
                    backdropFilter="blur(10px)"
                    borderColor="whiteAlpha.300"
                    _hover={{ 
                      bg: currentCustomerPage === i + 1 ? "purple.600" : "whiteAlpha.300",
                      borderColor: "whiteAlpha.400"
                    }}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  size="sm"
                  onClick={() => handleCustomerPageChange(currentCustomerPage + 1)}
                  isDisabled={currentCustomerPage === Math.ceil(filteredCustomers.length / customersPerPage)}
                  colorScheme="purple"
                  variant="outline"
                  borderRadius="full"
                  px={4}
                  bg="whiteAlpha.200"
                  backdropFilter="blur(10px)"
                  borderColor="whiteAlpha.300"
                  _hover={{ 
                    bg: "whiteAlpha.300",
                    borderColor: "whiteAlpha.400"
                  }}
                >
                  Next
                </Button>
              </HStack>
            </Flex>
          </Box>
        )}
      </Box>

      {/* Replace the Add Customer Drawer with Modal */}
      <Modal isOpen={isDrawerOpen} onClose={handleCancel} size="sm" isCentered>
        <ModalOverlay bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(4px)" />
        <ModalContent bg={cardBg} borderRadius="xl" maxH={{ base: "90vh", md: "80vh" }} overflowY="auto">
          <ModalHeader color={textColor} fontSize="xl" fontWeight="bold" textAlign="center" pb={0}>
            Add New Customer
          </ModalHeader>
          <ModalCloseButton onClick={handleCancel} />
          <ModalBody pb={6}>
            <VStack spacing={6} w="full">
              {/* Progress Dots */}
              <HStack spacing={3} justify="center" mt={2}>
                {formSteps.map((_, index) => (
                  <Box
                    key={index}
                    w={3}
                    h={3}
                    borderRadius="full"
                    bg={index === currentStep ? "purple.500" : index < currentStep ? "purple.200" : "gray.200"}
                    transition="all 0.2s"
                    boxShadow={index === currentStep ? "0 0 0 4px rgba(159, 122, 234, 0.2)" : "none"}
                  />
                ))}
              </HStack>

              {/* Step Label */}
              <Text 
                color="gray.500" 
                fontSize="sm" 
                textAlign="center"
                fontWeight="medium"
              >
                {formSteps[currentStep].label}
              </Text>

              {/* Current Step Input */}
              <Input
                name={formSteps[currentStep].name}
                placeholder={`Enter ${formSteps[currentStep].label.toLowerCase()}`}
                value={formData[formSteps[currentStep].name]}
                onChange={handleInputChange}
                variant="filled"
                isRequired={formSteps[currentStep].required}
                autoComplete="off"
                autoFocus
                size="lg"
                bg="purple.50"
                border="1px solid"
                borderColor="purple.200"
                _hover={{ 
                  bg: "purple.100",
                  borderColor: "purple.300"
                }}
                _focus={{ 
                  bg: "blue.900",
                  borderColor: "purple.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)"
                }}
                _placeholder={{ color: "purple.300" }}
                color="whiteAlpha.900"
                borderRadius="xl"
                fontSize="md"
                h="48px"
              />
            </VStack>
          </ModalBody>
          <ModalFooter pb={6} px={6} position="sticky" bottom={0} bg={cardBg}>
            <HStack spacing={3} w="full">
              <Button 
                variant="ghost" 
                onClick={handleCancel} 
                flex={1}
                size="lg"
                borderRadius="xl"
                _hover={{ bg: "gray.100" }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="purple"
                onClick={handleNext}
                flex={1}
                size="lg"
                borderRadius="xl"
                isDisabled={formSteps[currentStep].required && !formData[formSteps[currentStep].name]}
                _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
              >
                {currentStep === formSteps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={isSuccessModalOpen} onClose={onSuccessModalClose} size="sm" isCentered>
        <ModalOverlay bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(4px)" />
        <ModalContent bg={cardBg} borderRadius="xl">
          <ModalHeader color={textColor} fontSize="xl" fontWeight="bold" textAlign="center" pb={0}>
            Success!
          </ModalHeader>
          <ModalCloseButton onClick={onSuccessModalClose} />
          <ModalBody pb={6}>
            <VStack spacing={6} align="center">
              {showSuccessAnimation && <SuccessAnimation />}
              <Text color="green.500" textAlign="center" fontSize="lg" fontWeight="medium">
                Customer Created Successfully!
              </Text>
              <Text color="gray.600" textAlign="center" fontSize="sm">
                Share the link below with your customer
              </Text>
              <Box 
                w="full" 
                p={3} 
                bg="purple.50" 
                borderRadius="lg" 
                border="1px solid" 
                borderColor="purple.200"
                cursor="pointer"
                onClick={() => window.open(generatedLink, '_blank')}
                _hover={{ bg: "purple.100" }}
                transition="all 0.2s"
              >
                <HStack justify="space-between">
                  <Text fontSize="sm" color="purple.700" wordBreak="break-all" flex="1">
                    {generatedLink}
                  </Text>
                  <ExternalLinkIcon color="purple.500" />
                </HStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter pb={6} px={6}>
            <HStack spacing={3} w="full">
              <Button 
                leftIcon={<CopyIcon />} 
                colorScheme="purple" 
                variant="solid" 
                flex={1}
                size="lg"
                borderRadius="xl"
                onClick={handleCopyLink}
              >
                Copy Link
              </Button>
              <Button 
                leftIcon={<FaWhatsapp />} 
                colorScheme="green" 
                variant="solid" 
                flex={1}
                size="lg"
                borderRadius="xl"
                onClick={handleShareWhatsApp}
              >
                Share
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Analytics Drawer */}
      <Drawer isOpen={isAnalyticsOpen} placement="right" onClose={onAnalyticsClose} size="full">
        <DrawerOverlay />
        <DrawerContent>
          <Analytics onClose={onAnalyticsClose} user={{ username: 'Sales User' }} onMenuOpen={onMenuOpen} />
        </DrawerContent>
      </Drawer>
      <Drawer isOpen={isNotificationsOpen} placement="right" onClose={onNotificationsClose} size="full">
        <DrawerOverlay />
        <DrawerContent bg={bgGradient}>
          <Box p={4} h="100%" display="flex" flexDirection="column">
            {/* Header */}
            <Flex 
              justify="space-between" 
              align="center" 
              mb={6} 
              position="sticky" 
              top={0} 
              zIndex={2}
              bg={bgGradient}
              py={2}
            >
              <HStack spacing={3}>
                <IconButton
                  icon={<ArrowBackIcon />}
                  onClick={onNotificationsClose}
                  variant="ghost"
                  aria-label="Close notifications"
                  size="lg"
                  fontSize="xl"
                  color="purple.500"
                  _hover={{ bg: 'purple.50' }}
                />
                <Heading 
                  size="lg" 
                  bgGradient={accentGradient} 
                  bgClip="text"
                  fontSize={{ base: "xl", md: "2xl" }}
                >
                  Notifications
                </Heading>
              </HStack>
              <Badge 
                colorScheme="purple" 
                variant="subtle"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
              >
                {unreadCount} unread
              </Badge>
            </Flex>
            
            {/* Notifications List with Bottom Padding for Pagination */}
            <Box 
              flex="1" 
              overflowY="auto" 
              pb={{ base: "120px", md: "40px" }} // Increased bottom padding
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(159, 122, 234, 0.2)',
                  borderRadius: '24px',
                },
              }}
            >
              <VStack spacing={3} align="stretch" mb={{ base: 4, md: 2 }}> {/* Added margin bottom to VStack */}
                {paginatedNotifications.map(notification => (
                  <Box
                    key={notification.id}
                    p={4}
                    bg={notification.read_at ? cardBg : 'purple.50'}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={notification.read_at ? borderColor : 'purple.200'}
                    _hover={{ 
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                      borderColor: 'purple.300'
                    }}
                    transition="all 0.2s"
                    cursor="pointer"
                    onClick={() => markNotificationAsRead(notification.id)}
                    position="relative"
                  >
                    {!notification.read_at && (
                      <Box
                        position="absolute"
                        top={2}
                        right={2}
                        w={2}
                        h={2}
                        bg="purple.500"
                        borderRadius="full"
                        boxShadow="0 0 0 4px rgba(159, 122, 234, 0.2)"
                      />
                    )}
                    <VStack align="start" spacing={2}>
                      <Text 
                        fontWeight="bold" 
                        fontSize={{ base: "md", md: "lg" }}
                        color={notification.read_at ? textColor : "purple.700"}
                      >
                        {notification.title}
                      </Text>
                      <Text 
                        color="gray.600" 
                        fontSize={{ base: "sm", md: "md" }}
                        lineHeight="1.5"
                      >
                        {notification.message}
                      </Text>
                      <HStack 
                        spacing={2} 
                        fontSize="xs" 
                        color="gray.500"
                        w="full"
                        justify="space-between"
                        align="center"
                      >
                        <Text>From: {notification.sender_name}</Text>
                        <Text>{new Date(notification.created_at).toLocaleString()}</Text>
                      </HStack>
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </Box>

            {/* Pagination - Fixed at bottom */}
            {notifications.length > notificationsPerPage && (
              <Box 
                position="fixed"
                bottom={0}
                left={0}
                right={0}
                bg={cardBg}
                p={4}
                boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.1)"
                zIndex={2}
                borderTop="1px solid"
                borderColor={borderColor}
              >
                <Flex justify="center">
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      isDisabled={currentPage === 1}
                      colorScheme="purple"
                      variant="outline"
                      borderRadius="full"
                      px={4}
                    >
                      Previous
                    </Button>
                    {[...Array(Math.ceil(notifications.length / notificationsPerPage))].map((_, i) => (
                      <Button
                        key={i + 1}
                        size="sm"
                        onClick={() => handlePageChange(i + 1)}
                        colorScheme="purple"
                        variant={currentPage === i + 1 ? "solid" : "outline"}
                        borderRadius="full"
                        minW="8"
                        h="8"
                        p={0}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      isDisabled={currentPage === Math.ceil(notifications.length / notificationsPerPage)}
                      colorScheme="purple"
                      variant="outline"
                      borderRadius="full"
                      px={4}
                    >
                      Next
                    </Button>
                  </HStack>
                </Flex>
              </Box>
            )}
          </Box>
        </DrawerContent>
      </Drawer>
      <Drawer isOpen={isMessagesOpen} placement="right" onClose={onMessagesClose} size="full">
        <DrawerOverlay />
        <DrawerContent>
          <Messages onClose={onMessagesClose} user={{ username: 'Sales User' }} onMenuOpen={onMenuOpen} />
        </DrawerContent>
      </Drawer>

      <ToastContainer position="top-center" autoClose={2000} style={{ zIndex: 1500 }} />
    </Box>
  );
};

export default SalesExecutive;