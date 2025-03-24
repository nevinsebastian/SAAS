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
  Flex,
  HStack,
  Badge,
  Icon,
  Progress,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Image,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { 
  CheckCircleIcon, 
  TimeIcon, 
  WarningIcon, 
  InfoIcon,
  CalendarIcon,
  PhoneIcon,
  EmailIcon,
  LocationIcon,
  CarIcon,
  CreditCardIcon,
  SettingsIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import axios from 'axios';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const CustomerDetails = () => {
  const { customerId } = useParams();
  const toast = useToast();
  const { isOpen: isServiceModalOpen, onOpen: onServiceModalOpen, onClose: onServiceModalClose } = useDisclosure();
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
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(null);

  const bgGradient = useColorModeValue(
    'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
    'linear-gradient(135deg, #2d3748 0%, #1a365d 100%)'
  );
  const cardBg = useColorModeValue('whiteAlpha.900', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const accentGradient = useColorModeValue(
    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)'
  );

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://172.20.10.8:3000/customers/${customerId}`);
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
      } catch (error) {
        console.error('Error fetching customer:', error);
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
    setError('');

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => formData[key] && formDataToSend.append(key, formData[key]));
    if (files.aadhar_front) formDataToSend.append('aadhar_front', files.aadhar_front);
    if (files.aadhar_back) formDataToSend.append('aadhar_back', files.aadhar_back);
    if (files.passport_photo) formDataToSend.append('passport_photo', files.passport_photo);

    try {
      const response = await axios.put(`http://172.20.10.8:3000/customers/${customerId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCustomer(response.data.customer);
      toast({
        title: 'Success',
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

  // Calculate verification status
  const getVerificationStatus = () => {
    if (customer.sales_verified && customer.accounts_verified && customer.rto_verified) {
      return {
        status: 'Registration Successful',
        color: 'green',
        icon: CheckCircleIcon,
        progress: 100
      };
    } else if (customer.sales_verified && customer.accounts_verified) {
      return {
        status: 'Sales & Accounts Verified',
        color: 'blue',
        icon: InfoIcon,
        progress: 75
      };
    } else if (customer.sales_verified) {
      return {
        status: 'Sales Verified',
        color: 'yellow',
        icon: TimeIcon,
        progress: 25
      };
    } else {
      return {
        status: 'Pending Verification',
        color: 'gray',
        icon: WarningIcon,
        progress: 0
      };
    }
  };

  const verificationStatus = getVerificationStatus();

  return (
    <Box minH="100vh" bg={bgGradient} p={{ base: 4, md: 6 }}>
      {/* Dealership Header */}
      <Box 
        bg={cardBg} 
        borderRadius="xl" 
        p={4} 
        mb={6} 
        boxShadow="xl"
        backdropFilter="blur(10px)"
        border="1px solid"
        borderColor="whiteAlpha.300"
        animation={`${fadeIn} 0.5s ease-out`}
      >
        <Flex 
          justify="space-between" 
          align="center" 
          direction={{ base: "column", md: "row" }}
          gap={{ base: 4, md: 0 }}
        >
          <HStack spacing={4}>
            <Image 
              src={process.env.PUBLIC_URL + '/dealersync.jpeg'} 
              alt="Dealership Logo" 
              boxSize="40px" 
              objectFit="contain"
              fallback={<Box boxSize="40px" bg="gray.200" borderRadius="full" />}
            />
            <VStack align="start" spacing={0}>
              <Heading size="md" bgGradient={accentGradient} bgClip="text">
                DealrSync
              </Heading>
              <Text fontSize="sm" color="gray.500">Your Trusted Onboarding Partner</Text>
            </VStack>
          </HStack>
          <Badge 
            colorScheme={verificationStatus.color}
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Icon as={verificationStatus.icon} />
            {verificationStatus.status}
          </Badge>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box maxW={{ base: '100%', md: '800px' }} mx="auto">
        {/* Verification Progress */}
        <Box 
          bg={cardBg} 
          borderRadius="xl" 
          p={6} 
          mb={6} 
          boxShadow="xl"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="whiteAlpha.300"
          animation={`${fadeIn} 0.5s ease-out`}
        >
          <VStack spacing={6} align="stretch">
            <Heading size="md" color={textColor} textAlign="center">
              Booking Status
            </Heading>
            
            <Flex 
              justify="space-between" 
              align="center" 
              position="relative"
              px={4}
            >
              {/* Sales Verification */}
              <Flex direction="column" align="center" flex={1}>
                <Box
                  w="40px"
                  h="40px"
                  borderRadius="full"
                  bg={customer.sales_verified ? "green.500" : "red.500"}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  zIndex={2}
                  cursor="pointer"
                  onClick={() => setActiveStep('sales')}
                  _hover={{ transform: 'scale(1.1)' }}
                  transition="all 0.2s"
                >
                  <Icon 
                    as={customer.sales_verified ? CheckCircleIcon : TimeIcon} 
                    boxSize={6} 
                    color="white"
                  />
                </Box>
                <Text 
                  fontSize="sm" 
                  mt={2} 
                  color={customer.sales_verified ? "green.500" : "gray.500"}
                  fontWeight="medium"
                >
                  Sales
                </Text>
              </Flex>

              {/* Accounts Verification */}
              <Flex direction="column" align="center" flex={1}>
                <Box
                  w="40px"
                  h="40px"
                  borderRadius="full"
                  bg={customer.accounts_verified ? "green.500" : "red.500"}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  zIndex={2}
                  cursor="pointer"
                  onClick={() => setActiveStep('accounts')}
                  _hover={{ transform: 'scale(1.1)' }}
                  transition="all 0.2s"
                >
                  <Icon 
                    as={customer.accounts_verified ? CheckCircleIcon : TimeIcon} 
                    boxSize={6} 
                    color="white"
                  />
                </Box>
                <Text 
                  fontSize="sm" 
                  mt={2} 
                  color={customer.accounts_verified ? "green.500" : "gray.500"}
                  fontWeight="medium"
                >
                  Accounts
                </Text>
              </Flex>

              {/* RTO Verification */}
              <Flex direction="column" align="center" flex={1}>
                <Box
                  w="40px"
                  h="40px"
                  borderRadius="full"
                  bg={customer.rto_verified ? "green.500" : "red.500"}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  zIndex={2}
                  cursor="pointer"
                  onClick={() => setActiveStep('rto')}
                  _hover={{ transform: 'scale(1.1)' }}
                  transition="all 0.2s"
                >
                  <Icon 
                    as={customer.rto_verified ? CheckCircleIcon : TimeIcon} 
                    boxSize={6} 
                    color="white"
                  />
                </Box>
                <Text 
                  fontSize="sm" 
                  mt={2} 
                  color={customer.rto_verified ? "green.500" : "gray.500"}
                  fontWeight="medium"
                >
                  RTO
                </Text>
              </Flex>

              {/* Progress Line */}
              <Box
                position="absolute"
                top="20px"
                left="0"
                right="0"
                height="2px"
                bg="gray.200"
                zIndex={1}
              />
            </Flex>

            {/* Status Details Modal */}
            <Modal isOpen={!!activeStep} onClose={() => setActiveStep(null)} size="md">
              <ModalOverlay bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(4px)" />
              <ModalContent bg={cardBg} borderRadius="xl">
                <ModalHeader bgGradient={accentGradient} bgClip="text">
                  {activeStep === 'sales' && 'Sales Verification Status'}
                  {activeStep === 'accounts' && 'Accounts Verification Status'}
                  {activeStep === 'rto' && 'RTO Verification Status'}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    {activeStep === 'sales' && (
                      <>
                        <Box p={4} bg={customer.sales_verified ? "green.50" : "yellow.50"} borderRadius="md">
                          <HStack spacing={3}>
                            <Icon 
                              as={customer.sales_verified ? CheckCircleIcon : TimeIcon} 
                              boxSize={6} 
                              color={customer.sales_verified ? "green.500" : "yellow.500"}
                            />
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="bold" color={textColor}>
                                {customer.sales_verified ? 'Verified' : 'Pending'}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                {customer.status === 'Pending' 
                                  ? 'Please upload your details to start the sales verification process.'
                                  : customer.sales_verified 
                                    ? 'Your data has been verified by our sales team. All information is correct and complete.'
                                    : 'Your data is currently being reviewed by our sales team. This process typically takes 1-2 business days.'}
                              </Text>
                            </VStack>
                          </HStack>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" mb={2}>What's being verified:</Text>
                          <VStack align="start" spacing={2}>
                            <HStack>
                              <Icon as={CheckCircleIcon} color="green.500" />
                              <Text>Personal Information</Text>
                            </HStack>
                            <HStack>
                              <Icon as={CheckCircleIcon} color="green.500" />
                              <Text>Vehicle Selection</Text>
                            </HStack>
                            <HStack>
                              <Icon as={CheckCircleIcon} color="green.500" />
                              <Text>Documentation</Text>
                            </HStack>
                          </VStack>
                        </Box>
                      </>
                    )}

                    {activeStep === 'accounts' && (
                      <>
                        <Box p={4} bg={customer.accounts_verified ? "green.50" : "yellow.50"} borderRadius="md">
                          <HStack spacing={3}>
                            <Icon 
                              as={customer.accounts_verified ? CheckCircleIcon : TimeIcon} 
                              boxSize={6} 
                              color={customer.accounts_verified ? "green.500" : "yellow.500"}
                            />
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="bold" color={textColor}>
                                {customer.accounts_verified ? 'Verified' : 'Pending'}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                {!customer.sales_verified 
                                  ? 'Sales verification must be completed before starting accounts verification.'
                                  : customer.accounts_verified 
                                    ? 'Your payment details have been verified by our accounts team. All financial transactions are confirmed.'
                                    : 'Your payment details are being reviewed by our accounts team. This process typically takes 1-2 business days.'}
                              </Text>
                            </VStack>
                          </HStack>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" mb={2}>What's being verified:</Text>
                          <VStack align="start" spacing={2}>
                            <HStack>
                              <Icon as={CheckCircleIcon} color="green.500" />
                              <Text>Payment Details</Text>
                            </HStack>
                            <HStack>
                              <Icon as={CheckCircleIcon} color="green.500" />
                              <Text>Finance Information (if applicable)</Text>
                            </HStack>
                            <HStack>
                              <Icon as={CheckCircleIcon} color="green.500" />
                              <Text>Transaction Records</Text>
                            </HStack>
                          </VStack>
                        </Box>
                      </>
                    )}

                    {activeStep === 'rto' && (
                      <>
                        <Box p={4} bg={customer.rto_verified ? "green.50" : "yellow.50"} borderRadius="md">
                          <HStack spacing={3}>
                            <Icon 
                              as={customer.rto_verified ? CheckCircleIcon : TimeIcon} 
                              boxSize={6} 
                              color={customer.rto_verified ? "green.500" : "yellow.500"}
                            />
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="bold" color={textColor}>
                                {customer.rto_verified ? 'Verified' : 'Pending'}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                {!customer.accounts_verified 
                                  ? 'Accounts verification must be completed before starting RTO verification.'
                                  : customer.rto_verified 
                                    ? 'Your data has been successfully uploaded to the Motor Vehicle Department of Kerala. Registration process is complete.'
                                    : 'Your data is being processed for registration with the Motor Vehicle Department of Kerala. This process typically takes 3-5 business days.'}
                              </Text>
                            </VStack>
                          </HStack>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" mb={2}>What's being processed:</Text>
                          <VStack align="start" spacing={2}>
                            <HStack>
                              <Icon as={CheckCircleIcon} color="green.500" />
                              <Text>Vehicle Registration</Text>
                            </HStack>
                            <HStack>
                              <Icon as={CheckCircleIcon} color="green.500" />
                              <Text>RC Generation</Text>
                            </HStack>
                            <HStack>
                              <Icon as={CheckCircleIcon} color="green.500" />
                              <Text>Document Processing</Text>
                            </HStack>
                          </VStack>
                        </Box>
                      </>
                    )}
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button 
                    variant="ghost" 
                    mr={3} 
                    onClick={() => setActiveStep(null)}
                    _hover={{ bg: "gray.100" }}
                  >
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </VStack>
        </Box>

        {/* Customer Details Form or Display */}
        <Box 
          bg={cardBg} 
          borderRadius="xl" 
          p={6} 
          mb={6} 
          boxShadow="xl"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="whiteAlpha.300"
          animation={`${fadeIn} 0.5s ease-out`}
        >
          <Heading size="lg" mb={6} bgGradient={accentGradient} bgClip="text" textAlign="center">
            Booking Details
          </Heading>

          {customer.status === 'Pending' ? (
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                  <FormControl>
                    <FormLabel color={textColor}>Full Name</FormLabel>
                    <Input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      variant="filled" 
                      isDisabled 
                      bg="whiteAlpha.200"
                      _hover={{ bg: "whiteAlpha.300" }}
                      _focus={{ bg: "whiteAlpha.400" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel color={textColor}>Date of Birth</FormLabel>
                    <Input 
                      name="dob" 
                      type="date" 
                      value={formData.dob} 
                      onChange={handleInputChange} 
                      variant="filled"
                      bg="whiteAlpha.200"
                      _hover={{ bg: "whiteAlpha.300" }}
                      _focus={{ bg: "whiteAlpha.400" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel color={textColor}>Address</FormLabel>
                    <Input 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      variant="filled"
                      bg="whiteAlpha.200"
                      _hover={{ bg: "whiteAlpha.300" }}
                      _focus={{ bg: "whiteAlpha.400" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel color={textColor}>Mobile 1</FormLabel>
                    <Input 
                      name="mobile_1" 
                      value={formData.mobile_1} 
                      onChange={handleInputChange} 
                      variant="filled" 
                      isDisabled
                      bg="whiteAlpha.200"
                      _hover={{ bg: "whiteAlpha.300" }}
                      _focus={{ bg: "whiteAlpha.400" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel color={textColor}>Mobile 2 (Optional)</FormLabel>
                    <Input 
                      name="mobile_2" 
                      value={formData.mobile_2} 
                      onChange={handleInputChange} 
                      variant="filled"
                      bg="whiteAlpha.200"
                      _hover={{ bg: "whiteAlpha.300" }}
                      _focus={{ bg: "whiteAlpha.400" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel color={textColor}>Email</FormLabel>
                    <Input 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      variant="filled"
                      bg="whiteAlpha.200"
                      _hover={{ bg: "whiteAlpha.300" }}
                      _focus={{ bg: "whiteAlpha.400" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel color={textColor}>Nominee</FormLabel>
                    <Input 
                      name="nominee" 
                      value={formData.nominee} 
                      onChange={handleInputChange} 
                      variant="filled"
                      bg="whiteAlpha.200"
                      _hover={{ bg: "whiteAlpha.300" }}
                      _focus={{ bg: "whiteAlpha.400" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel color={textColor}>Relation with Nominee</FormLabel>
                    <Input 
                      name="nominee_relation" 
                      value={formData.nominee_relation} 
                      onChange={handleInputChange} 
                      variant="filled"
                      bg="whiteAlpha.200"
                      _hover={{ bg: "whiteAlpha.300" }}
                      _focus={{ bg: "whiteAlpha.400" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel color={textColor}>Payment Mode</FormLabel>
                    <Select 
                      name="payment_mode" 
                      value={formData.payment_mode} 
                      onChange={handleInputChange} 
                      variant="filled"
                      bg="whiteAlpha.200"
                      _hover={{ bg: "whiteAlpha.300" }}
                      _focus={{ bg: "whiteAlpha.400" }}
                    >
                      <option value="">Select payment mode</option>
                      <option value="Cash">Cash</option>
                      <option value="Finance">Finance</option>
                    </Select>
                  </FormControl>
                  {formData.payment_mode === 'Finance' && (
                    <>
                      <FormControl>
                        <FormLabel color={textColor}>Finance Company</FormLabel>
                        <Input 
                          name="finance_company" 
                          value={formData.finance_company} 
                          onChange={handleInputChange} 
                          variant="filled"
                          bg="whiteAlpha.200"
                          _hover={{ bg: "whiteAlpha.300" }}
                          _focus={{ bg: "whiteAlpha.400" }}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel color={textColor}>Finance Amount</FormLabel>
                        <Input 
                          name="finance_amount" 
                          type="number" 
                          value={formData.finance_amount} 
                          onChange={handleInputChange} 
                          variant="filled"
                          bg="whiteAlpha.200"
                          _hover={{ bg: "whiteAlpha.300" }}
                          _focus={{ bg: "whiteAlpha.400" }}
                        />
                      </FormControl>
                    </>
                  )}
                </Grid>

                <Box>
                  <FormLabel color={textColor}>Required Documents</FormLabel>
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={4}>
                    <FormControl>
                      <FormLabel color={textColor}>Aadhar Front</FormLabel>
                      <Input 
                        name="aadhar_front" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        variant="filled"
                        bg="whiteAlpha.200"
                        _hover={{ bg: "whiteAlpha.300" }}
                        _focus={{ bg: "whiteAlpha.400" }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel color={textColor}>Aadhar Back</FormLabel>
                      <Input 
                        name="aadhar_back" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        variant="filled"
                        bg="whiteAlpha.200"
                        _hover={{ bg: "whiteAlpha.300" }}
                        _focus={{ bg: "whiteAlpha.400" }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel color={textColor}>Passport Photo</FormLabel>
                      <Input 
                        name="passport_photo" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        variant="filled"
                        bg="whiteAlpha.200"
                        _hover={{ bg: "whiteAlpha.300" }}
                        _focus={{ bg: "whiteAlpha.400" }}
                      />
                    </FormControl>
                  </Grid>
                </Box>

                <Button 
                  type="submit" 
                  colorScheme="purple" 
                  size="lg" 
                  w="full" 
                  isLoading={isSubmitting}
                  bgGradient={accentGradient}
                  _hover={{ 
                    transform: 'translateY(-2px)',
                    boxShadow: 'xl'
                  }}
                  transition="all 0.2s"
                >
                  Submit Details
                </Button>
              </VStack>
            </form>
          ) : (
            <VStack spacing={6} align="stretch">
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>Name</Text>
                  <Text fontSize="lg" color={textColor}>{customer.customer_name}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>Vehicle</Text>
                  <Text fontSize="lg" color={textColor}>{customer.vehicle}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>Variant</Text>
                  <Text fontSize="lg" color={textColor}>{customer.variant || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>Color</Text>
                  <Text fontSize="lg" color={textColor}>{customer.color || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>Date of Birth</Text>
                  <Text fontSize="lg" color={textColor}>{customer.dob || 'Not provided'}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>Mobile</Text>
                  <Text fontSize="lg" color={textColor}>{customer.mobile_1}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>Email</Text>
                  <Text fontSize="lg" color={textColor}>{customer.email || 'Not provided'}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>Address</Text>
                  <Text fontSize="lg" color={textColor}>{customer.address || 'Not provided'}</Text>
                </Box>
              </Grid>

              <Divider />

              <Box>
                <Heading size="md" mb={4} color={textColor}>Payment Details</Heading>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={1}>Payment Mode</Text>
                    <Text fontSize="lg" color={textColor}>{customer.payment_mode}</Text>
                  </Box>
                  {customer.payment_mode === 'Finance' && (
                    <>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Finance Company</Text>
                        <Text fontSize="lg" color={textColor}>{customer.finance_company}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Finance Amount</Text>
                        <Text fontSize="lg" color={textColor}>₹{customer.finance_amount?.toLocaleString()}</Text>
                      </Box>
                    </>
                  )}
                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={1}>Total Price</Text>
                    <Text fontSize="lg" color={textColor}>₹{customer.total_price?.toLocaleString()}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={1}>Amount Paid</Text>
                    <Text fontSize="lg" color={textColor}>₹{customer.amount_paid?.toLocaleString()}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={1}>Remaining Amount</Text>
                    <Text fontSize="lg" color={textColor}>₹{remainingAmount.toLocaleString()}</Text>
                  </Box>
                </Grid>
              </Box>
            </VStack>
          )}
        </Box>

        {/* Service Booking Section */}
        {customer.status === 'Delivered' && (
          <Box 
            bg={cardBg} 
            borderRadius="xl" 
            p={6} 
            boxShadow="xl"
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor="whiteAlpha.300"
            animation={`${fadeIn} 0.5s ease-out`}
          >
            <VStack spacing={4} align="stretch">
              <Heading size="lg" bgGradient={accentGradient} bgClip="text" textAlign="center">
                Service Booking
              </Heading>
              <Text color="gray.500" textAlign="center">
                Schedule your vehicle's service appointment
              </Text>
              <Button 
                leftIcon={<SettingsIcon />}
                colorScheme="purple"
                size="lg"
                onClick={onServiceModalOpen}
                bgGradient={accentGradient}
                _hover={{ 
                  transform: 'translateY(-2px)',
                  boxShadow: 'xl'
                }}
                transition="all 0.2s"
              >
                Book Service
              </Button>
            </VStack>
          </Box>
        )}
      </Box>

      {/* Service Booking Modal */}
      <Modal isOpen={isServiceModalOpen} onClose={onServiceModalClose} size="xl">
        <ModalOverlay bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(4px)" />
        <ModalContent bg={cardBg} borderRadius="xl">
          <ModalHeader bgGradient={accentGradient} bgClip="text">Book Service Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Service Type</FormLabel>
                <Select placeholder="Select service type">
                  <option value="general">General Service</option>
                  <option value="repair">Repair</option>
                  <option value="inspection">Inspection</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Preferred Date</FormLabel>
                <Input type="date" />
              </FormControl>
              <FormControl>
                <FormLabel>Preferred Time</FormLabel>
                <Select placeholder="Select time">
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                  <option value="evening">Evening (4 PM - 7 PM)</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Additional Notes</FormLabel>
                <Input as="textarea" rows={4} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onServiceModalClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="purple"
              bgGradient={accentGradient}
              _hover={{ 
                transform: 'translateY(-2px)',
                boxShadow: 'xl'
              }}
              transition="all 0.2s"
            >
              Confirm Booking
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CustomerDetails;