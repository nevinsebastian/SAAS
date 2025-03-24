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
  SimpleGrid,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import {
  ArrowBackIcon,
  CheckCircleIcon,
  WarningIcon,
  TimeIcon,
  DeleteIcon,
  CheckIcon,
  ArrowForwardIcon,
  CopyIcon,
} from '@chakra-ui/icons';
import axios from 'axios';

// Define animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  // Move all useColorModeValue hooks to the top
  const mainBg = useColorModeValue(
    'linear-gradient(135deg, #f6f8ff 0%, #f0e7ff 100%)',
    'linear-gradient(135deg, #0f1729 0%, #1a1f35 100%)'
  );
  
  const glassEffect = {
    backgroundColor: useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(13, 15, 25, 0.7)'),
    backdropFilter: 'blur(5px)',
    boxShadow: useColorModeValue(
      '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
    ),
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const accentGradient = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(26, 32, 44, 0.7)');
  const inputBg = useColorModeValue('rgba(255, 255, 255, 0.5)', 'rgba(45, 55, 72, 0.3)');
  const hoverInputBg = useColorModeValue('rgba(255, 255, 255, 0.6)', 'rgba(45, 55, 72, 0.4)');
  const bgGradient = useColorModeValue('linear(to-b, gray.50, gray.100)', 'linear(to-b, gray.800, gray.900)');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const accentColor = useColorModeValue('blue.600', 'blue.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const modalBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(13, 15, 25, 0.9)');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://172.20.10.8:3000/customers/${customerId}`, {
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
            const imgResponse = await axios.get(`http://172.20.10.8:3000/customers/${customerId}/${type}`, {
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
        `http://172.20.10.8:3000/customers/${customerId}`,
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
        `http://172.20.10.8:3000/customers/${customerId}/payments`,
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
        `http://172.20.10.8:3000/customers/${customerId}/verify`,
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
      await axios.delete(`http://172.20.10.8:3000/customers/${customerId}`, {
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
        `http://172.20.10.8:3000/customers/${customerId}/delivered`,
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

  // Update Input components to use the pre-computed hover background
  const inputProps = {
    bg: inputBg,
    border: 'none',
    _focus: {
      boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.4)',
      borderColor: 'transparent'
    },
    _hover: { bg: hoverInputBg },
    transition: 'all 0.2s'
  };

  return (
    <Box 
      minH="100vh" 
      bgGradient={mainBg}
      p={{ base: 2, sm: 4 }}
      overflowY="auto"
      sx={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: accentGradient,
          borderRadius: '24px',
        },
      }}
    >
      <Box
        maxW={{ base: '100%', md: '1000px' }}
        mx="auto"
        {...glassEffect}
        borderRadius={{ base: 'xl', md: '2xl' }}
        p={{ base: 4, sm: 6 }}
        animation={`${fadeIn} 0.5s ease-out`}
      >
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          align={{ base: 'stretch', sm: 'center' }}
          justify="space-between"
          mb={6}
          gap={3}
        >
          <HStack spacing={3} w={{ base: '100%', sm: 'auto' }}>
            <IconButton
              icon={<ArrowBackIcon />}
              onClick={() => navigate('/sales-executive')}
              variant="ghost"
              size={{ base: 'md', sm: 'lg' }}
              aria-label="Back to list"
              _hover={{ 
                transform: 'translateX(-3px)',
                bg: 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s'
              }}
            />
            <Heading 
              size={{ base: 'md', md: 'lg' }} 
              bgGradient={accentGradient}
              bgClip="text"
              letterSpacing="tight"
            >
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
              px={3}
              py={1.5}
              borderRadius="full"
              fontSize={{ base: 'xs', sm: 'sm' }}
              {...glassEffect}
              display="flex"
              alignItems="center"
              animation={`${slideIn} 0.5s ease-out`}
            >
              <StatusIcon boxSize={3} mr={1.5} />
              {customer.status}
            </Badge>
            <Button
              leftIcon={<CheckIcon />}
              bgGradient="linear(to-r, green.400, green.600)"
              color="white"
              size={{ base: 'sm', sm: 'md' }}
              onClick={handleVerify}
              isDisabled={customer.status === 'Verified' || customer.status === 'Delivered'}
              _hover={{ 
                transform: 'translateY(-2px)',
                bgGradient: 'linear(to-r, green.500, green.700)',
                boxShadow: 'lg'
              }}
              transition="all 0.2s"
            >
              Verify
            </Button>
            <Button
              leftIcon={<DeleteIcon />}
              variant="outline"
              size={{ base: 'sm', sm: 'md' }}
              onClick={() => setIsDeleteModalOpen(true)}
              borderColor="red.400"
              color="red.400"
              _hover={{ 
                transform: 'translateY(-2px)',
                bg: 'rgba(255, 0, 0, 0.1)',
                boxShadow: 'lg'
              }}
              transition="all 0.2s"
            >
              Delete
            </Button>
            <Button
              leftIcon={<ArrowForwardIcon />}
              bgGradient={accentGradient}
              color="white"
              size={{ base: 'sm', sm: 'md' }}
              onClick={() => setIsDeliveryModalOpen(true)}
              isDisabled={customer.status === 'Delivered'}
              _hover={{ 
                transform: 'translateY(-2px)',
                opacity: 0.9,
                boxShadow: 'lg'
              }}
              transition="all 0.2s"
            >
              Delivered
            </Button>
          </HStack>
        </Flex>

        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* Booking Info Card */}
            <Card 
              {...glassEffect} 
              borderRadius="xl"
              animation={`${fadeIn} 0.6s ease-out`}
              _hover={{ transform: 'translateY(-3px)', transition: 'all 0.2s' }}
            >
              <CardBody p={{ base: 4, sm: 6 }}>
                <Text 
                  fontWeight="semibold" 
                  bgGradient={accentGradient}
                  bgClip="text"
                  mb={4}
                  fontSize="lg"
                >
                  Booking Info
                </Text>
                <VStack spacing={3} align="start">
                  <HStack spacing={4} width="100%">
                    <Text color="gray.500" fontSize="sm">Name:</Text>
                    <Text fontWeight="medium">{customer.customer_name}</Text>
                  </HStack>
                  <HStack spacing={4} width="100%">
                    <Text color="gray.500" fontSize="sm">Vehicle:</Text>
                    <Text fontWeight="medium">{customer.vehicle}</Text>
                  </HStack>
                  <HStack spacing={4} width="100%">
                    <Text color="gray.500" fontSize="sm">Variant:</Text>
                    <Text fontWeight="medium">{customer.variant || 'N/A'}</Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Customer Details Card */}
            <Card 
              {...glassEffect} 
              borderRadius="xl"
              animation={`${fadeIn} 0.7s ease-out`}
              _hover={{ transform: 'translateY(-3px)', transition: 'all 0.2s' }}
            >
              <CardBody p={{ base: 4, sm: 6 }}>
                <Text 
                  fontWeight="semibold" 
                  bgGradient={accentGradient}
                  bgClip="text"
                  mb={4}
                  fontSize="lg"
                >
                  Customer Details
                </Text>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                  <HStack spacing={4}>
                    <Text color="gray.500" fontSize="sm">DOB:</Text>
                    <Text fontWeight="medium">{customer.dob || 'N/A'}</Text>
                  </HStack>
                  <HStack spacing={4}>
                    <Text color="gray.500" fontSize="sm">Mobile:</Text>
                    <Text fontWeight="medium">{customer.mobile_1 || 'N/A'}</Text>
                  </HStack>
                  {customer.mobile_2 && (
                    <HStack spacing={4}>
                      <Text color="gray.500" fontSize="sm">Mobile 2:</Text>
                      <Text fontWeight="medium">{customer.mobile_2}</Text>
                    </HStack>
                  )}
                  <HStack spacing={4}>
                    <Text color="gray.500" fontSize="sm">Email:</Text>
                    <Text fontWeight="medium">{customer.email || 'N/A'}</Text>
                  </HStack>
                </SimpleGrid>
                <Divider my={4} opacity={0.1} />
                <Text fontWeight="medium" mb={2}>Address:</Text>
                <Text fontSize="sm" color="gray.500">{customer.address || 'N/A'}</Text>
                <Divider my={4} opacity={0.1} />
                <Box>
                  <Text fontWeight="medium" mb={2}>Customer Link:</Text>
                  <HStack 
                    spacing={2} 
                    bgGradient={accentGradient}
                    p={2} 
                    borderRadius="lg" 
                    border="1px solid" 
                    borderColor="whiteAlpha.300"
                    boxShadow="sm"
                  >
                    <Text 
                      fontSize="sm" 
                      color="whiteAlpha.900" 
                      wordBreak="break-all" 
                      flex="1"
                    >
                      http://172.20.10.8:3001/customer-details/{customer.id}
                    </Text>
                    <IconButton
                      icon={<CopyIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red.600"
                      onClick={() => {
                        const link = `http://172.20.10.8:3001/customer-details/${customer.id}`;
                        if (navigator.clipboard && window.isSecureContext) {
                          navigator.clipboard.writeText(link)
                            .then(() => {
                              toast({
                                title: 'Success',
                                description: 'Link copied to clipboard!',
                                status: 'success',
                                duration: 2000,
                                isClosable: true,
                              });
                            })
                            .catch(() => {
                              toast({
                                title: 'Error',
                                description: 'Failed to copy link',
                                status: 'error',
                                duration: 2000,
                                isClosable: true,
                              });
                            });
                        } else {
                          // Fallback for older browsers
                          const tempInput = document.createElement('input');
                          tempInput.value = link;
                          document.body.appendChild(tempInput);
                          tempInput.select();
                          tempInput.setSelectionRange(0, 99999);
                          try {
                            document.execCommand('copy');
                            toast({
                              title: 'Success',
                              description: 'Link copied to clipboard!',
                              status: 'success',
                              duration: 2000,
                              isClosable: true,
                            });
                          } catch (err) {
                            toast({
                              title: 'Error',
                              description: 'Failed to copy link',
                              status: 'error',
                              duration: 2000,
                              isClosable: true,
                            });
                          }
                          document.body.removeChild(tempInput);
                        }
                      }}
                      aria-label="Copy link"
                      _hover={{ bg: "purple.100" }}
                      transition="all 0.2s"
                    />
                  </HStack>
                </Box>
              </CardBody>
            </Card>

            {/* Documents Section */}
            <Card 
              {...glassEffect} 
              borderRadius="xl" 
              gridColumn={{ base: "1", md: "span 2" }}
              animation={`${fadeIn} 0.8s ease-out`}
            >
              <CardBody p={{ base: 4, sm: 6 }}>
                <Text 
                  fontWeight="semibold" 
                  bgGradient={accentGradient}
                  bgClip="text"
                  mb={4}
                  fontSize="lg"
                >
                  Documents
                </Text>
                <Grid 
                  templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }} 
                  gap={4}
                >
                  {[
                    'aadhar_front', 'aadhar_back', 'passport_photo',
                    'front_delivery_photo', 'back_delivery_photo', 'delivery_photo'
                  ].map((type, index) => (
                    <Box
                      key={type}
                      {...glassEffect}
                      p={3}
                      borderRadius="lg"
                      transition="all 0.2s"
                      _hover={{ transform: 'scale(1.05)' }}
                      animation={`${fadeIn} ${0.9 + index * 0.1}s ease-out`}
                    >
                      <Text 
                        color="gray.500" 
                        fontSize="xs" 
                        fontWeight="medium" 
                        mb={2}
                        textTransform="capitalize"
                      >
                        {type.split('_').join(' ')}
                      </Text>
                      {images[type] ? (
                        <Image
                          src={images[type]}
                          maxW="100%"
                          borderRadius="md"
                          objectFit="cover"
                          alt={`${type} document`}
                          fallback={<Text color="gray.400">Loading...</Text>}
                          transition="all 0.2s"
                          _hover={{ transform: 'scale(1.05)', cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedImage({ url: images[type], title: type.split('_').join(' ') });
                            setIsImagePreviewOpen(true);
                          }}
                        />
                      ) : (
                        <Flex 
                          align="center" 
                          justify="center" 
                          bg="gray.700" 
                          borderRadius="md" 
                          p={2}
                          opacity={0.5}
                        >
                        <Text color="gray.400" fontSize="xs">Not uploaded</Text>
                        </Flex>
                      )}
                    </Box>
                  ))}
                </Grid>
              </CardBody>
            </Card>

            {/* Price Details Form */}
            <Card 
              {...glassEffect} 
              borderRadius="xl"
              animation={`${fadeIn} 0.9s ease-out`}
            >
              <CardBody p={{ base: 4, sm: 6 }}>
                <Text 
                  fontWeight="semibold" 
                  bgGradient={accentGradient}
                  bgClip="text"
                  mb={4}
                  fontSize="lg"
                >
                  Price Details
                </Text>
                <form onSubmit={handlePriceSubmit}>
                  <VStack spacing={4}>
                    {[
                      { label: 'Ex-Showroom', name: 'ex_showroom' },
                      { label: 'Tax', name: 'tax' },
                      { label: 'Insurance', name: 'insurance' },
                      { label: 'Booking Fee', name: 'booking_fee' },
                      { label: 'Accessories', name: 'accessories' },
                    ].map(({ label, name }) => (
                      <FormControl key={name}>
                        <FormLabel fontSize="sm" color="gray.500">{label}</FormLabel>
                        <Input
                          name={name}
                          type="number"
                          value={priceData[name]}
                          onChange={handleInputChange}
                          {...inputProps}
                        />
                      </FormControl>
                    ))}
                    <Button
                      type="submit"
                      bgGradient={accentGradient}
                      color="white"
                      size="lg"
                      w="full"
                      isLoading={isSubmitting}
                      _hover={{ 
                        transform: 'translateY(-2px)',
                        opacity: 0.9,
                        boxShadow: 'lg'
                      }}
                      transition="all 0.2s"
                    >
                      Update Price
                    </Button>
                  </VStack>
                </form>
              </CardBody>
            </Card>

            {/* Add Payment Form */}
            <Card 
              {...glassEffect} 
              borderRadius="xl"
              animation={`${fadeIn} 1s ease-out`}
            >
              <CardBody p={{ base: 4, sm: 6 }}>
                <Text 
                  fontWeight="semibold" 
                  bgGradient={accentGradient}
                  bgClip="text"
                  mb={4}
                  fontSize="lg"
                >
                  Add Payment
                </Text>
                <form onSubmit={handlePaymentSubmit}>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" color="gray.500">Amount Paid</FormLabel>
                      <Input
                        name="amount_paid"
                        type="number"
                        value={priceData.amount_paid}
                        onChange={handleInputChange}
                        {...inputProps}
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      bgGradient={accentGradient}
                      color="white"
                      size="lg"
                      w="full"
                      isLoading={isSubmitting}
                      _hover={{ 
                        transform: 'translateY(-2px)',
                        opacity: 0.9,
                        boxShadow: 'lg'
                      }}
                      transition="all 0.2s"
                    >
                      Add Payment
                    </Button>
                  </VStack>
                </form>
              </CardBody>
            </Card>

            {/* Price Summary */}
            <Card 
              {...glassEffect} 
              borderRadius="xl"
              animation={`${fadeIn} 1.1s ease-out`}
              gridColumn={{ base: "1", md: "span 2" }}
            >
              <CardBody p={{ base: 4, sm: 6 }}>
                <Text 
                  fontWeight="semibold" 
                  bgGradient={accentGradient}
                  bgClip="text"
                  mb={4}
                  fontSize="lg"
                >
                  Price Summary
                </Text>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                  <Box>
                    <Text color="gray.500" fontSize="sm">Ex-Showroom</Text>
                    <Text fontSize="lg" fontWeight="bold">₹{customer.ex_showroom?.toLocaleString() || '0'}</Text>
                  </Box>
                  <Box>
                    <Text color="gray.500" fontSize="sm">Tax</Text>
                    <Text fontSize="lg" fontWeight="bold">₹{customer.tax?.toLocaleString() || '0'}</Text>
                  </Box>
                  <Box>
                    <Text color="gray.500" fontSize="sm">Insurance</Text>
                    <Text fontSize="lg" fontWeight="bold">₹{customer.insurance?.toLocaleString() || '0'}</Text>
                  </Box>
                  <Box>
                    <Text color="gray.500" fontSize="sm">Booking Fee</Text>
                    <Text fontSize="lg" fontWeight="bold">₹{customer.booking_fee?.toLocaleString() || '0'}</Text>
                  </Box>
                  <Box>
                    <Text color="gray.500" fontSize="sm">Accessories</Text>
                    <Text fontSize="lg" fontWeight="bold">₹{customer.accessories?.toLocaleString() || '0'}</Text>
                  </Box>
                </SimpleGrid>
                <Divider my={4} opacity={0.1} />
                <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4} mt={4}>
                  <Box>
                    <Text color="gray.500" fontSize="sm">Total Amount</Text>
                    <Text 
                      fontSize="xl" 
                      fontWeight="bold"
                      bgGradient={accentGradient}
                      bgClip="text"
                    >
                      ₹{customer.total_price?.toLocaleString() || '0'}
                  </Text>
                  </Box>
                  <Box>
                    <Text color="gray.500" fontSize="sm">Amount Paid</Text>
                    <Text 
                      fontSize="xl" 
                      fontWeight="bold" 
                      color="green.400"
                    >
                      ₹{customer.amount_paid?.toLocaleString() || '0'}
                  </Text>
                  </Box>
                  <Box>
                    <Text color="gray.500" fontSize="sm">Remaining</Text>
                    <Text 
                      fontSize="xl" 
                      fontWeight="bold"
                      color={remainingAmount > 0 ? 'red.400' : 'green.400'}
                    >
                      ₹{remainingAmount.toLocaleString()}
                  </Text>
                  </Box>
                </SimpleGrid>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>
      </Box>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent {...glassEffect} borderRadius="xl">
          <ModalHeader 
            bgGradient={accentGradient}
            bgClip="text"
          >
            Confirm Deletion
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this customer? This action cannot be undone.</Text>
          </ModalBody>
          <ModalFooter>
            <Button 
              variant="ghost" 
              mr={3} 
              onClick={() => setIsDeleteModalOpen(false)}
              _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
            >
              Cancel
            </Button>
            <Button 
              bgGradient="linear(to-r, red.400, red.600)"
              color="white"
              onClick={handleDelete}
              _hover={{ 
                transform: 'translateY(-2px)',
                opacity: 0.9
              }}
              transition="all 0.2s"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delivery Photos Modal */}
      <Modal isOpen={isDeliveryModalOpen} onClose={() => setIsDeliveryModalOpen(false)}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent {...glassEffect} borderRadius="xl">
          <ModalHeader
            bgGradient={accentGradient}
            bgClip="text"
          >
            Mark as Delivered
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleDeliveredSubmit}>
              <VStack spacing={4}>
                {[
                  { label: 'Front Delivery Photo', name: 'front_delivery_photo' },
                  { label: 'Back Delivery Photo', name: 'back_delivery_photo' },
                  { label: 'Delivery Photo', name: 'delivery_photo' },
                ].map(({ label, name }) => (
                  <FormControl key={name}>
                    <FormLabel>{label}</FormLabel>
                  <Input
                    type="file"
                      name={name}
                    accept="image/*"
                    onChange={handleDeliveryPhotoChange}
                      {...inputProps}
                      p={2}
                      sx={{
                        '&::file-selector-button': {
                          border: 'none',
                          bgGradient: accentGradient,
                          color: 'white',
                          borderRadius: 'md',
                          px: 4,
                          py: 1,
                          mr: 4,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          _hover: {
                            opacity: 0.9,
                            transform: 'translateY(-1px)'
                          }
                        }
                      }}
                  />
                </FormControl>
                ))}
                <Button
                  type="submit"
                  bgGradient={accentGradient}
                  color="white"
                  w="full"
                  size="lg"
                  isLoading={isSubmitting}
                  _hover={{ 
                    transform: 'translateY(-2px)',
                    opacity: 0.9,
                    boxShadow: 'lg'
                  }}
                  transition="all 0.2s"
                >
                  Submit Delivery Photos
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Image Preview Modal */}
      <Modal 
        isOpen={isImagePreviewOpen} 
        onClose={() => setIsImagePreviewOpen(false)}
        size="4xl"
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent 
          {...glassEffect} 
          borderRadius="xl"
          bg={modalBg}
          maxW={{ base: "95vw", md: "90vw" }}
          maxH={{ base: "95vh", md: "90vh" }}
          overflow="hidden"
        >
          <ModalHeader
            bgGradient={accentGradient}
            bgClip="text"
          >
            {selectedImage?.title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            <Box
              position="relative"
              width="100%"
              height={{ base: "60vh", md: "70vh" }}
              overflow="hidden"
            >
              {selectedImage && (
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  objectFit="contain"
                  width="100%"
                  height="100%"
                  p={4}
                />
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CustomerManagement;