import React, { useState, useEffect, useRef } from 'react';
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
  Image,
  HStack,
  IconButton,
  Flex,
  Badge,
  Card,
  CardBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  CheckCircleIcon,
  WarningIcon,
  TimeIcon,
  DeleteIcon,
  CheckIcon,
  ArrowForwardIcon,
} from '@chakra-ui/icons';
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
    front_delivery_photo: null,
    back_delivery_photo: null,
    delivery_photo: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [deliveryPhotos, setDeliveryPhotos] = useState({
    front_delivery_photo: null,
    back_delivery_photo: null,
    delivery_photo: null,
  });
  const blobUrlsRef = useRef({});

  const bgGradient = useColorModeValue('linear(to-b, gray.50, gray.100)', 'linear(to-b, gray.800, gray.900)');
  const cardBg = useColorModeValue('gray', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const accentColor = useColorModeValue('blue.600', 'blue.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/customers/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Customer data:', response.data.customer);
        setCustomer(response.data.customer);
        setPriceData({
          ex_showroom: response.data.customer.ex_showroom || '',
          tax: response.data.customer.tax || '',
          insurance: response.data.customer.insurance || '',
          booking_fee: response.data.customer.booking_fee || '',
          accessories: response.data.customer.accessories || '',
          amount_paid: '',
        });

        const imageTypes = [
          'aadhar_front', 'aadhar_back', 'passport_photo',
          'front_delivery_photo', 'back_delivery_photo', 'delivery_photo'
        ];
        const imagePromises = imageTypes.map(async (type) => {
          try {
            console.log(`Fetching ${type} for customer ${customerId}`);
            const imgResponse = await axios.get(`http://localhost:3000/customers/${customerId}/${type}`, {
              headers: { Authorization: `Bearer ${token}` },
              responseType: 'blob',
            });
            const imageUrl = URL.createObjectURL(imgResponse.data);
            console.log(`${type} URL:`, imageUrl);
            return { [type]: imageUrl };
          } catch (err) {
            console.error(`Failed to fetch ${type}:`, err.response?.status);
            return { [type]: null };
          }
        });

        const imageResults = await Promise.all(imagePromises);
        const newImages = Object.assign({}, ...imageResults);
        setImages(newImages);
        blobUrlsRef.current = newImages;
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

    return () => {
      Object.values(blobUrlsRef.current).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
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

  const handleVerify = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:3000/customers/${customerId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomer(response.data.customer);
      toast({
        title: 'Success',
        description: 'Customer verified successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Failed to verify customer:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to verify customer',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: 'Success',
        description: 'Customer deleted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/sales-executive');
    } catch (err) {
      console.error('Failed to delete customer:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to delete customer',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeliveryPhotoChange = (e) => {
    setDeliveryPhotos({ ...deliveryPhotos, [e.target.name]: e.target.files[0] });
  };

  const handleDeliveredSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    if (deliveryPhotos.front_delivery_photo) formData.append('front_delivery_photo', deliveryPhotos.front_delivery_photo);
    if (deliveryPhotos.back_delivery_photo) formData.append('back_delivery_photo', deliveryPhotos.back_delivery_photo);
    if (deliveryPhotos.delivery_photo) formData.append('delivery_photo', deliveryPhotos.delivery_photo);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:3000/customers/${customerId}/delivered`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      setCustomer(response.data.customer);
      setImages(prev => ({
        ...prev,
        front_delivery_photo: deliveryPhotos.front_delivery_photo ? URL.createObjectURL(deliveryPhotos.front_delivery_photo) : prev.front_delivery_photo,
        back_delivery_photo: deliveryPhotos.back_delivery_photo ? URL.createObjectURL(deliveryPhotos.back_delivery_photo) : prev.back_delivery_photo,
        delivery_photo: deliveryPhotos.delivery_photo ? URL.createObjectURL(deliveryPhotos.delivery_photo) : prev.delivery_photo,
      }));
      toast({
        title: 'Success',
        description: 'Customer marked as delivered successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsDeliveryModalOpen(false);
    } catch (err) {
      console.error('Failed to mark customer as delivered:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to mark customer as delivered',
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

  const statusConfig = {
    Pending: { color: 'orange.500', icon: TimeIcon },
    Submitted: { color: 'blue.500', icon: WarningIcon },
    Verified: { color: 'green.500', icon: CheckCircleIcon },
    Delivered: { color: 'purple.500', icon: ArrowForwardIcon },
  };
  const { color: statusColor, icon: StatusIcon } = statusConfig[customer.status] || {};

  return (
    <Box minH="100vh" bg={bgGradient} p={{ base: 2, sm: 4 }}>
      <Box
        maxW={{ base: '100%', md: '800px' }}
        mx="auto"
        bg={cardBg}
        borderRadius={{ base: 'md', md: 'xl' }}
        p={{ base: 3, sm: 5 }}
        boxShadow={{ base: 'md', md: 'lg' }}
      >
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          align={{ base: 'stretch', sm: 'center' }}
          justify="space-between"
          mb={4}
          gap={2}
        >
          <HStack spacing={2} w={{ base: '100%', sm: 'auto' }}>
            <IconButton
              icon={<ArrowBackIcon />}
              onClick={() => navigate('/sales-executive')}
              variant="ghost"
              colorScheme="blue"
              size={{ base: 'md', sm: 'lg' }}
              aria-label="Back to list"
            />
            <Heading size={{ base: 'md', md: 'lg' }} color={accentColor} isTruncated>
              Customer Management
            </Heading>
          </HStack>
          <HStack
            spacing={2}
            wrap="wrap"
            justify={{ base: 'center', sm: 'flex-end' }}
            w={{ base: '100%', sm: 'auto' }}
          >
            <Badge
              variant="subtle"
              colorScheme={statusColor.split('.')[0]}
              px={2}
              py={1}
              borderRadius="full"
              fontSize={{ base: 'xs', sm: 'sm' }}
            >
              <StatusIcon boxSize={3} mr={1} />
              {customer.status}
            </Badge>
            <Button
              leftIcon={<CheckIcon />}
              colorScheme="green"
              size={{ base: 'sm', sm: 'md' }}
              variant="solid"
              onClick={handleVerify}
              isDisabled={customer.status === 'Verified' || customer.status === 'Delivered'}
            >
              Verify
            </Button>
            <Button
              leftIcon={<DeleteIcon />}
              colorScheme="red"
              size={{ base: 'sm', sm: 'md' }}
              variant="outline"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete
            </Button>
            <Button
              leftIcon={<ArrowForwardIcon />}
              colorScheme="blue"
              size={{ base: 'sm', sm: 'md' }}
              variant="solid"
              onClick={() => setIsDeliveryModalOpen(true)}
              isDisabled={customer.status === 'Delivered'}
            >
              Delivered
            </Button>
          </HStack>
        </Flex>

        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          <VStack spacing={4} align="stretch">
            <Card bg="gray.700" borderRadius="md">
              <CardBody p={{ base: 3, sm: 4 }}>
                <Text fontWeight="semibold" color={accentColor} mb={2}>
                  Booking Info
                </Text>
                <VStack spacing={1} align="start" fontSize={{ base: 'sm', md: 'md' }}>
                  <Text color={textColor}><strong>Name:</strong> {customer.customer_name}</Text>
                  <Text color={textColor}><strong>Vehicle:</strong> {customer.vehicle}</Text>
                  <Text color={textColor}><strong>Variant:</strong> {customer.variant || 'N/A'}</Text>
                </VStack>
              </CardBody>
            </Card>

            <Card bg="gray.700" borderRadius="md">
              <CardBody p={{ base: 3, sm: 4 }}>
                <Text fontWeight="semibold" color={accentColor} mb={2}>
                  Customer Details
                </Text>
                <VStack spacing={1} align="start" fontSize={{ base: 'sm', md: 'md' }}>
                  <Text color={textColor}><strong>DOB:</strong> {customer.dob || 'N/A'}</Text>
                  <Text color={textColor}><strong>Address:</strong> {customer.address || 'N/A'}</Text>
                  <Text color={textColor}><strong>Mobile:</strong> {customer.mobile_1 || 'N/A'}</Text>
                  {customer.mobile_2 && <Text color={textColor}><strong>Mobile 2:</strong> {customer.mobile_2}</Text>}
                  <Text color={textColor}><strong>Email:</strong> {customer.email || 'N/A'}</Text>
                  <Text color={textColor}><strong>Nominee:</strong> {customer.nominee || 'N/A'}</Text>
                  {customer.payment_mode === 'Finance' && (
                    <>
                      <Text color={textColor}><strong>Finance Co:</strong> {customer.finance_company || 'N/A'}</Text>
                      <Text color={textColor}><strong>Finance Amount:</strong> ₹{customer.finance_amount?.toLocaleString() || 'N/A'}</Text>
                    </>
                  )}
                  <Divider my={2} />
                  <Text color={textColor}><strong>Sales Verified:</strong> {customer.sales_verified ? 'Yes' : 'No'}</Text>
                  <Text color={textColor}><strong>Accounts Verified:</strong> {customer.accounts_verified ? 'Yes' : 'No'}</Text>
                  <Text color={textColor}><strong>Manager Verified:</strong> {customer.manager_verified ? 'Yes' : 'No'}</Text>
                  <Text color={textColor}><strong>RTO Verified:</strong> {customer.rto_verified ? 'Yes' : 'No'}</Text>
                </VStack>
              </CardBody>
            </Card>

            <Card bg="gray.700" borderRadius="md">
              <CardBody p={{ base: 3, sm: 4 }}>
                <Text fontWeight="semibold" color={accentColor} mb={2}>
                  Documents
                </Text>
                <Grid templateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }} gap={3}>
                  {[
                    'aadhar_front', 'aadhar_back', 'passport_photo',
                    'front_delivery_photo', 'back_delivery_photo', 'delivery_photo'
                  ].map((type) => (
                    <Box key={type} bg={cardBg} p={2} borderRadius="md" border="1px" borderColor={borderColor}>
                      <Text color={textColor} fontSize="sm" fontWeight="medium" mb={1}>
                        {type.replace('_', ' ').toUpperCase()}
                      </Text>
                      {images[type] ? (
                        <Image
                          src={images[type]}
                          maxW={{ base: '100%', sm: '120px' }}
                          borderRadius="md"
                          objectFit="cover"
                          alt={`${type} document`}
                          fallback={<Text color="gray.400">Loading...</Text>}
                        />
                      ) : (
                        <Text color="gray.400" fontSize="xs">Not uploaded</Text>
                      )}
                    </Box>
                  ))}
                </Grid>
              </CardBody>
            </Card>
          </VStack>

          <VStack spacing={4} align="stretch">
            <Card bg="gray.700" borderRadius="md">
              <CardBody p={{ base: 3, sm: 4 }}>
                <Text fontWeight="semibold" color={accentColor} mb={2}>
                  Price Details
                </Text>
                <form onSubmit={handlePriceSubmit}>
                  <VStack spacing={3}>
                    {[
                      { label: 'Ex-Showroom', name: 'ex_showroom' },
                      { label: 'Tax', name: 'tax' },
                      { label: 'Insurance', name: 'insurance' },
                      { label: 'Booking Fee', name: 'booking_fee' },
                      { label: 'Accessories', name: 'accessories' },
                    ].map(({ label, name }) => (
                      <FormControl key={name}>
                        <FormLabel fontSize="sm" color={textColor}>{label}</FormLabel>
                        <Input
                          name={name}
                          type="number"
                          value={priceData[name]}
                          onChange={handleInputChange}
                          size="sm"
                          variant="outline"
                          bg="gray.600"
                          borderColor="gray.200"
                          _focus={{ borderColor: accentColor }}
                        />
                      </FormControl>
                    ))}
                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="md"
                      w="full"
                      isLoading={isSubmitting}
                      mt={2}
                    >
                      Update Price
                    </Button>
                  </VStack>
                </form>
              </CardBody>
            </Card>

            <Card bg="gray.700" borderRadius="md">
              <CardBody p={{ base: 3, sm: 4 }}>
                <Text fontWeight="semibold" color={accentColor} mb={2}>
                  Add Payment
                </Text>
                <form onSubmit={handlePaymentSubmit}>
                  <VStack spacing={3}>
                    <FormControl>
                      <FormLabel fontSize="sm" color={textColor}>Amount Paid</FormLabel>
                      <Input
                        name="amount_paid"
                        type="number"
                        value={priceData.amount_paid}
                        onChange={handleInputChange}
                        size="sm"
                        variant="outline"
                        bg="gray.600"
                        borderColor="gray.200"
                        _focus={{ borderColor: accentColor }}
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="md"
                      w="full"
                      isLoading={isSubmitting}
                    >
                      Add Payment
                    </Button>
                  </VStack>
                </form>
              </CardBody>
            </Card>

            <Card bg="gray.700" borderRadius="md">
              <CardBody p={{ base: 3, sm: 4 }}>
                <Text fontWeight="semibold" color={accentColor} mb={2}>
                  Price Summary
                </Text>
                <VStack spacing={1} align="start" fontSize={{ base: 'sm', md: 'md' }}>
                  <Grid templateColumns="1fr 1fr" gap={2} w="full">
                    <Text color={textColor}>Ex-Showroom:</Text>
                    <Text color={textColor}>₹{customer.ex_showroom?.toLocaleString() || '0'}</Text>
                    <Text color={textColor}>Tax:</Text>
                    <Text color={textColor}>₹{customer.tax?.toLocaleString() || '0'}</Text>
                    <Text color={textColor}>Insurance:</Text>
                    <Text color={textColor}>₹{customer.insurance?.toLocaleString() || '0'}</Text>
                    <Text color={textColor}>Booking Fee:</Text>
                    <Text color={textColor}>₹{customer.booking_fee?.toLocaleString() || '0'}</Text>
                    <Text color={textColor}>Accessories:</Text>
                    <Text color={textColor}>₹{customer.accessories?.toLocaleString() || '0'}</Text>
                  </Grid>
                  <Divider my={2} />
                  <Text fontWeight="semibold" color={textColor}>
                    Total: ₹{customer.total_price?.toLocaleString() || '0'}
                  </Text>
                  <Text color={textColor}>
                    Paid: ₹{customer.amount_paid?.toLocaleString() || '0'}
                  </Text>
                  <Text color={remainingAmount > 0 ? 'red.500' : 'green.500'}>
                    Remaining: ₹{remainingAmount.toLocaleString()}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </VStack>
      </Box>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this customer? This action cannot be undone.</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delivery Photos Modal */}
      <Modal isOpen={isDeliveryModalOpen} onClose={() => setIsDeliveryModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mark as Delivered</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleDeliveredSubmit}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Front Delivery Photo</FormLabel>
                  <Input
                    type="file"
                    name="front_delivery_photo"
                    accept="image/*"
                    onChange={handleDeliveryPhotoChange}
                    variant="outline"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Back Delivery Photo</FormLabel>
                  <Input
                    type="file"
                    name="back_delivery_photo"
                    accept="image/*"
                    onChange={handleDeliveryPhotoChange}
                    variant="outline"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Delivery Photo</FormLabel>
                  <Input
                    type="file"
                    name="delivery_photo"
                    accept="image/*"
                    onChange={handleDeliveryPhotoChange}
                    variant="outline"
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  w="full"
                  isLoading={isSubmitting}
                >
                  Submit Delivery Photos
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CustomerManagement;