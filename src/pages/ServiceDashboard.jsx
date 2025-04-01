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
  // Add more dummy data as needed
];

const ServiceDashboard = () => {
    const [bookings, setBookings] = useState(dummyBookings);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const { isOpen: isStatusModalOpen, onOpen: onStatusModalOpen, onClose } = useDisclosure();
    const { isOpen: isJobCardModalOpen, onOpen: onJobCardModalOpen, onClose: onJobCardModalClose } = useDisclosure();
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');
    const [currentKilometer, setCurrentKilometer] = useState('');
    const [newRemark, setNewRemark] = useState({ heading: '', description: '' });
    const [newTask, setNewTask] = useState('');
    const [remarks, setRemarks] = useState([]);
    const [tasks, setTasks] = useState([]);
    const isMobile = useBreakpointValue({ base: true, md: false });
    const toast = useToast();

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

    return (
        <Box p={4}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
                Service Dashboard
            </Text>
            
            <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
                {bookings.map((booking) => (
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
                                    {!booking.assigned_to && (
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