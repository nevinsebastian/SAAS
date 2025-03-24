import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Box,
  Image,
  Badge,
} from '@chakra-ui/react';

export const VerificationCard = ({ isOpen, onClose, verification }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Verification Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="medium">Status</Text>
              <Badge colorScheme={verification.status === 'verified' ? 'green' : 'yellow'}>
                {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
              </Badge>
            </HStack>

            <Box>
              <Text fontWeight="medium" mb={2}>Vehicle Condition</Text>
              <Image
                src={verification.vehicleConditionImage}
                alt="Vehicle Condition"
                borderRadius="md"
                maxH="200px"
                objectFit="cover"
              />
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>Notes</Text>
              <Text color="gray.600">{verification.notes}</Text>
            </Box>

            <HStack justify="space-between">
              <Text fontWeight="medium">Verified By</Text>
              <Text color="gray.600">{verification.verifiedBy}</Text>
            </HStack>

            <HStack justify="space-between">
              <Text fontWeight="medium">Verification Date</Text>
              <Text color="gray.600">
                {new Date(verification.verificationDate).toLocaleDateString()}
              </Text>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 