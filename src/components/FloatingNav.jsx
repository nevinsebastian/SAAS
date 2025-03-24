import React from 'react';
import { Box, HStack, IconButton, Text, useColorModeValue } from '@chakra-ui/react';
import { 
  CalendarIcon, 
  ChatIcon, 
  SettingsIcon,
  BellIcon,
} from '@chakra-ui/icons';

const FloatingNav = ({ activeScreen, onScreenChange, isDelivered }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const activeColor = useColorModeValue('purple.500', 'purple.300');
  const inactiveColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg={bgColor}
      boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)"
      zIndex={1000}
      borderTop="1px solid"
      borderColor="gray.200"
      p={2}
    >
      <HStack justify="space-around" maxW="600px" mx="auto">
        <IconButton
          icon={<CalendarIcon />}
          aria-label="Booking"
          variant="ghost"
          color={activeScreen === 'booking' ? activeColor : inactiveColor}
          onClick={() => onScreenChange('booking')}
          _hover={{ bg: 'transparent' }}
          size="lg"
        />
        <IconButton
          icon={<ChatIcon />}
          aria-label="Chat"
          variant="ghost"
          color={activeScreen === 'chat' ? activeColor : inactiveColor}
          onClick={() => onScreenChange('chat')}
          _hover={{ bg: 'transparent' }}
          size="lg"
        />
        <IconButton
          icon={<SettingsIcon />}
          aria-label="Service"
          variant="ghost"
          color={activeScreen === 'service' ? activeColor : inactiveColor}
          onClick={() => onScreenChange('service')}
          _hover={{ bg: 'transparent' }}
          size="lg"
          isDisabled={!isDelivered}
          opacity={isDelivered ? 1 : 0.5}
        />
      </HStack>
    </Box>
  );
};

export default FloatingNav; 