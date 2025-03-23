import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  IconButton,
  useColorModeValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { HamburgerIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';
import api from '../api';

const Notifications = ({ onClose, user, onMenuOpen }) => {
  const bgGradient = useColorModeValue('linear(to-br, purple.50, blue.50)', 'linear(to-br, purple.900, blue.900)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accentColor = 'purple.500';
  const chakraToast = useToast();

  const [notifications, setNotifications] = useState([]);
  const [concern, setConcern] = useState('');
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  useEffect(() => {
    if (user && user.id) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get(`/notifications/employee/${user.id}`);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      chakraToast({
        title: 'Error',
        description: 'Failed to fetch notifications',
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
      chakraToast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleReportConcern = () => {
    if (concern.trim()) {
      // TODO: Implement API call to report concern
      console.log(`Concern reported by ${user.username}: ${concern}`);
      toast.success('Concern reported to head office!', { position: 'top-center', style: { zIndex: 1000 } });
      setConcern('');
      onModalClose();
    } else {
      toast.error('Please enter a concern before submitting.', { position: 'top-center', style: { zIndex: 1000 } });
    }
  };

  return (
    <Box bg={bgGradient} minH="100vh" overflowY="auto" pb={{ base: 20, md: 8 }}>
      {/* Header */}
      <Flex justify="space-between" align="center" bg={cardBg} borderRadius="lg" p={3} boxShadow="lg" position="sticky" top={0} zIndex={10}>
        <HStack spacing={3}>
          <IconButton icon={<HamburgerIcon />} variant="ghost" onClick={onMenuOpen} aria-label="Open menu" />
          <Heading size="md" color={accentColor}>Notifications</Heading>
        </HStack>
        <Menu>
          <MenuButton>
            <Avatar name={user.username} size="sm" />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={onClose}>Back to Dashboard</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* Main Content */}
      <VStack spacing={4} maxW="1200px" mx="auto" px={{ base: 2, md: 4 }} align="stretch">
        <Box bg={cardBg} borderRadius="lg" p={4} boxShadow="md">
          {/* Report a Concern Button */}
          <HStack justify="flex-end" mb={4}>
            <Button
              leftIcon={<WarningTwoIcon />}
              colorScheme="red"
              variant="solid"
              size="sm"
              onClick={onModalOpen}
            >
              Report a Concern
            </Button>
          </HStack>

          {/* Notifications List */}
          <VStack spacing={4} align="stretch">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <Box 
                  key={notification.id} 
                  bg={cardBg} 
                  borderRadius="md" 
                  p={4}
                  borderWidth="1px"
                  borderColor={notification.read_at ? 'gray.200' : 'blue.200'}
                >
                  <Flex justify="space-between" align="start">
                    <VStack align="start" spacing={2} flex={1}>
                      <Text fontWeight="bold" color={textColor}>{notification.title}</Text>
                      <Text color="gray.600">{notification.message}</Text>
                      <Text fontSize="sm" color="gray.500">
                        From: {notification.sender_name} • {new Date(notification.created_at).toLocaleString()}
                      </Text>
                    </VStack>
                    {!notification.read_at && (
                      <Badge colorScheme="blue" ml={2}>New</Badge>
                    )}
                  </Flex>
                  {!notification.read_at && (
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
              ))
            ) : (
              <Text color="gray.500" textAlign="center">No notifications</Text>
            )}
          </VStack>
        </Box>
      </VStack>

      {/* Report Concern Modal */}
      <Modal isOpen={isModalOpen} onClose={onModalClose} size={{ base: 'full', md: 'md' }}>
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader color={textColor}>Report a Concern</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
              placeholder="Describe your concern here..."
              minH="150px"
              bg={useColorModeValue('gray.100', 'gray.700')}
              borderColor={useColorModeValue('gray.200', 'gray.600')}
              _focus={{ borderColor: accentColor }}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleReportConcern}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Notifications;