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
} from '@chakra-ui/react';
import { format } from 'date-fns';

const ServiceDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');
    const isMobile = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/service/bookings');
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            await fetch(`/api/service/bookings/${selectedBooking.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status, notes }),
            });
            onClose();
            fetchBookings();
        } catch (error) {
            console.error('Error updating status:', error);
        }
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
                                setNotes(booking.notes || '');
                                onOpen();
                            }}
                            _hover={{ shadow: 'lg' }}
                        >
                            <CardBody>
                                <VStack align="start" spacing={2}>
                                    <Text fontWeight="bold">
                                        {booking.customer_name}
                                    </Text>
                                    <Text color="gray.500">
                                        {booking.customer_phone}
                                    </Text>
                                    <Text fontSize="sm">
                                        {format(new Date(booking.booking_date), 'PPp')}
                                    </Text>
                                    <Badge colorScheme={getStatusColor(booking.status)}>
                                        {booking.status}
                                    </Badge>
                                </VStack>
                            </CardBody>
                        </Card>
                    </GridItem>
                ))}
            </Grid>

            <Modal 
                isOpen={isOpen} 
                onClose={onClose}
                size={isMobile ? "full" : "md"}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Update Service Status
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
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
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add notes..."
                                rows={4}
                            />
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
        </Box>
    );
};

export default ServiceDashboard; 