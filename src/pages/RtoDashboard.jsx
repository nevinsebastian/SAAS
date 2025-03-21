import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  IconButton,
  Button,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Input,
  Select,
  Tabs,
  TabList,
  Tab,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useColorMode,
  Image,
  Divider,
  Spinner,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  TabPanels,
  TabPanel,
  GridItem,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { HamburgerIcon, BellIcon, ArrowBackIcon, DownloadIcon, SearchIcon, FilterIcon, CheckIcon, TimeIcon, ChevronRightIcon, ChevronLeftIcon, StarIcon, InfoIcon, WarningIcon, CheckCircleIcon, CloseIcon, ChevronUpIcon, ChevronDownIcon, ExternalLinkIcon, ViewIcon, AttachmentIcon, SettingsIcon, RepeatIcon } from '@chakra-ui/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf'; // Add jsPDF for PDF generation
import { rtoApi } from '../api';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import JSZip from 'jszip';

// Define CustomerCard component first
const CustomerCard = ({ customer, onAction, isVerified, onSelect, onDownloadChassis }) => {
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const borderColor = useColorModeValue('rgba(226, 232, 240, 0.8)', 'rgba(45, 55, 72, 0.8)');
  const hoverBg = useColorModeValue('rgba(66, 153, 225, 0.1)', 'rgba(66, 153, 225, 0.2)');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -5 }}
      style={{ height: '100%' }}
    >
      <Box
        bg={cardBg}
        p={5}
        borderRadius="xl"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        border="1px"
        borderColor={borderColor}
        backdropFilter="blur(10px)"
        _hover={{ 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          borderColor: 'blue.400',
          bg: useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(26, 32, 44, 0.95)'),
          transform: 'translateY(-5px)'
        }}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        cursor="pointer"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(customer);
        }}
        position="relative"
        overflow="hidden"
      >
        <Flex justify="space-between" align="start" mb={3} position="relative">
          <VStack align="start" spacing={1}>
            <Text 
              fontWeight="bold" 
              fontSize="lg" 
              color={textColor}
              bgGradient={useColorModeValue(
                'linear(to-r, blue.500, purple.500)',
                'linear(to-r, blue.300, purple.300)'
              )}
              bgClip="text"
            >
              {customer.customer_name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {customer.vehicle} - {customer.variant}
            </Text>
          </VStack>
          <Badge
            colorScheme={isVerified ? 'green' : 'yellow'}
            px={2}
            py={0.5}
            borderRadius="full"
            fontSize="xs"
            boxShadow="sm"
            backdropFilter="blur(4px)"
            _hover={{ transform: 'scale(1.05)' }}
            transition="all 0.2s"
          >
            {isVerified ? 'Verified' : 'Pending'}
          </Badge>
        </Flex>

        <Divider my={3} borderColor={borderColor} />

        <Flex justify="space-between" align="center">
          <HStack spacing={2}>
            {customer.chassis_image && (
              <Button
                colorScheme="purple"
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadChassis(customer.id);
                }}
                leftIcon={<DownloadIcon />}
                backdropFilter="blur(4px)"
                _hover={{ 
                  transform: 'translateY(-2px)',
                  boxShadow: 'md'
                }}
                transition="all 0.2s"
              >
                Chassis
              </Button>
            )}
          </HStack>
          <ChevronRightIcon 
            color={useColorModeValue('gray.400', 'gray.500')}
            _groupHover={{ color: 'blue.500' }}
            transition="all 0.2s"
          />
        </Flex>
      </Box>
    </motion.div>
  );
};

const RtoDashboard = () => {
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isRtoVerifiedOpen, onOpen: onRtoVerifiedOpen, onClose: onRtoVerifiedClose } = useDisclosure();
  const { isOpen: isImageModalOpen, onOpen: onImageModalOpen, onClose: onImageModalClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  // Top-level useColorModeValue calls
  const bgGradient = useColorModeValue('linear(to-br, gray.50, gray.100)', 'linear(to-br, gray.900, gray.800)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const headerGradient = useColorModeValue('linear(to-r, blue.500, purple.500)', 'linear(to-r, blue.700, purple.700)');
  const accentColor = 'blue.500';
  const hoverBg = useColorModeValue('blue.50', 'blue.900');
  const emptyStateGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, blue.900, purple.900)'
  );
  const cardGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, blue.900, purple.900)'
  );

  // Add new color mode values at the top level
  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const glassBorder = useColorModeValue('rgba(226, 232, 240, 0.8)', 'rgba(45, 55, 72, 0.8)');
  const glassHoverBg = useColorModeValue('rgba(66, 153, 225, 0.1)', 'rgba(66, 153, 225, 0.2)');
  const glassInputBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');
  const gradientBg = useColorModeValue(
    'linear(to-br, rgba(66, 153, 225, 0.1), rgba(159, 122, 234, 0.1))',
    'linear(to-br, rgba(66, 153, 225, 0.2), rgba(159, 122, 234, 0.2))'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [tabIndex, setTabIndex] = useState(0); // Done, Pending, Uploaded tabs
  const [chassisNumber, setChassisNumber] = useState('');
  const [chassisImage, setChassisImage] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [verifiedCustomers, setVerifiedCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState({
    fullName: '', address: '', fathersName: '', panNumber: '', aadharNumber: '', photo: '',
    aadharFront: '', aadharBack: '', signature: '', nomineeName: '', nomineeAge: '', nomineeRelation: '',
    ward: '', rtoOffice: '', invoicePdf: '', name: '', vehicle: '', variant: '', color: '',
    exShowroom: '', tax: '', onRoad: '', insurance: '', bookingCharge: '', deliveryCharge: '',
  });
  const [sortBy, setSortBy] = useState('date');

  const user = JSON.parse(localStorage.getItem('user')) || { username: 'rto_user' };

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
  }, []);

  // Update the fetchCustomers function to handle rto_verified status
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Fetch both pending and verified customers
      const [pendingResponse, verifiedResponse] = await Promise.all([
        rtoApi.getPendingCustomers(),
        rtoApi.getVerifiedCustomers()
      ]);

      console.log('Pending customers:', pendingResponse.customers);
      console.log('Verified customers:', verifiedResponse.customers);

      setPendingCustomers(pendingResponse.customers);
      setVerifiedCustomers(verifiedResponse.customers);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      if (error.message) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load customers. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  // Update useEffect to use the fetchCustomers function
  useEffect(() => {
    fetchCustomers();
  }, []);

  const notifications = [
    { id: 1, message: 'New booking added: John Doe', time: '2025-03-01 10:00 AM', seen: false },
    { id: 2, message: 'RTO upload completed for Jane Smith', time: '2025-03-02 09:00 AM', seen: false },
  ];

  const unseenNotifications = notifications.filter(n => !n.seen);

  // Add history handling
  useEffect(() => {
    const handlePopState = (event) => {
      if (selectedCustomer) {
        setSelectedCustomer(null);
        // Push a new state to prevent going back to logout
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedCustomer]);

  // Update handleCustomerSelect to push a new state
  const handleCustomerSelect = async (customer) => {
    setSelectedCustomer(customer);
    setCustomerData(customer);
    // Push a new state when viewing customer details
    window.history.pushState({ customerId: customer.id }, '', window.location.href);
  };

  // Update the back button click handler
  const handleBackClick = () => {
    setSelectedCustomer(null);
    // Push a new state to prevent going back to logout
    window.history.pushState(null, '', window.location.href);
  };

  const handleMarkUploaded = async (customerId) => {
    try {
      await rtoApi.updateCustomerStatus(customerId, 'uploaded');
      toast({
        title: 'Success',
        description: 'Customer marked as uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchCustomers(); // Refresh the list
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update customer status',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRtoVerified = async (customerId) => {
    try {
      await rtoApi.updateCustomerStatus(customerId, 'done');
      toast({
        title: 'Success',
        description: 'Customer marked as RTO verified successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchCustomers(); // Refresh the list
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update customer status',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleChassisSearch = async () => {
    if (!chassisNumber) {
      toast({
        title: 'Error',
        description: 'Please enter a chassis number',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await rtoApi.getCustomerByChassis(chassisNumber);
      if (response.customer) {
        setSelectedCustomer(response.customer);
        setCustomerData(response.customer);
        toast({
          title: 'Success',
          description: 'Customer found',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'No customer found with this chassis number',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Failed to search chassis:', error);
      toast({
        title: 'Error',
        description: 'Failed to search chassis number',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDownloadChassis = async (customerId) => {
    try {
      const response = await rtoApi.getChassisImage(customerId);
      if (response.image) {
        const link = document.createElement('a');
        link.href = `data:image/jpeg;base64,${response.image}`;
        link.download = `chassis_${customerId}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
          title: 'Success',
          description: 'Chassis image downloaded successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
    } else {
        toast({
          title: 'Error',
          description: 'No chassis image found',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Failed to download chassis image:', error);
      toast({
        title: 'Error',
        description: 'Failed to download chassis image',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    onImageModalOpen();
  };

  const handleDownloadUserData = async () => {
    try {
      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Set initial position
      let yOffset = 20;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const contentWidth = pageWidth - (2 * margin);

      // Helper function to add text with proper wrapping
      const addText = (text, y) => {
        const splitText = doc.splitTextToSize(text, contentWidth);
        doc.text(splitText, margin, y);
        return y + (splitText.length * 7) + 5;
      };

      // Helper function to add section header
      const addSectionHeader = (title, y) => {
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(41, 128, 185); // Blue color
        y = addText(title, y);
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        return y + 5;
      };

      // Helper function to add field
      const addField = (label, value, y) => {
        doc.setFont(undefined, 'bold');
        y = addText(label + ':', y);
        doc.setFont(undefined, 'normal');
        return addText(value || 'N/A', y);
      };

      // Add title
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(41, 128, 185);
      yOffset = addText('Customer Details Report', yOffset);
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      yOffset += 10;

      // Add date
      const today = new Date().toLocaleDateString();
      yOffset = addText(`Generated on: ${today}`, yOffset);
      yOffset += 10;

      // Personal Information Section
      yOffset = addSectionHeader('Personal Information', yOffset);
      yOffset = addField('Customer Name', customerData.customer_name, yOffset);
      yOffset = addField('Phone Number', customerData.phone_number, yOffset);
      yOffset = addField('Mobile 1', customerData.mobile_1, yOffset);
      yOffset = addField('Mobile 2', customerData.mobile_2, yOffset);
      yOffset = addField('Email', customerData.email, yOffset);
      yOffset = addField('Address', customerData.address, yOffset);
      yOffset += 10;

      // Nominee Information Section
      yOffset = addSectionHeader('Nominee Information', yOffset);
      yOffset = addField('Nominee Name', customerData.nominee, yOffset);
      yOffset = addField('Nominee Relation', customerData.nominee_relation, yOffset);
      yOffset += 10;

      // Vehicle Information Section
      yOffset = addSectionHeader('Vehicle Information', yOffset);
      yOffset = addField('Vehicle', customerData.vehicle, yOffset);
      yOffset = addField('Variant', customerData.variant, yOffset);
      yOffset = addField('Color', customerData.color, yOffset);
      yOffset = addField('Created At', new Date(customerData.created_at).toLocaleDateString(), yOffset);
      yOffset = addField('Created By', customerData.created_by_name, yOffset);
      yOffset += 10;

      // Payment Information Section
      yOffset = addSectionHeader('Payment Information', yOffset);
      yOffset = addField('Payment Mode', customerData.payment_mode, yOffset);
      if (customerData.payment_mode?.toLowerCase() === 'finance') {
        yOffset = addField('Finance Company', customerData.finance_company, yOffset);
        yOffset = addField('Finance Amount', `₹${customerData.finance_amount}`, yOffset);
        yOffset = addField('EMI', `₹${customerData.emi}`, yOffset);
        yOffset = addField('Tenure (months)', customerData.tenure, yOffset);
      }
      yOffset = addField('Amount Paid', `₹${customerData.amount_paid}`, yOffset);
      yOffset += 10;

      // Pricing Details Section
      yOffset = addSectionHeader('Pricing Details', yOffset);
      yOffset = addField('Ex-Showroom', `₹${customerData.ex_showroom}`, yOffset);
      yOffset = addField('Tax', `₹${customerData.tax}`, yOffset);
      yOffset = addField('Insurance', `₹${customerData.insurance}`, yOffset);
      yOffset = addField('Booking Fee', `₹${customerData.booking_fee}`, yOffset);
      yOffset = addField('Accessories', `₹${customerData.accessories}`, yOffset);
      yOffset = addField('Total Price', `₹${customerData.total_price}`, yOffset);
      yOffset += 10;

      // Add a new page for images
      doc.addPage();

      // Images Section
      yOffset = addSectionHeader('Documents', yOffset);

      // Function to add image to PDF
      const addImage = async (base64Image, label, y) => {
        try {
          if (!base64Image) return y;
          
          // Add label
          doc.setFont(undefined, 'bold');
          y = addText(label + ':', y);
          
          // Add image
          const imgWidth = contentWidth;
          const imgHeight = 50; // Fixed height for images
          
          // Add the image directly from base64
          doc.addImage(base64Image, 'JPEG', margin, y, imgWidth, imgHeight);
          
          return y + imgHeight + 10;
        } catch (error) {
          console.error('Error adding image:', error);
          return y + 20;
        }
      };

      // Add images
      if (customerData.passport_photo_base64) {
        yOffset = await addImage(
          `data:image/jpeg;base64,${customerData.passport_photo_base64}`,
          'Passport Photo',
          yOffset
        );
      }
      if (customerData.aadhar_front_base64) {
        yOffset = await addImage(
          `data:image/jpeg;base64,${customerData.aadhar_front_base64}`,
          'Aadhar Front',
          yOffset
        );
      }
      if (customerData.aadhar_back_base64) {
        yOffset = await addImage(
          `data:image/jpeg;base64,${customerData.aadhar_back_base64}`,
          'Aadhar Back',
          yOffset
        );
      }

      // Save the PDF
      const fileName = `${customerData.customer_name.replace(/\s+/g, '_')}_${customerData.vehicle.replace(/\s+/g, '_')}_details.pdf`;
      doc.save(fileName);

      toast({
        title: 'Success',
        description: 'Customer details PDF downloaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Update the sorting function
  const sortCustomers = (customers) => {
    if (!customers || !Array.isArray(customers)) return [];
    
    return [...customers].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.created_at) - new Date(b.created_at); // Show oldest first
        case 'finance':
          // Show customers with finance first
          if (a.payment_mode?.toLowerCase() === 'finance' && b.payment_mode?.toLowerCase() !== 'finance') return -1;
          if (a.payment_mode?.toLowerCase() !== 'finance' && b.payment_mode?.toLowerCase() === 'finance') return 1;
          return 0;
        case 'cash':
          // Show customers with cash first
          if (a.payment_mode?.toLowerCase() !== 'finance' && b.payment_mode?.toLowerCase() === 'finance') return -1;
          if (a.payment_mode?.toLowerCase() === 'finance' && b.payment_mode?.toLowerCase() !== 'finance') return 1;
          return 0;
        default:
          return 0;
      }
    });
  };

  // Update the filteredCustomers function to include sorting
  const filteredCustomers = (customers, query) => {
    if (!customers || !Array.isArray(customers)) return [];
    
    let filtered = customers;
    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = customers.filter(customer => {
        if (!customer) return false;
        
        const customerName = customer.customer_name || '';
        const vehicle = customer.vehicle || '';
        const variant = customer.variant || '';
        
        return (
          customerName.toLowerCase().includes(searchTerm) ||
          vehicle.toLowerCase().includes(searchTerm) ||
          variant.toLowerCase().includes(searchTerm)
        );
      });
    }

    // Apply finance/cash filter
    if (sortBy === 'finance') {
      filtered = filtered.filter(customer => customer.payment_mode?.toLowerCase() === 'finance');
    } else if (sortBy === 'cash') {
      filtered = filtered.filter(customer => customer.payment_mode?.toLowerCase() !== 'finance');
    }
    
    return sortCustomers(filtered);
  };

  // Add new components for the customer details view
  const ImageViewer = ({ src, alt, onClose }) => {
    const scale = useMotionValue(1);
    const rotate = useMotionValue(0);
    const rotateY = useTransform(rotate, [-100, 100], [-30, 30]);
    const rotateX = useTransform(rotate, [-100, 100], [30, -30]);

    return (
      <Modal isOpen={true} onClose={onClose} size="full" motionPreset="scale">
        <ModalOverlay bg="rgba(0, 0, 0, 0.8)" backdropFilter="blur(10px)" />
        <ModalContent
          bg="transparent"
          boxShadow="none"
          overflow="hidden"
          h="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <motion.div
            style={{
              scale,
              rotateY,
              rotateX,
              cursor: 'grab',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            whileTap={{ cursor: 'grabbing' }}
            drag
            dragConstraints={{
              top: -100,
              left: -100,
              right: 100,
              bottom: 100,
            }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              rotate.set(info.offset.x);
            }}
            onWheel={(e) => {
              e.preventDefault();
              const delta = e.deltaY * -0.01;
              const newScale = Math.min(Math.max(scale.get() + delta, 0.5), 3);
              scale.set(newScale);
            }}
          >
            <Image
              src={src}
              alt={alt}
              objectFit="contain"
              maxH="90vh"
              maxW="90vw"
              borderRadius="lg"
              boxShadow="0 0 50px rgba(0,0,0,0.5)"
              fallbackSrc="https://via.placeholder.com/300?text=Image+Not+Available"
            />
          </motion.div>
          <IconButton
            icon={<CloseIcon />}
            position="absolute"
            top={4}
            right={4}
            color="white"
            bg="rgba(0,0,0,0.5)"
            _hover={{ bg: 'rgba(0,0,0,0.8)' }}
            onClick={onClose}
            size="lg"
            borderRadius="full"
          />
        </ModalContent>
      </Modal>
    );
  };

  const DetailCard = ({ title, children, icon }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const cardBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
    const borderColor = useColorModeValue('rgba(226, 232, 240, 0.8)', 'rgba(45, 55, 72, 0.8)');

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          bg={cardBg}
          borderRadius="xl"
          p={4}
          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          border="1px"
          borderColor={borderColor}
          backdropFilter="blur(10px)"
        >
          <Flex
            justify="space-between"
            align="center"
            cursor="pointer"
            onClick={() => setIsExpanded(!isExpanded)}
            mb={isExpanded ? 4 : 0}
          >
            <HStack spacing={3}>
              {icon}
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                {title}
              </Text>
            </HStack>
            {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Flex>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </motion.div>
    );
  };

  return (
    <Box minH="100vh" bg={bgGradient} position="relative">
      {/* Header with glassmorphism */}
      <Flex
        justify="space-between"
        align="center"
        bg={glassBg}
        color="white"
        p={4}
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        position="sticky"
        top={0}
        zIndex={10}
        borderBottom="1px solid"
        borderColor={glassBorder}
        backdropFilter="blur(10px)"
        bgBlendMode="overlay"
      >
        <HStack spacing={6}>
          <IconButton
            icon={<HamburgerIcon />}
            variant="ghost"
            color="white"
            onClick={onMenuOpen}
            aria-label="Open menu"
            _hover={{ 
              bg: 'whiteAlpha.200',
              transform: 'scale(1.1)'
            }}
            transition="all 0.2s"
          />
          <Heading 
            size="lg" 
            fontWeight="bold"
            bgGradient="linear(to-r, white, blue.100)"
            bgClip="text"
          >
            RTO Dashboard
          </Heading>
        </HStack>
        <HStack spacing={4}>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<BellIcon />}
              variant="ghost"
              color="white"
              aria-label="Notifications"
              position="relative"
              _hover={{ 
                bg: '#47679',
                transform: 'scale(1.1)'
              }}
              transition="all 0.2s"
            >
              {unseenNotifications.length > 0 && (
                <Badge 
                  colorScheme="red" 
                  borderRadius="full" 
                  position="absolute" 
                  top="-1" 
                  right="-1"
                  boxShadow="lg"
                >
                  {unseenNotifications.length}
                </Badge>
              )}
            </MenuButton>
            <MenuList 
              maxH="300px" 
              overflowY="auto" 
              bg={cardBg} 
              borderColor={borderColor}
              boxShadow="xl"
              borderRadius="xl"
            >
              {unseenNotifications.length > 0 ? (
                unseenNotifications.map(n => (
                  <MenuItem 
                    key={n.id} 
                    bg={cardBg} 
                    _hover={{ 
                      bg: hoverBg,
                      transform: 'translateX(5px)'
                    }}
                    transition="all 0.2s"
                  >
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" color={textColor}>{n.message}</Text>
                      <Text fontSize="xs" color="gray.500">{n.time}</Text>
                    </VStack>
                  </MenuItem>
                ))
              ) : (
                <MenuItem bg={cardBg}>No new notifications</MenuItem>
              )}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton>
              <Avatar 
                name={user.username} 
                size="sm"
                border="2px"
                borderColor="whiteAlpha.400"
                _hover={{ 
                  transform: 'scale(1.1)',
                  borderColor: 'white'
                }}
                transition="all 0.2s"
              />
            </MenuButton>
            <MenuList 
              bg={cardBg} 
              borderColor={borderColor}
              boxShadow="xl"
              borderRadius="xl"
            >
              <MenuItem 
                onClick={toggleColorMode} 
                bg={cardBg} 
                _hover={{ 
                  bg: hoverBg,
                  transform: 'translateX(5px)'
                }}
                transition="all 0.2s"
              >
                {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }} 
                bg={cardBg} 
                _hover={{ 
                  bg: hoverBg,
                  transform: 'translateX(5px)'
                }}
                transition="all 0.2s"
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Main Layout */}
      <Box maxW="1400px" mx="auto" mt={4} px={{ base: 3, md: 4 }} pb={{ base: 16, md: 8 }}>
        {selectedCustomer ? (
          <Flex direction="column" h={{ base: 'calc(100vh - 70px)', md: 'auto' }} position={{ base: 'fixed', md: 'static' }} top={{ base: '70px', md: 'auto' }} left={0} right={0} bottom={0} bg={bgGradient} zIndex={9}>
            {/* Fixed Header */}
            <Flex
              justify="space-between"
              align="center"
              bg={glassBg}
              p={4}
              borderRadius={{ base: 0, md: 'lg' }}
              boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              position="sticky"
              top={0}
              zIndex={10}
              borderBottom="1px"
              borderColor={glassBorder}
              backdropFilter="blur(10px)"
            >
              <HStack spacing={4}>
                <IconButton
                  icon={<ArrowBackIcon />}
                  variant="ghost"
                  color={textColor}
                  onClick={handleBackClick}
                  aria-label="Back to list"
                  _hover={{ bg: hoverBg }}
                />
                <VStack align="start" spacing={0}>
                  <Heading size="md" color={textColor}>{customerData.customer_name}</Heading>
                  <Text fontSize="sm" color="gray.500">{customerData.vehicle} - {customerData.variant}</Text>
                </VStack>
              </HStack>
              <HStack spacing={2}>
                <Button
                  leftIcon={<DownloadIcon />}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadUserData}
                  _hover={{ bg: hoverBg }}
                >
                  Export Data
                </Button>
              </HStack>
            </Flex>

            {/* Scrollable Details */}
            <Box flex="1" overflowY="auto" p={6} pb={200}>
              <VStack spacing={6} align="stretch">
                {/* Status Badge */}
                <Flex justify="center">
                  <Badge
                    colorScheme={customerData.rto_verified ? 'green' : 'yellow'}
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontSize="md"
                    boxShadow="md"
                    backdropFilter="blur(4px)"
                  >
                    {customerData.rto_verified ? 'Verified' : 'Pending Verification'}
                  </Badge>
                </Flex>

                {/* Personal Information */}
                <DetailCard
                  title="Personal Information"
                  icon={<AttachmentIcon />}
                >
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Customer Name</Text>
                      <Text fontSize="md" color={textColor}>{customerData.customer_name}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Phone Number</Text>
                      <Text fontSize="md" color={textColor}>{customerData.phone_number}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Mobile 1</Text>
                      <Text fontSize="md" color={textColor}>{customerData.mobile_1}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Mobile 2</Text>
                      <Text fontSize="md" color={textColor}>{customerData.mobile_2}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Email</Text>
                      <Text fontSize="md" color={textColor}>{customerData.email}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Address</Text>
                      <Text fontSize="md" color={textColor}>{customerData.address}</Text>
                    </Box>
                  </SimpleGrid>
                </DetailCard>

                {/* Nominee Information */}
                <DetailCard
                  title="Nominee Information"
                  icon={<AttachmentIcon />}
                >
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Nominee Name</Text>
                      <Text fontSize="md" color={textColor}>{customerData.nominee}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Nominee Relation</Text>
                      <Text fontSize="md" color={textColor}>{customerData.nominee_relation}</Text>
                    </Box>
                  </SimpleGrid>
                </DetailCard>

                {/* Vehicle Information */}
                <DetailCard
                  title="Vehicle Information"
                  icon={<SettingsIcon />}
                >
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Vehicle</Text>
                      <Text fontSize="md" color={textColor}>{customerData.vehicle}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Variant</Text>
                      <Text fontSize="md" color={textColor}>{customerData.variant}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Color</Text>
                      <Text fontSize="md" color={textColor}>{customerData.color}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Created At</Text>
                      <Text fontSize="md" color={textColor}>{new Date(customerData.created_at).toLocaleDateString()}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Created By</Text>
                      <Text fontSize="md" color={textColor}>{customerData.created_by_name}</Text>
                    </Box>
                  </SimpleGrid>
                </DetailCard>

                {/* Payment Information */}
                <DetailCard
                  title="Payment Information"
                  icon={<RepeatIcon />}
                >
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Payment Mode</Text>
                      <Text fontSize="md" color={textColor}>{customerData.payment_mode}</Text>
                    </Box>
                    {customerData.payment_mode?.toLowerCase() === 'finance' && (
                      <>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Finance Company</Text>
                          <Text fontSize="md" color={textColor}>{customerData.finance_company}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Finance Amount</Text>
                          <Text fontSize="md" color={textColor}>₹{customerData.finance_amount}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">EMI</Text>
                          <Text fontSize="md" color={textColor}>₹{customerData.emi}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Tenure (months)</Text>
                          <Text fontSize="md" color={textColor}>{customerData.tenure}</Text>
                        </Box>
                      </>
                    )}
                    <Box>
                      <Text fontSize="sm" color="gray.500">Amount Paid</Text>
                      <Text fontSize="md" color={textColor}>₹{customerData.amount_paid}</Text>
                    </Box>
                  </SimpleGrid>
                </DetailCard>

                {/* Pricing Details */}
                <DetailCard
                  title="Pricing Details"
                  icon={<RepeatIcon />}
                >
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Ex-Showroom</Text>
                      <Text fontSize="md" color={textColor}>₹{customerData.ex_showroom}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Tax</Text>
                      <Text fontSize="md" color={textColor}>₹{customerData.tax}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Insurance</Text>
                      <Text fontSize="md" color={textColor}>₹{customerData.insurance}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Booking Fee</Text>
                      <Text fontSize="md" color={textColor}>₹{customerData.booking_fee}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Accessories</Text>
                      <Text fontSize="md" color={textColor}>₹{customerData.accessories}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Total Price</Text>
                      <Text fontSize="md" color={textColor} fontWeight="bold">₹{customerData.total_price}</Text>
                    </Box>
                  </SimpleGrid>
                </DetailCard>

                {/* Documents */}
                <DetailCard
                  title="Documents"
                  icon={<AttachmentIcon />}
                >
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={2}>Passport Photo</Text>
                      <Image
                        src={`data:image/jpeg;base64,${customerData.passport_photo_base64}`}
                        alt="Customer Photo"
                        objectFit="cover"
                        borderRadius="lg"
                        cursor="pointer"
                        onClick={() => handleImageClick(`data:image/jpeg;base64,${customerData.passport_photo_base64}`)}
                        fallbackSrc="https://via.placeholder.com/150?text=No+Photo"
                        _hover={{ opacity: 0.8 }}
                        transition="all 0.2s"
                        h="200px"
                        w="100%"
                      />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={2}>Aadhar Front</Text>
                      <Image
                        src={`data:image/jpeg;base64,${customerData.aadhar_front_base64}`}
                        alt="Aadhar Front"
                        objectFit="cover"
                        borderRadius="lg"
                        cursor="pointer"
                        onClick={() => handleImageClick(`data:image/jpeg;base64,${customerData.aadhar_front_base64}`)}
                        fallbackSrc="https://via.placeholder.com/200x150?text=No+Aadhar+Front"
                        _hover={{ opacity: 0.8 }}
                        transition="all 0.2s"
                        h="200px"
                        w="100%"
                      />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={2}>Aadhar Back</Text>
                      <Image
                        src={`data:image/jpeg;base64,${customerData.aadhar_back_base64}`}
                        alt="Aadhar Back"
                        objectFit="cover"
                        borderRadius="lg"
                        cursor="pointer"
                        onClick={() => handleImageClick(`data:image/jpeg;base64,${customerData.aadhar_back_base64}`)}
                        fallbackSrc="https://via.placeholder.com/200x150?text=No+Aadhar+Back"
                        _hover={{ opacity: 0.8 }}
                        transition="all 0.2s"
                        h="200px"
                        w="100%"
                      />
                    </Box>
                  </SimpleGrid>
                </DetailCard>

                {/* Action Buttons */}
                <Flex justify="center" mt={8}>
                  <HStack spacing={4}>
                    {!customerData.rto_verified && (
                      <Button
                        colorScheme="blue"
                        size="lg"
                        leftIcon={<CheckIcon />}
                        onClick={() => {
                          onRtoVerifiedOpen();
                          setSelectedCustomer(customerData);
                        }}
                        _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                        transition="all 0.2s"
                      >
                        Mark as Verified
                      </Button>
                    )}
                    <Button
                      colorScheme="purple"
                      size="lg"
                      leftIcon={<DownloadIcon />}
                      onClick={async () => {
                        try {
                          // Create a zip file containing all images
                          const zip = new JSZip();
                          
                          // Add passport photo
                          if (customerData.passport_photo_base64) {
                            zip.file(`${customerData.customer_name}_passport_photo.jpg`, customerData.passport_photo_base64, {base64: true});
                          }
                          
                          // Add Aadhar front
                          if (customerData.aadhar_front_base64) {
                            zip.file(`${customerData.customer_name}_aadhar_front.jpg`, customerData.aadhar_front_base64, {base64: true});
                          }
                          
                          // Add Aadhar back
                          if (customerData.aadhar_back_base64) {
                            zip.file(`${customerData.customer_name}_aadhar_back.jpg`, customerData.aadhar_back_base64, {base64: true});
                          }
                          
                          // Generate and download the zip file
                          const content = await zip.generateAsync({type: "blob"});
                          const link = document.createElement('a');
                          link.href = URL.createObjectURL(content);
                          link.download = `${customerData.customer_name}_documents.zip`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          
                          toast({
                            title: 'Success',
                            description: 'All documents downloaded successfully',
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                          });
                        } catch (error) {
                          console.error('Error downloading documents:', error);
                          toast({
                            title: 'Error',
                            description: 'Failed to download documents',
                            status: 'error',
                            duration: 5000,
                            isClosable: true,
                          });
                        }
                      }}
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                      transition="all 0.2s"
                    >
                      Download All Images
                    </Button>
                  </HStack>
                </Flex>
              </VStack>
            </Box>

            {/* Image Viewer Modal */}
            {selectedImage && (
              <ImageViewer
                src={selectedImage}
                alt="Selected Document"
                onClose={() => setSelectedImage(null)}
              />
            )}
          </Flex>
        ) : (
          // Customer List (Default View)
          <Box>
            <Tabs variant="solid-rounded" colorScheme="blue" index={tabIndex} onChange={setTabIndex} defaultIndex={1}>
              <TabList mb={4} bg={glassBg} p={1} borderRadius="xl" boxShadow="sm" backdropFilter="blur(10px)">
                <Tab _selected={{ bg: accentColor, color: 'white' }}>Verified</Tab>
                <Tab _selected={{ bg: accentColor, color: 'white' }}>Pending</Tab>
              </TabList>

              <Box mb={6}>
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  gap={3}
                  align="center"
                  justify="space-between"
                  bg={glassBg}
                  p={3}
                  borderRadius="xl"
                  boxShadow="sm"
                  backdropFilter="blur(10px)"
                >
                  <InputGroup maxW={{ base: '100%', md: '300px' }}>
                    <InputLeftElement pointerEvents="none">
                      <FaSearch color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search customers..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      size="md"
                      bg={glassInputBg}
                      borderColor={borderColor}
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor }}
                      borderRadius="lg"
                    />
                  </InputGroup>
                  <Select
                    placeholder="All"
                    size="md"
                    w={{ base: '100%', md: '150px' }}
                    bg={glassInputBg}
                    borderColor={borderColor}
                    _hover={{ borderColor: accentColor }}
                    _focus={{ borderColor: accentColor }}
                    borderRadius="lg"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="date">Date (Oldest First)</option>
                    <option value="finance">Finance</option>
                    <option value="cash">Cash</option>
                  </Select>
                </Flex>
              </Box>

              <TabPanels>
                <TabPanel>
                  {loading ? (
                    <Flex justify="center" align="center" h="400px">
                      <Spinner size="xl" color={accentColor} />
                    </Flex>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {filteredCustomers(verifiedCustomers, searchQuery).length === 0 ? (
                        <Box
                          textAlign="center"
                          py={16}
                  bg={cardBg}
                          borderRadius="2xl"
                          boxShadow="xl"
                          position="relative"
                          overflow="hidden"
                        >
                          <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            bgGradient={emptyStateGradient}
                            opacity={0.1}
                          />
                          <VStack spacing={4}>
                            <InfoIcon w={12} h={12} color={accentColor} />
                            <Text fontSize="xl" fontWeight="bold" color={textColor}>
                              No verified customers found
                            </Text>
                            <Text fontSize="md" color="gray.500">
                              Try adjusting your search or filters
                            </Text>
                    </VStack>
                        </Box>
                      ) : (
                        filteredCustomers(verifiedCustomers, searchQuery).map((customer) => (
                          <GridItem key={customer.id}>
                            <CustomerCard
                              customer={customer}
                              isVerified={true}
                              onAction={handleRtoVerified}
                              onSelect={handleCustomerSelect}
                              onDownloadChassis={handleDownloadChassis}
                            />
                          </GridItem>
                        ))
                      )}
                    </SimpleGrid>
                  )}
                </TabPanel>
                <TabPanel>
                  {loading ? (
                    <Flex justify="center" align="center" h="400px">
                      <Spinner size="xl" color={accentColor} />
                    </Flex>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {filteredCustomers(pendingCustomers, searchQuery).length === 0 ? (
                        <Box
                          textAlign="center"
                          py={16}
                          bg={cardBg}
                          borderRadius="2xl"
                          boxShadow="xl"
                          position="relative"
                          overflow="hidden"
                        >
                          <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            bgGradient={emptyStateGradient}
                            opacity={0.1}
                          />
                          <VStack spacing={4}>
                            <InfoIcon w={12} h={12} color={accentColor} />
                            <Text fontSize="xl" fontWeight="bold" color={textColor}>
                              No pending customers found
                            </Text>
                            <Text fontSize="md" color="gray.500">
                              Try adjusting your search or filters
                            </Text>
                    </VStack>
                </Box>
                      ) : (
                        filteredCustomers(pendingCustomers, searchQuery).map((customer) => (
                          <GridItem key={customer.id}>
                            <CustomerCard
                              customer={customer}
                              isVerified={false}
                              onAction={handleMarkUploaded}
                              onSelect={handleCustomerSelect}
                              onDownloadChassis={handleDownloadChassis}
                            />
                          </GridItem>
                        ))
                      )}
                    </SimpleGrid>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        )}
      </Box>

      {/* Sidebar Drawer */}
      <Drawer isOpen={isMenuOpen} placement="left" onClose={onMenuClose}>
        <DrawerOverlay />
        <DrawerContent w={{ base: 'full', md: '250px' }} bg={cardBg} borderColor={borderColor}>
          <DrawerCloseButton color={textColor} />
          <DrawerHeader color={textColor} borderBottom="1px" borderColor={borderColor}>Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={4}>
              <Button
                variant="ghost"
                colorScheme="blue"
                isActive
                justifyContent="start"
                _hover={{ bg: hoverBg }}
              >
                RTO Dashboard
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>  
      </Drawer> 

      {/* RTO Verified Modal */}
      <Modal isOpen={isRtoVerifiedOpen} onClose={onRtoVerifiedClose}>
        <ModalOverlay />
        <ModalContent bg={cardBg} borderRadius="xl" boxShadow="lg">
          <ModalHeader color={textColor}>RTO Verified</ModalHeader>
          <ModalCloseButton color={textColor} />
          <ModalBody>
            <VStack spacing={4}>
              <Text color={textColor}>Enter Vehicle Registration Number</Text>
              <Input
                placeholder="e.g., MH12AB1234"
                value={registrationNumber}
                onChange={e => setRegistrationNumber(e.target.value)}
                bg={inputBg}
                borderColor={borderColor}
                _hover={{ borderColor: accentColor }}
                _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => handleRtoVerified(selectedCustomer.id)}
              _hover={{ bg: 'blue.600' }}
            >
              Mark Verified
            </Button>
            <Button
              variant="ghost"
              ml={2}
              onClick={onRtoVerifiedClose}
              color={textColor}
              _hover={{ bg: hoverBg }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Image Preview Modal */}
      <Modal isOpen={isImageModalOpen} onClose={onImageModalClose} size="xl">
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
        <ModalContent
          w="60%"
          maxW="60%"
          h="auto"
          bg={cardBg}
          borderRadius="2xl"
          boxShadow="2xl"
          overflow="hidden"
        >
          <ModalCloseButton color={textColor} zIndex={10} />
          <ModalBody p={0}>
            <Image
              src={selectedImage}
              alt="Selected Image"
              objectFit="contain"
              w="100%"
              h="auto"
              borderRadius="2xl"
              fallbackSrc="https://via.placeholder.com/300?text=Image+Not+Available"
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={2000} style={{ zIndex: 1500 }} />
    </Box>
  );
};

export default RtoDashboard;