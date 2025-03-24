import React from 'react';
import { Box, HStack, Text, IconButton, useColorModeValue } from '@chakra-ui/react';

export const Header = ({ title, onBack, onMenu, rightElement }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={10}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={4}
      py={3}
    >
      <HStack justify="space-between">
        <HStack spacing={2}>
          {onBack && (
            <IconButton
              icon={<Text>←</Text>}
              aria-label="Go back"
              onClick={onBack}
              variant="ghost"
              size="sm"
            />
          )}
          <Text fontSize="xl" fontWeight="bold">
            {title}
          </Text>
        </HStack>

        <HStack spacing={2}>
          {rightElement}
          {onMenu && (
            <IconButton
              icon={<Text>☰</Text>}
              aria-label="Menu"
              onClick={onMenu}
              variant="ghost"
              size="sm"
            />
          )}
        </HStack>
      </HStack>
    </Box>
  );
}; 