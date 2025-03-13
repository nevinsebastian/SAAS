import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';
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
} from '@chakra-ui/react';
import { AddIcon, CopyIcon, HamburgerIcon, SearchIcon, SettingsIcon, BellIcon, ChatIcon, ArrowBackIcon, CheckIcon } from '@chakra-ui/icons';
import { FaWhatsapp } from 'react-icons/fa';
import Analytics from '../components/Analytics';
import Notifications from '../components/Notifications';
import Messages from '../components/Messages';

const SalesExecutive = () => {
  const navigate = useNavigate();
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const { isOpen: isAnalyticsOpen, onOpen: onAnalyticsOpen, onClose: onAnalyticsClose } = useDisclosure();
  const { isOpen: isNotificationsOpen, onOpen: onNotificationsOpen, onClose: onNotificationsClose } = useDisclosure();
  const { isOpen: isMessagesOpen, onOpen: onMessagesOpen, onClose: onMessagesClose } = useDisclosure();
  const { isOpen: isSuccessModalOpen, onOpen: onSuccessModalOpen, onClose: onSuccessModalClose } = useDisclosure();

  const [stats] = useState({ totalCustomers: 0, pending: 0, submitted: 0, verified: 0 }); // Update with real data later
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    customer_name: '',
    phone_number: '',
    vehicle: '',
    variant: '',
    color: '',
    price: '',
  });
  const [generatedLink, setGeneratedLink] = useState('');

  const bgGradient = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  // Fetch customers on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/customers');
        const fetchedCustomers = response.data.customers.map(c => ({
          id: c.id,
          name: c.customer_name,
          phone: c.phone_number,
          vehicle: c.vehicle,
          status: c.status, // Use backend status
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
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/customers', {
        customer_name: formData.customer_name,
        phone_number: formData.phone_number,
        vehicle: formData.vehicle,
        variant: formData.variant || undefined,
        color: formData.color || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
      });

      const newCustomer = {
        id: response.data.customer.id,
        name: response.data.customer.customer_name,
        phone: response.data.customer.phone_number,
        vehicle: response.data.customer.vehicle,
        status: response.data.customer.status, // Use backend status
        date: new Date(response.data.customer.created_at).toISOString().split('T')[0],
      };

      setCustomers(prev => [...prev, newCustomer]);
      setFilteredCustomers(prev => [...prev, newCustomer]);
      setGeneratedLink(response.data.uniqueLink);
      setFormData({ customer_name: '', phone_number: '', vehicle: '', variant: '', color: '', price: '' });

      toast.success('Customer added successfully!', { position: 'top-center' });
      onDrawerClose();
      onSuccessModalOpen();
    } catch (err) {
      console.error('Failed to add customer:', err);
      toast.error(err.response?.data?.error || 'Failed to add customer', { position: 'top-center' });
    }
  };

  const handleVerifyCustomer = async (customerId) => {
    try {
      const response = await api.put(`/customers/${customerId}`, { status: 'Verified' });
      const updatedCustomer = {
        id: response.data.customer.id,
        name: response.data.customer.customer_name,
        phone: response.data.customer.phone_number,
        vehicle: response.data.customer.vehicle,
        status: response.data.customer.status,
        date: new Date(response.data.customer.created_at).toISOString().split('T')[0],
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
    navigator.clipboard.writeText(generatedLink);
    toast.info('Link copied to clipboard!', { position: 'top-center' });
  };

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(generatedLink)}`;
    window.open(whatsappUrl, '_blank');
  };

  const isHomeActive = !isAnalyticsOpen && !isNotificationsOpen && !isMessagesOpen;

  return (
    <Box minH="100vh" bg={bgGradient} p={{ base: 2, md: 4 }} transition="filter 0.3s" filter={isDrawerOpen || isAnalyticsOpen || isNotificationsOpen || isMessagesOpen ? 'blur(4px)' : 'none'} position="relative">
      {/* Header */}
      <Flex justify="space-between" align="center" bg={cardBg} borderRadius="lg" p={3} mb={4} boxShadow="sm" position="sticky" top={0} zIndex={10}>
        <HStack spacing={3}>
          <IconButton icon={<HamburgerIcon />} variant="ghost" onClick={onMenuOpen} aria-label="Open menu" />
          <Heading size="md" color="purple.600">Sales Hub</Heading>
        </HStack>
        <Menu>
          <MenuButton>
            <Avatar name="Sales User" size="sm" />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* Main Content */}
      <Box maxW="1200px" mx="auto">
        <VStack spacing={3} mb={4}>
          <InputGroup>
            <InputLeftElement pointerEvents="none"><SearchIcon color="gray.400" /></InputLeftElement>
            <Input placeholder="Search customers..." value={searchQuery} onChange={handleSearch} variant="filled" borderRadius="md" bg={cardBg} />
          </InputGroup>
          <HStack spacing={2} overflowX="auto" w="full" justify="center">
            {['All', 'Pending', 'Submitted', 'Verified'].map(status => (
              <Button key={status} size="sm" variant={filteredCustomers.some(c => c.status === status) || (status === 'All' && filteredCustomers.length > 0) ? 'solid' : 'outline'} colorScheme="purple" onClick={() => handleFilter(status)} flexShrink={0}>
                {status}
              </Button>
            ))}
          </HStack>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3} mb={20}>
          {filteredCustomers.map(customer => (
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

        <Button leftIcon={<AddIcon />} colorScheme="purple" size="lg" borderRadius="full" position={{ base: 'fixed', md: 'static' }} bottom={{ base: 4, md: 'auto' }} right={{ base: 4, md: 'auto' }} boxShadow="lg" onClick={onDrawerOpen} zIndex={20} w={{ base: 'auto', md: 'full' }} px={{ base: 6, md: 4 }}>
          <Text display={{ base: 'none', md: 'block' }}>New Customer</Text>
        </Button>
      </Box>

      {/* Sidebar Drawer */}
      <Drawer isOpen={isMenuOpen} placement="left" onClose={onMenuClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={4}>
              <Button leftIcon={<ArrowBackIcon />} colorScheme="purple" variant={isHomeActive ? 'solid' : 'outline'} onClick={() => { onMenuClose(); onAnalyticsClose(); onNotificationsClose(); onMessagesClose(); }}>Home</Button>
              <Button leftIcon={<SettingsIcon />} colorScheme="purple" variant={isAnalyticsOpen ? 'solid' : 'outline'} onClick={() => { onMenuClose(); onAnalyticsOpen(); }}>Analytics</Button>
              <Button leftIcon={<BellIcon />} colorScheme="purple" variant={isNotificationsOpen ? 'solid' : 'outline'} onClick={() => { onMenuClose(); onNotificationsOpen(); }}>Notifications</Button>
              <Button leftIcon={<ChatIcon />} colorScheme="purple" variant={isMessagesOpen ? 'solid' : 'outline'} onClick={() => { onMenuClose(); onMessagesOpen(); }}>Messages</Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Add Customer Drawer */}
      <Drawer isOpen={isDrawerOpen} placement="bottom" onClose={onDrawerClose} size={{ base: 'md', md: 'sm' }}>
        <DrawerOverlay bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(4px)" />
        <DrawerContent bg={cardBg} borderTopRadius="lg">
          <DrawerCloseButton zIndex={10} />
          <DrawerHeader color={textColor}>Add New Customer</DrawerHeader>
          <DrawerBody pb={6} maxH={{ base: "70vh", md: "auto" }} overflowY="auto">
            <VStack as="form" onSubmit={handleSubmit} spacing={3} h="full">
              <VStack spacing={3} w="full" flex="1">
                <Input name="customer_name" placeholder="Customer Name" value={formData.customer_name} onChange={handleInputChange} variant="filled" isRequired />
                <Input name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleInputChange} variant="filled" isRequired />
                <Input name="vehicle" placeholder="Vehicle" value={formData.vehicle} onChange={handleInputChange} variant="filled" isRequired />
                <Input name="variant" placeholder="Variant (optional)" value={formData.variant} onChange={handleInputChange} variant="filled" />
                <Input name="color" placeholder="Color (optional)" value={formData.color} onChange={handleInputChange} variant="filled" />
                <Input name="price" placeholder="Price (optional)" value={formData.price} onChange={handleInputChange} variant="filled" type="number" />
              </VStack>
              <Button type="submit" colorScheme="purple" w="full" size="md">Add Customer</Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Success Modal */}
      <Modal isOpen={isSuccessModalOpen} onClose={onSuccessModalClose} size={{ base: 'full', md: 'md' }}>
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader color={textColor}>Customer Created Successfully</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color={textColor} wordBreak="break-all">{generatedLink}</Text>
              <HStack spacing={2}>
                <Button leftIcon={<CopyIcon />} colorScheme="purple" variant="solid" size="md" onClick={handleCopyLink}>
                  Copy
                </Button>
                <Button leftIcon={<FaWhatsapp />} colorScheme="green" variant="solid" size="md" onClick={handleShareWhatsApp}>
                  Share via WhatsApp
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onSuccessModalClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Analytics, Notifications, Messages Drawers */}
      <Drawer isOpen={isAnalyticsOpen} placement="right" onClose={onAnalyticsClose} size="full">
        <DrawerOverlay />
        <DrawerContent>
          <Analytics onClose={onAnalyticsClose} stats={stats} user={{ username: 'Sales User' }} onMenuOpen={onMenuOpen} />
        </DrawerContent>
      </Drawer>
      <Drawer isOpen={isNotificationsOpen} placement="right" onClose={onNotificationsClose} size="full">
        <DrawerOverlay />
        <DrawerContent>
          <Notifications onClose={onNotificationsClose} user={{ username: 'Sales User' }} onMenuOpen={onMenuOpen} />
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