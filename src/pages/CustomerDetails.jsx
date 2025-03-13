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
  useColorModeValue,
  Divider,
  Grid,
  GridItem,
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
        setFormData(prev => ({
          ...prev,
          name: response.data.customer.customer_name,
          mobile_1: response.data.customer.phone_number,
          dob: response.data.customer.dob || '',
          address: response.data.customer.address || '',
          mobile_2: response.data.customer.mobile_2 || '',
          email: response.data.customer.email || '',
          nominee: response.data.customer.nominee || '',
          nominee_relation: response.data.customer.nominee_relation || '',
          payment_mode: response.data.customer.payment_mode || '',
          finance_company: response.data.customer.finance_company || '',
          finance_amount: response.data.customer.finance_amount || '',
        }));
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
    Object.keys(formData).forEach(key => formData[key] && formDataToSend.append(key, formData[key]));
    if (files.aadhar_front) formDataToSend.append('aadhar_front', files.aadhar_front);
    if (files.aadhar_back) formDataToSend.append('aadhar_back', files.aadhar_back);
    if (files.passport_photo) formDataToSend.append('passport_photo', files.passport_photo);

    try {
      const response = await axios.put(`http://localhost:3000/customers/${customerId}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCustomer(response.data.customer);
      toast({
        title: ' TectSuccess',
        description: response.data.customer.status === 'Submitted' ? 'Details fully submitted!' : 'Details updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
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

  const remainingAmount = (customer.total_price || 0) - (customer.amount_paid || 0);

  return (
    <Box minH="100vh" bg={bgGradient} p={{ base: 4, md: 6 }} display="flex" justifyContent="center" alignItems="center">
      <Box maxW={{ base: '100%', md: '600px' }} w="full" bg={cardBg} borderRadius="lg" p={6} boxShadow="lg">
        <Heading size="lg" mb={4} color="purple.600" textAlign="center">Customer Details</Heading>

        {/* Booking Details */}
        <VStack spacing={3} mb={6} align="stretch">
          <Text fontWeight="bold" color={textColor}>Booking Information</Text>
          <Text color={textColor}>Name: {customer.customer_name}</Text>
          <Text color={textColor}>Vehicle: {customer.vehicle}</Text>
          <Text color={textColor}>Variant: {customer.variant || 'Not specified Eco'}</Text>
          <Text color={textColor}>Status: {customer.status}</Text>
        </VStack>

        {customer.status === 'Pending' ? (
          // Form for Partial Submission
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel color={textColor}>Full Name</FormLabel>
                <Input name="name" value={formData.name} onChange={handleInputChange} variant="filled" isDisabled />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Date of Birth</FormLabel>
                <Input name="dob" type="date" value={formData.dob} onChange={handleInputChange} variant="filled" />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Address</FormLabel>
                <Input name="address" value={formData.address} onChange={handleInputChange} variant="filled" />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Mobile 1</FormLabel>
                <Input name="mobile_1" value={formData.mobile_1} onChange={handleInputChange} variant="filled" isDisabled />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Mobile 2 (Optional)</FormLabel>
                <Input name="mobile_2" value={formData.mobile_2} onChange={handleInputChange} variant="filled" />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Email</FormLabel>
                <Input name="email" type="email" value={formData.email} onChange={handleInputChange} variant="filled" />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Nominee</FormLabel>
                <Input name="nominee" value={formData.nominee} onChange={handleInputChange} variant="filled" />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Relation with Nominee</FormLabel>
                <Input name="nominee_relation" value={formData.nominee_relation} onChange={handleInputChange} variant="filled" />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Payment Mode</FormLabel>
                <Select name="payment_mode" value={formData.payment_mode} onChange={handleInputChange} variant="filled" placeholder="Select payment mode">
                  <option value="Cash">Cash</option>
                  <option value="Finance">Finance</option>
                </Select>
              </FormControl>
              {formData.payment_mode === 'Finance' && (
                <>
                  <FormControl>
                    <FormLabel color={textColor}>Finance Company</FormLabel>
                    <Input name="finance_company" value={formData.finance_company} onChange={handleInputChange} variant="filled" />
                  </FormControl>
                  <FormControl>
                    <FormLabel color={textColor}>Finance Amount</FormLabel>
                    <Input name="finance_amount" type="number" value={formData.finance_amount} onChange={handleInputChange} variant="filled" />
                  </FormControl>
                </>
              )}
              <FormControl>
                <FormLabel color={textColor}>Aadhar Front</FormLabel>
                <Input name="aadhar_front" type="file" accept="image/*" onChange={handleFileChange} variant="filled" />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Aadhar Back</FormLabel>
                <Input name="aadhar_back" type="file" accept="image/*" onChange={handleFileChange} variant="filled" />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Passport-Size Photo</FormLabel>
                <Input name="passport_photo" type="file" accept="image/*" onChange={handleFileChange} variant="filled" />
              </FormControl>
              <Button type="submit" colorScheme="purple" size="lg" w="full" isLoading={isSubmitting}>Update Details</Button>
            </VStack>
          </form>
        ) : (
          // Display Submitted Details and Price Breakdown
          <VStack spacing={6} align="stretch">
            <VStack spacing={3} align="stretch">
              <Text fontWeight="bold" color={textColor}>Submitted Details</Text>
              <Text color={textColor}>Name: {customer.customer_name}</Text>
              <Text color={textColor}>Date of Birth: {customer.dob || 'Not provided'}</Text>
              <Text color={textColor}>Address: {customer.address || 'Not provided'}</Text>
              <Text color={textColor}>Mobile 1: {customer.mobile_1 || 'Not provided'}</Text>
              <Text color={textColor}>Mobile 2: {customer.mobile_2 || 'Not provided'}</Text>
              <Text color={textColor}>Email: {customer.email || 'Not provided'}</Text>
              <Text color={textColor}>Nominee: {customer.nominee || 'Not provided'}</Text>
              <Text color={textColor}>Nominee Relation: {customer.nominee_relation || 'Not provided'}</Text>
              <Text color={textColor}>Payment Mode: {customer.payment_mode || 'Not provided'}</Text>
              {customer.payment_mode === 'Finance' && (
                <>
                  <Text color={textColor}>Finance Company: {customer.finance_company || 'Not provided'}</Text>
                  <Text color={textColor}>Finance Amount: ₹{customer.finance_amount?.toLocaleString() || 'Not provided'}</Text>
                </>
              )}
            </VStack>

            <Divider />

            <VStack spacing={3} align="stretch">
              <Text fontWeight="bold" color={textColor}>Price Details</Text>
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={2}>
                <GridItem><Text color={textColor}>Ex-Showroom: ₹{customer.ex_showroom?.toLocaleString() || '0'}</Text></GridItem>
                <GridItem><Text color={textColor}>Tax: ₹{customer.tax?.toLocaleString() || '0'}</Text></GridItem>
                <GridItem><Text color={textColor}>Insurance: ₹{customer.insurance?.toLocaleString() || '0'}</Text></GridItem>
                <GridItem><Text color={textColor}>Booking Fee: ₹{customer.booking_fee?.toLocaleString() || '0'}</Text></GridItem>
                <GridItem><Text color={textColor}>Accessories: ₹{customer.accessories?.toLocaleString() || '0'}</Text></GridItem>
              </Grid>
              <Divider />
              <Text fontWeight="bold" color={textColor}>Total Price: ₹{customer.total_price?.toLocaleString() || '0'}</Text>
              <Text color={textColor}>Amount Paid: ₹{customer.amount_paid?.toLocaleString() || '0'}</Text>
              <Text color={textColor}>Remaining Amount: ₹{remainingAmount.toLocaleString()}</Text>
            </VStack>
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default CustomerDetails;