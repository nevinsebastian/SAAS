import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { BellIcon, HamburgerIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';

const Notifications = ({ onClose, user, onMenuOpen }) => {
  const bgGradient = useColorModeValue('linear(to-br, purple.50, blue.50)', 'linear(to-br, purple.900, blue.900)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accentColor = 'purple.500';

  const [tabIndex, setTabIndex] = useState(0); // 0 for Internal, 1 for Customer
  const [concern, setConcern] = useState(''); // State for concern text
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure(); // Modal state

  // Sample notification data
  const internalNotifications = [
    { id: 1, message: 'Head Office: Q1 targets increased by 10%', time: '2025-03-01 09:00 AM', type: 'announcement' },
    { id: 2, message: 'Team meeting scheduled at 2 PM', time: '2025-03-02 10:00 AM', type: 'meeting' },
  ];

  const customerNotifications = [
    { id: 1, message: 'Customer "John Doe" added', time: '2025-03-01 10:00 AM', type: 'customer' },
    { id: 2, message: 'Delivery delayed for "Toyota Corolla"', time: '2025-03-01 12:00 PM', type: 'delivery' },
  ];

  const handleReportConcern = () => {
    if (concern.trim()) {
      // Simulate sending concern to head office (replace with API call in production)
      console.log(`Concern reported by ${user.username}: ${concern}`);
      toast.success('Concern reported to head office!', { position: 'top-center', style: { zIndex: 1000 } });
      setConcern(''); // Clear the input
      onModalClose(); // Close the modal
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

          {/* Tabs */}
          <Tabs variant="soft-rounded" colorScheme="purple" index={tabIndex} onChange={(index) => setTabIndex(index)}>
            <TabList mb={4}>
              <Tab>Internal</Tab>
              <Tab>Customer</Tab>
            </TabList>
            <TabPanels>
              {/* Internal Notifications */}
              <TabPanel p={0}>
                {internalNotifications.length > 0 ? (
                  <VStack spacing={2} align="stretch">
                    {internalNotifications.map(notification => (
                      <Box key={notification.id} bg={cardBg} borderRadius="md" p={3}>
                        <Flex justify="space-between" align="center">
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium" color={textColor}>{notification.message}</Text>
                            <Text fontSize="sm" color="gray.500">{notification.time}</Text>
                          </VStack>
                          <Badge
                            colorScheme={notification.type === 'announcement' ? 'purple' : 'blue'}
                            px={2}
                            py={1}
                            borderRadius="full"
                          >
                            {notification.type}
                          </Badge>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Text color="gray.500" textAlign="center">No internal notifications</Text>
                )}
              </TabPanel>

              {/* Customer Notifications */}
              <TabPanel p={0}>
                {customerNotifications.length > 0 ? (
                  <VStack spacing={2} align="stretch">
                    {customerNotifications.map(notification => (
                      <Box key={notification.id} bg={cardBg} borderRadius="md" p={3}>
                        <Flex justify="space-between" align="center">
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium" color={textColor}>{notification.message}</Text>
                            <Text fontSize="sm" color="gray.500">{notification.time}</Text>
                          </VStack>
                          <Badge
                            colorScheme={notification.type === 'customer' ? 'green' : 'yellow'}
                            px={2}
                            py={1}
                            borderRadius="full"
                          >
                            {notification.type}
                          </Badge>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Text color="gray.500" textAlign="center">No customer notifications</Text>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
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