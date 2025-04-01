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
import serviceData from '../data/serviceData.json';

const ServiceDashboard = () => {
    const [bookings, setBookings] = useState(serviceData.bookings);
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
    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.700', 'gray.200');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const hoverBg = useColorModeValue('gray.100', 'gray.700');
    const accentGradient = useColorModeValue(
        'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)'
    );

    // Filter bookings based on current filters and search query
    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = searchType === 'all' 
            ? (booking.customer_name.toLowerCase().includes(searchValue.toLowerCase()) ||
               booking.vehicle.toLowerCase().includes(searchValue.toLowerCase()) ||
               booking.vehicle_number.toLowerCase().includes(searchValue.toLowerCase()))
            : searchType === 'vehicle'
            ? booking.vehicle.toLowerCase().includes(searchValue.toLowerCase())
            : searchType === 'registration'
            ? booking.vehicle_number.toLowerCase().includes(searchValue.toLowerCase())
            : booking.customer_name.toLowerCase().includes(searchValue.toLowerCase());

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
        <Flex 
            justify="space-between" 
            align="center" 
            bg={headerBg}
            backdropFilter="blur(10px)"
            borderBottom="1px solid"
            borderColor={headerBorderColor}
            px={4}
            py={3}
            position="fixed"
            top={0}
            left={0}
            right={0}
            zIndex={1000}
            height="60px"
        >
            <HStack spacing={3}>
                <Text 
                    fontSize={{ base: "xl", md: "2xl" }} 
                    fontWeight="bold" 
                    bgGradient={accentGradient}
                    bgClip="text"
                >
                    Service
                </Text>
            </HStack>
            <HStack spacing={2}>
                <Menu isOpen={isNotificationsOpen} onOpen={onNotificationsOpen} onClose={onNotificationsClose}>
                    <MenuButton
                        as={IconButton}
                        icon={<BellIcon />}
                        variant="ghost"
                        aria-label="Notifications"
                        position="relative"
                        size={{ base: "sm", md: "md" }}
                        _hover={{ 
                            bg: 'whiteAlpha.200',
                            transform: 'scale(1.1)'
                        }}
                        transition="all 0.2s"
                    >
                        {notifications.length > 0 && (
                            <Badge 
                                colorScheme="red" 
                                borderRadius="full" 
                                position="absolute" 
                                top="-1" 
                                right="-1"
                                boxShadow="lg"
                            >
                                {notifications.length}
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
                        {notifications.map((notification) => (
                            <MenuItem
                                key={notification.id}
                                bg={notification.read_at ? cardBg : 'blue.50'}
                                _hover={{ 
                                    bg: hoverBg,
                                    transform: 'translateX(5px)'
                                }}
                                transition="all 0.2s"
                            >
                                <VStack align="start" spacing={1} width="100%">
                                    <Text fontWeight="bold" fontSize="sm">{notification.message}</Text>
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
                        size={{ base: "sm", md: "md" }}
                        cursor="pointer"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bg="blue.500"
                        color="white"
                        _hover={{ 
                            transform: 'scale(1.1)',
                            boxShadow: 'lg'
                        }}
                        transition="all 0.2s"
                    >
                        J
                    </MenuButton>
                    <MenuList>
                        <MenuItem color="red.500" icon={<DeleteIcon />}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </HStack>
        </Flex>
    );

    const renderSearchBar = () => (
        <Box
            position="sticky"
            top="10px"
            left={0}
            right={0}
            zIndex={999}
            bg={searchBg}
            borderBottom="1px solid"
            borderColor={searchBorderColor}
            px={4}
            py={3}
            shadow="sm"
            backdropFilter="blur(10px)"
        >
            <VStack spacing={3} width="100%">
                <HStack spacing={2} width="100%">
                    <Select
                        size="sm"
                        width={{ base: "120px", md: "150px" }}
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        bg={cardBg}
                        borderColor={borderColor}
                        _hover={{ borderColor: 'blue.300' }}
                        _focus={{ borderColor: 'blue.500' }}
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
                            bg={cardBg}
                            borderColor={borderColor}
                            _hover={{ borderColor: 'blue.300' }}
                            _focus={{ borderColor: 'blue.500' }}
                        />
                        <IconButton
                            icon={<SettingsIcon />}
                            aria-label="Filter"
                            onClick={onFilterModalOpen}
                            variant="ghost"
                            size="sm"
                            ml={2}
                            _hover={{ 
                                bg: 'blue.50',
                                transform: 'scale(1.1)'
                            }}
                            transition="all 0.2s"
                        />
                    </InputGroup>
                </HStack>
            </VStack>
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
                                {serviceData.service_types.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </Select>
                        </Box>
                        <Box>
                            <Text mb={2}>Vehicle Type</Text>
                            <Select
                                value={filters.vehicleType}
                                onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
                            >
                                <option value="">All Vehicles</option>
                                {serviceData.vehicle_brands.map((brand) => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </Select>
                        </Box>
                        {activeTab === 1 && (
                            <Box>
                                <Text mb={2}>Status</Text>
                                <Select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                >
                                    {serviceData.status_types.map((status) => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
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
        <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
            {renderHeader()}
            
            <Box
                pt="60px"
                pb="60px"
                px={4}
                maxW="100%"
                overflowX="hidden"
            >
                {renderSearchBar()}
                {renderFilterModal()}
                
                <Box
                    mt={4}
                    mb={8}
                >
                    <Grid 
                        templateColumns={{ 
                            base: "repeat(1, 1fr)", 
                            md: "repeat(2, 1fr)", 
                            lg: "repeat(3, 1fr)" 
                        }} 
                        gap={4}
                        px={{ base: 0, md: 4 }}
                    >
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
                                    transition="all 0.2s"
                                >
                                    <CardBody>
                                        <VStack align="start" spacing={2}>
                                            <HStack justify="space-between" width="100%">
                                                <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                                                    {booking.customer_name}
                                                </Text>
                                                <Badge 
                                                    colorScheme={getStatusColor(booking.status)}
                                                    fontSize={{ base: "xs", md: "sm" }}
                                                >
                                                    {booking.status}
                                                </Badge>
                                            </HStack>
                                            <Text color="gray.500" fontSize={{ base: "sm", md: "md" }}>
                                                {booking.vehicle}
                                            </Text>
                                            <Text fontSize={{ base: "xs", md: "sm" }}>
                                                {format(new Date(booking.booking_date), 'PPp')}
                                            </Text>
                                            <Text fontSize={{ base: "xs", md: "sm" }}>
                                                Service Type: {booking.service_type}
                                            </Text>
                                            {!booking.assigned_to && activeTab === 0 && (
                                                <Button
                                                    size={{ base: "xs", md: "sm" }}
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