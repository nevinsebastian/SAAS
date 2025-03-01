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
  DrawerHeader,
  DrawerCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChatIcon, ArrowForwardIcon } from '@chakra-ui/icons';

const Messages = ({ onClose }) => {
  const bgGradient = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  const [messages, setMessages] = useState([
    { id: 1, sender: 'John Doe', text: 'When will my car be delivered?', time: '10:00 AM' },
    { id: 2, sender: 'You', text: 'We’re working on it, expect delivery by tomorrow.', time: '10:05 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: 'You', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setNewMessage('');
    }
  };

  return (
    <Box bg={bgGradient} minH="100vh" display="flex" flexDirection="column">
      <DrawerHeader bg={cardBg} borderBottom="1px" borderColor="gray.200" position="sticky" top={0} zIndex={10}>
        <Flex justify="space-between" align="center">
          <Flex align="center">
            <ChatIcon color="purple.600" mr={2} />
            <Heading size="md" color="purple.600">Messages</Heading>
          </Flex>
          <DrawerCloseButton onClick={onClose} />
        </Flex>
      </DrawerHeader>
      <VStack spacing={4} p={4} flex="1" overflowY="auto">
        {messages.map(message => (
          <HStack key={message.id} alignSelf={message.sender === 'You' ? 'flex-end' : 'flex-start'} bg={message.sender === 'You' ? 'purple.100' : cardBg} borderRadius="lg" p={3} maxW="70%">
            <VStack align={message.sender === 'You' ? 'end' : 'start'}>
              <Text fontWeight="medium" color={textColor}>{message.text}</Text>
              <Text fontSize="xs" color="gray.500">{message.time}</Text>
            </VStack>
          </HStack>
        ))}
      </VStack>
      <HStack p={4} bg={cardBg} borderTop="1px" borderColor="gray.200" position="sticky" bottom={0}>
        <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." variant="filled" />
        <Button colorScheme="purple" onClick={handleSendMessage}><ArrowForwardIcon /></Button>
      </HStack>
    </Box>
  );
};

export default Messages;