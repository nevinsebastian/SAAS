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
  Textarea,
} from '@chakra-ui/react';
import { HamburgerIcon, BellIcon, ArrowBackIcon, DownloadIcon, SearchIcon, FilterIcon, CheckIcon, TimeIcon, ChevronRightIcon, ChevronLeftIcon, StarIcon, InfoIcon, WarningIcon, CheckCircleIcon, CloseIcon, ChevronUpIcon, ChevronDownIcon, ExternalLinkIcon, ViewIcon, AttachmentIcon, SettingsIcon, RepeatIcon, AddIcon } from '@chakra-ui/icons';
import { FiPlus, FiEdit, FiUsers, FiPieChart, FiBriefcase, FiLogOut, FiDownload, FiBell, FiImage, FiBarChart, FiMenu, FiTrendingUp, FiDollarSign, FiUserCheck, FiClock, FiCheckCircle, FiAlertCircle, FiTruck, FiEdit2, FiTrash2, FiMail, FiPhone, FiMapPin, FiUser } from 'react-icons/fi';
import { Line, Pie, Bar } from 'react-chartjs-2';
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
import api from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const MotionBox = motion.create(Box);

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
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    branch_id: '',
    role: '',
    password: ''
  });
  const [branches, setBranches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('role'); // 'role' or 'branch'
  const [sortOrder, setSortOrder] = useState('asc');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [targetType, setTargetType] = useState('all');
  const [user, setUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Top-level useColorModeValue calls
  const cardBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const metricCardBg = useColorModeValue('white', 'gray.800');
  const metricCardHoverBg = useColorModeValue('gray.50', 'gray.700');
  const bgGradient = useColorModeValue(
    'linear(to-b, gray.50, white)',
    'linear(to-b, gray.900, gray.800)'
  );
  const performanceCardBg = useColorModeValue('white', 'gray.800');
  const performanceCardHoverBg = useColorModeValue('gray.50', 'gray.700');
  const performanceMetricBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
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

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      
      if (!response.data || !response.data.analytics) {
        throw new Error('Invalid analytics data structure');
      }

      // Transform the data to match the expected structure
      const analyticsData = {
        total_bookings: {
          current: response.data.analytics.total_bookings?.current || 0,
          previous: response.data.analytics.total_bookings?.previous || 0,
          percentage_change: response.data.analytics.total_bookings?.percentage_change || 0
        },
        pending_deliveries: {
          current: response.data.analytics.pending_deliveries?.current || 0,
          previous: response.data.analytics.pending_deliveries?.previous || 0,
          percentage_change: response.data.analytics.pending_deliveries?.percentage_change || 0
        },
        rto_pending: {
          current: response.data.analytics.rto_pending?.current || 0,
          previous: response.data.analytics.rto_pending?.previous || 0,
          percentage_change: response.data.analytics.rto_pending?.percentage_change || 0
        },
        total_revenue: {
          current: response.data.analytics.total_revenue?.current || 0,
          previous: response.data.analytics.total_revenue?.previous || 0,
          percentage_change: response.data.analytics.total_revenue?.percentage_change || 0
        }
      };

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch analytics data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [employeesRes, branchesRes] = await Promise.all([
          api.get('/admin/employees'),
          api.get('/admin/branches')
        ]);
        setEmployees(employeesRes.data.employees);
        setBranches(branchesRes.data.branches);
        await fetchAnalytics();
      } catch (err) {
        console.error('Error fetching data:', err);
        toast({
          title: 'Error',
          description: 'Failed to fetch data',
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

  useEffect(() => {
    // Get user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user && user.id) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get(`/notifications/employee/${user.id}`);
      setNotifications(response.data.notifications);
      
      const unreadResponse = await api.get(`/notifications/unread-count/${user.id}`);
      setUnreadCount(unreadResponse.data.count);
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

  const sendNotification = async () => {
    try {
      let targetId = null;
      switch (targetType) {
        case 'employee':
          targetId = selectedEmployee;
          break;
        case 'branch':
          targetId = selectedBranch;
          break;
        case 'role':
          targetId = selectedRole;
          break;
        case 'role_in_branch':
          targetId = {
            role: selectedRole,
            branch_id: selectedBranch
          };
          break;
        default:
          targetId = null;
      }

      await api.post('/notifications/send', {
        title: notificationTitle,
        message: notificationMessage,
        targetType,
        targetId,
      });

      toast({
        title: 'Success',
        description: 'Notification sent successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
      setNotificationTitle('');
      setNotificationMessage('');
      setTargetType('all');
      setSelectedEmployee(null);
      setSelectedBranch(null);
      setSelectedRole('');
      fetchNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to send notification',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      fetchNotifications();
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
        <>
          {/* Overview Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
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
                  <StatNumber fontSize="2xl">{analytics.total_bookings?.current || 0}</StatNumber>
                  <StatHelpText>
                    <StatArrow type={(analytics.total_bookings?.percentage_change || 0) >= 0 ? 'increase' : 'decrease'} />
                    {Math.abs(analytics.total_bookings?.percentage_change || 0).toFixed(1)}% from last month
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
                  <StatNumber fontSize="2xl">{analytics.pending_deliveries?.current || 0}</StatNumber>
                  <StatHelpText>
                    <StatArrow type={(analytics.pending_deliveries?.percentage_change || 0) >= 0 ? 'increase' : 'decrease'} />
                    {Math.abs(analytics.pending_deliveries?.percentage_change || 0).toFixed(1)}% from last month
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
                  <StatNumber fontSize="2xl">{analytics.rto_pending?.current || 0}</StatNumber>
                  <StatHelpText>
                    <StatArrow type={(analytics.rto_pending?.percentage_change || 0) >= 0 ? 'increase' : 'decrease'} />
                    {Math.abs(analytics.rto_pending?.percentage_change || 0).toFixed(1)}% from last month
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
                  <StatNumber fontSize="2xl">₹{(analytics.total_revenue?.current || 0).toLocaleString()}</StatNumber>
                  <StatHelpText>
                    <StatArrow type={(analytics.total_revenue?.percentage_change || 0) >= 0 ? 'increase' : 'decrease'} />
                    {Math.abs(analytics.total_revenue?.percentage_change || 0).toFixed(1)}% from last month
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Sales Performance Charts */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
            <Card bg={cardBg} borderRadius="xl" boxShadow="lg">
              <CardHeader>
                <Heading size="md">Monthly Sales Trend</Heading>
              </CardHeader>
              <CardBody>
                <Box h="300px">
                  <Line
                    data={{
                      labels: ['Last Month', 'Current Month'],
                      datasets: [
                        {
                          label: 'Total Bookings',
                          data: [analytics.total_bookings?.previous || 0, analytics.total_bookings?.current || 0],
                          borderColor: 'rgb(75, 192, 192)',
                          tension: 0.1
                        },
                        {
                          label: 'Pending Deliveries',
                          data: [analytics.pending_deliveries?.previous || 0, analytics.pending_deliveries?.current || 0],
                          borderColor: 'rgb(255, 99, 132)',
                          tension: 0.1
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                </Box>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderRadius="xl" boxShadow="lg">
              <CardHeader>
                <Heading size="md">Revenue Comparison</Heading>
              </CardHeader>
              <CardBody>
                <Box h="300px">
                  <Bar
                    data={{
                      labels: ['Last Month', 'Current Month'],
                      datasets: [
                        {
                          label: 'Total Revenue',
                          data: [analytics.total_revenue?.previous || 0, analytics.total_revenue?.current || 0],
                          backgroundColor: [
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(75, 192, 192, 0.8)'
                          ]
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                </Box>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Recent Activity */}
          <Card bg={cardBg} borderRadius="xl" boxShadow="lg">
            <CardHeader>
              <Heading size="md">Recent Activity</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text>Total Bookings: {analytics.total_bookings?.current || 0} (vs {analytics.total_bookings?.previous || 0} last month)</Text>
                <Text>Pending Deliveries: {analytics.pending_deliveries?.current || 0} (vs {analytics.pending_deliveries?.previous || 0} last month)</Text>
                <Text>RTO Pending: {analytics.rto_pending?.current || 0} (vs {analytics.rto_pending?.previous || 0} last month)</Text>
                <Text>Total Revenue: ₹{(analytics.total_revenue?.current || 0).toLocaleString()} (vs ₹{(analytics.total_revenue?.previous || 0).toLocaleString()} last month)</Text>
              </VStack>
            </CardBody>
          </Card>
        </>
      ) : (
        <Flex justify="center" align="center" minH="200px">
          <Text color="red.500">Failed to load analytics data</Text>
        </Flex>
      )}
    </MotionBox>
  );

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/employees', employeeForm);
      
      toast({
        title: 'Success',
        description: 'Employee added successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Refresh employees list
      const response = await api.get('/admin/employees');
      setEmployees(response.data.employees);
      onAddEmployeeClose();
      setEmployeeForm({
        name: '',
        email: '',
        phone: '',
        branch_id: '',
        role: '',
        password: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to add employee',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateEmployee = async () => {
    try {
      // Create an update object with only the fields that have changed
      const updateData = {
        name: employeeForm.name,
        email: employeeForm.email,
        phone: employeeForm.phone,
        branch_id: employeeForm.branch_id,
        role: employeeForm.role
      };

      // Only include password if it's not empty
      if (employeeForm.password) {
        updateData.password = employeeForm.password;
      }

      await api.put(`/admin/employees/${selectedEmployee.id}`, updateData);
      
      toast({
        title: 'Success',
        description: 'Employee updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Refresh employees list
      const response = await api.get('/admin/employees');
      setEmployees(response.data.employees);
      setIsEditModalOpen(false);
      setSelectedEmployee(null);
      setEmployeeForm({
        name: '',
        email: '',
        phone: '',
        branch_id: '',
        role: '',
        password: ''
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update employee',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      await api.delete(`/admin/employees/${selectedEmployee.id}`);
      
      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Refresh employees list
      const response = await api.get('/admin/employees');
      setEmployees(response.data.employees);
      setIsDeleteModalOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete employee',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Add this function to filter and sort employees
  const getFilteredAndSortedEmployees = () => {
    let filtered = employees.filter(employee => 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortBy === 'role') {
        return sortOrder === 'asc' 
          ? a.role.localeCompare(b.role)
          : b.role.localeCompare(a.role);
      } else if (sortBy === 'branch') {
        return sortOrder === 'asc'
          ? (a.branch_name || '').localeCompare(b.branch_name || '')
          : (b.branch_name || '').localeCompare(a.branch_name || '');
      }
      return 0;
    });

    return filtered;
  };

  const renderEmployees = () => (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Employee Management</Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={onAddEmployeeOpen}
        >
          Add Employee
        </Button>
      </Flex>

      {/* Search and Sort Controls */}
      <Flex gap={4} mb={6}>
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg={inputBg}
            borderColor={borderColor}
          />
        </InputGroup>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          maxW="200px"
          bg={inputBg}
          borderColor={borderColor}
        >
          <option value="role">Sort by Role</option>
          <option value="branch">Sort by Branch</option>
        </Select>
        <Button
          leftIcon={sortOrder === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />}
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          variant="outline"
        >
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </Button>
      </Flex>

      <Card bg={cardBg} borderRadius="xl" boxShadow="lg">
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Role</Th>
                <Th>Branch</Th>
                {sortBy === 'role' && <Th>Performance</Th>}
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {getFilteredAndSortedEmployees().map((employee) => (
                <Tr key={employee.id}>
                  <Td>
                    <HStack>
                      <Avatar size="sm" name={employee.name} />
                      <Box>
                        <Text fontWeight="bold">{employee.name}</Text>
                        <Text fontSize="sm" color="gray.500">{employee.email}</Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td>
                    <Badge colorScheme={
                      employee.role === 'admin' ? 'purple' :
                      employee.role === 'sales' ? 'blue' :
                      employee.role === 'accounts' ? 'green' : 'orange'
                    }>
                      {(employee.role || 'N/A').toUpperCase()}
                    </Badge>
                  </Td>
                  <Td>{employee.branch_name || 'N/A'}</Td>
                  {sortBy === 'role' && (
                    <Td>
                      {employee.role === 'sales' ? (
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm">
                            {employee.total_customers || 0} customers
                          </Text>
                          <Text fontSize="sm" color="green.500">
                            ₹{(employee.total_revenue || 0).toLocaleString()}
                          </Text>
                        </VStack>
                      ) : (
                        <Text fontSize="sm" color="gray.500">N/A</Text>
                      )}
                    </Td>
                  )}
                  <Td>
                    <Badge colorScheme={(employee.status || 'active') === 'active' ? 'green' : 'red'}>
                      {(employee.status || 'active').toUpperCase()}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<FiEdit2 />}
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setEmployeeForm({
                            name: employee.name,
                            email: employee.email,
                            phone: employee.phone,
                            branch_id: employee.branch_id,
                            role: employee.role,
                            password: ''
                          });
                          setIsEditModalOpen(true);
                        }}
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      {/* View Employee Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent bg={cardBg} borderRadius="xl">
          <ModalHeader>Employee Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedEmployee && (
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Icon as={FiUser } />
                  <Text fontWeight="bold">{selectedEmployee.name}</Text>
                </HStack>
                <HStack>
                  <Icon as={FiMail} />
                  <Text>{selectedEmployee.email}</Text>
                </HStack>
                <HStack>
                  <Icon as={FiPhone} />
                  <Text>{selectedEmployee.phone}</Text>
                </HStack>
                <HStack>
                  <Icon as={FiMapPin} />
                  <Text>{selectedEmployee.branch_name || 'N/A'}</Text>
                </HStack>
                <HStack>
                  <Icon as={FiBriefcase} />
                  <Text>{(selectedEmployee.role || 'N/A').toUpperCase()}</Text>
                </HStack>
                <Divider />
                <Heading size="sm">Performance Metrics</Heading>
                <SimpleGrid columns={2} spacing={4}>
                  <Box p={4} bg={performanceMetricBg} borderRadius="md">
                    <Text fontSize="sm" color="gray.500">Total Customers</Text>
                    <Text fontSize="xl" fontWeight="bold">{selectedEmployee.total_customers || 0}</Text>
                  </Box>
                  <Box p={4} bg={performanceMetricBg} borderRadius="md">
                    <Text fontSize="sm" color="gray.500">Verified Customers</Text>
                    <Text fontSize="xl" fontWeight="bold">{selectedEmployee.verified_customers || 0}</Text>
                  </Box>
                  <Box p={4} bg={performanceMetricBg} borderRadius="md">
                    <Text fontSize="sm" color="gray.500">Total Revenue</Text>
                    <Text fontSize="xl" fontWeight="bold">₹{(selectedEmployee.total_revenue || 0).toLocaleString()}</Text>
                  </Box>
                  <Box p={4} bg={performanceMetricBg} borderRadius="md">
                    <Text fontSize="sm" color="gray.500">Current Month</Text>
                    <Text fontSize="xl" fontWeight="bold">{selectedEmployee.current_month_customers || 0} customers</Text>
                  </Box>
                </SimpleGrid>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bg={cardBg} borderRadius="xl">
          <ModalHeader>Edit Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                  placeholder="Enter employee name"
                  bg={inputBg}
                  borderColor={borderColor}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                  placeholder="Enter employee email"
                  bg={inputBg}
                  borderColor={borderColor}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input
                  value={employeeForm.phone}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                  placeholder="Enter employee phone"
                  bg={inputBg}
                  borderColor={borderColor}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Branch</FormLabel>
                <Select
                  value={employeeForm.branch_id}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, branch_id: e.target.value })}
                  bg={inputBg}
                  borderColor={borderColor}
                >
                  <option value="">Select branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select
                  value={employeeForm.role}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value })}
                  bg={inputBg}
                  borderColor={borderColor}
                >
                  <option value="">Select role</option>
                  <option value="sales">Sales</option>
                  <option value="accounts">Accounts</option>
                  <option value="rto">RTO</option>
                  <option value="admin">Admin</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>New Password (leave blank to keep current)</FormLabel>
                <Input
                  type="password"
                  value={employeeForm.password}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                  placeholder="Enter new password"
                  bg={inputBg}
                  borderColor={borderColor}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleUpdateEmployee}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Employee Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bg={cardBg} borderRadius="xl">
          <ModalHeader>Delete Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete {selectedEmployee?.name}? This action cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteEmployee}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MotionBox>
  );

  const renderNotifications = () => {
    return (
      <Box>
        <HStack justify="space-between" mb={4}>
          <Text fontSize="xl" fontWeight="bold">Notifications</Text>
          <Button leftIcon={<BellIcon />} colorScheme="blue" onClick={onOpen}>
            Send Notification
          </Button>
        </HStack>

        <VStack spacing={4} align="stretch">
          {notifications.map((notification) => (
            <Box
              key={notification.id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg={notification.is_read ? 'white' : 'blue.50'}
              _hover={{ shadow: 'md' }}
            >
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">{notification.title}</Text>
                  <Text color="gray.600">{notification.message}</Text>
                  <Text fontSize="sm" color="gray.500">
                    From: {notification.sender_name} • {new Date(notification.created_at).toLocaleString()}
                  </Text>
                </VStack>
                {!notification.is_read && (
                  <Badge colorScheme="blue">New</Badge>
                )}
              </HStack>
              {!notification.is_read && (
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  mt={2}
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as Read
                </Button>
              )}
            </Box>
          ))}
        </VStack>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Send Notification</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    placeholder="Enter notification title"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Enter notification message"
                    rows={4}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Send To</FormLabel>
                  <Select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value)}
                  >
                    <option value="all">All Employees</option>
                    <option value="role">By Role</option>
                    <option value="branch">By Branch</option>
                    <option value="role_in_branch">By Role in Branch</option>
                    <option value="employee">Specific Employee</option>
                  </Select>
                </FormControl>

                {targetType === 'role' && (
                  <FormControl isRequired>
                    <FormLabel>Select Role</FormLabel>
                    <Select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="">Select a role</option>
                      <option value="sales">Sales</option>
                      <option value="accounts">Accounts</option>
                      <option value="rto">RTO</option>
                    </Select>
                  </FormControl>
                )}

                {targetType === 'branch' && (
                  <FormControl isRequired>
                    <FormLabel>Select Branch</FormLabel>
                    <Select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                      <option value="">Select a branch</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {targetType === 'role_in_branch' && (
                  <>
                    <FormControl isRequired>
                      <FormLabel>Select Branch</FormLabel>
                      <Select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                      >
                        <option value="">Select a branch</option>
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Select Role</FormLabel>
                      <Select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      >
                        <option value="">Select a role</option>
                        <option value="sales">Sales</option>
                        <option value="accounts">Accounts</option>
                        <option value="rto">RTO</option>
                      </Select>
                    </FormControl>
                  </>
                )}

                {targetType === 'employee' && (
                  <FormControl isRequired>
                    <FormLabel>Select Employee</FormLabel>
                    <Select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                    >
                      <option value="">Select an employee</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} ({employee.role})
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <Button
                  colorScheme="blue"
                  width="full"
                  onClick={sendNotification}
                  isDisabled={!notificationTitle || !notificationMessage}
                >
                  Send Notification
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
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
                notifications.map(notification => (
                  <MenuItem 
                    key={notification.id} 
                    bg={notification.is_read ? cardBg : 'blue.50'} 
                    _hover={{ 
                      bg: hoverBg,
                      transform: 'translateX(5px)'
                    }}
                    transition="all 0.2s"
                  >
                    <VStack align="start" spacing={1} width="100%">
                      <Text fontWeight="bold" fontSize="sm">{notification.title}</Text>
                      <Text fontSize="sm" color="gray.600">{notification.message}</Text>
                      <Text fontSize="xs" color="gray.500">
                        From: {notification.sender_name} • {new Date(notification.created_at).toLocaleString()}
                      </Text>
                      {!notification.is_read && (
                        <Button
                          size="xs"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                        >
                          Mark as Read
                        </Button>
                      )}
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
        {activeTab === 'employees' && renderEmployees()}
        {activeTab === 'notifications' && renderNotifications()}
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
                isActive={activeTab === 'notifications'}
                justifyContent="start"
                _hover={{ bg: hoverBg }}
                onClick={() => { setActiveTab('notifications'); onMenuClose(); }}
              >
                Notifications
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
        <ModalContent>
          <ModalHeader>Add New Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleAddEmployee}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={employeeForm.name}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                    placeholder="Enter employee name"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                    placeholder="Enter employee email"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    value={employeeForm.phone}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                    placeholder="Enter employee phone"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Branch</FormLabel>
                  <Select
                    value={employeeForm.branch_id}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, branch_id: parseInt(e.target.value) })}
                  >
                    <option value="">Select a branch</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Role</FormLabel>
                  <Select
                    value={employeeForm.role}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value })}
                  >
                    <option value="">Select a role</option>
                    <option value="sales">Sales</option>
                    <option value="accounts">Accounts</option>
                    <option value="rto">RTO</option>
                    <option value="admin">Admin</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={employeeForm.password}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </FormControl>
                <Button type="submit" colorScheme="blue" width="full">
                  Add Employee
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Admin;