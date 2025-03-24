import React from 'react';
import { Badge as ChakraBadge } from '@chakra-ui/react';

const statusColors = {
  pending: 'yellow',
  completed: 'green',
  cancelled: 'red',
  inProgress: 'blue',
  verified: 'green',
  unverified: 'yellow',
  default: 'gray'
};

export const Badge = ({ status, children, ...props }) => {
  const colorScheme = statusColors[status] || statusColors.default;
  
  return (
    <ChakraBadge
      colorScheme={colorScheme}
      px={2}
      py={1}
      borderRadius="full"
      fontSize="xs"
      fontWeight="medium"
      {...props}
    >
      {children}
    </ChakraBadge>
  );
}; 