import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  useColorModeValue,
  Divider,
  Grid,
  GridItem,
  Image,
} from '@chakra-ui/react';
import axios from 'axios';

const CustomerManagement = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [customer, setCustomer] = useState(null);
  const [priceData, setPriceData] = useState({
    ex_showroom: '',
    tax: '',
    insurance: '',
    booking_fee: '',
    accessories: '',
    amount_paid: '',
  });
  const [images, setImages] = useState({
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
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/customers/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomer(response.data.customer);
        setPriceData({
          ex_showroom: response.data.customer.ex_showroom || '',
          tax: response.data.customer.tax || '',
          insurance: response.data.customer.insurance || '',
          booking_fee: response.data.customer.booking_fee || '',
          accessories: response.data.customer.accessories || '',
          amount_paid: '',
        });

        // Fetch images
        const imageTypes = ['aadhar_front', 'aadhar_back', 'passport_photo'];
        const imagePromises = imageTypes.map(async (type) => {
          if (response.data.customer[type]) {
            const imgResponse = await axios.get(`http://localhost:3000/customers/${customerId}/${type}`, {
              headers: { Authorization: `Bearer ${token}` },
              responseType: 'blob',
            });
            return { [type]: URL.createObjectURL(imgResponse.data) };
          }
          return { [type]: null };
        });

        const imageResults = await Promise.all(imagePromises);
        setImages(Object.assign({}, ...imageResults));
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
    setPriceData({ ...priceData, [e.target.name]: e.target.value });
  };

  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:3000/customers/${customerId}`,
        priceData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomer(response.data.customer);
      toast({
        title: 'Success',
        description: 'Price details updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Failed to update price details:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to update price details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!priceData.amount_paid) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:3000/customers/${customerId}/payments`,
        { amount: priceData.amount_paid },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomer(response.data.customer);
      setPriceData(prev => ({ ...prev, amount_paid: '' }));
      toast({
        title: 'Success',
        description: 'Payment updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Failed to update payment:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to update payment',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!customer) return <Text>Loading...</Text>;

  const remainingAmount = (customer.total_price || 0) - (customer.amount_paid || 0);

  return (
    <Box minH="100vh" bg={bgGradient} p={{ base: 4, md: 6 }}>
      <Box maxW="800px" mx="auto" bg={cardBg} borderRadius="lg" p={6} boxShadow="lg">
        <Heading size="lg" mb={4} color="purple.600" textAlign="center">Customer Management</Heading>

        {/* Booking Details */}
        <VStack spacing={3} mb={6} align="stretch">
          <Text fontWeight="bold" color={textColor}>Booking Information</Text>
          <Text color={textColor}>Name: {customer.customer_name}</Text>
          <Text color={textColor}>Vehicle: {customer.vehicle}</Text>
          <Text color={textColor}>Variant: {customer.variant || 'Not specified'}</Text>
          <Text color={textColor}>Status: {customer.status}</Text>
        </VStack>

        {/* Customer Uploaded Details */}
        <VStack spacing={3} mb={6} align="stretch">
          <Text fontWeight="bold" color={textColor}>Customer Details</Text>
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

        {/* Uploaded Images */}
        <VStack spacing={3} mb={6} align="stretch">
          <Text fontWeight="bold" color={textColor}>Uploaded Images</Text>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={4}>
            <Box>
              <Text color={textColor}>Aadhar Front</Text>
              {images.aadhar_front ? <Image src={images.aadhar_front} maxW="200px" /> : <Text color="gray.500">Not uploaded</Text>}
            </Box>
            <Box>
              <Text color={textColor}>Aadhar Back</Text>
              {images.aadhar_back ? <Image src={images.aadhar_back} maxW="200px" /> : <Text color="gray.500">Not uploaded</Text>}
            </Box>
            <Box>
              <Text color={textColor}>Passport Photo</Text>
              {images.passport_photo ? <Image src={images.passport_photo} maxW="200px" /> : <Text color="gray.500">Not uploaded</Text>}
            </Box>
          </Grid>
        </VStack>

        {/* Price Details Form */}
        <form onSubmit={handlePriceSubmit}>
          <VStack spacing={4} mb={6} align="stretch">
            <Text fontWeight="bold" color={textColor}>Update Price Details</Text>
            <FormControl>
              <FormLabel color={textColor}>Ex-Showroom</FormLabel>
              <Input name="ex_showroom" type="number" value={priceData.ex_showroom} onChange={handleInputChange} variant="filled" />
            </FormControl>
            <FormControl>
              <FormLabel color={textColor}>Tax</FormLabel>
              <Input name="tax" type="number" value={priceData.tax} onChange={handleInputChange} variant="filled" />
            </FormControl>
            <FormControl>
              <FormLabel color={textColor}>Insurance</FormLabel>
              <Input name="insurance" type="number" value={priceData.insurance} onChange={handleInputChange} variant="filled" />
            </FormControl>
            <FormControl>
              <FormLabel color={textColor}>Booking Fee</FormLabel>
              <Input name="booking_fee" type="number" value={priceData.booking_fee} onChange={handleInputChange} variant="filled" />
            </FormControl>
            <FormControl>
              <FormLabel color={textColor}>Accessories</FormLabel>
              <Input name="accessories" type="number" value={priceData.accessories} onChange={handleInputChange} variant="filled" />
            </FormControl>
            <Button type="submit" colorScheme="purple" size="lg" w="full" isLoading={isSubmitting}>Update Price</Button>
          </VStack>
        </form>

        {/* Payment Form */}
        <form onSubmit={handlePaymentSubmit}>
          <VStack spacing={4} mb={6} align="stretch">
            <Text fontWeight="bold" color={textColor}>Add Payment</Text>
            <FormControl>
              <FormLabel color={textColor}>Amount Paid</FormLabel>
              <Input name="amount_paid" type="number" value={priceData.amount_paid} onChange={handleInputChange} variant="filled" />
            </FormControl>
            <Button type="submit" colorScheme="purple" size="lg" w="full" isLoading={isSubmitting}>Add Payment</Button>
          </VStack>
        </form>

        {/* Price Summary */}
        <VStack spacing={3} align="stretch">
          <Text fontWeight="bold" color={textColor}>Price Summary</Text>
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

        <Button mt={6} colorScheme="gray" onClick={() => navigate('/sales-executive')}>Back to List</Button>
      </Box>
    </Box>
  );
};

export default CustomerManagement;