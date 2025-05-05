import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  Badge,
  HStack,
  Icon,
  IconButton,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  Input,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Pagination,
  useToast,
} from '@chakra-ui/react';
import {
  CheckCircleIcon,
  TimeIcon,
  WarningIcon,
  BellIcon,
  SettingsIcon,
} from '@chakra-ui/icons';

const ServiceSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();

  const bgGradient = useColorModeValue(
    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)'
  );
  const cardBg = useColorModeValue('whiteAlpha.900', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  // Dummy data for upcoming service
  const upcomingService = {
    type: 'Periodic Service',
    dueDate: '2024-04-15',
    dueKm: 5000,
    currentKm: 4500,
    status: 'upcoming',
  };

  // Dummy data for service history
  const serviceHistory = [
    {
      id: 1,
      type: 'Basic Service',
      date: '2024-03-01',
      km: 3000,
      status: 'completed',
      notes: 'Regular maintenance completed',
    },
    {
      id: 2,
      type: 'Checkup',
      date: '2024-02-15',
      km: 2000,
      status: 'completed',
      notes: 'General inspection',
    },
    {
      id: 3,
      type: 'Wash',
      date: '2024-02-01',
      km: 1500,
      status: 'completed',
      notes: 'Exterior and interior cleaning',
    },
    {
      id: 4,
      type: 'Periodic Service',
      date: '2024-01-15',
      km: 1000,
      status: 'completed',
      notes: 'First service completed',
    },
    {
      id: 5,
      type: 'Checkup',
      date: '2024-01-01',
      km: 500,
      status: 'completed',
      notes: 'Initial inspection',
    },
  ];

  const handleServiceBooking = () => {
    toast({
      title: 'Service Booked',
      description: 'Your service appointment has been scheduled successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Box maxW="1200px" mx="auto" p={4} mb="80px">
      {/* Header with Notification Icon */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" bgGradient={bgGradient} bgClip="text">
          Service Center
        </Heading>
        <IconButton
          icon={<BellIcon />}
          aria-label="Notifications"
          variant="ghost"
          colorScheme="purple"
          size="lg"
          position="relative"
        >
          <Badge
            position="absolute"
            top={2}
            right={2}
            colorScheme="red"
            borderRadius="full"
          >
            3
          </Badge>
        </IconButton>
      </Flex>

      {/* Upcoming Service Card */}
      <Box
        bg={cardBg}
        borderRadius="xl"
        p={6}
        mb={6}
        boxShadow="xl"
        border="1px solid"
        borderColor="whiteAlpha.300"
      >
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Heading size="md" color={textColor}>Upcoming Service</Heading>
            <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
              Due in 5 days
            </Badge>
          </HStack>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
            <Box>
              <Text color="gray.500" fontSize="sm">Service Type</Text>
              <Text fontSize="lg" color={textColor}>{upcomingService.type}</Text>
            </Box>
            <Box>
              <Text color="gray.500" fontSize="sm">Due Date</Text>
              <Text fontSize="lg" color={textColor}>{upcomingService.dueDate}</Text>
            </Box>
            <Box>
              <Text color="gray.500" fontSize="sm">Due Kilometer</Text>
              <Text fontSize="lg" color={textColor}>{upcomingService.dueKm} km</Text>
            </Box>
            <Box>
              <Text color="gray.500" fontSize="sm">Current Kilometer</Text>
              <Text fontSize="lg" color={textColor}>{upcomingService.currentKm} km</Text>
            </Box>
          </Grid>
          <Button
            colorScheme="purple"
            size="lg"
            onClick={onOpen}
            bgGradient={bgGradient}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
            transition="all 0.2s"
          >
            Book Service Now
          </Button>
        </VStack>
      </Box>

      {/* Service History */}
      <Box
        bg={cardBg}
        borderRadius="xl"
        p={6}
        boxShadow="xl"
        border="1px solid"
        borderColor="whiteAlpha.300"
      >
        <VStack spacing={4} align="stretch">
          <Heading size="md" color={textColor}>Service History</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Type</Th>
                <Th>Kilometer</Th>
                <Th>Status</Th>
                <Th>Notes</Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceHistory.map((service) => (
                <Tr key={service.id}>
                  <Td>{service.date}</Td>
                  <Td>{service.type}</Td>
                  <Td>{service.km} km</Td>
                  <Td>
                    <Badge colorScheme="green">Completed</Badge>
                  </Td>
                  <Td>{service.notes}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Flex justify="center" mt={4}>
            <Pagination
              currentPage={currentPage}
              totalPages={3}
              onPageChange={setCurrentPage}
            />
          </Flex>
        </VStack>
      </Box>

      {/* Service Booking Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(4px)" />
        <ModalContent bg={cardBg} borderRadius="xl">
          <ModalHeader bgGradient={bgGradient} bgClip="text">
            Book Service Appointment
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Service Type</FormLabel>
                <Select placeholder="Select service type">
                  <option value="periodic">Periodic Service</option>
                  <option value="basic">Basic Service</option>
                  <option value="checkup">Checkup</option>
                  <option value="wash">Wash</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Preferred Date</FormLabel>
                <Input type="date" />
              </FormControl>
              <FormControl>
                <FormLabel>Preferred Time</FormLabel>
                <Select placeholder="Select time">
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                  <option value="evening">Evening (4 PM - 7 PM)</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Additional Notes (Optional)</FormLabel>
                <Textarea rows={4} placeholder="Enter any specific concerns or requirements" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              bgGradient={bgGradient}
              onClick={handleServiceBooking}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
              transition="all 0.2s"
              mb="60px"
            >
              Confirm Booking
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ServiceSection; 