import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Select,
  useToast,
  Flex,
  useColorModeValue,
  Image,
} from '@chakra-ui/react';
import axios from 'axios';

const CustomerDetails = () => {
  const { customerId } = useParams();
  const toast = useToast();
  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    address: '',
    mobile_1: '',
    mobile_2: '',
    email: '',
    nominee: '',
    nominee_relation: '',
    payment_mode: '',
    finance_company: '',
    finance_amount: '',
  });
  const [files, setFiles] = useState({
    aadhar_front: null,
    aadhar_back: null,
    passport_photo: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bgGradient = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/customers/${customerId}`);
        setCustomer(response.data.customer);
        setFormData(prev => ({ ...prev, name: response.data.customer.customer_name, mobile_1: response.data.customer.phone_number }));
      } catch (err) {
        console.error('Failed to fetch customer:', err);
        toast({
          title: 'Error',
          description: 'Failed to load customer details',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchCustomer();
  }, [customerId, toast]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('status', 'Submitted');
    Object.keys(formData).forEach(key => formData[key] && formDataToSend.append(key, formData[key]));
    if (files.aadhar_front) formDataToSend.append('aadhar_front', files.aadhar_front);
    if (files.aadhar_back) formDataToSend.append('aadhar_back', files.aadhar_back);
    if (files.passport_photo) formDataToSend.append('passport_photo', files.passport_photo);

    try {
      await axios.put(`http://localhost:3000/customers/${customerId}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast({
        title: 'Success',
        description: 'Details submitted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setCustomer(prev => ({ ...prev, status: 'Submitted' }));
    } catch (err) {
      console.error('Failed to submit details:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to submit details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!customer) return <Text>Loading...</Text>;

  return (
    <Box minH="100vh" bg={bgGradient} p={{ base: 4, md: 6 }} display="flex" justifyContent="center" alignItems="center">
      <Box maxW={{ base: '100%', md: '600px' }} w="full" bg={cardBg} borderRadius="lg" p={6} boxShadow="lg">
        <Heading size="lg" mb={4} color="purple.600" textAlign="center">Customer Details</Heading>

        {/* Booking Details */}
        <VStack spacing={3} mb={6} align="stretch">
          <Text fontWeight="bold" color={textColor}>Booking Information</Text>
          <Text color={textColor}>Name: {customer.customer_name}</Text>
          <Text color={textColor}>Vehicle: {customer.vehicle}</Text>
          <Text color={textColor}>Variant: {customer.variant || 'Not specified'}</Text>
          <Text color={textColor}>Status: {customer.status}</Text>
        </VStack>

        {/* Form for Additional Details */}
        {customer.status === 'Pending' ? (
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel color={textColor}>Full Name</FormLabel>
                <Input name="name" value={formData.name} onChange={handleInputChange} variant="filled" isRequired />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Date of Birth</FormLabel>
                <Input name="dob" type="date" value={formData.dob} onChange={handleInputChange} variant="filled" isRequired />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Address</FormLabel>
                <Input name="address" value={formData.address} onChange={handleInputChange} variant="filled" isRequired />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Mobile 1</FormLabel>
                <Input name="mobile_1" value={formData.mobile_1} onChange={handleInputChange} variant="filled" isRequired />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Mobile 2 (Optional)</FormLabel>
                <Input name="mobile_2" value={formData.mobile_2} onChange={handleInputChange} variant="filled" />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Email</FormLabel>
                <Input name="email" type="email" value={formData.email} onChange={handleInputChange} variant="filled" isRequired />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Nominee</FormLabel>
                <Input name="nominee" value={formData.nominee} onChange={handleInputChange} variant="filled" isRequired />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Relation with Nominee</FormLabel>
                <Input name="nominee_relation" value={formData.nominee_relation} onChange={handleInputChange} variant="filled" isRequired />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Payment Mode</FormLabel>
                <Select name="payment_mode" value={formData.payment_mode} onChange={handleInputChange} variant="filled" isRequired placeholder="Select payment mode">
                  <option value="Cash">Cash</option>
                  <option value="Finance">Finance</option>
                </Select>
              </FormControl>
              {formData.payment_mode === 'Finance' && (
                <>
                  <FormControl>
                    <FormLabel color={textColor}>Finance Company</FormLabel>
                    <Input name="finance_company" value={formData.finance_company} onChange={handleInputChange} variant="filled" isRequired />
                  </FormControl>
                  <FormControl>
                    <FormLabel color={textColor}>Finance Amount</FormLabel>
                    <Input name="finance_amount" type="number" value={formData.finance_amount} onChange={handleInputChange} variant="filled" isRequired />
                  </FormControl>
                </>
              )}
              <FormControl>
                <FormLabel color={textColor}>Aadhar Front</FormLabel>
                <Input name="aadhar_front" type="file" accept="image/*" onChange={handleFileChange} variant="filled" isRequired />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Aadhar Back</FormLabel>
                <Input name="aadhar_back" type="file" accept="image/*" onChange={handleFileChange} variant="filled" isRequired />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Passport-Size Photo</FormLabel>
                <Input name="passport_photo" type="file" accept="image/*" onChange={handleFileChange} variant="filled" isRequired />
              </FormControl>
              <Button type="submit" colorScheme="purple" size="lg" w="full" isLoading={isSubmitting}>Submit Details</Button>
            </VStack>
          </form>
        ) : (
          <Text color="green.500" textAlign="center">Details already submitted. Thank you!</Text>
        )}
      </Box>
    </Box>
  );
};

export default CustomerDetails;