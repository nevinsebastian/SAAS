import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  IconButton,
  useColorModeValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { HamburgerIcon, ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';

const Messages = ({ onClose, user, onMenuOpen }) => {
  const bgGradient = useColorModeValue('linear(to-br, purple.50, blue.50)', 'linear(to-br, purple.900, blue.900)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accentColor = 'purple.500';
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const sentMessageBg = useColorModeValue('purple.500', 'purple.600');
  const sentMessageColor = useColorModeValue('white', 'gray.100');
  const receivedMessageBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [customerMessages, setCustomerMessages] = useState([
    { id: 1, name: 'John Doe', vehicle: 'Honda City', lastMessage: 'When will my car be delivered?', time: '10:00 AM' },
    { id: 2, name: 'Jane Smith', vehicle: 'Toyota Corolla', lastMessage: 'Thanks for the update!', time: 'Yesterday, 3:00 PM' },
    { id: 3, name: 'Mike Johnson', vehicle: 'Hyundai Creta', lastMessage: 'Can you confirm the price?', time: '2025-03-02 9:00 AM' },
  ]);
  const [chatHistory, setChatHistory] = useState({
    1: [
      { id: 1, sender: 'John Doe', text: 'When will my car be delivered?', time: '10:00 AM' },
      { id: 2, sender: 'You', text: 'We’re working on it, expect delivery by tomorrow.', time: '10:05 AM' },
    ],
    2: [
      { id: 1, sender: 'Jane Smith', text: 'Thanks for the update!', time: 'Yesterday, 3:00 PM' },
    ],
    3: [
      { id: 1, sender: 'Mike Johnson', text: 'Can you confirm the price?', time: '2025-03-02 9:00 AM' },
    ],
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedCustomer) {
      const newMsg = {
        id: chatHistory[selectedCustomer.id].length + 1,
        sender: 'You',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory(prev => ({
        ...prev,
        [selectedCustomer.id]: [...prev[selectedCustomer.id], newMsg],
      }));
      setCustomerMessages(prev =>
        prev.map(customer =>
          customer.id === selectedCustomer.id
            ? { ...customer, lastMessage: newMessage, time: newMsg.time }
            : customer
        )
      );
      setNewMessage('');
    }
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  return (
    <Box bg={bgGradient} minH="100vh" overflowY="auto" pb={{ base: 0, md: 8 }}>
      {/* Header */}
      <Flex justify="space-between" align="center" bg={cardBg} borderRadius="lg" p={3} mb={6} boxShadow="lg" position="sticky" top={0} zIndex={10}>
        <HStack spacing={3}>
          <IconButton icon={<HamburgerIcon />} variant="ghost" onClick={onMenuOpen} aria-label="Open menu" />
          <Heading size="md" color={accentColor}>Messages</Heading>
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
      <Box maxW="1200px" mx="auto" px={{ base: 2, md: 4 }}>
        {selectedCustomer ? (
          <Flex direction="column" h={{ base: 'calc(100vh - 70px)', md: 'calc(100vh - 100px)' }}>
            {/* Fixed Back Button and Customer Info */}
            <Flex
              align="center"
              bg={cardBg}
              p={3}
              position={{ base: 'fixed', md: 'static' }}
              top={{ base: '70px', md: 'auto' }}
              left={0}
              right={0}
              zIndex={9}
              boxShadow={{ base: 'md', md: 'none' }}
            >
              <IconButton
                icon={<ArrowBackIcon />}
                variant="ghost"
                onClick={() => setSelectedCustomer(null)}
                aria-label="Back to customer list"
                mr={2}
              />
              <Text fontWeight="bold" color={textColor}>{selectedCustomer.name} - {selectedCustomer.vehicle}</Text>
            </Flex>

            {/* Scrollable Chat Messages */}
            <VStack
              spacing={4}
              flex="1"
              overflowY="auto"
              mt={{ base: '60px', md: 0 }}
              mb={{ base: '60px', md: 0 }}
              px={2}
            >
              {chatHistory[selectedCustomer.id].map(message => (
                <HStack
                  key={message.id}
                  alignSelf={message.sender === 'You' ? 'flex-end' : 'flex-start'}
                  bg={message.sender === 'You' ? sentMessageBg : receivedMessageBg}
                  color={message.sender === 'You' ? sentMessageColor : textColor}
                  borderRadius="lg"
                  p={3}
                  maxW="70%"
                >
                  <VStack align={message.sender === 'You' ? 'end' : 'start'} spacing={1}>
                    <Text>{message.text}</Text>
                    <Text fontSize="xs" color={message.sender === 'You' ? 'gray.200' : 'gray.500'}>{message.time}</Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>

            {/* Fixed Input Field */}
            <HStack
              p={2}
              bg={cardBg}
              borderRadius="lg"
              boxShadow="md"
              position={{ base: 'fixed', md: 'static' }}
              bottom={{ base: 0, md: 'auto' }}
              left={0}
              right={0}
              zIndex={9}
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                variant="filled"
                bg={inputBg}
                _focus={{ borderColor: accentColor }}
              />
              <Button colorScheme="purple" onClick={handleSendMessage}>
                <ArrowForwardIcon />
              </Button>
            </HStack>
          </Flex>
        ) : (
          <VStack spacing={2} align="stretch">
            {customerMessages.map(customer => (
              <Box
                key={customer.id}
                bg={cardBg}
                borderRadius="md"
                p={3}
                boxShadow="sm"
                cursor="pointer"
                _hover={{ bg: hoverBg }}
                onClick={() => handleCustomerSelect(customer)}
              >
                <Flex justify="space-between" align="center">
                  <VStack align="start" spacing={1} flex="1">
                    <Text fontWeight="medium" color={textColor} isTruncated>{customer.name}</Text>
                    <Text fontSize="sm" color="gray.500" isTruncated>{customer.vehicle}</Text>
                    <Text fontSize="sm" color={textColor} isTruncated>{customer.lastMessage}</Text>
                  </VStack>
                  <Text fontSize="xs" color="gray.500" whiteSpace="nowrap" ml={2}>{customer.time}</Text>
                </Flex>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default Messages;