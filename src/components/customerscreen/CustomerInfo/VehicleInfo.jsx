import React from 'react';
import { VStack, HStack, Text, Box, Image } from '@chakra-ui/react';
import { Card } from '../shared/Card';

export const VehicleInfo = ({ vehicle }) => {
  return (
    <Card title="Vehicle Information">
      <VStack align="stretch" spacing={4}>
        <HStack spacing={4}>
          <Image
            src={vehicle.image}
            alt={vehicle.model}
            boxSize="100px"
            objectFit="cover"
            borderRadius="md"
          />
          <Box>
            <Text fontWeight="bold" fontSize="lg">{vehicle.model}</Text>
            <Text color="gray.600" fontSize="sm">{vehicle.make} - {vehicle.year}</Text>
          </Box>
        </HStack>

        <Box>
          <Text fontWeight="medium" color="gray.700">Vehicle Details</Text>
          <VStack align="start" spacing={1} mt={1}>
            <Text color="gray.600">Registration Number: {vehicle.registrationNumber}</Text>
            <Text color="gray.600">VIN: {vehicle.vin}</Text>
            <Text color="gray.600">Color: {vehicle.color}</Text>
            <Text color="gray.600">Fuel Type: {vehicle.fuelType}</Text>
          </VStack>
        </Box>

        <Box>
          <Text fontWeight="medium" color="gray.700">Service History</Text>
          <VStack align="start" spacing={1} mt={1}>
            <Text color="gray.600">Last Service Date: {new Date(vehicle.lastServiceDate).toLocaleDateString()}</Text>
            <Text color="gray.600">Mileage: {vehicle.mileage} km</Text>
            <Text color="gray.600">Next Service Due: {new Date(vehicle.nextServiceDue).toLocaleDateString()}</Text>
          </VStack>
        </Box>
      </VStack>
    </Card>
  );
}; 