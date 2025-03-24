import React from 'react';
import { VStack } from '@chakra-ui/react';
import { Card } from '../shared/Card';
import { PersonalInfo } from './PersonalInfo';
import { VehicleInfo } from './VehicleInfo';
import { PaymentInfo } from './PaymentInfo';

export const CustomerInfo = ({ customer }) => {
  return (
    <VStack spacing={4} align="stretch">
      <PersonalInfo customer={customer} />
      <VehicleInfo vehicle={customer.vehicle} />
      <PaymentInfo payment={customer.payment} />
    </VStack>
  );
}; 