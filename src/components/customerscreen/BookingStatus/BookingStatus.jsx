import React from 'react';
import { VStack, HStack, Text, Box, Progress, Button, useDisclosure } from '@chakra-ui/react';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';
import { VerificationCard } from './VerificationCard';

export const BookingStatus = ({ booking }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'yellow.500';
      case 'completed':
        return 'green.500';
      case 'cancelled':
        return 'red.500';
      default:
        return 'gray.500';
    }
  };

  const getProgressValue = (status) => {
    switch (status) {
      case 'pending':
        return 33;
      case 'in_progress':
        return 66;
      case 'completed':
        return 100;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Card>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="bold">
              Booking Status
            </Text>
            <Badge status={booking.status}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </HStack>
          
          <Box>
            <Progress 
              value={getProgressValue(booking.status)} 
              colorScheme={getStatusColor(booking.status).split('.')[0]}
              size="sm"
              borderRadius="full"
            />
          </Box>

          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600">
              Booking ID: {booking.id}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Date: {new Date(booking.date).toLocaleDateString()}
            </Text>
          </HStack>
        </VStack>
      </Card>

      <Card>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="bold">
              Verification Status
            </Text>
            <Badge status={booking.verificationStatus}>
              {booking.verificationStatus.charAt(0).toUpperCase() + booking.verificationStatus.slice(1)}
            </Badge>
          </HStack>

          <Button 
            size="sm" 
            colorScheme="blue" 
            variant="outline"
            onClick={onOpen}
          >
            View Verification Details
          </Button>
        </VStack>
      </Card>

      <VerificationCard 
        isOpen={isOpen} 
        onClose={onClose} 
        verification={booking.verification}
      />
    </VStack>
  );
}; 