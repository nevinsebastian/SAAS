import React from 'react';
import { Box, Text, VStack, HStack, IconButton, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

export const Card = ({ 
  children, 
  title, 
  subtitle, 
  rightElement,
  onClick,
  isClickable = true,
  animation = true,
  ...props 
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const cardProps = {
    bg: bgColor,
    borderWidth: '1px',
    borderColor: borderColor,
    borderRadius: 'lg',
    p: 4,
    cursor: isClickable ? 'pointer' : 'default',
    _hover: isClickable ? { bg: hoverBg } : {},
    transition: 'all 0.2s',
    ...props
  };

  const content = (
    <VStack align="stretch" spacing={2}>
      {(title || subtitle) && (
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={0}>
            {title && (
              <Text fontSize="sm" fontWeight="medium" color="gray.700">
                {title}
              </Text>
            )}
            {subtitle && (
              <Text fontSize="xs" color="gray.500">
                {subtitle}
              </Text>
            )}
          </VStack>
          {rightElement}
        </HStack>
      )}
      {children}
    </VStack>
  );

  if (animation) {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClick}
        {...cardProps}
      >
        {content}
      </MotionBox>
    );
  }

  return (
    <Box onClick={onClick} {...cardProps}>
      {content}
    </Box>
  );
}; 