import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Collapse,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Textarea,
  Pagination,
  useBreakpointValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorMode,
  Tooltip,
  ScaleFade,
  Fade,
  SlideFade,
  Slide,
  useStyleConfig,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
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
  SettingsIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  EditIcon,
  BellIcon,
  ChatIcon,
  ViewIcon,
  CloseIcon,
  AddIcon,
  ChevronLeftIcon,
  ChevronLeftIcon as ChevronLeftIconAlias,
  StarIcon,
  WarningTwoIcon,
  CheckIcon,
  InfoOutlineIcon,
  RepeatIcon,
  RepeatClockIcon,
  TriangleUpIcon,
  TriangleDownIcon,
  ExternalLinkIcon,
  PhoneIcon as PhoneIconAlias,
  EmailIcon as EmailIconAlias,
  CalendarIcon as CalendarIconAlias,
  TimeIcon as TimeIconAlias,

  SettingsIcon as SettingsIconAlias,
  ChevronRightIcon as ChevronRightIconAlias,
  ChevronDownIcon as ChevronDownIconAlias,
  EditIcon as EditIconAlias,
  BellIcon as BellIconAlias,
  ChatIcon as ChatIconAlias,
  ViewIcon as ViewIconAlias,
  CloseIcon as CloseIconAlias,
  AddIcon as AddIconAlias,
  ChevronLeftIcon as ChevronLeftIconAlias2,
  StarIcon as StarIconAlias,
  WarningTwoIcon as WarningTwoIconAlias,
  CheckIcon as CheckIconAlias,
  InfoOutlineIcon as InfoOutlineIconAlias,
  RepeatIcon as RepeatIconAlias,
  RepeatClockIcon as RepeatClockIconAlias,
  TriangleUpIcon as TriangleUpIconAlias,
  TriangleDownIcon as TriangleDownIconAlias,
  ExternalLinkIcon as ExternalLinkIconAlias,
} from '@chakra-ui/icons';
import axios from 'axios';

// Modern UI Components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionCard = motion(Card);

// Modern Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const slideOut = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const gradientBorder = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const textFadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Modern Color Schemes
const modernColors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },
};

// Modern Card Styles
const cardStyles = {
  baseStyle: {
    container: {
      bg: 'white',
      borderRadius: 'xl',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.2s',
      _hover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
};

// Add the AnimatedModal component after the modernColors definition
const AnimatedModal = ({ isOpen, onClose, children }) => {
  const cardBg = useColorModeValue('whiteAlpha.900', 'gray.800');
  const modalGradient = useColorModeValue(
    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)'
  );
  
  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <Box
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            position="fixed"
            inset={0}
            zIndex={99999}
            bg="rgba(0, 0, 0, 0.7)"
            backdropFilter="blur(8px)"
            overflowY="hidden"
            onClick={onClose}
          >
            <Box
              as={motion.div}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              w="full"
              h="100vh"
              display="flex"
              flexDirection="column"
              overflow="hidden"
              position="relative"
              bg={cardBg}
              boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            >
              {/* Fixed Header */}
              <Box
                p={3}
                borderBottom="1px solid"
                borderColor="whiteAlpha.300"
                bg={cardBg}
                position="fixed"
                top={0}
                left={0}
                right={0}
                zIndex={999999}
                boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                backdropFilter="blur(8px)"
              >
                <Flex justify="space-between" align="center">
                  <HStack spacing={2}>
                    <Box
                      p={1.5}
                      borderRadius="lg"
                      bg="whiteAlpha.200"
                      backdropFilter="blur(8px)"
                    >
                      <Icon as={ViewIcon} boxSize={5} color="purple.500" />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Heading size="sm" bgGradient={modalGradient} bgClip="text">
                        Complete Customer Details
                      </Heading>
                      <Text fontSize="xs" color="gray.500">
                        View and manage customer information
                      </Text>
                    </VStack>
                  </HStack>
                  <IconButton
                    icon={<CloseIcon />}
                    onClick={onClose}
                    variant="ghost"
                    colorScheme="purple"
                    size="sm"
                    _hover={{
                      transform: 'rotate(90deg)',
                      transition: 'all 0.3s',
                      bg: 'whiteAlpha.200',
                    }}
                  />
                </Flex>
              </Box>

              {/* Scrollable Content */}
              <Box
                flex={1}
                overflowY="auto"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    width: '6px',
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '24px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: 'rgba(0, 0, 0, 0.3)',
                  },
                }}
                pt="60px"
                pb="60px"
                px={3}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {children}
                </motion.div>
              </Box>

              {/* Fixed Footer */}
              <Box
                p={3}
                borderTop="1px solid"
                borderColor="whiteAlpha.300"
                bg={cardBg}
                position="fixed"
                bottom={0}
                left={0}
                right={0}
                zIndex={999999}
                boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.1)"
                backdropFilter="blur(8px)"
              >
                <Flex justify="flex-end" gap={2}>
                  <Button
                    leftIcon={<EditIcon />}
                    colorScheme="purple"
                    onClick={() => {}}
                    bgGradient={modalGradient}
                    size="sm"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'xl',
                    }}
                    transition="all 0.2s"
                  >
                    Edit Details
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    size="sm"
                    _hover={{
                      transform: 'translateY(-2px)',
                      bg: 'whiteAlpha.200',
                    }}
                    transition="all 0.2s"
                  >
                    Close
                  </Button>
                </Flex>
              </Box>
            </Box>
          </Box>
        )}
      </AnimatePresence>
    </Portal>
  );
};

const MultiStepLoader = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { text: "Collecting booking details...", icon: CalendarIcon },
    { text: "Gathering vehicle information...", icon: ViewIcon },
    { text: "Loading customer documents...", icon: InfoIcon },
    { text: "Preparing service history...", icon: TimeIcon },
    { text: "Almost there...", icon: CheckIcon }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      position="fixed"
      inset={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(0, 0, 0, 0.7)"
      backdropFilter="blur(8px)"
      zIndex={9999}
    >
      <VStack spacing={8} align="center">
        <Box
          position="relative"
          w="300px"
          display="flex"
          flexDirection="column"
          gap={4}
        >
          {/* Steps container */}
          <Box position="relative" zIndex={1}>
            {steps.map((step, index) => (
              <Box
                key={index}
                position="relative"
                display="flex"
                alignItems="center"
                gap={4}
                opacity={index <= currentStep ? 1 : 0.5}
                transition="all 0.3s ease-in-out"
                mb={index < steps.length - 1 ? "40px" : "0"}
              >
                {/* Connecting line - only show between completed steps */}
                {index < steps.length - 1 && index < currentStep && (
                  <Box
                    position="absolute"
                    left="20px"
                    top="40px"
                    bottom="-40px"
                    w="2px"
                    bgGradient="linear(to bottom, purple.500, purple.300)"
                    zIndex={0}
                  />
                )}
                
                <Box
                  position="relative"
                  w="40px"
                  h="40px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="full"
                  bg={index <= currentStep ? "purple.500" : "gray.500"}
                  transition="all 0.3s ease-in-out"
                  border="2px solid"
                  borderColor={index <= currentStep ? "purple.500" : "gray.500"}
                  zIndex={1}
                >
                  {index < currentStep ? (
                    <Icon as={CheckIcon} boxSize={5} color="white" />
                  ) : (
                    <Icon as={step.icon} boxSize={5} color="white" />
                  )}
                </Box>
                <Text
                  color="white"
                  fontSize="md"
                  fontWeight="medium"
                  opacity={index <= currentStep ? 1 : 0.5}
                  transition="all 0.3s ease-in-out"
                >
                  {step.text}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

// Add spin animation to your existing keyframes
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const CustomerDetails = () => {
  const { customerId } = useParams();
  const toast = useToast();
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const { isOpen: isServiceModalOpen, onOpen: onServiceModalOpen, onClose: onServiceModalClose } = useDisclosure();
  const [customer, setCustomer] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
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
  const [images, setImages] = useState({
    aadhar_front: null,
    aadhar_back: null,
    passport_photo: null,
    front_delivery_photo: null,
    back_delivery_photo: null,
    delivery_photo: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(null);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your service request has been confirmed', time: '2 hours ago' },
    { id: 2, message: 'New message from support team', time: '5 hours ago' },
  ]);
  const [activeTab, setActiveTab] = useState('booking');
  const [serviceHistory, setServiceHistory] = useState([
    {
      id: 1,
      type: 'General Service',
      date: '2024-03-15',
      status: 'Completed',
      notes: 'Regular maintenance completed',
    },
    {
      id: 2,
      type: 'Oil Change',
      date: '2024-02-20',
      status: 'Completed',
      notes: 'Oil and filter replaced',
    },
    {
      id: 3,
      type: 'Brake Service',
      date: '2024-01-10',
      status: 'Completed',
      notes: 'Brake pads replaced',
    },
    {
      id: 4,
      type: 'Tire Rotation',
      date: '2023-12-05',
      status: 'Completed',
      notes: 'Tires rotated and balanced',
    },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceType, setServiceType] = useState('');
  const [customService, setCustomService] = useState('');
  const [serviceNotes, setServiceNotes] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'user', text: 'Hello, I need help with my vehicle', time: '10:00 AM' },
    { id: 2, sender: 'support', text: 'Hi! How can I assist you today?', time: '10:01 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const blobUrlsRef = useRef({});
  const [isLoading, setIsLoading] = useState(true);

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

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Add state for modal control in the CustomerDetails component
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://172.20.10.8:3000/public/customers/${customerId}`);
        setCustomer(response.data.customer);
        console.log('Full customer data:', response.data.customer);
        
        // Fetch employee details if created_by exists
        if (response.data.customer.created_by) {
          try {
            const employeeResponse = await axios.get(`http://172.20.10.8:3000/public/employees/${response.data.customer.created_by}`);
            setEmployeeDetails(employeeResponse.data.employee);
            console.log('Employee details:', employeeResponse.data.employee);
          } catch (error) {
            console.error('Error fetching employee details:', error);
          }
        }

        // Set form data from customer response
        setFormData(prev => ({
          ...prev,
          name: response.data.customer.customer_name,
          mobile_1: response.data.customer.mobile_1 || response.data.customer.phone_number,
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

        // Set images from the response
        const newImages = {
          aadhar_front: response.data.customer.aadhar_front_base64 ? `data:image/jpeg;base64,${response.data.customer.aadhar_front_base64}` : null,
          aadhar_back: response.data.customer.aadhar_back_base64 ? `data:image/jpeg;base64,${response.data.customer.aadhar_back_base64}` : null,
          passport_photo: response.data.customer.passport_photo_base64 ? `data:image/jpeg;base64,${response.data.customer.passport_photo_base64}` : null,
          front_delivery_photo: response.data.customer.front_delivery_photo_base64 ? `data:image/jpeg;base64,${response.data.customer.front_delivery_photo_base64}` : null,
          back_delivery_photo: response.data.customer.back_delivery_photo_base64 ? `data:image/jpeg;base64,${response.data.customer.back_delivery_photo_base64}` : null,
          delivery_photo: response.data.customer.delivery_photo_base64 ? `data:image/jpeg;base64,${response.data.customer.back_delivery_photo_base64}` : null,
        };

        setImages(newImages);
        console.log('Set images:', newImages);

      } catch (error) {
        console.error('Error fetching customer:', error);
        toast({
          title: 'Error',
          description: 'Failed to load customer details',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        // Add a small delay to show the loading animation
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
    };
    fetchCustomer();

    // Cleanup blob URLs
    return () => {
      Object.values(blobUrlsRef.current).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [customerId, toast]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Show/hide header based on scroll direction
      if (currentScrollY > lastScrollY) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Calculate transparency based on scroll position
  const headerOpacity = useMemo(() => {
    if (scrollY < 100) return 0.2;
    return Math.min(0.4, 0.2 + (scrollY / 1000));
  }, [scrollY]);

  const bottomNavOpacity = useMemo(() => {
    if (scrollY < 100) return 0.15;
    return Math.max(0.05, 0.15 - (scrollY / 1000));
  }, [scrollY]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImages(prev => ({
        ...prev,
        [e.target.name]: imageUrl
      }));
      blobUrlsRef.current[e.target.name] = imageUrl;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => formData[key] && formDataToSend.append(key, formData[key]));
    
    // Handle file uploads
    const fileInput = e.target.querySelector('input[type="file"]');
    if (fileInput && fileInput.files[0]) {
      formDataToSend.append(fileInput.name, fileInput.files[0]);
    }

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

  if (isLoading) {
    return <MultiStepLoader />;
  }

  if (!customer) {
    return <Text>No customer data available</Text>;
  }

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

  const handleServiceSubmit = () => {
    if (serviceType === 'Custom' && !customService) {
      toast({
        title: 'Error',
        description: 'Please specify your custom service',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newService = {
      id: serviceHistory.length + 1,
      type: serviceType === 'Custom' ? customService : serviceType,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      notes: serviceNotes,
    };

    setServiceHistory([newService, ...serviceHistory]);
    setServiceType('');
    setCustomService('');
    setServiceNotes('');
    toast({
      title: 'Success',
      description: 'Service request submitted successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: 'user',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    onServiceModalOpen();
  };

  const renderBottomNav = () => (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg={`rgba(17, 24, 39, ${bottomNavOpacity})`}
      boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.1)"
      zIndex={1000}
      display={{ base: 'block', md: 'none' }}
      backdropFilter="blur(8px)"
      borderTop="1px solid"
      borderColor="whiteAlpha.200"
      transform="translateY(0)"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: '0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Flex justify="space-around" p={3}>
        <IconButton
          icon={<ViewIcon />}
          aria-label="Booking"
          variant="ghost"
          colorScheme={activeTab === 'booking' ? 'purple' : 'gray'}
          onClick={() => setActiveTab('booking')}
          size="lg"
          _hover={{
            transform: 'scale(1.1)',
            transition: 'all 0.2s',
          }}
          animation={activeTab === 'booking' ? `${pulse} 2s infinite` : 'none'}
        />
        <IconButton
          icon={<SettingsIcon />}
          aria-label="Service"
          variant="ghost"
          colorScheme={activeTab === 'service' ? 'purple' : 'gray'}
          onClick={() => setActiveTab('service')}
          size="lg"
          _hover={{
            transform: 'scale(1.1)',
            transition: 'all 0.2s',
          }}
          animation={activeTab === 'service' ? `${pulse} 2s infinite` : 'none'}
        />
      </Flex>
    </Box>
  );

  const renderChat = () => (
    <Box
      position="fixed"
      top={0}
      right={0}
      bottom={0}
      w={{ base: '100%', md: '400px' }}
      bg={cardBg}
      boxShadow="-4px 0 6px -1px rgba(0, 0, 0, 0.1)"
      zIndex={1001}
      display={isChatOpen ? 'block' : 'none'}
    >
      <Flex direction="column" h="full">
        <Flex p={4} borderBottom="1px" borderColor="whiteAlpha.300" align="center">
          <IconButton
            icon={<CloseIcon />}
            aria-label="Close chat"
            variant="ghost"
            colorScheme="purple"
            onClick={() => setIsChatOpen(false)}
            mr={2}
          />
          <Heading size="md" bgGradient={accentGradient} bgClip="text">Chat with Support</Heading>
        </Flex>
        <Box flex={1} overflowY="auto" p={4}>
          {messages.map((message) => (
            <Box
              key={message.id}
              bg={message.sender === 'user' ? 'purple.100' : 'gray.100'}
              p={3}
              borderRadius="lg"
              mb={2}
              maxW="80%"
              ml={message.sender === 'user' ? 'auto' : '0'}
              mr={message.sender === 'user' ? '0' : 'auto'}
            >
              <Text>{message.text}</Text>
              <Text fontSize="xs" color="gray.500" mt={1}>
                {message.time}
              </Text>
            </Box>
          ))}
        </Box>
        <HStack p={4} borderTop="1px" borderColor="whiteAlpha.300">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            variant="filled"
            bg="whiteAlpha.200"
            _hover={{ bg: "whiteAlpha.300" }}
            _focus={{ bg: "whiteAlpha.400" }}
          />
          <IconButton
            icon={<AddIcon />}
            aria-label="Send message"
            colorScheme="purple"
            onClick={handleSendMessage}
            isDisabled={!newMessage.trim()}
          />
        </HStack>
      </Flex>
    </Box>
  );

  const renderPagination = () => {
    const totalPages = Math.ceil(serviceHistory.length / 4);
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Show ellipsis and pages around current page
    if (currentPage > 3) {
      pages.push('...');
    }
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    
    // Show ellipsis and last page
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return (
      <Flex justify="center" align="center" gap={2} mt={4}>
        <IconButton
          icon={<ChevronLeftIcon />}
          aria-label="Previous page"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          isDisabled={currentPage === 1}
          variant="ghost"
          colorScheme="purple"
          size="sm"
        />
        
        {pages.map((page, index) => (
          page === '...' ? (
            <Text key={`ellipsis-${index}`} color="gray.500">...</Text>
          ) : (
            <Button
              key={page}
              onClick={() => setCurrentPage(page)}
              variant={currentPage === page ? "solid" : "ghost"}
              colorScheme="purple"
              size="sm"
              minW="8"
            >
              {page}
            </Button>
          )
        ))}
        
        <IconButton
          icon={<ChevronLeftIconAlias transform="rotate(180deg)" />}
          aria-label="Next page"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          isDisabled={currentPage === totalPages}
          variant="ghost"
          colorScheme="purple"
          size="sm"
        />
      </Flex>
    );
  };

  const renderServiceHistory = () => (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      mb={6}
      overflow="hidden"
    >
      <CardBody p={0}>
        <Box
          bg={cardBg}
          p={4}
          position="relative"
          overflow="hidden"
        >
          <VStack spacing={6} align="stretch">
            {/* Vehicle Summary */}
            <Box
              bg="whiteAlpha.200"
              p={4}
              borderRadius="lg"
              backdropFilter="blur(10px)"
            >
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>First Service</Text>
                  <HStack>
                    <Text fontSize="lg" color={textColor}>15 Mar 2024</Text>
                    <Badge colorScheme={serviceHistory.some(s => s.type === 'First Service' && s.status === 'Completed') ? 'green' : 'yellow'}>
                      {serviceHistory.some(s => s.type === 'First Service' && s.status === 'Completed') ? 'Done' : 'Not Done'}
                    </Badge>
                  </HStack>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>Total Kilometers</Text>
                    <Text fontSize="lg" color={textColor}>5,000 km</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>Vehicle Condition</Text>
                  <Button
                    variant="ghost"
                    colorScheme="purple"
                    onClick={() => {
                      setSelectedService(null);
                      onServiceModalOpen();
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </SimpleGrid>
            </Box>

            {/* Service History */}
            <Box>
              <Heading size="md" mb={4} color={textColor}>Service History</Heading>
              <VStack spacing={4} align="stretch">
                {serviceHistory.slice((currentPage - 1) * 4, currentPage * 4).map((service) => (
                  <Box
                    key={service.id}
                    bg="whiteAlpha.200"
                    p={4}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="whiteAlpha.300"
                    cursor="pointer"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                    onClick={() => handleServiceClick(service)}
                  >
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                          <Text fontWeight="bold" color={textColor}>{service.type}</Text>
                          <Text fontSize="sm" color="gray.500">{service.date}</Text>
                        <Text fontSize="sm" color="gray.500">{service.notes}</Text>
                      </VStack>
                      <Badge
                        colorScheme={service.status === 'Completed' ? 'green' : 'yellow'}
                        px={2}
                        py={1}
                        borderRadius="full"
                      >
                        {service.status}
                      </Badge>
                    </Flex>
                  </Box>
                ))}
              </VStack>
              {renderPagination()}
            </Box>
          </VStack>
        </Box>
      </CardBody>
    </MotionCard>
  );

  const renderServiceBooking = () => (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      overflow="hidden"
    >
      <CardBody p={0}>
        <Box
          bg={cardBg}
          p={6}
          position="relative"
          overflow="hidden"
        >
          <VStack spacing={6} align="stretch">
            <Heading size="md" color={textColor}>Book New Service</Heading>
            <FormControl>
              <FormLabel>Service Type</FormLabel>
              <Select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                variant="filled"
                bg="whiteAlpha.200"
                _hover={{ bg: "whiteAlpha.300" }}
                _focus={{ bg: "whiteAlpha.400" }}
              >
                <option value="">Select service type</option>
                <option value="General Service">General Service</option>
                <option value="Oil Change">Oil Change</option>
                <option value="Brake Service">Brake Service</option>
                <option value="Tire Rotation">Tire Rotation</option>
                <option value="Custom">Custom Service</option>
              </Select>
            </FormControl>

            {serviceType === 'Custom' && (
              <FormControl>
                <FormLabel>Custom Service Description</FormLabel>
                <Input
                  value={customService}
                  onChange={(e) => setCustomService(e.target.value)}
                  placeholder="Describe your custom service"
                  variant="filled"
                  bg="whiteAlpha.200"
                  _hover={{ bg: "whiteAlpha.300" }}
                  _focus={{ bg: "whiteAlpha.400" }}
                />
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <Textarea
                value={serviceNotes}
                onChange={(e) => setServiceNotes(e.target.value)}
                placeholder="Add any additional notes"
                variant="filled"
                bg="whiteAlpha.200"
                _hover={{ bg: "whiteAlpha.300" }}
                _focus={{ bg: "whiteAlpha.400" }}
                rows={3}
              />
            </FormControl>

            <Button
              colorScheme="purple"
              size="lg"
              onClick={handleServiceSubmit}
              bgGradient={accentGradient}
              _hover={{ 
                transform: 'translateY(-2px)',
                boxShadow: 'xl'
              }}
              transition="all 0.2s"
            >
              Submit Service Request
            </Button>
          </VStack>
        </Box>
      </CardBody>
    </MotionCard>
  );

  // Vehicle Condition Modal
  const VehicleConditionModal = ({ isOpen, onClose, service }) => (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(4px)" />
      <ModalContent bg={cardBg} borderRadius="xl">
        <ModalHeader bgGradient={accentGradient} bgClip="text">
          Vehicle Condition Details
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            <Box
              bg="whiteAlpha.200"
              p={4}
              borderRadius="lg"
              backdropFilter="blur(10px)"
            >
              <Text fontSize="sm" color="gray.500" mb={2}>Exterior Condition</Text>
              <VStack align="start" spacing={2}>
                <HStack>
                  <Icon as={CheckCircleIcon} color="green.500" />
                  <Text>Paint: Excellent</Text>
                </HStack>
                <HStack>
                  <Icon as={CheckCircleIcon} color="green.500" />
                  <Text>Body: No dents or scratches</Text>
                </HStack>
                <HStack>
                  <Icon as={CheckCircleIcon} color="green.500" />
                  <Text>Windows: Clean and intact</Text>
                </HStack>
              </VStack>
            </Box>

            <Box
              bg="whiteAlpha.200"
              p={4}
              borderRadius="lg"
              backdropFilter="blur(10px)"
            >
              <Text fontSize="sm" color="gray.500" mb={2}>Mechanical Condition</Text>
              <VStack align="start" spacing={2}>
                <HStack>
                  <Icon as={CheckCircleIcon} color="green.500" />
                  <Text>Engine: Running smoothly</Text>
                </HStack>
                <HStack>
                  <Icon as={CheckCircleIcon} color="green.500" />
                  <Text>Brakes: Responsive</Text>
                </HStack>
                <HStack>
                  <Icon as={CheckCircleIcon} color="green.500" />
                  <Text>Suspension: No issues</Text>
                </HStack>
              </VStack>
            </Box>

            <Box
              bg="whiteAlpha.200"
              p={4}
              borderRadius="lg"
              backdropFilter="blur(10px)"
            >
              <Text fontSize="sm" color="gray.500" mb={2}>Tire Condition</Text>
              <VStack align="start" spacing={2}>
                <HStack>
                  <Icon as={CheckCircleIcon} color="green.500" />
                  <Text>Tread Depth: Good</Text>
                </HStack>
                <HStack>
                  <Icon as={CheckCircleIcon} color="green.500" />
                  <Text>Pressure: Optimal</Text>
                </HStack>
                <HStack>
                  <Icon as={CheckCircleIcon} color="green.500" />
                  <Text>Alignment: Correct</Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const renderHeader = () => (
    <Box 
      bg={`rgba(17, 24, 39, ${headerOpacity})`}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      backdropFilter="blur(8px)"
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
      transform={headerVisible ? 'translateY(0)' : 'translateY(-100%)'}
      transition="all 0.3s ease-in-out"
      _hover={{
        transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Flex 
        justify="space-between" 
        align="center" 
        p={4}
        maxW="1200px"
        mx="auto"
      >
        <HStack spacing={4}>
          <Image 
            src={process.env.PUBLIC_URL + '/dealersync.jpeg'} 
            alt="Dealership Logo" 
            boxSize="40px" 
            objectFit="contain"
            fallback={<Box boxSize="40px" bg="gray.200" borderRadius="full" />}
            animation={`${float} 3s ease-in-out infinite`}
          />
          <VStack align="start" spacing={0}>
            <Heading size="md" bgGradient={accentGradient} bgClip="text">
              DealrSync
            </Heading>
            <Text fontSize="sm" color="gray.500">Your Trusted Onboarding Partner</Text>
          </VStack>
        </HStack>
        <HStack spacing={4}>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<BellIcon />}
              aria-label="Notifications"
              variant="ghost"
              colorScheme="purple"
              position="relative"
              _hover={{
                transform: 'scale(1.1)',
                transition: 'all 0.2s',
              }}
            >
              {notifications.length > 0 && (
                <Badge
                  position="absolute"
                  top={-2}
                  right={-2}
                  colorScheme="red"
                  borderRadius="full"
                  minW="20px"
                  h="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xs"
                  animation={`${pulse} 2s infinite`}
                >
                  {notifications.length}
                </Badge>
              )}
            </MenuButton>
            <Portal>
              <MenuList>
                {notifications.map((notification) => (
                  <MenuItem key={notification.id}>
                    <VStack align="start" spacing={0}>
                      <Text>{notification.message}</Text>
                      <Text fontSize="xs" color="gray.500">{notification.time}</Text>
                    </VStack>
                  </MenuItem>
                ))}
              </MenuList>
            </Portal>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );

  const renderCustomerDetails = () => (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      mb={4}
      overflow="hidden"
    >
      <CardBody p={0}>
        <Box
          bg={cardBg}
          p={3}
          position="relative"
          overflow="hidden"
        >
          <VStack spacing={3} align="stretch">
            {/* Basic Information */}
            <Box
              bg="whiteAlpha.200"
              p={3}
              borderRadius="lg"
              backdropFilter="blur(10px)"
            >
              <Text fontSize="sm" color="gray.500" mb={2}>Basic Information</Text>
              <SimpleGrid columns={{ base: 1 }} spacing={2}>
                <Box>
                  <Text fontSize="xs" color="gray.500">Customer Name</Text>
                  <Text fontSize="md">{customer.customer_name}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">Phone Number</Text>
                  <Text fontSize="md">{customer.phone_number}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">Date of Birth</Text>
                  <Text fontSize="md">{customer.dob ? new Date(customer.dob).toLocaleDateString() : 'Not provided'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">Email</Text>
                  <Text fontSize="md">{customer.email || 'Not provided'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">Address</Text>
                  <Text fontSize="md">{customer.address || 'Not provided'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">Mobile 2</Text>
                  <Text fontSize="md">{customer.mobile_2 || 'Not provided'}</Text>
                </Box>
              </SimpleGrid>
            </Box>

            {/* Vehicle Information */}
            <Box
              bg="whiteAlpha.200"
              p={3}
              borderRadius="lg"
              backdropFilter="blur(10px)"
            >
              <Text fontSize="sm" color="gray.500" mb={2}>Vehicle Information</Text>
              <SimpleGrid columns={{ base: 1 }} spacing={2}>
                <Box>
                  <Text fontSize="xs" color="gray.500">Vehicle</Text>
                  <Text fontSize="md">{customer.vehicle}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">Variant</Text>
                  <Text fontSize="md">{customer.variant || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">Color</Text>
                  <Text fontSize="md">{customer.color || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">Ex Showroom Price</Text>
                  <Text fontSize="md">₹{customer.ex_showroom?.toLocaleString() || 'Not specified'}</Text>
                </Box>
              </SimpleGrid>
            </Box>

            {/* Payment Information */}
            <Box
              bg="whiteAlpha.200"
              p={3}
              borderRadius="lg"
              backdropFilter="blur(10px)"
            >
              <Text fontSize="sm" color="gray.500" mb={2}>Payment Information</Text>
              <SimpleGrid columns={{ base: 1 }} spacing={2}>
                <Box>
                  <Text fontSize="xs" color="gray.500">Payment Mode</Text>
                  <Text fontSize="md">{customer.payment_mode || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">Total Price</Text>
                  <Text fontSize="md">₹{customer.total_price?.toLocaleString() || '0'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">Amount Paid</Text>
                  <Text fontSize="md">₹{customer.amount_paid?.toLocaleString() || '0'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">Remaining Amount</Text>
                  <Text fontSize="md">₹{(customer.total_price - customer.amount_paid)?.toLocaleString() || '0'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">Tax</Text>
                  <Text fontSize="md">₹{customer.tax?.toLocaleString() || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">Insurance</Text>
                  <Text fontSize="md">₹{customer.insurance?.toLocaleString() || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">Booking Fee</Text>
                  <Text fontSize="md">₹{customer.booking_fee?.toLocaleString() || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">Accessories</Text>
                  <Text fontSize="md">₹{customer.accessories?.toLocaleString() || 'Not specified'}</Text>
                </Box>
              </SimpleGrid>
            </Box>

            {/* Finance Information */}
            {customer.payment_mode === 'Finance' && (
              <Box
                bg="whiteAlpha.200"
                p={3}
                borderRadius="lg"
                backdropFilter="blur(10px)"
              >
                <Text fontSize="sm" color="gray.500" mb={2}>Finance Information</Text>
                <SimpleGrid columns={{ base: 1 }} spacing={2}>
                  <Box>
                    <Text fontSize="xs" color="gray.500">Finance Company</Text>
                    <Text fontSize="md">{customer.finance_company || 'Not specified'}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500">Finance Amount</Text>
                    <Text fontSize="md">₹{customer.finance_amount?.toLocaleString() || 'Not specified'}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500">EMI</Text>
                    <Text fontSize="md">₹{customer.emi?.toLocaleString() || 'Not specified'}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500">Tenure (months)</Text>
                    <Text fontSize="md">{customer.tenure || 'Not specified'}</Text>
                  </Box>
                </SimpleGrid>
              </Box>
            )}

            {/* Nominee Information */}
            <Box
              bg="whiteAlpha.200"
              p={3}
              borderRadius="lg"
              backdropFilter="blur(10px)"
            >
              <Text fontSize="sm" color="gray.500" mb={2}>Nominee Information</Text>
              <SimpleGrid columns={{ base: 1 }} spacing={2}>
                <Box>
                  <Text fontSize="xs" color="gray.500">Nominee Name</Text>
                  <Text fontSize="md">{customer.nominee || 'Not provided'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">Relation with Nominee</Text>
                  <Text fontSize="md">{customer.nominee_relation || 'Not provided'}</Text>
                </Box>
              </SimpleGrid>
            </Box>

            {/* Document Images */}
            <Box
              bg="whiteAlpha.200"
              p={3}
              borderRadius="lg"
              backdropFilter="blur(10px)"
            >
              <Text fontSize="sm" color="gray.500" mb={2}>Document Images</Text>
              <SimpleGrid columns={{ base: 1 }} spacing={3}>
                <Box>
                  <Text fontSize="xs" color="gray.500" mb={1}>Aadhar Front</Text>
                  {images.aadhar_front ? (
                    <Image
                      src={images.aadhar_front}
                      alt="Aadhar Front"
                      borderRadius="md"
                      w="full"
                      h="150px"
                      objectFit="cover"
                      fallback={<Text>Error loading image</Text>}
                    />
                  ) : (
                    <Text fontSize="sm">Not uploaded</Text>
                  )}
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" mb={1}>Aadhar Back</Text>
                  {images.aadhar_back ? (
                    <Image
                      src={images.aadhar_back}
                      alt="Aadhar Back"
                      borderRadius="md"
                      w="full"
                      h="150px"
                      objectFit="cover"
                      fallback={<Text>Error loading image</Text>}
                    />
                  ) : (
                    <Text fontSize="sm">Not uploaded</Text>
                  )}
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" mb={1}>Passport Photo</Text>
                  {images.passport_photo ? (
                    <Image
                      src={images.passport_photo}
                      alt="Passport Photo"
                      borderRadius="md"
                      w="full"
                      h="150px"
                      objectFit="cover"
                      fallback={<Text>Error loading image</Text>}
                    />
                  ) : (
                    <Text fontSize="sm">Not uploaded</Text>
                  )}
                </Box>
              </SimpleGrid>
            </Box>

            {/* Delivery Photos - Only show if delivery_status is true */}
            {customer.delivery_status && (
              <Box
                bg="whiteAlpha.200"
                p={3}
                borderRadius="lg"
                backdropFilter="blur(10px)"
              >
                <Text fontSize="sm" color="gray.500" mb={2}>Delivery Photos</Text>
                <SimpleGrid columns={{ base: 1 }} spacing={3}>
                  <Box>
                    <Text fontSize="xs" color="gray.500" mb={1}>Front Delivery Photo</Text>
                    {images.front_delivery_photo ? (
                      <Image
                        src={images.front_delivery_photo}
                        alt="Front Delivery Photo"
                        borderRadius="md"
                        w="full"
                        h="150px"
                        objectFit="cover"
                      />
                    ) : (
                      <Text fontSize="sm">Not uploaded</Text>
                    )}
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500" mb={1}>Back Delivery Photo</Text>
                    {images.back_delivery_photo ? (
                      <Image
                        src={images.back_delivery_photo}
                        alt="Back Delivery Photo"
                        borderRadius="md"
                        w="full"
                        h="150px"
                        objectFit="cover"
                      />
                    ) : (
                      <Text fontSize="sm">Not uploaded</Text>
                    )}
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500" mb={1}>Delivery Photo</Text>
                    {images.delivery_photo ? (
                      <Image
                        src={images.delivery_photo}
                        alt="Delivery Photo"
                        borderRadius="md"
                        w="full"
                        h="150px"
                        objectFit="cover"
                      />
                    ) : (
                      <Text fontSize="sm">Not uploaded</Text>
                    )}
                  </Box>
                </SimpleGrid>
              </Box>
            )}
          </VStack>
        </Box>
      </CardBody>
    </MotionCard>
  );

  const renderBookingStatus = () => (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      mb={6}
      overflow="hidden"
    >
      <CardBody p={0}>
        <Box
          bg={cardBg}
          p={6}
          position="relative"
          overflow="hidden"
        >
          {/* Booking Status Section */}
          <Box mb={6}>
            <Heading size="md" mb={4} color={textColor}>Booking Status</Heading>
            <VStack spacing={4} align="stretch">
              <Box
                bg="whiteAlpha.200"
                p={4}
                borderRadius="lg"
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor="whiteAlpha.300"
                position="relative"
                _hover={{
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 'lg',
                    padding: '1px',
                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b649, #2c3e50)',
                    backgroundSize: '300% 300%',
                    animation: `${gradientBorder} 3s ease infinite`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                  },
                }}
              >
                <VStack spacing={4} align="stretch">
                  <Flex justify="space-between" align="center">
                    <Badge
                      colorScheme={verificationStatus.color}
                      px={3}
                      py={1}
                      borderRadius="full"
                      _hover={{
                        transform: 'scale(1.05)',
                        transition: 'all 0.2s',
                      }}
                    >
                      {verificationStatus.status}
                    </Badge>
                  </Flex>
                  <Progress
                    value={verificationStatus.progress}
                    colorScheme={verificationStatus.color}
                    size="sm"
                    borderRadius="full"
                    sx={{
                      '& > div': {
                        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                        backgroundSize: '200% 200%',
                        animation: `${gradientBorder} 3s ease infinite`,
                      },
                    }}
                  />
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <Box
                      bg="whiteAlpha.100"
                      p={3}
                      borderRadius="md"
                      border="1px solid"
                      borderColor={customer.sales_verified ? "green.500" : "gray.500"}
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color="gray.500">Sales Verification</Text>
                        <HStack>
                          <Icon
                            as={customer.sales_verified ? CheckCircleIcon : TimeIcon}
                            color={customer.sales_verified ? "green.500" : "yellow.500"}
                          />
                          <Text>
                            {customer.sales_verified ? "Verified" : "Pending"}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                    <Box
                      bg="whiteAlpha.100"
                      p={3}
                      borderRadius="md"
                      border="1px solid"
                      borderColor={customer.accounts_verified ? "green.500" : "gray.500"}
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color="gray.500">Accounts Verification</Text>
                        <HStack>
                          <Icon
                            as={customer.accounts_verified ? CheckCircleIcon : TimeIcon}
                            color={customer.accounts_verified ? "green.500" : "yellow.500"}
                          />
                          <Text>
                            {customer.accounts_verified ? "Verified" : "Pending"}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                    <Box
                      bg="whiteAlpha.100"
                      p={3}
                      borderRadius="md"
                      border="1px solid"
                      borderColor={customer.rto_verified ? "green.500" : "gray.500"}
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color="gray.500">RTO Verification</Text>
                        <HStack>
                          <Icon
                            as={customer.rto_verified ? CheckCircleIcon : TimeIcon}
                            color={customer.rto_verified ? "green.500" : "yellow.500"}
                          />
                          <Text>
                            {customer.rto_verified ? "Verified" : "Pending"}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                  </SimpleGrid>
                </VStack>
              </Box>
            </VStack>
          </Box>

          <Flex justify="space-between" align="center" mb={6}>
            <VStack align="start" spacing={1}>
              <Button
                onClick={() => setIsCustomerModalOpen(true)}
                variant="ghost"
                size="lg"
                rightIcon={<ChevronRightIcon />}
                _hover={{
                  transform: 'translateX(4px)',
                  transition: 'all 0.2s',
                }}
              >
                <Heading size="lg" bgGradient={accentGradient} bgClip="text">
                  Customer Details
                </Heading>
              </Button>
              <Text fontSize="sm" color="gray.500">
                Created by {customer.sales_employee || 'John Doe'} on {new Date(customer.created_at).toLocaleDateString()}
              </Text>
            </VStack>
          </Flex>

          {/* Add the AnimatedModal */}
          <AnimatedModal 
            isOpen={isCustomerModalOpen} 
            onClose={() => setIsCustomerModalOpen(false)}
          >
            <Box p={6}>
              {renderCustomerDetails()}
            </Box>
          </AnimatedModal>

          <Collapse in={isBookingDetailsOpen || customer.status === 'Pending'}>
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
                <Flex justify="flex-end">
                  <IconButton
                    icon={<EditIcon />}
                    aria-label="Edit details"
                    variant="ghost"
                    colorScheme="purple"
                    onClick={() => setIsEditing(!isEditing)}
                    size="lg"
                  />
                </Flex>

                {isEditing ? (
                  <form onSubmit={handleSubmit}>
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
                    <Button
                      type="submit"
                      colorScheme="purple"
                      size="lg"
                      mt={4}
                      bgGradient={accentGradient}
                      _hover={{ 
                        transform: 'translateY(-2px)',
                        boxShadow: 'xl'
                      }}
                      transition="all 0.2s"
                    >
                      Save Changes
                    </Button>
                  </form>
                ) : (
                  <VStack spacing={6} align="stretch">
                    {/* Basic Information */}
                    <Box
                      bg="whiteAlpha.200"
                      p={4}
                      borderRadius="lg"
                      backdropFilter="blur(10px)"
                    >
                      <Text fontSize="sm" color="gray.500" mb={3}>Basic Information</Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Customer Name</Text>
                          <Text fontSize="lg">{customer.customer_name}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Phone Number</Text>
                          <Text fontSize="lg">{customer.phone_number}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Date of Birth</Text>
                          <Text fontSize="lg">{customer.dob ? new Date(customer.dob).toLocaleDateString() : 'Not provided'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Email</Text>
                          <Text fontSize="lg">{customer.email || 'Not provided'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Address</Text>
                          <Text fontSize="lg">{customer.address || 'Not provided'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Mobile 2</Text>
                          <Text fontSize="lg">{customer.mobile_2 || 'Not provided'}</Text>
                        </Box>
                      </SimpleGrid>
                    </Box>

                    {/* Vehicle Information */}
                    <Box
                      bg="whiteAlpha.200"
                      p={4}
                      borderRadius="lg"
                      backdropFilter="blur(10px)"
                    >
                      <Text fontSize="sm" color="gray.500" mb={3}>Vehicle Information</Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Vehicle</Text>
                          <Text fontSize="lg">{customer.vehicle}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Variant</Text>
                          <Text fontSize="lg">{customer.variant || 'Not specified'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Color</Text>
                          <Text fontSize="lg">{customer.color || 'Not specified'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Ex Showroom Price</Text>
                          <Text fontSize="lg">₹{customer.ex_showroom?.toLocaleString() || 'Not specified'}</Text>
                        </Box>
                      </SimpleGrid>
                    </Box>

                    {/* Payment Information */}
                    <Box
                      bg="whiteAlpha.200"
                      p={4}
                      borderRadius="lg"
                      backdropFilter="blur(10px)"
                    >
                      <Text fontSize="sm" color="gray.500" mb={3}>Payment Information</Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Payment Mode</Text>
                          <Text fontSize="lg">{customer.payment_mode || 'Not specified'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Total Price</Text>
                          <Text fontSize="lg">₹{customer.total_price?.toLocaleString() || '0'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Amount Paid</Text>
                          <Text fontSize="lg">₹{customer.amount_paid?.toLocaleString() || '0'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Remaining Amount</Text>
                          <Text fontSize="lg">₹{(customer.total_price - customer.amount_paid)?.toLocaleString() || '0'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Tax</Text>
                          <Text fontSize="lg">₹{customer.tax?.toLocaleString() || 'Not specified'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Insurance</Text>
                          <Text fontSize="lg">₹{customer.insurance?.toLocaleString() || 'Not specified'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Booking Fee</Text>
                          <Text fontSize="lg">₹{customer.booking_fee?.toLocaleString() || 'Not specified'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Accessories</Text>
                          <Text fontSize="lg">₹{customer.accessories?.toLocaleString() || 'Not specified'}</Text>
                        </Box>
                      </SimpleGrid>
                    </Box>

                    {/* Finance Information */}
                            {customer.payment_mode === 'Finance' && (
                      <Box
                        bg="whiteAlpha.200"
                        p={4}
                        borderRadius="lg"
                        backdropFilter="blur(10px)"
                      >
                        <Text fontSize="sm" color="gray.500" mb={3}>Finance Information</Text>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <Box>
                            <Text fontSize="sm" color="gray.500">Finance Company</Text>
                            <Text fontSize="lg">{customer.finance_company || 'Not specified'}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.500">Finance Amount</Text>
                            <Text fontSize="lg">₹{customer.finance_amount?.toLocaleString() || 'Not specified'}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.500">EMI</Text>
                            <Text fontSize="lg">₹{customer.emi?.toLocaleString() || 'Not specified'}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.500">Tenure (months)</Text>
                            <Text fontSize="lg">{customer.tenure || 'Not specified'}</Text>
                          </Box>
                        </SimpleGrid>
                      </Box>
                    )}

                    {/* Nominee Information */}
                    <Box
                      bg="whiteAlpha.200"
                      p={4}
                      borderRadius="lg"
                      backdropFilter="blur(10px)"
                    >
                      <Text fontSize="sm" color="gray.500" mb={3}>Nominee Information</Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Nominee Name</Text>
                          <Text fontSize="lg">{customer.nominee || 'Not provided'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Relation with Nominee</Text>
                          <Text fontSize="lg">{customer.nominee_relation || 'Not provided'}</Text>
                        </Box>
                      </SimpleGrid>
                    </Box>

                    {/* Document Images */}
                    <Box
                      bg="whiteAlpha.200"
                      p={4}
                      borderRadius="lg"
                      backdropFilter="blur(10px)"
                    >
                      <Text fontSize="sm" color="gray.500" mb={3}>Document Images</Text>
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.500" mb={2}>Aadhar Front</Text>
                          {images.aadhar_front ? (
                            <Image
                              src={images.aadhar_front}
                              alt="Aadhar Front"
                              borderRadius="md"
                              boxSize="200px"
                              objectFit="cover"
                              fallback={<Text>Error loading image</Text>}
                            />
                          ) : (
                            <Text>Not uploaded</Text>
                          )}
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500" mb={2}>Aadhar Back</Text>
                          {images.aadhar_back ? (
                            <Image
                              src={images.aadhar_back}
                              alt="Aadhar Back"
                              borderRadius="md"
                              boxSize="200px"
                              objectFit="cover"
                              fallback={<Text>Error loading image</Text>}
                            />
                          ) : (
                            <Text>Not uploaded</Text>
                          )}
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500" mb={2}>Passport Photo</Text>
                          {images.passport_photo ? (
                            <Image
                              src={images.passport_photo}
                              alt="Passport Photo"
                              borderRadius="md"
                              boxSize="200px"
                              objectFit="cover"
                              fallback={<Text>Error loading image</Text>}
                            />
                          ) : (
                            <Text>Not uploaded</Text>
                          )}
                        </Box>
                      </SimpleGrid>
                    </Box>

                  

                    {/* Delivery Photos - Only show if delivery_status is true */}
                    {customer.delivery_status && (
                      <Box
                        bg="whiteAlpha.200"
                        p={4}
                        borderRadius="lg"
                        backdropFilter="blur(10px)"
                      >
                        <Text fontSize="sm" color="gray.500" mb={3}>Delivery Photos</Text>
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                          <Box>
                            <Text fontSize="sm" color="gray.500" mb={2}>Front Delivery Photo</Text>
                            {images.front_delivery_photo ? (
                              <Image
                                src={images.front_delivery_photo}
                                alt="Front Delivery Photo"
                                borderRadius="md"
                                boxSize="200px"
                                objectFit="cover"
                              />
                            ) : (
                              <Text>Not uploaded</Text>
                            )}
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.500" mb={2}>Back Delivery Photo</Text>
                            {images.back_delivery_photo ? (
                              <Image
                                src={images.back_delivery_photo}
                                alt="Back Delivery Photo"
                                borderRadius="md"
                                boxSize="200px"
                                objectFit="cover"
                              />
                            ) : (
                              <Text>Not uploaded</Text>
                            )}
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.500" mb={2}>Delivery Photo</Text>
                            {images.delivery_photo ? (
                              <Image
                                src={images.delivery_photo}
                                alt="Delivery Photo"
                                borderRadius="md"
                                boxSize="200px"
                                objectFit="cover"
                              />
                            ) : (
                              <Text>Not uploaded</Text>
                            )}
                          </Box>
                        </SimpleGrid>
                      </Box>
                    )}
                  </VStack>
                )}
              </VStack>
            )}
          </Collapse>
        </Box>
      </CardBody>
    </MotionCard>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'booking':
        return (
          <Box 
            bg={cardBg} 
            minH="100vh"
            w="100%"
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            overflowY="auto"
            pt={{ base: '80px', md: '120px' }}
            pb={{ base: '80px', md: '40px' }}
            px={{ base: 4, md: 6 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key="booking"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
            {renderBookingStatus()}
                {/* Employee Details Box */}
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  mb={6}
                  overflow="hidden"
                >
                  <CardBody p={0}>
          <Box 
            bg={cardBg} 
            p={6} 
                      position="relative"
                      overflow="hidden"
                    >
                      <VStack spacing={4} align="stretch">
                        <Heading size="md" color={textColor}>Employee Details</Heading>
                        <Box
                          bg="whiteAlpha.200"
                          p={4}
                          borderRadius="lg"
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor="whiteAlpha.300"
                          _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                          }}
                        >
                          <HStack justify="space-between" align="center" spacing={2}>
                            <HStack spacing={2} flex={1} minW={0}>
                              <Avatar size="md" name={employeeDetails?.name || 'Loading...'} />
                              <VStack align="start" spacing={0.5} flex={1} minW={0}>
                                <Text fontSize="md" fontWeight="bold" noOfLines={1}>
                                  {employeeDetails?.name || 'Loading...'}
                                </Text>
                                <Text fontSize="sm" color="gray.500" noOfLines={1}>
                                  {employeeDetails?.designation || 'Loading...'}
                                </Text>
                                <Text fontSize="sm" color="gray.500" noOfLines={1}>
                                  {employeeDetails?.phone || 'Loading...'}
                                </Text>
                                <HStack spacing={1}>
                                  <Text fontSize="sm" color="gray.500">Rating:</Text>
                                  <HStack spacing={0.5}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Icon 
                                        key={star} 
                                        as={StarIcon} 
                                        color={star <= (employeeDetails?.rating || 0) ? "yellow.400" : "gray.300"} 
                                        boxSize={3} 
                                      />
                                    ))}
                                  </HStack>
                                </HStack>
                              </VStack>
                            </HStack>
                            <IconButton
                              icon={<ChatIcon />}
                              aria-label="Chat with employee"
                              colorScheme="purple"
                              onClick={() => setIsChatOpen(true)}
                              size="md"
                              flexShrink={0}
                              _hover={{
                                transform: 'scale(1.1)',
                                transition: 'all 0.2s',
                              }}
                            />
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>
                  </CardBody>
                </MotionCard>
              </motion.div>
            </AnimatePresence>
          </Box>
        );
      case 'service':
        return (
          <Box 
            bg={cardBg} 
            minH="100vh"
            w="100%"
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            overflowY="auto"
            pt={{ base: '80px', md: '120px' }}
            pb={{ base: '80px', md: '40px' }}
            px={{ base: 4, md: 6 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key="service"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Flex justify="space-between" align="center" mb={6}>
                  <Heading size="lg" color={textColor}>Service</Heading>
                  <IconButton
                    icon={<ChatIcon />}
                    aria-label="Chat with service team"
                    colorScheme="purple"
                    onClick={() => setIsChatOpen(true)}
                    size="lg"
                    _hover={{
                      transform: 'scale(1.1)',
                      transition: 'all 0.2s',
                    }}
                  />
                </Flex>
            {renderServiceHistory()}
            {renderServiceBooking()}
              </motion.div>
            </AnimatePresence>
          </Box>
        );
      default:
        return null;
    }
  };

  const ServiceDetailsModal = ({ isOpen, onClose, service }) => (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" motionPreset="slideInBottom">
      <ModalOverlay bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(4px)" />
      <ModalContent 
        bg={cardBg} 
        borderRadius="xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <ModalHeader 
          bgGradient={accentGradient} 
          bgClip="text"
          animation={`${gradientBorder} 3s ease infinite`}
        >
          Service Details
        </ModalHeader>
        <ModalCloseButton 
          _hover={{
            transform: 'rotate(90deg)',
            transition: 'all 0.3s',
          }}
        />
        <ModalBody>
          {service ? (
            <VStack spacing={6} align="stretch">
              <Box
                bg="whiteAlpha.200"
                p={4}
                borderRadius="lg"
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor="whiteAlpha.300"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                }}
              >
                <VStack align="start" spacing={4}>
                    <Text fontSize="lg" fontWeight="bold">{service.type}</Text>
                    <Text>Date: {service.date}</Text>
                    <Text>Status: {service.status}</Text>
                </VStack>
              </Box>
  
              <Box
                bg="whiteAlpha.200"
                p={4}
                borderRadius="lg"
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor="whiteAlpha.300"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Text fontSize="sm" color="gray.500" mb={2}>Service Details</Text>
                <VStack align="start" spacing={2}>
                  <Text>{service.notes}</Text>
                </VStack>
              </Box>
  
              <Box
                bg="whiteAlpha.200"
                p={4}
                borderRadius="lg"
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor="whiteAlpha.300"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Text fontSize="sm" color="gray.500" mb={2}>Service Executive</Text>
                <HStack>
                  <Avatar size="sm" name="John Doe" />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">John Doe</Text>
                    <Text fontSize="sm" color="gray.500">Service Manager</Text>
                    <Text fontSize="sm" color="gray.500">+91 98765 43210</Text>
                  </VStack>
                </HStack>
              </Box>
  
              <Box
                bg="whiteAlpha.200"
                p={4}
                borderRadius="lg"
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor="whiteAlpha.300"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Text fontSize="sm" color="gray.500" mb={2}>Cost Details</Text>
                <VStack align="start" spacing={2}>
                  <HStack justify="space-between" w="full">
                    <Text>Service Cost</Text>
                    <Text fontWeight="bold">₹2,500</Text>
                  </HStack>
                  <HStack justify="space-between" w="full">
                    <Text>Parts Cost</Text>
                    <Text fontWeight="bold">₹1,500</Text>
                  </HStack>
                  <HStack justify="space-between" w="full">
                    <Text>Tax (18%)</Text>
                    <Text fontWeight="bold">₹720</Text>
                  </HStack>
                  <Divider />
                  <HStack justify="space-between" w="full">
                    <Text fontWeight="bold">Total Amount</Text>
                    <Text fontWeight="bold" color="purple.500">₹4,720</Text>
                  </HStack>
                </VStack>
              </Box>

              <HStack spacing={4} justify="center">
                <Button
                  leftIcon={<ViewIcon />}
                  colorScheme="purple"
                  size="lg"
                  onClick={() => {
                    toast({
                      title: 'Report Downloaded',
                      description: 'Service report has been downloaded successfully',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                  }}
                  _hover={{
                    transform: 'scale(1.05)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s',
                  }}
                >
                  Download Report
                </Button>
                <Button
                  leftIcon={<StarIcon />}
                  colorScheme="yellow"
                  size="lg"
                  onClick={() => {
                    toast({
                      title: 'Rating Submitted',
                      description: 'Thank you for your feedback',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                  }}
                  _hover={{
                    transform: 'scale(1.05)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s',
                  }}
                >
                  Rate Service
                </Button>
              </HStack>
            </VStack>
          ) : (
            <Text>No service details available.</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <Box minH="100vh" bg={bgGradient}>
      {renderHeader()}

      {/* Main Content with padding for fixed header and bottom nav */}
      <Box 
        maxW={{ base: '100%', md: '800px' }} 
        mx="auto" 
        pt={{ base: '80px', md: '120px' }}
        pb={{ base: '80px', md: '40px' }}
        px={{ base: 4, md: 6 }}
      >
        {renderContent()}
      </Box>

      {/* Bottom Navigation */}
      {renderBottomNav()}

      {/* Chat Panel */}
      {renderChat()}

      {/* Vehicle Condition Modal */}
      <VehicleConditionModal isOpen={isServiceModalOpen && !selectedService} onClose={onServiceModalClose} service={customer} />

      {/* Service Details Modal */}
      <ServiceDetailsModal isOpen={isServiceModalOpen && selectedService} onClose={onServiceModalClose} service={selectedService} />
    </Box>
  );
};

export default CustomerDetails;