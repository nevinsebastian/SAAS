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
  Select,
  Tabs,
  TabList,
  Tab,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useColorMode,
  Image,
  Divider,
  Spinner,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  TabPanels,
  TabPanel,
  GridItem,
  InputGroup,
  InputLeftElement,
  FormControl,
  FormLabel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Stack,
  useBreakpointValue,
  Icon,
} from '@chakra-ui/react';
import { HamburgerIcon, BellIcon, ArrowBackIcon, DownloadIcon, SearchIcon, FilterIcon, CheckIcon, TimeIcon, ChevronRightIcon, ChevronLeftIcon, StarIcon, InfoIcon, WarningIcon, CheckCircleIcon, CloseIcon, ChevronUpIcon, ChevronDownIcon, ExternalLinkIcon, ViewIcon, AttachmentIcon, SettingsIcon, RepeatIcon, AddIcon } from '@chakra-ui/icons';
import { FiPlus, FiEdit, FiUsers, FiPieChart, FiBriefcase, FiLogOut, FiDownload, FiBell, FiImage, FiBarChart, FiMenu, FiTrendingUp, FiDollarSign, FiUserCheck, FiClock, FiCheckCircle, FiAlertCircle, FiTruck } from 'react-icons/fi';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const MotionBox = motion(Box);

const Admin = () => {
  const navigate = useNavigate();
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isAddEmployeeOpen, onOpen: onAddEmployeeOpen, onClose: onAddEmployeeClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [salesExecutives, setSalesExecutives] = useState([]);

  // Top-level useColorModeValue calls
  const bgGradient = useColorModeValue('linear(to-br, gray.50, gray.100)', 'linear(to-br, gray.900, gray.800)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const headerGradient = useColorModeValue('linear(to-r, blue.500, purple.500)', 'linear(to-r, blue.700, purple.700)');
  const accentColor = 'blue.500';
  const hoverBg = useColorModeValue('blue.50', 'blue.900');
  const emptyStateGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, blue.900, purple.900)'
  );
  const cardGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, blue.900, purple.900)'
  );

  // Add new color mode values at the top level
  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const glassBorder = useColorModeValue('rgba(226, 232, 240, 0.8)', 'rgba(45, 55, 72, 0.8)');
  const glassHoverBg = useColorModeValue('rgba(66, 153, 225, 0.1)', 'rgba(66, 153, 225, 0.2)');
  const glassInputBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetch analytics
        const analyticsResponse = await axios.get('http://localhost:3000/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(analyticsResponse.data.analytics);

        // Fetch customers
        const customersResponse = await axios.get('http://localhost:3000/customers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCustomers(customersResponse.data.customers);

        // Fetch sales executives
        const salesResponse = await axios.get('http://localhost:3000/admin/employees', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSalesExecutives(salesResponse.data.employees.filter(emp => emp.role === 'sales'));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch dashboard data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const renderDashboard = () => (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isLoading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : analytics ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card
            bg={cardBg}
            borderRadius="xl"
            boxShadow="lg"
            _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">Total Bookings</StatLabel>
                <StatNumber fontSize="2xl">{analytics.total_bookings.current}</StatNumber>
                <StatHelpText>
                  <StatArrow type={analytics.total_bookings.percentage_change >= 0 ? 'increase' : 'decrease'} />
                  {Math.abs(analytics.total_bookings.percentage_change).toFixed(1)}% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card
            bg={cardBg}
            borderRadius="xl"
            boxShadow="lg"
            _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">Pending Deliveries</StatLabel>
                <StatNumber fontSize="2xl">{analytics.pending_deliveries.current}</StatNumber>
                <StatHelpText>
                  <StatArrow type={analytics.pending_deliveries.percentage_change >= 0 ? 'increase' : 'decrease'} />
                  {Math.abs(analytics.pending_deliveries.percentage_change).toFixed(1)}% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card
            bg={cardBg}
            borderRadius="xl"
            boxShadow="lg"
            _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">RTO Pending</StatLabel>
                <StatNumber fontSize="2xl">{analytics.rto_pending.current}</StatNumber>
                <StatHelpText>
                  <StatArrow type={analytics.rto_pending.percentage_change >= 0 ? 'increase' : 'decrease'} />
                  {Math.abs(analytics.rto_pending.percentage_change).toFixed(1)}% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card
            bg={cardBg}
            borderRadius="xl"
            boxShadow="lg"
            _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">Total Revenue</StatLabel>
                <StatNumber fontSize="2xl">₹{analytics.total_revenue.current.toLocaleString()}</StatNumber>
                <StatHelpText>
                  <StatArrow type={analytics.total_revenue.percentage_change >= 0 ? 'increase' : 'decrease'} />
                  {Math.abs(analytics.total_revenue.percentage_change).toFixed(1)}% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
      ) : (
        <Text>Failed to load analytics data</Text>
      )}

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={6}>
        <Card
          bg={cardBg}
          borderRadius="xl"
          boxShadow="lg"
        >
          <CardHeader>
            <Heading size="md">Recent Bookings</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              {customers.slice(0, 5).map((customer) => (
                <Flex key={customer.id} justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="bold">{customer.customer_name}</Text>
                    <Text fontSize="sm" color="gray.500">{customer.vehicle}</Text>
                  </Box>
                  <Badge colorScheme={customer.rto_verified ? "green" : "orange"}>
                    {customer.rto_verified ? "Verified" : "Pending"}
                  </Badge>
                </Flex>
              ))}
            </Stack>
          </CardBody>
        </Card>

        <Card
          bg={cardBg}
          borderRadius="xl"
          boxShadow="lg"
        >
          <CardHeader>
            <Heading size="md">Top Executives</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              {salesExecutives
                .map((executive) => {
                  const executiveCustomers = customers.filter(c => c.created_by === executive.id);
                  const verifiedCount = executiveCustomers.filter(c => c.rto_verified).length;
                  const totalRevenue = executiveCustomers.reduce((sum, c) => sum + (c.amount_paid || 0), 0);
                  
                  return {
                    ...executive,
                    customerCount: executiveCustomers.length,
                    verifiedCount,
                    totalRevenue
                  };
                })
                .sort((a, b) => b.customerCount - a.customerCount)
                .slice(0, 5)
                .map((executive) => (
                  <Flex key={executive.id} justify="space-between" align="center" p={2} borderRadius="md" _hover={{ bg: 'gray.50' }}>
                    <Box>
                      <Text fontWeight="bold">{executive.name}</Text>
                      <Text fontSize="sm" color="gray.500">{executive.customerCount} bookings</Text>
                    </Box>
                    <HStack spacing={4}>
                      <Badge colorScheme="green">{executive.verifiedCount} verified</Badge>
                      <Text fontSize="sm" color="gray.500">₹{executive.totalRevenue.toLocaleString()}</Text>
                    </HStack>
                  </Flex>
                ))}
              {salesExecutives.length === 0 && (
                <Text color="gray.500" textAlign="center">No sales executives found</Text>
              )}
            </Stack>
          </CardBody>
        </Card>

        <Card
          bg={cardBg}
          borderRadius="xl"
          boxShadow="lg"
        >
          <CardHeader>
            <Heading size="md">Pending Approvals</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              {customers
                .filter(c => !c.rto_verified && c.sales_verified && c.accounts_verified)
                .slice(0, 5)
                .map((customer) => (
                  <Flex key={customer.id} justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="bold">{customer.customer_name}</Text>
                      <Text fontSize="sm" color="gray.500">₹{customer.total_price?.toLocaleString()}</Text>
                    </Box>
                    <Button size="sm" colorScheme="blue">Review</Button>
                  </Flex>
                ))}
            </Stack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </MotionBox>
  );

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box minH="100vh" bg={bgGradient} position="relative">
      {/* Header with glassmorphism */}
      <Flex
        justify="space-between"
        align="center"
        bg={glassBg}
        color="white"
        p={4}
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        position="sticky"
        top={0}
        zIndex={10}
        borderBottom="1px solid"
        borderColor={glassBorder}
        backdropFilter="blur(10px)"
        bgBlendMode="overlay"
      >
        <HStack spacing={6}>
          <IconButton
            icon={<HamburgerIcon />}
            variant="ghost"
            color="white"
            onClick={onMenuOpen}
            aria-label="Open menu"
            _hover={{ 
              bg: 'whiteAlpha.200',
              transform: 'scale(1.1)'
            }}
            transition="all 0.2s"
          />
          <Heading 
            size="lg" 
            fontWeight="bold"
            bgGradient="linear(to-r, white, blue.100)"
            bgClip="text"
          >
            Admin Dashboard
          </Heading>
        </HStack>

        <HStack spacing={4}>
          <IconButton
            icon={<BellIcon />}
            variant="ghost"
            color="white"
            aria-label="Notifications"
            _hover={{ 
              bg: 'whiteAlpha.200',
              transform: 'scale(1.1)'
            }}
            transition="all 0.2s"
          />
          <Menu>
            <MenuButton>
              <Avatar 
                name="Admin" 
                size="sm"
                border="2px"
                borderColor="whiteAlpha.400"
                _hover={{ 
                  transform: 'scale(1.1)',
                  borderColor: 'white'
                }}
                transition="all 0.2s"
              />
            </MenuButton>
            <MenuList 
              bg={cardBg} 
              borderColor={borderColor}
              boxShadow="xl"
              borderRadius="xl"
            >
              <MenuItem 
                onClick={toggleColorMode} 
                bg={cardBg} 
                _hover={{ 
                  bg: hoverBg,
                  transform: 'translateX(5px)'
                }}
                transition="all 0.2s"
              >
                {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
              </MenuItem>
              <MenuItem 
                onClick={handleLogout} 
                bg={cardBg} 
                _hover={{ 
                  bg: hoverBg,
                  transform: 'translateX(5px)'
                }}
                transition="all 0.2s"
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Main Content */}
      <Box maxW="1400px" mx="auto" mt={4} px={{ base: 2, md: 4 }} pb={{ base: 16, md: 8 }}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'sales' && (
          <Text>Sales content coming soon...</Text>
        )}
        {activeTab === 'employees' && (
          <Text>Employees content coming soon...</Text>
        )}
        {activeTab === 'reports' && (
          <Text>Reports content coming soon...</Text>
        )}
      </Box>

      {/* Sidebar Drawer */}
      <Drawer isOpen={isMenuOpen} placement="left" onClose={onMenuClose}>
        <DrawerOverlay />
        <DrawerContent w={{ base: 'full', md: '250px' }} bg={cardBg} borderColor={borderColor}>
          <DrawerCloseButton color={textColor} />
          <DrawerHeader color={textColor} borderBottom="1px" borderColor={borderColor}>Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={4}>
              <Button
                variant="ghost"
                colorScheme="blue"
                isActive={activeTab === 'dashboard'}
                justifyContent="start"
                _hover={{ bg: hoverBg }}
                onClick={() => { setActiveTab('dashboard'); onMenuClose(); }}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                colorScheme="blue"
                isActive={activeTab === 'sales'}
                justifyContent="start"
                _hover={{ bg: hoverBg }}
                onClick={() => { setActiveTab('sales'); onMenuClose(); }}
              >
                Sales
              </Button>
              <Button
                variant="ghost"
                colorScheme="blue"
                isActive={activeTab === 'employees'}
                justifyContent="start"
                _hover={{ bg: hoverBg }}
                onClick={() => { setActiveTab('employees'); onMenuClose(); }}
              >
                Employees
              </Button>
              <Button
                variant="ghost"
                colorScheme="blue"
                isActive={activeTab === 'reports'}
                justifyContent="start"
                _hover={{ bg: hoverBg }}
                onClick={() => { setActiveTab('reports'); onMenuClose(); }}
              >
                Reports
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Add Employee Modal */}
      <Modal isOpen={isAddEmployeeOpen} onClose={onAddEmployeeClose}>
        <ModalOverlay />
        <ModalContent bg={cardBg} borderRadius="xl" boxShadow="lg">
          <ModalHeader color={textColor}>Add New Employee</ModalHeader>
          <ModalCloseButton color={textColor} />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Enter employee name"
                  bg={inputBg}
                  borderColor={borderColor}
                  _hover={{ borderColor: accentColor }}
                  _focus={{ borderColor: accentColor }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select
                  bg={inputBg}
                  borderColor={borderColor}
                  _hover={{ borderColor: accentColor }}
                  _focus={{ borderColor: accentColor }}
                >
                  <option>Sales</option>
                  <option>RTO</option>
                  <option>Accounts</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Branch</FormLabel>
                <Select
                  bg={inputBg}
                  borderColor={borderColor}
                  _hover={{ borderColor: accentColor }}
                  _focus={{ borderColor: accentColor }}
                >
                  <option>Downtown</option>
                  <option>Uptown</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={onAddEmployeeClose}
              _hover={{ bg: 'blue.600' }}
            >
              Create
            </Button>
            <Button
              variant="ghost"
              ml={2}
              onClick={onAddEmployeeClose}
              color={textColor}
              _hover={{ bg: hoverBg }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Admin;