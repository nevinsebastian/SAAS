import React from 'react';
import { VStack, HStack, Text, Box, Avatar } from '@chakra-ui/react';
import { Card } from '../shared/Card';

export const PersonalInfo = ({ customer }) => {
  return (
    <Card title="Personal Information">
      <VStack align="stretch" spacing={3}>
        <HStack spacing={4}>
          <Avatar size="lg" name={customer.name} />
          <Box>
            <Text fontWeight="bold" fontSize="lg">{customer.name}</Text>
            <Text color="gray.600" fontSize="sm">Customer ID: {customer.id}</Text>
          </Box>
        </HStack>

        <Box>
          <Text fontWeight="medium" color="gray.700">Contact Details</Text>
          <VStack align="start" spacing={1} mt={1}>
            <Text color="gray.600">Phone: {customer.phone}</Text>
            <Text color="gray.600">Email: {customer.email}</Text>
            <Text color="gray.600">Address: {customer.address}</Text>
          </VStack>
        </Box>

        <Box>
          <Text fontWeight="medium" color="gray.700">Additional Information</Text>
          <VStack align="start" spacing={1} mt={1}>
            <Text color="gray.600">Date of Birth: {new Date(customer.dateOfBirth).toLocaleDateString()}</Text>
            <Text color="gray.600">Gender: {customer.gender}</Text>
            <Text color="gray.600">Preferred Language: {customer.preferredLanguage}</Text>
          </VStack>
        </Box>
      </VStack>
    </Card>
  );
}; 