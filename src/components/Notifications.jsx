import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  DrawerHeader,
  DrawerCloseButton,
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';

const Notifications = ({ onClose }) => {
  const bgGradient = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  const dummyNotifications = [
    { id: 1, message: 'Customer "John Doe" added', time: '2025-03-01 10:00 AM', type: 'customer' },
    { id: 2, message: 'Delivery delayed for "Toyota Corolla"', time: '2025-03-01 12:00 PM', type: 'delivery' },
    { id: 3, message: 'Head Office: Q1 targets increased by 10%', time: '2025-03-01 09:00 AM', type: 'announcement' },
  ];

  return (
    <Box bg={bgGradient} minH="100vh">
      <DrawerHeader bg={cardBg} borderBottom="1px" borderColor="gray.200" position="sticky" top={0} zIndex={10}>
        <Flex justify="space-between" align="center">
          <Flex align="center">
            <BellIcon color="purple.600" mr={2} />
            <Heading size="md" color="purple.600">Notifications</Heading>
          </Flex>
          <DrawerCloseButton onClick={onClose} />
        </Flex>
      </DrawerHeader>
      <VStack spacing={4} p={4} align="stretch">
        {dummyNotifications.map(notification => (
          <Box key={notification.id} bg={cardBg} borderRadius="lg" p={3} boxShadow="sm">
            <Text fontWeight="medium" color={textColor}>{notification.message}</Text>
            <Text fontSize="sm" color="gray.500">{notification.time}</Text>
            <Badge colorScheme={notification.type === 'customer' ? 'green' : notification.type === 'delivery' ? 'yellow' : 'purple'} mt={1}>{notification.type}</Badge>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Notifications;