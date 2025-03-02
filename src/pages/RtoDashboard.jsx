import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { HamburgerIcon, BellIcon, ArrowBackIcon, DownloadIcon } from '@chakra-ui/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RtoDashboard = () => {
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isRtoVerifiedOpen, onOpen: onRtoVerifiedOpen, onClose: onRtoVerifiedClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  // Move all useColorModeValue calls to the top level
  const bgGradient = useColorModeValue('linear(to-br, gray.50, gray.100)', 'linear(to-br, gray.900, gray.800)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const headerGradient = useColorModeValue('linear(to-r, blue.500, blue.700)', 'linear(to-r, blue.700, blue.900)');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [tabIndex, setTabIndex] = useState(0); // Done, Pending, Uploaded tabs
  const [chassisNumber, setChassisNumber] = useState('');
  const [chassisImage, setChassisImage] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [customerData, setCustomerData] = useState({
    fullName: '', address: '', fathersName: '', panNumber: '', aadharNumber: '', photo: '',
    aadharFront: '', aadharBack: '', signature: '', nomineeName: '', nomineeAge: '', nomineeRelation: '',
    ward: '', rtoOffice: '', invoicePdf: '', name: '', vehicle: '', variant: '', color: '',
    exShowroom: '', tax: '', onRoad: '', insurance: '', bookingCharge: '', deliveryCharge: '',
  });

  const user = JSON.parse(localStorage.getItem('user')) || { username: 'rto_user' };

  // Dummy customer data
  const customers = [
    {
      id: 'RTO001', name: 'John Doe', status: 'Pending', registrationNumber: '',
      fullName: 'John Michael Doe', address: '123 Main St, Springfield', fathersName: 'Robert Doe',
      panNumber: 'ABCDE1234F', aadharNumber: '1234-5678-9012', photo: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLXG6-abcFOb8OfkXL12NRC0r_poydMnr9-Vte6KrDY1FzDPfx0I_Nf5zhVOBNZ9MqsGz-v_4SiiMpKLCBsWxaI5yZL0KbrXfNMvqarDHGZQQoVlz40RQ52DpjHPOQwHo2RVRQdTZuPfI/s1600/Sachin.jpg',
      aadharFront: 'https://akm-img-a-in.tosshub.com/businesstoday/images/story/202205/screenshot_2022-05-29_at_10-sixteen_nine.png?size=1200:675',
      aadharBack: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL8JFf8Xm0tpcQih9Ys0GHfinVjnbc8g2n7w&s',
      signature: 'https://www.morebusiness.com/wp-content/uploads/2020/09/handwritten-email-signature.jpg',
      nomineeName: 'Mary Doe', nomineeAge: '35', nomineeRelation: 'Wife',
      ward: 'Ward 5', rtoOffice: 'Springfield RTO', invoicePdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      vehicle: 'Toyota Corolla', variant: 'LE', color: 'Black',
      exShowroom: '50000', tax: '5000', onRoad: '55000', insurance: '2000', bookingCharge: '1000', deliveryCharge: '1500',
    },
    {
      id: 'RTO002', name: 'Jane Smith', status: 'Uploaded', registrationNumber: 'MH12AB1234',
      fullName: 'Jane Elizabeth Smith', address: '456 Oak Ave, Rivertown', fathersName: 'James Smith',
      panNumber: 'FGHIJ5678K', aadharNumber: '9876-5432-1098', photo: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLXG6-abcFOb8OfkXL12NRC0r_poydMnr9-Vte6KrDY1FzDPfx0I_Nf5zhVOBNZ9MqsGz-v_4SiiMpKLCBsWxaI5yZL0KbrXfNMvqarDHGZQQoVlz40RQ52DpjHPOQwHo2RVRQdTZuPfI/s1600/Sachin.jpg',
      aadharFront: 'https://akm-img-a-in.tosshub.com/businesstoday/images/story/202205/screenshot_2022-05-29_at_10-sixteen_nine.png?size=1200:675',
      aadharBack: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL8JFf8Xm0tpcQih9Ys0GHfinVjnbc8g2n7w&s',
      signature: 'https://www.morebusiness.com/wp-content/uploads/2020/09/handwritten-email-signature.jpg',
      nomineeName: 'Tom Smith', nomineeAge: '40', nomineeRelation: 'Brother',
      ward: 'Ward 3', rtoOffice: 'Rivertown RTO', invoicePdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      vehicle: 'Honda City', variant: 'VX', color: 'Silver',
      exShowroom: '60000', tax: '6000', onRoad: '66000', insurance: '2500', bookingCharge: '1200', deliveryCharge: '1800',
    },
    {
      id: 'RTO003', name: 'Mike Johnson', status: 'Done', registrationNumber: 'DL01XY5678',
      fullName: 'Michael David Johnson', address: '789 Pine Rd, Hillcity', fathersName: 'David Johnson',
      panNumber: 'KLMNO9012P', aadharNumber: '4567-8901-2345', photo: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLXG6-abcFOb8OfkXL12NRC0r_poydMnr9-Vte6KrDY1FzDPfx0I_Nf5zhVOBNZ9MqsGz-v_4SiiMpKLCBsWxaI5yZL0KbrXfNMvqarDHGZQQoVlz40RQ52DpjHPOQwHo2RVRQdTZuPfI/s1600/Sachin.jpg',
      aadharFront: 'https://akm-img-a-in.tosshub.com/businesstoday/images/story/202205/screenshot_2022-05-29_at_10-sixteen_nine.png?size=1200:675',
      aadharBack: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL8JFf8Xm0tpcQih9Ys0GHfinVjnbc8g2n7w&s',
      signature: 'https://www.morebusiness.com/wp-content/uploads/2020/09/handwritten-email-signature.jpg',
      nomineeName: 'Lisa Johnson', nomineeAge: '28', nomineeRelation: 'Daughter',
      ward: 'Ward 7', rtoOffice: 'Hillcity RTO', invoicePdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      vehicle: 'Hyundai Creta', variant: 'SX', color: 'White',
      exShowroom: '70000', tax: '7000', onRoad: '77000', insurance: '3000', bookingCharge: '1500', deliveryCharge: '2000',
    },
  ];

  const filteredCustomers = customers.filter(c =>
    (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     (c.registrationNumber && c.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    (tabIndex === 0 ? c.status === 'Done' : tabIndex === 1 ? c.status === 'Pending' : c.status === 'Uploaded')
  );

  const notifications = [
    { id: 1, message: 'New booking added: John Doe', time: '2025-03-01 10:00 AM', seen: false },
    { id: 2, message: 'RTO upload completed for Jane Smith', time: '2025-03-02 09:00 AM', seen: false },
  ];

  const unseenNotifications = notifications.filter(n => !n.seen);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setCustomerData({
      fullName: customer.fullName,
      address: customer.address,
      fathersName: customer.fathersName,
      panNumber: customer.panNumber,
      aadharNumber: customer.aadharNumber,
      photo: customer.photo,
      aadharFront: customer.aadharFront,
      aadharBack: customer.aadharBack,
      signature: customer.signature,
      nomineeName: customer.nomineeName,
      nomineeAge: customer.nomineeAge,
      nomineeRelation: customer.nomineeRelation,
      ward: customer.ward,
      rtoOffice: customer.rtoOffice,
      invoicePdf: customer.invoicePdf,
      name: customer.name,
      vehicle: customer.vehicle,
      variant: customer.variant,
      color: customer.color,
      exShowroom: customer.exShowroom,
      tax: customer.tax,
      onRoad: customer.onRoad,
      insurance: customer.insurance,
      bookingCharge: customer.bookingCharge,
      deliveryCharge: customer.deliveryCharge,
    });
    setChassisNumber('');
    setChassisImage(null);
    setRegistrationNumber(customer.registrationNumber || '');
  };

  const handleChassisSearch = () => {
    if (chassisNumber) {
      setChassisImage(`https://johnhenrymccarthy.wordpress.com/wp-content/uploads/2015/05/wall-rubbing-resized.jpg`);
      toast.success('Chassis image loaded!', { position: 'top-center' });
    } else {
      toast.error('Please enter a chassis number!', { position: 'top-center' });
    }
  };

  const handleDownloadChassis = () => {
    if (chassisImage) {
      const link = document.createElement('a');
      link.href = chassisImage;
      link.download = `chassis_${chassisNumber}.png`;
      link.click();
      toast.success('Chassis image downloaded!', { position: 'top-center' });
    }
  };

  const handleMarkUploaded = () => {
    setCustomerData(prev => ({ ...prev, status: 'Uploaded' }));
    setSelectedCustomer(prev => ({ ...prev, status: 'Uploaded' }));
    toast.success('Marked as uploaded to RTO!', { position: 'top-center' });
  };

  const handleRtoVerified = () => {
    if (registrationNumber) {
      setCustomerData(prev => ({ ...prev, status: 'Done', registrationNumber }));
      setSelectedCustomer(prev => ({ ...prev, status: 'Done', registrationNumber }));
      onRtoVerifiedClose();
      toast.success(`RTO Verified with Reg. No: ${registrationNumber}`, { position: 'top-center' });
    } else {
      toast.error('Please enter a registration number!', { position: 'top-center' });
    }
  };

  return (
    <Box minH="100vh" bg={bgGradient} position="relative">
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        bgGradient={headerGradient}
        color="white"
        borderRadius={{ base: 0, md: 'lg' }}
        p={3}
        boxShadow="lg"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <HStack spacing={3}>
          <IconButton icon={<HamburgerIcon />} variant="ghost" color="white" onClick={onMenuOpen} aria-label="Open menu" />
          <Heading size="md">RTO Dashboard</Heading>
        </HStack>
        <HStack spacing={4}>
          <Menu>
            <MenuButton as={IconButton} icon={<BellIcon />} variant="ghost" color="white" aria-label="Notifications" position="relative">
              {unseenNotifications.length > 0 && (
                <Badge colorScheme="red" borderRadius="full" position="absolute" top="-1" right="-1">{unseenNotifications.length}</Badge>
              )}
            </MenuButton>
            <MenuList maxH="300px" overflowY="auto">
              {unseenNotifications.length > 0 ? (
                unseenNotifications.map(n => (
                  <MenuItem key={n.id}>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" color={textColor}>{n.message}</Text>
                      <Text fontSize="xs" color="gray.500">{n.time}</Text>
                    </VStack>
                  </MenuItem>
                ))
              ) : (
                <MenuItem>No new notifications</MenuItem>
              )}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton>
              <Avatar name={user.username} size="sm" />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={toggleColorMode}>{colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}</MenuItem>
              <MenuItem onClick={() => toast.info('Sign out not implemented')}>Sign Out</MenuItem>
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
              p={3}
              borderRadius={{ base: 0, md: 'lg' }}
              boxShadow="md"
              position="sticky"
              top={0}
              zIndex={10}
              borderBottom="1px"
              borderColor={borderColor}
            >
              <HStack spacing={2}>
                <IconButton
                  icon={<ArrowBackIcon />}
                  variant="ghost"
                  onClick={() => setSelectedCustomer(null)}
                  aria-label="Back to list"
                />
                <Heading size="md" color={textColor}>{customerData.name} - {customerData.id}</Heading>
              </HStack>
            </Flex>

            {/* Scrollable Details */}
            <Flex direction="column" flex="1" overflowY="auto" p={6} pb={20}>
              <VStack spacing={6} align="stretch">
                {/* Personal Information */}
                <Box bg={cardBg} borderRadius="xl" p={4} boxShadow="md">
                  <Text fontWeight="bold" mb={4} color={textColor}>Personal Information</Text>
                  <HStack spacing={6} align="start">
                    <Box flex="1">
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Full Name</Text>
                          <Text color={textColor}>{customerData.fullName}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Address</Text>
                          <Text color={textColor}>{customerData.address}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Father's Name</Text>
                          <Text color={textColor}>{customerData.fathersName}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">PAN Number</Text>
                          <Text color={textColor}>{customerData.panNumber}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Aadhar Number</Text>
                          <Text color={textColor}>{customerData.aadharNumber}</Text>
                        </Box>
                        <Box>
                      <Text fontSize="sm" color="gray.500">Ward</Text>
                      <Text color={textColor}>{customerData.ward}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">RTO Office</Text>
                      <Text color={textColor}>{customerData.rtoOffice}</Text>
                    </Box>
                      </SimpleGrid>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={2}>Passport Photo</Text>
                      <Image
                        src={customerData.photo}
                        alt="Customer Photo"
                        boxSize={{ base: '100px', md: '120px' }}
                        objectFit="cover"
                        borderRadius="md"
                        fallbackSrc="https://via.placeholder.com/100?text=No+Photo"
                      />
                    </Box>
                  </HStack>
                  <HStack mt={4} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={2}>Aadhar Front</Text>
                      <Image
                        src={customerData.aadharFront}
                        alt="Aadhar Front"
                        boxSize={{ base: '150px', md: '200px' }}
                        objectFit="cover"
                        borderRadius="md"
                        fallbackSrc="https://via.placeholder.com/200x150?text=No+Aadhar+Front"
                      />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={2}>Aadhar Back</Text>
                      <Image
                        src={customerData.aadharBack}
                        alt="Aadhar Back"
                        boxSize={{ base: '150px', md: '200px' }}
                        objectFit="cover"
                        borderRadius="md"
                        fallbackSrc="https://via.placeholder.com/200x150?text=No+Aadhar+Back"
                      />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={2}>Signature</Text>
                      <Image
                        src={customerData.signature}
                        alt="Signature"
                        boxSize={{ base: '100px', md: '150x50' }}
                        objectFit="cover"
                        borderRadius="md"
                        fallbackSrc="https://via.placeholder.com/150x50?text=No+Signature"
                      />
                    </Box>
                  </HStack>
                </Box>

                {/* Nominee & RTO Info */}
                <Box bg={cardBg} borderRadius="xl" p={4} boxShadow="md">
                  <Text fontWeight="bold" mb={4} color={textColor}>Nominee  Details</Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Nominee Name</Text>
                      <Text color={textColor}>{customerData.nomineeName}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Nominee Age</Text>
                      <Text color={textColor}>{customerData.nomineeAge}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Relation with Nominee</Text>
                      <Text color={textColor}>{customerData.nomineeRelation}</Text>
                    </Box>
                  
                  </SimpleGrid>
                </Box>

                {/* Invoice */}
                <Box bg={cardBg} borderRadius="xl" p={4} boxShadow="md">
                  <Text fontWeight="bold" mb={4} color={textColor}>Invoice</Text>
                  <Image
                    src={customerData.invoicePdf}
                    alt="Invoice PDF"
                    maxW={{ base: '100%', md: '300px' }}
                    objectFit="contain"
                    borderRadius="md"
                    fallbackSrc="https://via.placeholder.com/300x400?text=No+Invoice"
                  />
                </Box>

                {/* Vehicle Details */}
                <Box bg={cardBg} borderRadius="xl" p={4} boxShadow="md">
                  <Text fontWeight="bold" mb={4} color={textColor}>Vehicle Details</Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Vehicle</Text>
                      <Text color={textColor}>{customerData.vehicle}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Variant</Text>
                      <Text color={textColor}>{customerData.variant}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Color</Text>
                      <Text color={textColor}>{customerData.color}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>

                {/* Pricing */}
                <Box bg={cardBg} borderRadius="xl" p={4} boxShadow="md">
                  <Text fontWeight="bold" mb={4} color={textColor}>Pricing</Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Ex-Showroom</Text>
                      <Text color={textColor}>{customerData.exShowroom}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Tax</Text>
                      <Text color={textColor}>{customerData.tax}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">On-Road</Text>
                      <Text color={textColor}>{customerData.onRoad}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Insurance</Text>
                      <Text color={textColor}>{customerData.insurance}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Booking Charge</Text>
                      <Text color={textColor}>{customerData.bookingCharge}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Delivery Charge</Text>
                      <Text color={textColor}>{customerData.deliveryCharge}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>

                {/* Chassis Search */}
                <Box bg={cardBg} borderRadius="xl" p={4} boxShadow="md">
                  <Text fontWeight="bold" mb={4} color={textColor}>Chassis Search</Text>
                  <HStack spacing={4}>
                    <Input
                      placeholder="Enter chassis number"
                      value={chassisNumber}
                      onChange={e => setChassisNumber(e.target.value)}
                      bg={inputBg}
                    />
                    <Button colorScheme="blue" onClick={handleChassisSearch}>Search</Button>
                  </HStack>
                  {chassisImage && (
                    <VStack mt={4} spacing={2} align="start">
                      <Image
                        src={chassisImage}
                        alt="Chassis Image"
                        maxW={{ base: '100%', md: '300px' }}
                        objectFit="contain"
                        borderRadius="md"
                      />
                      <Button leftIcon={<DownloadIcon />} colorScheme="blue" variant="outline" size="sm" onClick={handleDownloadChassis}>
                        Download
                      </Button>
                    </VStack>
                  )}
                </Box>
              </VStack>

              {/* Action Buttons */}
              <HStack mt={6} spacing={4} justify="center">
                {selectedCustomer.status === 'Pending' && (
                  <Button colorScheme="purple" size="lg" w="full" onClick={handleMarkUploaded}>Mark Uploaded to RTO</Button>
                )}
                {(selectedCustomer.status === 'Uploaded' || selectedCustomer.status === 'Pending') && (
                  <Button colorScheme="green" size="lg" w="full" onClick={onRtoVerifiedOpen}>RTO Verified</Button>
                )}
                {selectedCustomer.status === 'Done' && (
                  <Badge colorScheme="green" p={2} borderRadius="md">Completed</Badge>
                )}
              </HStack>
            </Flex>
          </Flex>
        ) : (
          // Customer List (Default View)
          <Box>
            <Tabs variant="soft-rounded" colorScheme="blue" index={tabIndex} onChange={setTabIndex}>
              <TabList mb={4}>
                <Tab>Done</Tab>
                <Tab>Pending</Tab>
                <Tab>Uploaded</Tab>
              </TabList>
            </Tabs>
            <HStack mb={4}>
              <Select placeholder="Sort by" size="sm" w="150px">
                <option value="date">Date</option>
                <option value="name">Name</option>
              </Select>
              <Input
                placeholder="Search by name or reg. number"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                size="sm"
                bg={inputBg} // Use predefined variable
              />
            </HStack>
            <VStack spacing={2} align="stretch" maxH={{ base: 'calc(100vh - 200px)', md: '70vh' }} overflowY="auto">
              {filteredCustomers.map(customer => (
                <Box
                  key={customer.id}
                  bg={cardBg}
                  borderRadius="md"
                  p={3}
                  boxShadow="sm"
                  _hover={{ boxShadow: 'md', transform: 'scale(1.02)' }}
                  transition="all 0.2s"
                  cursor="pointer"
                  onClick={() => handleCustomerSelect(customer)}
                >
                  <Flex justify="space-between" align="center">
                    <VStack align="start" spacing={1} flex="1">
                      <Text fontWeight="bold" color={textColor}>{customer.name}</Text>
                      <Text fontSize="sm" color="gray.500">{customer.id}</Text>
                      <Text fontSize="sm" color="gray.500">{customer.vehicle}</Text>
                      {customer.registrationNumber && (
                        <Text fontSize="sm" color="gray.500">Reg. No: {customer.registrationNumber}</Text>
                      )}
                    </VStack>
                    <VStack align="end" spacing={1}>
                      <Badge colorScheme={customer.status === 'Pending' ? 'orange' : customer.status === 'Uploaded' ? 'blue' : 'green'}>{customer.status}</Badge>
                      <Text fontSize="xs" color="gray.500">{customer.date}</Text>
                    </VStack>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </Box>

      {/* Sidebar Drawer */}
      <Drawer isOpen={isMenuOpen} placement="left" onClose={onMenuClose}>
        <DrawerOverlay />
        <DrawerContent w={{ base: 'full', md: '200px' }}>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={4}>
              <Button variant="ghost" colorScheme="blue" isActive>RTO Dashboard</Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* RTO Verified Modal */}
      <Modal isOpen={isRtoVerifiedOpen} onClose={onRtoVerifiedClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={textColor}>RTO Verified</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>Enter Vehicle Registration Number</Text>
              <Input
                placeholder="e.g., MH12AB1234"
                value={registrationNumber}
                onChange={e => setRegistrationNumber(e.target.value)}
                bg={inputBg} // Use predefined variable
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={handleRtoVerified}>Mark Verified</Button>
            <Button variant="ghost" ml={2} onClick={onRtoVerifiedClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={2000} style={{ zIndex: 1500 }} />
    </Box>
  );
};

export default RtoDashboard;