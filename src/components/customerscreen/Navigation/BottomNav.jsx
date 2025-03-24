import React from 'react';
import { Box, HStack, Button, useColorModeValue } from '@chakra-ui/react';

export const BottomNav = ({ onBookService, onViewService }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg={bgColor}
      borderTop="1px"
      borderColor={borderColor}
      px={4}
      py={3}
      zIndex={10}
    >
      <HStack spacing={4} justify="space-between">
        <Button
          flex={1}
          colorScheme="blue"
          onClick={onBookService}
        >
          Book Service
        </Button>
        <Button
          flex={1}
          variant="outline"
          colorScheme="blue"
          onClick={onViewService}
        >
          View Service
        </Button>
      </HStack>
    </Box>
  );
}; 