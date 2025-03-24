import React from 'react';
import { VStack, HStack, Text, Box, IconButton, Avatar } from '@chakra-ui/react';
import { Card } from '../shared/Card';
import { EmployeeRating } from './EmployeeRating';

export const EmployeeDetails = ({ employee, onChatClick }) => {
  return (
    <Card>
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <HStack spacing={4}>
            <Avatar size="lg" name={employee.name} />
            <Box>
              <Text fontWeight="bold" fontSize="lg">{employee.name}</Text>
              <Text color="gray.600" fontSize="sm">{employee.role}</Text>
            </Box>
          </HStack>
          <IconButton
            icon={<Text>💬</Text>}
            aria-label="Chat with employee"
            onClick={onChatClick}
            colorScheme="blue"
            variant="ghost"
            size="lg"
          />
        </HStack>

        <Box>
          <Text fontWeight="medium" color="gray.700">Contact Details</Text>
          <VStack align="start" spacing={1} mt={1}>
            <Text color="gray.600">Phone: {employee.phone}</Text>
            <Text color="gray.600">Email: {employee.email}</Text>
            <Text color="gray.600">Department: {employee.department}</Text>
          </VStack>
        </Box>

        <Box>
          <Text fontWeight="medium" color="gray.700">Performance</Text>
          <EmployeeRating rating={employee.rating} />
        </Box>

        <Box>
          <Text fontWeight="medium" color="gray.700">Availability</Text>
          <Text color="gray.600" mt={1}>
            {employee.isAvailable ? 'Available' : 'Currently Busy'}
          </Text>
        </Box>
      </VStack>
    </Card>
  );
}; 