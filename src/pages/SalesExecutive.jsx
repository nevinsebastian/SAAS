import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  Tooltip,
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
} from '@chakra-ui/react';
import { AddIcon, CopyIcon, HamburgerIcon, SearchIcon, SettingsIcon, BellIcon, ChatIcon, ArrowBackIcon } from '@chakra-ui/icons';
import Analytics from '../components/Analytics';
import Notifications from '../components/Notifications';
import Messages from '../components/Messages';

const SalesExecutive = () => {
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'sales_user' };
  const navigate = useNavigate();
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const { isOpen: isAnalyticsOpen, onOpen: onAnalyticsOpen, onClose: onAnalyticsClose } = useDisclosure();
  const { isOpen: isNotificationsOpen, onOpen: onNotificationsOpen, onClose: onNotificationsClose } = useDisclosure();
  const { isOpen: isMessagesOpen, onOpen: onMessagesOpen, onClose: onMessagesClose } = useDisclosure();

  const dummyData = {
    stats: { totalCustomers: 25, pending: 8, submitted: 17, reviewsPending: 5, reviewsDone: 20 },
    customers: [
      { id: 1, name: 'John Doe', phone: '123-456-7890', status: 'Pending', vehicle: 'Honda City', date: '2025-03-01' },
      { id: 2, name: 'Jane Smith', phone: '098-765-4321', status: 'Submitted', vehicle: 'Toyota Corolla', date: '2025-03-02' },
      { id: 3, name: 'Mike Johnson', phone: '555-555-5555', status: 'Verified', vehicle: 'Hyundai Creta', date: '2025-03-03' },
    ],
  };

  const [stats] = useState(dummyData.stats);
  const [customers] = useState(dummyData.customers);
  const [filteredCustomers, setFilteredCustomers] = useState(dummyData.customers);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '', phone: '', vehicle: '', variant: '', color: '', price: '',
  });
  const [generatedLink, setGeneratedLink] = useState('');

  const bgGradient = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const linkBg = useColorModeValue('gray.100', 'gray.700');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleFilter = (status) => {
    const filtered = status === 'All' ? customers : customers.filter(c => c.status === status);
    setFilteredCustomers(filtered.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
    ));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCustomer = {
      id: customers.length + 1,
      ...formData,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    };
    setFilteredCustomers(prev => [...prev, newCustomer]);
    setGeneratedLink(`https://example.com/customer/${newCustomer.id}`);
    setFormData({ name: '', phone: '', vehicle: '', variant: '', color: '', price: '' });
    toast.success('Customer added successfully!', { position: 'top-center', style: { zIndex: 1000 } });
  };

  const handleCustomerClick = (id) => {
    navigate(`/customer-details/${id}`);
  };

  const isHomeActive = !isAnalyticsOpen && !isNotificationsOpen && !isMessagesOpen;

  return (
    <Box minH="100vh" bg={bgGradient} p={{ base: 2, md: 4 }} transition="filter 0.3s" filter={isDrawerOpen || isAnalyticsOpen || isNotificationsOpen || isMessagesOpen ? 'blur(4px)' : 'none'}>
      {/* Header */}
      <Flex justify="space-between" align="center" bg={cardBg} borderRadius="lg" p={3} mb={4} boxShadow="sm" position="sticky" top={0} zIndex={10}>
        <HStack spacing={3}>
          <IconButton icon={<HamburgerIcon />} variant="ghost" onClick={onMenuOpen} aria-label="Open menu" />
          <Heading size="md" color="purple.600">Sales Hub</Heading>
        </HStack>
        <Menu>
          <MenuButton>
            <Avatar name={user.username} size="sm" />
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
              <Button key={status} size="sm" variant={filteredCustomers.some(c => c.status === status) ? 'solid' : 'outline'} colorScheme="purple" onClick={() => handleFilter(status)} flexShrink={0}>
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
                <Badge colorScheme={customer.status === 'Pending' ? 'yellow' : customer.status === 'Submitted' ? 'purple' : 'green'} variant="subtle">{customer.status}</Badge>
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
                <Input name="name" placeholder="Customer Name" value={formData.name} onChange={handleInputChange} variant="filled" isRequired />
                <Input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} variant="filled" isRequired />
                <Input name="vehicle" placeholder="Vehicle" value={formData.vehicle} onChange={handleInputChange} variant="filled" isRequired />
                <Input name="variant" placeholder="Variant (optional)" value={formData.variant} onChange={handleInputChange} variant="filled" />
                <Input name="color" placeholder="Color (optional)" value={formData.color} onChange={handleInputChange} variant="filled" />
                <Input name="price" placeholder="Price (optional)" value={formData.price} onChange={handleInputChange} variant="filled" type="number" />
              </VStack>
              <VStack w="full" spacing={3}>
                <Button type="submit" colorScheme="purple" w="full" size="md">Add Customer</Button>
                {generatedLink && (
                  <Flex w="full" bg={linkBg} borderRadius="md" p={3} align="center" justify="space-between">
                    <Text fontSize="sm" color={textColor} isTruncated maxW="70%">{generatedLink}</Text>
                    <Tooltip label="Copy Link">
                      <IconButton icon={<CopyIcon />} colorScheme="purple" size="sm" onClick={() => navigator.clipboard.writeText(generatedLink)} aria-label="Copy link" />
                    </Tooltip>
                  </Flex>
                )}
              </VStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Analytics, Notifications, Messages Drawers */}
      <Drawer isOpen={isAnalyticsOpen} placement="right" onClose={onAnalyticsClose} size="full">
        <DrawerOverlay />
        <DrawerContent>
          <Analytics onClose={onAnalyticsClose} stats={stats} user={user} onMenuOpen={onMenuOpen} />
        </DrawerContent>
      </Drawer>
      <Drawer isOpen={isNotificationsOpen} placement="right" onClose={onNotificationsClose} size="full">
        <DrawerOverlay />
        <DrawerContent>
          <Notifications onClose={onNotificationsClose} user={user} onMenuOpen={onMenuOpen} />
        </DrawerContent>
      </Drawer>
      <Drawer isOpen={isMessagesOpen} placement="right" onClose={onMessagesClose} size="full">
        <DrawerOverlay />
        <DrawerContent>
          <Messages onClose={onMessagesClose} />
        </DrawerContent>
      </Drawer>

      <ToastContainer position="top-center" autoClose={2000} style={{ zIndex: 1000 }} />
    </Box>
  );
};

export default SalesExecutive;