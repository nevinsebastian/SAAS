import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Grid,
  GridItem,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Select,
  Textarea,
  VStack,
  Badge,
  useDisclosure,
  Card,
  CardBody,
  HStack,
  IconButton,
  Input,
  List,
  ListItem,
  ListIcon,
  Checkbox,
  Divider,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Icon,
  Flex,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { 
  AddIcon, 
  CheckIcon, 
  DeleteIcon, 
  EditIcon,
  WarningIcon,
  InfoIcon,
  TimeIcon,
  ViewIcon,
  SearchIcon,
  SettingsIcon,
  ChevronDownIcon,
  BellIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';

// Dummy data
const dummyBookings = [
  {
    id: 1,
    customer_name: 'John Doe',
    customer_phone: '+91 98765 43210',
    vehicle: 'Honda City',
    booking_date: '2024-04-02T10:00:00',
    status: 'pending',
    total_kilometer: 5000,
    service_type: 'General Service',
    notes: 'Regular maintenance required',
    assigned_to: null,
    current_kilometer: null,
    remarks: [],
    job_card: {
      tasks: [
        { id: 1, description: 'Oil Change', completed: false },
        { id: 2, description: 'Brake Check', completed: false },
        { id: 3, description: 'Tire Rotation', completed: false },
      ]
    }
  },
  {
    id: 2,
    customer_name: 'Jane Smith',
    customer_phone: '+91 98765 43211',
    vehicle: 'Maruti Swift',
    booking_date: '2024-04-02T11:00:00',
    status: 'in_progress',
    total_kilometer: 3000,
    service_type: 'Oil Change',
    notes: 'Oil change and filter replacement',
    assigned_to: 'Service Employee 1',
    current_kilometer: 3200,
    remarks: [
      { id: 1, heading: 'Initial Inspection', description: 'Vehicle condition checked' }
    ],
    job_card: {
      tasks: [
        { id: 1, description: 'Oil Filter Change', completed: true },
        { id: 2, description: 'Oil Level Check', completed: true },
      ]
    }
  },
  {
    id: 3,
    customer_name: 'Rajesh Kumar',
    customer_phone: '+91 98765 43212',
    vehicle: 'BMW X5',
    booking_date: '2024-04-02T12:00:00',
    status: 'pending',
    total_kilometer: 15000,
    service_type: 'Repaint',
    notes: 'Full body repaint required due to scratches',
    assigned_to: null,
    current_kilometer: null,
    remarks: [],
    job_card: {
      tasks: [
        { id: 1, description: 'Body Inspection', completed: false },
        { id: 2, description: 'Paint Matching', completed: false },
        { id: 3, description: 'Surface Preparation', completed: false },
      ]
    }
  },
  {
    id: 4,
    customer_name: 'Priya Sharma',
    customer_phone: '+91 98765 43213',
    vehicle: 'Mercedes-Benz C-Class',
    booking_date: '2024-04-02T13:00:00',
    status: 'in_progress',
    total_kilometer: 8000,
    service_type: 'Maintenance',
    notes: 'Regular maintenance and brake pad replacement',
    assigned_to: 'Service Employee 2',
    current_kilometer: 8200,
    remarks: [
      { id: 1, heading: 'Brake Inspection', description: 'Brake pads need replacement' }
    ],
    job_card: {
      tasks: [
        { id: 1, description: 'Brake Pad Replacement', completed: true },
        { id: 2, description: 'Brake Fluid Check', completed: true },
        { id: 3, description: 'Wheel Alignment', completed: false },
      ]
    }
  },
  {
    id: 5,
    customer_name: 'Amit Patel',
    customer_phone: '+91 98765 43214',
    vehicle: 'Toyota Fortuner',
    booking_date: '2024-04-02T14:00:00',
    status: 'completed',
    total_kilometer: 25000,
    service_type: 'General Service',
    notes: 'Complete vehicle service and inspection',
    assigned_to: 'Service Employee 1',
    current_kilometer: 25100,
    remarks: [
      { id: 1, heading: 'Service Complete', description: 'All checks performed and issues resolved' }
    ],
    job_card: {
      tasks: [
        { id: 1, description: 'Engine Oil Change', completed: true },
        { id: 2, description: 'Air Filter Replacement', completed: true },
        { id: 3, description: 'Battery Check', completed: true },
        { id: 4, description: 'Tire Pressure Check', completed: true },
      ]
    }
  },
  {
    id: 6,
    customer_name: 'Neha Gupta',
    customer_phone: '+91 98765 43215',
    vehicle: 'Hyundai Verna',
    booking_date: '2024-04-02T15:00:00',
    status: 'pending',
    total_kilometer: 12000,
    service_type: 'Oil Change',
    notes: 'Synthetic oil change required',
    assigned_to: null,
    current_kilometer: null,
    remarks: [],
    job_card: {
      tasks: [
        { id: 1, description: 'Oil Drain', completed: false },
        { id: 2, description: 'Filter Replacement', completed: false },
        { id: 3, description: 'Oil Level Check', completed: false },
      ]
    }
  },
  {
    id: 7,
    customer_name: 'Vikram Singh',
    customer_phone: '+91 98765 43216',
    vehicle: 'Audi Q5',
    booking_date: '2024-04-02T16:00:00',
    status: 'in_progress',
    total_kilometer: 18000,
    service_type: 'Repaint',
    notes: 'Front bumper repaint due to accident',
    assigned_to: 'Service Employee 3',
    current_kilometer: null,
    remarks: [
      { id: 1, heading: 'Damage Assessment', description: 'Front bumper damage assessed' }
    ],
    job_card: {
      tasks: [
        { id: 1, description: 'Bumper Removal', completed: true },
        { id: 2, description: 'Surface Preparation', completed: true },
        { id: 3, description: 'Paint Application', completed: false },
        { id: 4, description: 'Clear Coat', completed: false },
      ]
    }
  },
  {
    id: 8,
    customer_name: 'Pooja Reddy',
    customer_phone: '+91 98765 43217',
    vehicle: 'Volkswagen Polo',
    booking_date: '2024-04-02T17:00:00',
    status: 'completed',
    total_kilometer: 9000,
    service_type: 'Maintenance',
    notes: 'Regular maintenance and AC service',
    assigned_to: 'Service Employee 2',
    current_kilometer: 9100,
    remarks: [
      { id: 1, heading: 'AC Service Complete', description: 'AC system cleaned and recharged' }
    ],
    job_card: {
      tasks: [
        { id: 1, description: 'AC Filter Cleaning', completed: true },
        { id: 2, description: 'AC Gas Recharge', completed: true },
        { id: 3, description: 'Belt Inspection', completed: true },
      ]
    }
  }
];

const ServiceDashboard = () => {
    const [bookings, setBookings] = useState(dummyBookings);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const { isOpen: isStatusModalOpen, onOpen: onStatusModalOpen, onClose } = useDisclosure();
    const { isOpen: isJobCardModalOpen, onOpen: onJobCardModalOpen, onClose: onJobCardModalClose } = useDisclosure();
    const { isOpen: isFilterModalOpen, onOpen: onFilterModalOpen, onClose: onFilterModalClose } = useDisclosure();
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');
    const [currentKilometer, setCurrentKilometer] = useState('');
    const [newRemark, setNewRemark] = useState({ heading: '', description: '' });
    const [newTask, setNewTask] = useState('');
    const [remarks, setRemarks] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        serviceType: '',
        vehicleType: '',
        status: 'pending'
    });
    const isMobile = useBreakpointValue({ base: true, md: false });
    const toast = useToast();
    const [notifications] = useState([
        { id: 1, message: 'New service request from John Doe', time: '5 min ago' },
        { id: 2, message: 'Service #123 completed', time: '1 hour ago' },
    ]);
    const { isOpen: isNotificationsOpen, onOpen: onNotificationsOpen, onClose: onNotificationsClose } = useDisclosure();
    const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure();
    const [searchType, setSearchType] = useState('all');
    const [searchValue, setSearchValue] = useState('');

    // Add color mode values
    const headerBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
    const headerBorderColor = useColorModeValue('gray.200', 'gray.700');
    const bottomNavBg = useColorModeValue('white', 'gray.800');
    const bottomNavBorderColor = useColorModeValue('gray.200', 'gray.700');
    const searchBg = useColorModeValue('white', 'gray.700');
    const searchBorderColor = useColorModeValue('gray.200', 'gray.600');

    // Filter bookings based on current filters and search query
    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = 
            booking.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.service_type.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesServiceType = !filters.serviceType || booking.service_type === filters.serviceType;
        const matchesVehicleType = !filters.vehicleType || booking.vehicle.includes(filters.vehicleType);
        const matchesStatus = !filters.status || booking.status === filters.status;
        const matchesAssigned = activeTab === 1 ? booking.assigned_to === 'Service Employee 1' : true;

        return matchesSearch && matchesServiceType && matchesVehicleType && matchesStatus && matchesAssigned;
    });

    const handleStatusUpdate = async () => {
        try {
            // Update the booking in the local state
            setBookings(bookings.map(booking => 
                booking.id === selectedBooking.id 
                    ? { ...booking, status, current_kilometer: currentKilometer, remarks: [...remarks] }
                    : booking
            ));
            onClose();
            toast({
                title: 'Status Updated',
                description: 'Service status has been updated successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error updating status:', error);
            toast({
                title: 'Error',
                description: 'Failed to update service status',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleAssignService = (bookingId) => {
        setBookings(bookings.map(booking => 
            booking.id === bookingId 
                ? { ...booking, assigned_to: 'Service Employee 1', status: 'in_progress' }
                : booking
        ));
        toast({
            title: 'Service Assigned',
            description: 'You have been assigned to this service',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    const handleAddRemark = () => {
        if (newRemark.heading && newRemark.description) {
            setRemarks([...remarks, { id: remarks.length + 1, ...newRemark }]);
            setNewRemark({ heading: '', description: '' });
        }
    };

    const handleAddTask = () => {
        if (newTask) {
            setTasks([...tasks, { id: tasks.length + 1, description: newTask, completed: false }]);
            setNewTask('');
        }
    };

    const handleTaskToggle = (taskId) => {
        setTasks(tasks.map(task => 
            task.id === taskId 
                ? { ...task, completed: !task.completed }
                : task
        ));
    };

    const handleCreateJobCard = () => {
        setBookings(bookings.map(booking => 
            booking.id === selectedBooking.id 
                ? { ...booking, job_card: { tasks } }
                : booking
        ));
        onJobCardModalClose();
        toast({
            title: 'Job Card Created',
            description: 'Service job card has been created successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'yellow';
            case 'in_progress':
                return 'blue';
            case 'completed':
                return 'green';
            case 'cancelled':
                return 'red';
            default:
                return 'gray';
        }
    };

    const renderHeader = () => (
        <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            zIndex={1000}
            bg={headerBg}
            backdropFilter="blur(10px)"
            borderBottom="1px solid"
            borderColor={headerBorderColor}
            px={4}
            py={3}
        >
            <Flex justify="space-between" align="center">
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                    Service
                </Text>
                <HStack spacing={4}>
                    <Menu isOpen={isNotificationsOpen} onOpen={onNotificationsOpen} onClose={onNotificationsClose}>
                        <MenuButton
                            as={IconButton}
                            icon={<BellIcon />}
                            variant="ghost"
                            aria-label="Notifications"
                            position="relative"
                        >
                            {notifications.length > 0 && (
                                <Badge
                                    position="absolute"
                                    top="-1"
                                    right="-1"
                                    colorScheme="red"
                                    borderRadius="full"
                                >
                                    {notifications.length}
                                </Badge>
                            )}
                        </MenuButton>
                        <MenuList>
                            {notifications.map((notification) => (
                                <MenuItem key={notification.id}>
                                    <VStack align="start" spacing={1}>
                                        <Text>{notification.message}</Text>
                                        <Text fontSize="xs" color="gray.500">{notification.time}</Text>
                                    </VStack>
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu isOpen={isProfileOpen} onOpen={onProfileOpen} onClose={onProfileClose}>
                        <MenuButton
                            as={Avatar}
                            name="John Doe"
                            size="sm"
                            cursor="pointer"
                        />
                        <MenuList>
                            <MenuItem icon={<SettingsIcon />}>Settings</MenuItem>
                            <MenuItem icon={<ViewIcon />}>Profile</MenuItem>
                            <Divider />
                            <MenuItem color="red.500" icon={<DeleteIcon />}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </Flex>
        </Box>
    );

    const renderSearchBar = () => (
        <Box
            position="fixed"
            top="72px"
            left={0}
            right={0}
            zIndex={999}
            bg={searchBg}
            borderBottom="1px solid"
            borderColor={searchBorderColor}
            px={4}
            py={3}
            shadow="sm"
        >
            <HStack spacing={2}>
                <Select
                    size="sm"
                    width="150px"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                >
                    <option value="all">All Fields</option>
                    <option value="vehicle">Vehicle</option>
                    <option value="registration">Registration</option>
                    <option value="customer">Customer Name</option>
                </Select>
                <InputGroup size="sm">
                    <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                        placeholder={`Search by ${searchType === 'all' ? 'any field' : searchType}...`}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <IconButton
                        icon={<SettingsIcon />}
                        aria-label="Filter"
                        onClick={onFilterModalOpen}
                        variant="ghost"
                        size="sm"
                        ml={2}
                    />
                </InputGroup>
            </HStack>
        </Box>
    );

    const renderFilterModal = () => (
        <Modal isOpen={isFilterModalOpen} onClose={onFilterModalClose} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Filter Options</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        <Box>
                            <Text mb={2}>Service Type</Text>
                            <Select
                                value={filters.serviceType}
                                onChange={(e) => setFilters({ ...filters, serviceType: e.target.value })}
                            >
                                <option value="">All Services</option>
                                <option value="General Service">General Service</option>
                                <option value="Oil Change">Oil Change</option>
                                <option value="Repaint">Repaint</option>
                                <option value="Maintenance">Maintenance</option>
                            </Select>
                        </Box>
                        <Box>
                            <Text mb={2}>Vehicle Type</Text>
                            <Select
                                value={filters.vehicleType}
                                onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
                            >
                                <option value="">All Vehicles</option>
                                <option value="Honda">Honda</option>
                                <option value="Maruti">Maruti</option>
                                <option value="BMW">BMW</option>
                                <option value="Benz">Benz</option>
                            </Select>
                        </Box>
                        {activeTab === 1 && (
                            <Box>
                                <Text mb={2}>Status</Text>
                                <Select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </Select>
                            </Box>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onFilterModalClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="blue" onClick={onFilterModalClose}>
                        Apply Filters
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );

    const renderBottomNav = () => (
        <Box
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            bg={bottomNavBg}
            borderTop="1px solid"
            borderColor={bottomNavBorderColor}
            px={4}
            py={2}
            zIndex={1000}
        >
            <Tabs
                variant="soft-rounded"
                colorScheme="blue"
                onChange={(index) => setActiveTab(index)}
                defaultIndex={0}
            >
                <TabList width="100%" justifyContent="space-around">
                    <Tab>All</Tab>
                    <Tab>My</Tab>
                </TabList>
            </Tabs>
        </Box>
    );

    return (
        <Box>
            {renderHeader()}
            {renderSearchBar()}
            {renderFilterModal()}
            
            <Box
                pt={32}
                pb={20}
                px={4}
            >
                <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
                    {filteredBookings.map((booking) => (
                        <GridItem key={booking.id}>
                            <Card 
                                cursor="pointer"
                                onClick={() => {
                                    setSelectedBooking(booking);
                                    setStatus(booking.status);
                                    setCurrentKilometer(booking.current_kilometer || '');
                                    setRemarks(booking.remarks || []);
                                    setTasks(booking.job_card?.tasks || []);
                                    onStatusModalOpen();
                                }}
                                _hover={{ shadow: 'lg' }}
                            >
                                <CardBody>
                                    <VStack align="start" spacing={2}>
                                        <HStack justify="space-between" width="100%">
                                            <Text fontWeight="bold">
                                                {booking.customer_name}
                                            </Text>
                                            <Badge colorScheme={getStatusColor(booking.status)}>
                                                {booking.status}
                                            </Badge>
                                        </HStack>
                                        <Text color="gray.500">
                                            {booking.vehicle}
                                        </Text>
                                        <Text fontSize="sm">
                                            {format(new Date(booking.booking_date), 'PPp')}
                                        </Text>
                                        <Text fontSize="sm">
                                            Service Type: {booking.service_type}
                                        </Text>
                                        {!booking.assigned_to && activeTab === 0 && (
                                            <Button
                                                size="sm"
                                                colorScheme="blue"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAssignService(booking.id);
                                                }}
                                            >
                                                Take Up Service
                                            </Button>
                                        )}
                                    </VStack>
                                </CardBody>
                            </Card>
                        </GridItem>
                    ))}
                </Grid>
            </Box>

            {renderBottomNav()}

            <Modal 
                isOpen={isStatusModalOpen} 
                onClose={onClose}
                size={isMobile ? "full" : "xl"}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Service Details
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={6} align="stretch">
                            {/* Service Information */}
                            <Box>
                                <Text fontWeight="bold" mb={2}>Service Information</Text>
                                <VStack align="start" spacing={2}>
                                    <Text>Customer: {selectedBooking?.customer_name}</Text>
                                    <Text>Vehicle: {selectedBooking?.vehicle}</Text>
                                    <Text>Service Type: {selectedBooking?.service_type}</Text>
                                    <Text>Total Kilometer: {selectedBooking?.total_kilometer}</Text>
                                </VStack>
                            </Box>

                            <Divider />

                            {/* Current Status */}
                            <Box>
                                <Text fontWeight="bold" mb={2}>Current Status</Text>
                                <VStack spacing={4}>
                                    <Select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </Select>
                                    <NumberInput
                                        value={currentKilometer}
                                        onChange={(value) => setCurrentKilometer(value)}
                                        min={0}
                                        placeholder="Current Kilometer"
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </VStack>
                            </Box>

                            <Divider />

                            {/* Remarks */}
                            <Box>
                                <Text fontWeight="bold" mb={2}>Remarks</Text>
                                <VStack spacing={4}>
                                    <Input
                                        placeholder="Remark Heading"
                                        value={newRemark.heading}
                                        onChange={(e) => setNewRemark({ ...newRemark, heading: e.target.value })}
                                    />
                                    <Textarea
                                        placeholder="Remark Description"
                                        value={newRemark.description}
                                        onChange={(e) => setNewRemark({ ...newRemark, description: e.target.value })}
                                    />
                                    <Button
                                        leftIcon={<AddIcon />}
                                        colorScheme="blue"
                                        onClick={handleAddRemark}
                                        isDisabled={!newRemark.heading || !newRemark.description}
                                    >
                                        Add Remark
                                    </Button>
                                    <List spacing={2} width="100%">
                                        {remarks.map((remark) => (
                                            <ListItem key={remark.id}>
                                                <HStack>
                                                    <Icon as={InfoIcon} color="blue.500" />
                                                    <Box>
                                                        <Text fontWeight="medium">{remark.heading}</Text>
                                                        <Text fontSize="sm" color="gray.500">{remark.description}</Text>
                                                    </Box>
                                                </HStack>
                                            </ListItem>
                                        ))}
                                    </List>
                                </VStack>
                            </Box>

                            <Divider />

                            {/* Job Card */}
                            <Box>
                                <HStack justify="space-between">
                                    <Text fontWeight="bold">Job Card</Text>
                                    <Button
                                        size="sm"
                                        colorScheme="green"
                                        onClick={onJobCardModalOpen}
                                    >
                                        Create/Update Job Card
                                    </Button>
                                </HStack>
                                <List spacing={2} mt={2}>
                                    {selectedBooking?.job_card?.tasks.map((task) => (
                                        <ListItem key={task.id}>
                                            <HStack>
                                                <Checkbox
                                                    isChecked={task.completed}
                                                    onChange={() => handleTaskToggle(task.id)}
                                                    colorScheme="green"
                                                />
                                                <Text textDecoration={task.completed ? 'line-through' : 'none'}>
                                                    {task.description}
                                                </Text>
                                            </HStack>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" onClick={handleStatusUpdate}>
                            Update Status
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Job Card Modal */}
            <Modal
                isOpen={isJobCardModalOpen}
                onClose={onJobCardModalClose}
                size={isMobile ? "full" : "md"}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Job Card</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <Input
                                placeholder="Add new task"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                            />
                            <Button
                                leftIcon={<AddIcon />}
                                colorScheme="blue"
                                onClick={handleAddTask}
                                isDisabled={!newTask}
                            >
                                Add Task
                            </Button>
                            <List spacing={2} width="100%">
                                {tasks.map((task) => (
                                    <ListItem key={task.id}>
                                        <HStack>
                                            <Icon as={WarningIcon} color="yellow.500" />
                                            <Text>{task.description}</Text>
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="sm"
                                                colorScheme="red"
                                                variant="ghost"
                                                onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                                            />
                                        </HStack>
                                    </ListItem>
                                ))}
                            </List>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onJobCardModalClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="green" onClick={handleCreateJobCard}>
                            Create Job Card
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ServiceDashboard; 