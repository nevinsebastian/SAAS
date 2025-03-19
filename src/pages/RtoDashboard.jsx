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
} from '@chakra-ui/react';
import { HamburgerIcon, BellIcon, ArrowBackIcon, DownloadIcon, SearchIcon, FilterIcon, CheckIcon, TimeIcon } from '@chakra-ui/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf'; // Add jsPDF for PDF generation
import { rtoApi } from '../api';
import { motion } from 'framer-motion';

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
  const headerGradient = useColorModeValue('linear(to-r, blue.500, blue.700)', 'linear(to-r, blue.700, blue.900)'); // Reverted to blue
  const accentColor = 'blue.500';
  const hoverBg = useColorModeValue('blue.50', 'blue.900');

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

      // Fetch all customers
      const response = await rtoApi.getPendingCustomers();
      console.log('All customers:', response.customers);

      // Filter customers based on rto_verified status
      const verifiedCustomers = response.customers.filter(customer => customer.rto_verified === true);
      const pendingCustomers = response.customers.filter(customer => customer.rto_verified === false);

      console.log('Pending customers:', pendingCustomers);
      console.log('Verified customers:', verifiedCustomers);

      setPendingCustomers(pendingCustomers);
      setVerifiedCustomers(verifiedCustomers);
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

  const handleCustomerSelect = async (customer) => {
    setSelectedCustomer(customer);
    setCustomerData(customer);
    onMenuOpen();
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

  const handleDownloadUserData = () => {
    const folderName = `${customerData.name.split(' ')[0]}_${customerData.vehicle.replace(' ', '_')}`;
    const files = [
      { url: customerData.photo, name: 'passport_photo.jpg' },
      { url: customerData.aadharFront, name: 'aadhar_front.jpg' },
      { url: customerData.aadharBack, name: 'aadhar_back.jpg' },
      { url: customerData.signature, name: 'signature.jpg' },
      { url: customerData.invoicePdf, name: 'invoice.pdf' },
    ];

    // Download individual files
    files.forEach(file => {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = `${folderName}_${file.name}`;
      link.click();
    });

    // Generate and download full data PDF
    const doc = new jsPDF();
    let yOffset = 10;

    // Title
    doc.setFontSize(16);
    doc.text('Customer Data Report', 10, yOffset);
    yOffset += 10;

    // Personal Information
    doc.setFontSize(12);
    doc.text('Personal Information', 10, yOffset);
    yOffset += 7;
    doc.setFontSize(10);
    doc.text(`Full Name: ${customerData.fullName}`, 10, yOffset); yOffset += 5;
    doc.text(`Address: ${customerData.address}`, 10, yOffset); yOffset += 5;
    doc.text(`Father's Name: ${customerData.fathersName}`, 10, yOffset); yOffset += 5;
    doc.text(`PAN Number: ${customerData.panNumber}`, 10, yOffset); yOffset += 5;
    doc.text(`Aadhar Number: ${customerData.aadharNumber}`, 10, yOffset); yOffset += 5;
    doc.text(`Ward: ${customerData.ward}`, 10, yOffset); yOffset += 5;
    doc.text(`RTO Office: ${customerData.rtoOffice}`, 10, yOffset); yOffset += 10;

    // Nominee Details
    doc.setFontSize(12);
    doc.text('Nominee Details', 10, yOffset);
    yOffset += 7;
    doc.setFontSize(10);
    doc.text(`Nominee Name: ${customerData.nomineeName}`, 10, yOffset); yOffset += 5;
    doc.text(`Nominee Age: ${customerData.nomineeAge}`, 10, yOffset); yOffset += 5;
    doc.text(`Relation: ${customerData.nomineeRelation}`, 10, yOffset); yOffset += 10;

    // Vehicle Details
    doc.setFontSize(12);
    doc.text('Vehicle Details', 10, yOffset);
    yOffset += 7;
    doc.setFontSize(10);
    doc.text(`Vehicle: ${customerData.vehicle}`, 10, yOffset); yOffset += 5;
    doc.text(`Variant: ${customerData.variant}`, 10, yOffset); yOffset += 5;
    doc.text(`Color: ${customerData.color}`, 10, yOffset); yOffset += 10;

    // Pricing
    doc.setFontSize(12);
    doc.text('Pricing', 10, yOffset);
    yOffset += 7;
    doc.setFontSize(10);
    doc.text(`Ex-Showroom: ${customerData.exShowroom}`, 10, yOffset); yOffset += 5;
    doc.text(`Tax: ${customerData.tax}`, 10, yOffset); yOffset += 5;
    doc.text(`On-Road: ${customerData.onRoad}`, 10, yOffset); yOffset += 5;
    doc.text(`Insurance: ${customerData.insurance}`, 10, yOffset); yOffset += 5;
    doc.text(`Booking Charge: ${customerData.bookingCharge}`, 10, yOffset); yOffset += 5;
    doc.text(`Delivery Charge: ${customerData.deliveryCharge}`, 10, yOffset); yOffset += 10;

    // Placeholder for images (actual image embedding requires fetching and converting to base64)
    doc.setFontSize(12);
    doc.text('Images (See Downloaded Files)', 10, yOffset);
    yOffset += 7;
    doc.setFontSize(10);
    doc.text('Passport Photo: Included as separate file', 10, yOffset); yOffset += 5;
    doc.text('Aadhar Front: Included as separate file', 10, yOffset); yOffset += 5;
    doc.text('Aadhar Back: Included as separate file', 10, yOffset); yOffset += 5;
    doc.text('Signature: Included as separate file', 10, yOffset); yOffset += 5;
    doc.text('Invoice: Included as separate file', 10, yOffset);

    // Save PDF
    doc.save(`${folderName}_full_data.pdf`);
    toast({
      title: 'Success',
      description: `Downloaded user data as "${folderName}" folder!`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const CustomerCard = ({ customer, onAction, isVerified }) => {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const hoverBg = useColorModeValue('blue.50', 'blue.900');
    const textColor = useColorModeValue('gray.800', 'white');

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <Box
          bg={cardBg}
          p={6}
          borderRadius="xl"
          boxShadow="lg"
          border="1px"
          borderColor={borderColor}
          _hover={{ boxShadow: 'xl', borderColor: 'blue.500' }}
          transition="all 0.2s"
        >
          <Flex justify="space-between" align="start" mb={4}>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" fontSize="xl" color={textColor}>
                {customer.customer_name}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {customer.vehicle} - {customer.variant}
              </Text>
            </VStack>
            <Badge
              colorScheme={isVerified ? 'green' : 'yellow'}
              px={3}
              py={1}
              borderRadius="full"
              fontSize="sm"
            >
              {isVerified ? 'Verified' : 'Pending'}
            </Badge>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
            <Box>
              <Text fontSize="sm" color="gray.500">Phone</Text>
              <Text fontSize="md">{customer.phone_number}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Registration No.</Text>
              <Text fontSize="md">{customer.registration_number || 'Not Assigned'}</Text>
            </Box>
          </SimpleGrid>

          <Divider my={4} />

          <Flex justify="space-between" align="center">
            <HStack spacing={2}>
              {customer.chassis_image && (
                <Button
                  colorScheme="purple"
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadChassis(customer.id)}
                >
                  Chassis
                </Button>
              )}
              {!isVerified && (
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => onAction(customer.id)}
                >
                  Mark Verified
                </Button>
              )}
            </HStack>
            <Text fontSize="sm" color="gray.500">
              {new Date(customer.created_at).toLocaleDateString()}
            </Text>
          </Flex>
        </Box>
      </motion.div>
    );
  };

  return (
    <Box minH="100vh" bg={bgGradient} position="relative">
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        bgGradient={headerGradient}
        color="white"
        p={4}
        boxShadow="lg"
        position="sticky"
        top={0}
        zIndex={10}
        borderBottom="1px solid"
        borderColor={borderColor}
      >
        <HStack spacing={4}>
          <IconButton
            icon={<HamburgerIcon />}
            variant="ghost"
            color="white"
            onClick={onMenuOpen}
            aria-label="Open menu"
            _hover={{ bg: hoverBg }}
          />
          <Heading size="md" fontWeight="bold">RTO Dashboard</Heading>
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
              _hover={{ bg: hoverBg }}
            >
              {unseenNotifications.length > 0 && (
                <Badge colorScheme="red" borderRadius="full" position="absolute" top="-1" right="-1">{unseenNotifications.length}</Badge>
              )}
            </MenuButton>
            <MenuList maxH="300px" overflowY="auto" bg={cardBg} borderColor={borderColor}>
              {unseenNotifications.length > 0 ? (
                unseenNotifications.map(n => (
                  <MenuItem key={n.id} bg={cardBg} _hover={{ bg: hoverBg }}>
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
              <Avatar name={user.username} size="sm" />
            </MenuButton>
            <MenuList bg={cardBg} borderColor={borderColor}>
              <MenuItem onClick={toggleColorMode} bg={cardBg} _hover={{ bg: hoverBg }}>
                {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
              </MenuItem>
              <MenuItem onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }} bg={cardBg} _hover={{ bg: hoverBg }}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Main Layout */}
      <Box maxW="1400px" mx="auto" mt={6} px={{ base: 4, md: 6 }} pb={{ base: 16, md: 8 }}>
        {selectedCustomer ? (
          // Full-Screen Customer Details
          <Flex direction="column" h={{ base: 'calc(100vh - 70px)', md: 'auto' }} position={{ base: 'fixed', md: 'static' }} top={{ base: '70px', md: 'auto' }} left={0} right={0} bottom={0} bg={cardBg} zIndex={9}>
            {/* Fixed Header */}
            <Flex
              justify="space-between"
              align="center"
              bg={cardBg}
              p={4}
              borderRadius={{ base: 0, md: 'lg' }}
              boxShadow="md"
              position="sticky"
              top={0}
              zIndex={10}
              borderBottom="1px"
              borderColor={borderColor}
            >
              <HStack spacing={4}>
                <IconButton
                  icon={<ArrowBackIcon />}
                  variant="ghost"
                  color={textColor}
                  onClick={() => setSelectedCustomer(null)}
                  aria-label="Back to list"
                  _hover={{ bg: hoverBg }}
                />
                <Heading size="md" color={textColor}>{customerData.name} - {customerData.id}</Heading>
              </HStack>
              <Button
                leftIcon={<DownloadIcon />}
                colorScheme="blue"
                variant="solid"
                size="sm"
                onClick={handleDownloadUserData}
                _hover={{ bg: 'blue.600' }}
              >
                Download User Data
              </Button>
            </Flex>

            {/* Scrollable Details */}
            <Flex direction="column" flex="1" overflowY="auto" p={6} pb={200}>
              <VStack spacing={8} align="stretch">
                {/* Personal Information */}
                <Box bg={cardBg} borderRadius="2xl" p={6} boxShadow="lg" _hover={{ boxShadow: 'xl' }} transition="all 0.2s">
                  <Text fontWeight="bold" fontSize="lg" mb={4} color={textColor}>Personal Information</Text>
                  <HStack spacing={6} align="start" wrap="wrap">
                    <Box flex="1" minW={{ base: '100%', md: '300px' }}>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Full Name</Text>
                          <Text fontSize="md" color={textColor}>{customerData.fullName}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Address</Text>
                          <Text fontSize="md" color={textColor}>{customerData.address}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Father's Name</Text>
                          <Text fontSize="md" color={textColor}>{customerData.fathersName}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">PAN Number</Text>
                          <Text fontSize="md" color={textColor}>{customerData.panNumber}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Aadhar Number</Text>
                          <Text fontSize="md" color={textColor}>{customerData.aadharNumber}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Ward</Text>
                          <Text fontSize="md" color={textColor}>{customerData.ward}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">RTO Office</Text>
                          <Text fontSize="md" color={textColor}>{customerData.rtoOffice}</Text>
                        </Box>
                      </SimpleGrid>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={2}>Passport Photo</Text>
                      <Image
                        src={customerData.photo}
                        alt="Customer Photo"
                        objectFit="cover"
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() => handleImageClick(customerData.photo)}
                        fallbackSrc="https://via.placeholder.com/150?text=No+Photo"
                        _hover={{ opacity: 0.8 }}
                      />
                    </Box>
                  </HStack>
                  <Divider my={4} borderColor={borderColor} />
                  <HStack spacing={6} wrap="wrap" justify="space-between">
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={2}>Aadhar Front</Text>
                      <Image
                        src={customerData.aadharFront}
                        alt="Aadhar Front"
                        objectFit="cover"
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() => handleImageClick(customerData.aadharFront)}
                        fallbackSrc="https://via.placeholder.com/200x150?text=No+Aadhar+Front"
                        _hover={{ opacity: 0.8 }}
                      />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={2}>Aadhar Back</Text>
                      <Image
                        src={customerData.aadharBack}
                        alt="Aadhar Back"
                        objectFit="cover"
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() => handleImageClick(customerData.aadharBack)}
                        fallbackSrc="https://via.placeholder.com/200x150?text=No+Aadhar+Back"
                        _hover={{ opacity: 0.8 }}
                      />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={2}>Signature</Text>
                      <Image
                        src={customerData.signature}
                        alt="Signature"
                        objectFit="cover"
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() => handleImageClick(customerData.signature)}
                        fallbackSrc="https://via.placeholder.com/150x50?text=No+Signature"
                        _hover={{ opacity: 0.8 }}
                      />
                    </Box>
                  </HStack>
                </Box>

                {/* Nominee Details */}
                <Box bg={cardBg} borderRadius="2xl" p={6} boxShadow="lg" _hover={{ boxShadow: 'xl' }} transition="all 0.2s">
                  <Text fontWeight="bold" fontSize="lg" mb={4} color={textColor}>Nominee Details</Text>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Nominee Name</Text>
                      <Text fontSize="md" color={textColor}>{customerData.nomineeName}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Nominee Age</Text>
                      <Text fontSize="md" color={textColor}>{customerData.nomineeAge}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Relation with Nominee</Text>
                      <Text fontSize="md" color={textColor}>{customerData.nomineeRelation}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>

                {/* Invoice */}
                <Box bg={cardBg} borderRadius="2xl" p={6} boxShadow="lg" _hover={{ boxShadow: 'xl' }} transition="all 0.2s">
                  <Text fontWeight="bold" fontSize="lg" mb={4} color={textColor}>Invoice</Text>
                  <iframe
                    src={customerData.invoicePdf}
                    title="Invoice PDF"
                    style={{ width: '100%', height: '400px', border: 'none', borderRadius: '8px' }}
                  />
                </Box>

                {/* Vehicle Details */}
                <Box bg={cardBg} borderRadius="2xl" p={6} boxShadow="lg" _hover={{ boxShadow: 'xl' }} transition="all 0.2s">
                  <Text fontWeight="bold" fontSize="lg" mb={4} color={textColor}>Vehicle Details</Text>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
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
                  </SimpleGrid>
                </Box>

                {/* Pricing */}
                <Box bg={cardBg} borderRadius="2xl" p={6} boxShadow="lg" _hover={{ boxShadow: 'xl' }} transition="all 0.2s">
                  <Text fontWeight="bold" fontSize="lg" mb={4} color={textColor}>Pricing</Text>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Ex-Showroom</Text>
                      <Text fontSize="md" color={textColor}>{customerData.exShowroom}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Tax</Text>
                      <Text fontSize="md" color={textColor}>{customerData.tax}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">On-Road</Text>
                      <Text fontSize="md" color={textColor}>{customerData.onRoad}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Insurance</Text>
                      <Text fontSize="md" color={textColor}>{customerData.insurance}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Booking Charge</Text>
                      <Text fontSize="md" color={textColor}>{customerData.bookingCharge}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Delivery Charge</Text>
                      <Text fontSize="md" color={textColor}>{customerData.deliveryCharge}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>

                {/* Chassis Search */}
                <Box bg={cardBg} borderRadius="2xl" p={6} boxShadow="lg" _hover={{ boxShadow: 'xl' }} transition="all 0.2s">
                  <Text fontWeight="bold" fontSize="lg" mb={4} color={textColor}>Chassis Search</Text>
                  <HStack spacing={4}>
                    <Input
                      placeholder="Enter chassis number"
                      value={chassisNumber}
                      onChange={e => setChassisNumber(e.target.value)}
                      bg={inputBg}
                      borderColor={borderColor}
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                    />
                    <Button
                      colorScheme="blue"
                      onClick={handleChassisSearch}
                      _hover={{ bg: 'blue.600' }}
                    >
                      Search
                    </Button>
                  </HStack>
                  {chassisImage && (
                    <VStack mt={4} spacing={2} align="start">
                      <Image
                        src={chassisImage}
                        alt="Chassis Image"
                        objectFit="contain"
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() => handleImageClick(chassisImage)}
                        _hover={{ opacity: 0.8 }}
                      />
                      <Button
                        leftIcon={<DownloadIcon />}
                        colorScheme="blue"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadChassis(selectedCustomer.id)}
                        _hover={{ bg: hoverBg }}
                      >
                        Download
                      </Button>
                    </VStack>
                  )}
                </Box>
              </VStack>

              {/* Action Buttons */}
              <HStack mt={8} spacing={6} justify="center">
                {selectedCustomer.status === 'Pending' && (
                  <Button
                    colorScheme="purple"
                    size="lg"
                    w="full"
                    maxW="200px"
                    onClick={() => handleMarkUploaded(selectedCustomer.id)}
                    _hover={{ bg: 'purple.600' }}
                  >
                    Mark Uploaded to RTO
                  </Button>
                )}
                {(selectedCustomer.status === 'Uploaded' || selectedCustomer.status === 'Pending') && (
                  <Button
                    colorScheme="blue"
                    size="lg"
                    w="full"
                    maxW="200px"
                    onClick={() => handleRtoVerified(selectedCustomer.id)}
                    _hover={{ bg: 'blue.600' }}
                  >
                    RTO Verified
                  </Button>
                )}
                {selectedCustomer.status === 'Done' && (
                  <Badge colorScheme="blue" p={3} borderRadius="md" fontSize="md">Uploaded to RTO</Badge>
                )}
              </HStack>
            </Flex>
          </Flex>
        ) : (
          // Customer List (Default View)
          <Box>
            <Tabs variant="solid-rounded" colorScheme="blue" index={tabIndex} onChange={setTabIndex} defaultIndex={1}>
              <TabList mb={6} bg={cardBg} p={2} borderRadius="xl" boxShadow="md">
                <Tab _selected={{ bg: accentColor, color: 'white' }}>Verified</Tab>
                <Tab _selected={{ bg: accentColor, color: 'white' }}>Pending</Tab>
              </TabList>

              <Box mb={6}>
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  gap={4}
                  align="center"
                  justify="space-between"
                >
                  <Input
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    size="lg"
                    bg={inputBg}
                    borderColor={borderColor}
                    _hover={{ borderColor: accentColor }}
                    _focus={{ borderColor: accentColor }}
                    maxW={{ base: '100%', md: '400px' }}
                  />
                  <Select
                    placeholder="Sort by"
                    size="lg"
                    w={{ base: '100%', md: '200px' }}
                    bg={inputBg}
                    borderColor={borderColor}
                    _hover={{ borderColor: accentColor }}
                    _focus={{ borderColor: accentColor }}
                  >
                    <option value="date">Date</option>
                    <option value="name">Name</option>
                    <option value="vehicle">Vehicle</option>
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
                      {verifiedCustomers.length === 0 ? (
                        <GridItem colSpan={{ base: 1, md: 2, lg: 3 }}>
                          <Box
                            textAlign="center"
                            py={10}
                            bg={cardBg}
                            borderRadius="xl"
                            boxShadow="md"
                          >
                            <Text fontSize="lg" color="gray.500">
                              No verified customers found
                            </Text>
                          </Box>
                        </GridItem>
                      ) : (
                        verifiedCustomers.map((customer) => (
                          <GridItem key={customer.id}>
                            <CustomerCard
                              customer={customer}
                              isVerified={true}
                              onAction={handleRtoVerified}
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
                      {pendingCustomers.length === 0 ? (
                        <GridItem colSpan={{ base: 1, md: 2, lg: 3 }}>
                          <Box
                            textAlign="center"
                            py={10}
                            bg={cardBg}
                            borderRadius="xl"
                            boxShadow="md"
                          >
                            <Text fontSize="lg" color="gray.500">
                              No pending customers found
                            </Text>
                          </Box>
                        </GridItem>
                      ) : (
                        pendingCustomers.map((customer) => (
                          <GridItem key={customer.id}>
                            <CustomerCard
                              customer={customer}
                              isVerified={false}
                              onAction={handleMarkUploaded}
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