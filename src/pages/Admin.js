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
} from '@chakra-ui/react';
import { HamburgerIcon, BellIcon, ArrowBackIcon, DownloadIcon, SearchIcon, FilterIcon, CheckIcon, TimeIcon, ChevronRightIcon, ChevronLeftIcon, StarIcon, InfoIcon, WarningIcon, CheckCircleIcon, CloseIcon, ChevronUpIcon, ChevronDownIcon, ExternalLinkIcon, ViewIcon, AttachmentIcon, SettingsIcon, RepeatIcon, AddIcon } from '@chakra-ui/icons';
import { FiPlus, FiEdit, FiUsers, FiPieChart, FiBriefcase, FiLogOut, FiDownload, FiBell, FiImage, FiBarChart, FiMenu, FiTrendingUp, FiDollarSign, FiUserCheck, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
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

  // Enhanced Dummy Data
  const dummyData = {
    bookings: [
      { id: 1, customer: "John Doe", vehicle: "Honda City", status: "Booking", date: "2025-02-20", expectedDelivery: "2025-03-01", executive: "Alice", amount: 15000 },
      { id: 2, customer: "Jane Smith", vehicle: "Toyota Corolla", status: "Delivery", date: "2025-02-22", expectedDelivery: "2025-02-28", executive: "Bob", amount: 18000 },
      { id: 3, customer: "Mike Johnson", vehicle: "Hyundai Creta", status: "Completed", date: "2025-02-15", expectedDelivery: "2025-02-25", executive: "Charlie", amount: 20000 },
      { id: 4, customer: "Sarah Williams", vehicle: "Maruti Swift", status: "RTO", date: "2025-02-18", expectedDelivery: "2025-03-05", executive: "Alice", amount: 12000 },
    ],
    salesExecutives: [
      { id: 1, name: "Alice", bookings: 25, pending: 5, conversions: 20, rating: 4.8, branch: "Downtown" },
      { id: 2, name: "Bob", bookings: 18, pending: 3, conversions: 15, rating: 4.5, branch: "Uptown" },
      { id: 3, name: "Charlie", bookings: 15, pending: 2, conversions: 13, rating: 4.7, branch: "Downtown" },
    ],
    financial: {
      totalRevenue: 2500000,
      pendingPayments: 350000,
      loans: 1200000,
      taxes: 250000,
      approvalsPending: [
        { id: 1, customer: "John Doe", loan: 10000, tax: 1500, total: 15000 },
        { id: 2, customer: "Sarah Williams", loan: 8000, tax: 1200, total: 12000 },
      ]
    },
    rtoTasks: [
      { id: 1, vehicle: "Honda City", status: "Pending", customer: "John Doe", days: 5 },
      { id: 2, vehicle: "Toyota Corolla", status: "Completed", customer: "Jane Smith", days: 3 },
      { id: 3, vehicle: "Maruti Swift", status: "In Progress", customer: "Sarah Williams", days: 2 },
    ],
    feedback: [
      { id: 1, customer: "John Doe", rating: 5, comment: "Great service!", aspect: "Sales" },
      { id: 2, customer: "Jane Smith", rating: 4, comment: "Good experience", aspect: "Delivery" },
      { id: 3, customer: "Mike Johnson", rating: 5, comment: "Excellent support", aspect: "Service" },
    ],
    serviceBookings: [
      { id: 1, customer: "John Doe", status: "Pending", date: "2025-03-01", type: "Regular Maintenance" },
      { id: 2, customer: "Mike Johnson", status: "In Progress", date: "2025-02-28", type: "Repair" },
    ],
    notifications: [
      { id: 1, message: "Booking confirmed for John Doe", time: "2025-02-20 10:00" },
      { id: 2, message: "Delivery scheduled for Jane Smith", time: "2025-02-22 14:30" },
    ],
    deliveries: [
      { id: 1, vehicle: "Toyota Corolla", customer: "Jane Smith", status: "On Time", expected: "2025-02-28", actual: "2025-02-27", image: "url1" },
      { id: 2, vehicle: "Hyundai Creta", customer: "Mike Johnson", status: "Delayed", expected: "2025-02-25", actual: "2025-02-27", image: "url2" },
    ],
    employees: [
      { id: 1, name: "Alice Smith", role: "Sales", branch: "Downtown", status: "Active", performance: 92 },
      { id: 2, name: "Bob Johnson", role: "RTO", branch: "Uptown", status: "Active", performance: 85 },
      { id: 3, name: "Charlie Brown", role: "Accounts", branch: "Downtown", status: "Active", performance: 88 },
    ]
  };

  const [dashboardData] = useState({
    totalBookings: dummyData.bookings.length,
    pendingDeliveries: dummyData.bookings.filter(b => b.status !== "Completed").length,
    rtoPending: dummyData.rtoTasks.filter(t => t.status === "Pending").length,
    totalRevenue: dummyData.financial.totalRevenue,
    customerSatisfaction: dummyData.feedback.reduce((sum, f) => sum + f.rating, 0) / dummyData.feedback.length,
    onTimeDeliveries: dummyData.deliveries.filter(d => d.status === "On Time").length,
    serviceCompletionRate: (dummyData.serviceBookings.filter(s => s.status === "Completed").length / dummyData.serviceBookings.length) * 100 || 0
  });

  const salesChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [{
      label: 'Sales Revenue',
      data: [1200000, 1500000, 1800000, 2500000],
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 2
    }]
  };

  const vehiclePieData = {
    labels: dummyData.bookings.map(b => b.vehicle),
    datasets: [{
      data: dummyData.bookings.map(() => Math.floor(Math.random() * 10) + 1),
      backgroundColor: ['#6366f1', '#14b8a6', '#f97316', '#ef4444']
    }]
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderDashboard = () => (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
              <StatNumber fontSize="2xl">{dashboardData.totalBookings}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
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
              <StatNumber fontSize="2xl">{dashboardData.pendingDeliveries}</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                12.5%
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
              <StatNumber fontSize="2xl">{dashboardData.rtoPending}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                8.2%
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
              <StatNumber fontSize="2xl">${dashboardData.totalRevenue.toLocaleString()}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                15.8%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mt={6}>
        <Card
          bg={cardBg}
          borderRadius="xl"
          boxShadow="lg"
          height="400px"
        >
          <CardHeader>
            <Heading size="md">Sales Trend</Heading>
          </CardHeader>
          <CardBody>
            <Line data={salesChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </CardBody>
        </Card>
        <Card
          bg={cardBg}
          borderRadius="xl"
          boxShadow="lg"
          height="400px"
        >
          <CardHeader>
            <Heading size="md">Top Vehicles</Heading>
          </CardHeader>
          <CardBody>
            <Pie data={vehiclePieData} options={{ responsive: true, maintainAspectRatio: false }} />
          </CardBody>
        </Card>
      </SimpleGrid>

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
              {dummyData.bookings.slice(0, 5).map((booking) => (
                <Flex key={booking.id} justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="bold">{booking.customer}</Text>
                    <Text fontSize="sm" color="gray.500">{booking.vehicle}</Text>
                  </Box>
                  <Badge colorScheme={booking.status === "Completed" ? "green" : "orange"}>
                    {booking.status}
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
              {dummyData.salesExecutives.map((executive) => (
                <Flex key={executive.id} justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="bold">{executive.name}</Text>
                    <Text fontSize="sm" color="gray.500">{executive.branch}</Text>
                  </Box>
                  <HStack>
                    <Badge colorScheme="green">{executive.rating}/5</Badge>
                    <Text fontSize="sm" color="gray.500">{executive.bookings} bookings</Text>
                  </HStack>
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
            <Heading size="md">Pending Approvals</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              {dummyData.financial.approvalsPending.map((approval) => (
                <Flex key={approval.id} justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="bold">{approval.customer}</Text>
                    <Text fontSize="sm" color="gray.500">Total: ${approval.total}</Text>
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