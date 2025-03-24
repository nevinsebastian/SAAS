import React from 'react';
import { VStack, HStack, Text, Box, Badge } from '@chakra-ui/react';
import { Card } from '../shared/Card';

export const PaymentInfo = ({ payment }) => {
  return (
    <Card title="Payment Information">
      <VStack align="stretch" spacing={4}>
        <Box>
          <Text fontWeight="medium" color="gray.700">Payment Method</Text>
          <HStack spacing={2} mt={1}>
            <Text color="gray.600">{payment.method}</Text>
            <Badge colorScheme={payment.isDefault ? 'green' : 'gray'}>
              {payment.isDefault ? 'Default' : 'Alternative'}
            </Badge>
          </HStack>
        </Box>

        <Box>
          <Text fontWeight="medium" color="gray.700">Payment Details</Text>
          <VStack align="start" spacing={1} mt={1}>
            <Text color="gray.600">Card Number: **** **** **** {payment.lastFourDigits}</Text>
            <Text color="gray.600">Expiry Date: {payment.expiryDate}</Text>
            <Text color="gray.600">Card Holder: {payment.cardHolderName}</Text>
          </VStack>
        </Box>

        <Box>
          <Text fontWeight="medium" color="gray.700">Billing Address</Text>
          <Text color="gray.600" mt={1}>{payment.billingAddress}</Text>
        </Box>

        <Box>
          <Text fontWeight="medium" color="gray.700">Payment Status</Text>
          <HStack spacing={2} mt={1}>
            <Badge colorScheme={payment.status === 'active' ? 'green' : 'red'}>
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </Badge>
            <Text color="gray.600" fontSize="sm">
              Last Updated: {new Date(payment.lastUpdated).toLocaleDateString()}
            </Text>
          </HStack>
        </Box>
      </VStack>
    </Card>
  );
}; 