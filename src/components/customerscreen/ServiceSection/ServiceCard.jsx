import React from 'react';
import { VStack, HStack, Text, Box, Badge } from '@chakra-ui/react';
import { Card } from '../shared/Card';

export const ServiceCard = ({ service, onClick }) => {
  return (
    <Card onClick={onClick}>
      <VStack align="stretch" spacing={2}>
        <HStack justify="space-between">
          <Text fontWeight="bold" fontSize="lg">{service.type}</Text>
          <Badge colorScheme={service.status === 'completed' ? 'green' : 'yellow'}>
            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
          </Badge>
        </HStack>

        <HStack justify="space-between">
          <Text color="gray.600">Date: {new Date(service.date).toLocaleDateString()}</Text>
          <Text color="gray.600">Cost: ₹{service.cost}</Text>
        </HStack>

        {service.notes && (
          <Text color="gray.600" fontSize="sm" noOfLines={2}>
            {service.notes}
          </Text>
        )}

        <HStack justify="space-between">
          <Text color="gray.600" fontSize="sm">
            Service Executive: {service.executive.name}
          </Text>
          <Text color="gray.600" fontSize="sm">
            Rating: {service.rating}/5
          </Text>
        </HStack>
      </VStack>
    </Card>
  );
}; 