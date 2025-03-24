import React from 'react';
import { HStack, Text } from '@chakra-ui/react';

export const EmployeeRating = ({ rating }) => {
  const stars = Array(5).fill('★');
  const emptyStars = Array(5).fill('☆');

  return (
    <HStack spacing={1} mt={1}>
      {stars.map((star, index) => (
        <Text
          key={index}
          color={index < rating ? 'yellow.400' : 'gray.300'}
          fontSize="lg"
        >
          {index < rating ? star : emptyStars[index]}
        </Text>
      ))}
      <Text color="gray.600" fontSize="sm" ml={2}>
        ({rating}/5)
      </Text>
    </HStack>
  );
}; 