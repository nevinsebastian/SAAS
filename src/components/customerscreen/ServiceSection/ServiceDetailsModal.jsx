import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Box,
  Button,
  Divider,
} from '@chakra-ui/react';
import { Badge } from '../shared/Badge';

export const ServiceDetailsModal = ({ isOpen, onClose, service }) => {
  if (!service) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Service Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="bold" fontSize="lg">{service.type}</Text>
              <Badge status={service.status}>
                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
              </Badge>
            </HStack>

            <Divider />

            <Box>
              <Text fontWeight="medium" color="gray.700">Service Information</Text>
              <VStack align="start" spacing={1} mt={1}>
                <Text color="gray.600">Date: {new Date(service.date).toLocaleDateString()}</Text>
                <Text color="gray.600">Time: {new Date(service.date).toLocaleTimeString()}</Text>
                <Text color="gray.600">Duration: {service.duration} minutes</Text>
              </VStack>
            </Box>

            <Box>
              <Text fontWeight="medium" color="gray.700">Service Executive</Text>
              <VStack align="start" spacing={1} mt={1}>
                <Text color="gray.600">Name: {service.executive.name}</Text>
                <Text color="gray.600">Contact: {service.executive.phone}</Text>
                <Text color="gray.600">Rating: {service.rating}/5</Text>
              </VStack>
            </Box>

            <Box>
              <Text fontWeight="medium" color="gray.700">Cost Details</Text>
              <VStack align="start" spacing={1} mt={1}>
                <Text color="gray.600">Service Cost: ₹{service.cost}</Text>
                <Text color="gray.600">Tax: ₹{service.tax}</Text>
                <Text fontWeight="bold">Total: ₹{service.totalCost}</Text>
              </VStack>
            </Box>

            {service.notes && (
              <Box>
                <Text fontWeight="medium" color="gray.700">Notes</Text>
                <Text color="gray.600" mt={1}>{service.notes}</Text>
              </Box>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="outline" colorScheme="blue" onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue">
              Rate Service
            </Button>
            <Button colorScheme="red" variant="outline">
              Report Issue
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 