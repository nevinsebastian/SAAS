import React from 'react';
import { VStack, Text, Box } from '@chakra-ui/react';
import { Card } from '../shared/Card';
import { ServiceCard } from './ServiceCard';
import { ServiceDetailsModal } from './ServiceDetailsModal';

export const ServiceHistory = ({ services, onServiceSelect }) => {
  const [selectedService, setSelectedService] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
    onServiceSelect?.(service);
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={4}>Service History</Text>
        <VStack spacing={3} align="stretch">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onClick={() => handleServiceClick(service)}
            />
          ))}
        </VStack>
      </Box>

      <ServiceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
      />
    </VStack>
  );
}; 