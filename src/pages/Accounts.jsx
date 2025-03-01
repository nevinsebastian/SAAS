import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useColorMode,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import { HamburgerIcon, BellIcon, EditIcon, ArrowBackIcon, DeleteIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { Chart as ChartJS, ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const Accounts = () => {
  const navigate = useNavigate();
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isVerifyOpen, onOpen: onVerifyOpen, onClose: onVerifyClose } = useDisclosure();
  const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();
  const { isOpen: isDeletOpen, onOpen: onDeletOpen, onClose: onDeletClose } = useDisclosure();

  const { colorMode, toggleColorMode } = useColorMode();
  const bgGradient = useColorModeValue('linear(to-br, gray.50, gray.100)', 'linear(to-br, gray.900, gray.800)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accentColor = 'blue.500';
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [tabIndex, setTabIndex] = useState(0); // Done, Pending, Errors tabs
  const [isEditing, setIsEditing] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '', vehicle: '', variant: '', color: '', exShowroom: '', tax: '', onRoad: '', insurance: '',
    bookingCharge: '', deliveryCharge: '', hasFinance: false, financeProvider: '', financeAmount: '', emi: '', tenure: '',
  });
  const [reportMessage, setReportMessage] = useState('');
  const [customReport, setCustomReport] = useState('');

  const [deleteMessage, setDeleteMessage] = useState('');
  const [customDelete, setCustomDelete] = useState('');
  // Dummy customer data
  const customers = [
    { id: 'B001', name: 'John Doe', status: 'Pending', vehicle: 'Toyota Corolla', date: '2025-03-01', errors: 0 },
    { id: 'B002', name: 'Jane Smith', status: 'Done', vehicle: 'Honda City', date: '2025-02-28', errors: 0 },
    { id: 'B003', name: 'Mike Johnson', status: 'Errors', vehicle: 'Hyundai Creta', date: '2025-03-02', errors: 1, errorReason: 'Wrong Transaction ID' },
  ];

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (tabIndex === 0 ? c.status === 'Done' : tabIndex === 1 ? c.status === 'Pending' : c.status === 'Errors')
  );

  const notifications = [
    { id: 1, message: 'New customer added: John Doe', time: '2025-03-01 10:00 AM', seen: false },
    { id: 2, message: 'Error reported for Mike Johnson', time: '2025-03-02 09:00 AM', seen: false },
    { id: 3, message: 'Verification completed for Jane Smith', time: '2025-02-28 12:00 PM', seen: true },
  ];

  const unseenNotifications = notifications.filter(n => !n.seen);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setCustomerData({
      name: customer.name, vehicle: customer.vehicle, variant: 'LE', color: 'Black',
      exShowroom: '50000', tax: '5000', onRoad: '55000', insurance: '2000', bookingCharge: '1000', deliveryCharge: '1500',
      hasFinance: false, financeProvider: '', financeAmount: '', emi: '', tenure: '',
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const handleFinanceToggle = () => {
    setCustomerData(prev => ({ ...prev, hasFinance: !prev.hasFinance }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Customer details saved!', { position: 'top-center' });
  };

  const handleVerify = () => {
    setCustomerData(prev => ({ ...prev, status: 'Done' }));
    setSelectedCustomer(null);
    onVerifyClose();
    toast.success('Customer verified successfully!', { position: 'top-center' });
  };

  const handleCancelVerify = () => {
    setSelectedCustomer(null);
    onVerifyClose();
  };

  const handleDelete = () => {
    const finalMessage = customDelete || deleteMessage;
    if (finalMessage) {
      toast.success(`Deleted: ${finalMessage}`, { position: 'top-center' });
      setDeleteMessage('');
      setCustomDelete('');
      onDeletClose();
    } else {
      toast.error('Please select or enter a Reason!', { position: 'top-center' });
    }
  };

  const handleReportSubmit = () => {
    const finalMessage = customReport || reportMessage;
    if (finalMessage) {
      toast.success(`Reported: ${finalMessage}`, { position: 'top-center' });
      setReportMessage('');
      setCustomReport('');
      onReportClose();
    } else {
      toast.error('Please select or enter a report message!', { position: 'top-center' });
    }
  };

  return (
    <Box minH="100vh" bg={bgGradient} position="relative">
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        bg={cardBg}
        borderRadius={{ base: 0, md: 'lg' }}
        p={3}
        boxShadow="md"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <HStack spacing={3}>
          <IconButton icon={<HamburgerIcon />} variant="ghost" onClick={onMenuOpen} aria-label="Open menu" display={{ md: 'none' }} />
          <Heading size="md" color={accentColor}>Accounts</Heading>
        </HStack>
        <HStack spacing={4}>
      
          <Menu>
            <MenuButton as={IconButton} icon={<BellIcon />} variant="ghost" aria-label="Notifications" position="relative">
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
              <Avatar name="Account User" size="sm" />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={toggleColorMode}>{colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}</MenuItem>
              <MenuItem onClick={() => navigate('/login')}>Sign Out</MenuItem>
            </MenuList>
            </Menu>
          </HStack>
        </Flex>

      {/* Main Layout */}
      <Box maxW="1400px" mx="auto" mt={4} px={{ base: 2, md: 4 }} pb={{ base: 16, md: 8 }}>
        {selectedCustomer ? (
          // Full-Screen Customer Details (Mobile)
          <Flex direction="column" h={{ base: 'calc(100vh - 70px)', md: 'auto' }} position={{ base: 'fixed', md: 'static' }} top={{ base: '70px', md: 'auto' }} left={0} right={0} bottom={0} bg={cardBg} zIndex={9}>
            {/* Fixed Header with Back Button */}
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
                <Heading size="md" color={textColor}>{selectedCustomer.name} - {selectedCustomer.id}</Heading>
              </HStack>
              <Button size="sm" leftIcon={<EditIcon />} variant="outline" colorScheme="blue" onClick={handleEditToggle}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </Flex>

            {/* Scrollable Details */}
            <Flex direction="column" flex="1" overflowY="auto" p={4} pb={200}> {/* Added padding-bottom */}
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={2}>Vehicle Details</Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Vehicle</Text>
                      <Input name="vehicle" value={customerData.vehicle} onChange={handleInputChange} isDisabled={!isEditing} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Variant</Text>
                      <Input name="variant" value={customerData.variant} onChange={handleInputChange} isDisabled={!isEditing} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Color</Text>
                      <Input name="color" value={customerData.color} onChange={handleInputChange} isDisabled={!isEditing} />
                    </Box>
                  </SimpleGrid>
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2}>Pricing</Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Ex-Showroom</Text>
                      <Input name="exShowroom" value={customerData.exShowroom} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Tax</Text>
                      <Input name="tax" value={customerData.tax} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">On-Road</Text>
                      <Input name="onRoad" value={customerData.onRoad} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Insurance</Text>
                      <Input name="insurance" value={customerData.insurance} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Booking Charge</Text>
                      <Input name="bookingCharge" value={customerData.bookingCharge} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Delivery Charge</Text>
                      <Input name="deliveryCharge" value={customerData.deliveryCharge} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                    </Box>
                  </SimpleGrid>
                </Box>
                <Box>
                  <HStack justify="space-between">
                    <Text fontWeight="bold">Finance Options</Text>
                    <Checkbox
                      isChecked={customerData.hasFinance}
                      onChange={handleFinanceToggle}
                      isDisabled={!isEditing}
                    >
                      Has Finance?
                    </Checkbox>
                  </HStack>
                  {customerData.hasFinance && (
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} mt={2}>
                      <Box>
                        <Text fontSize="sm" color="gray.500">Finance Provider</Text>
                        <Input name="financeProvider" value={customerData.financeProvider} onChange={handleInputChange} isDisabled={!isEditing} />
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500">Finance Amount</Text>
                        <Input name="financeAmount" value={customerData.financeAmount} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500">EMI</Text>
                        <Input name="emi" value={customerData.emi} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500">Tenure (months)</Text>
                        <Input name="tenure" value={customerData.tenure} onChange={handleInputChange} type="number" isDisabled={!isEditing} />
                      </Box>
                    </SimpleGrid>
                  )}
                </Box>
              </VStack>
              <Box mt={4}>
                {isEditing ? (
                  <Button colorScheme="blue" w="full" onClick={handleSave}>Save</Button>
                ) : (
                  <HStack spacing={4} justify="center">
                    <Button colorScheme="green" w="full" size="lg" onClick={onVerifyOpen}>Verify</Button>
                    <Button colorScheme="red" w="full" size="lg" leftIcon={<DeleteIcon />} onClick={onDeletOpen}>Delete</Button>
                    <Button colorScheme="orange" w="full" size="lg" leftIcon={<WarningTwoIcon />} onClick={onReportOpen}>Report</Button>
                  </HStack>
                )}
              </Box>
            </Flex>
          </Flex>
        ) : (
          // Customer List (Default Mobile View)
          <Box>
            <Tabs variant="soft-rounded" colorScheme="blue" index={tabIndex} onChange={setTabIndex}>
              <TabList mb={4}>
                <Tab>Done</Tab>
                <Tab>Pending</Tab>
                <Tab>Errors</Tab>
              </TabList>
            </Tabs>
            <HStack mb={4}>
              <Select placeholder="Sort by" size="sm" w="150px">
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="status">Status</option>
              </Select>
              <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} size="sm" />
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
                      {customer.status === 'Errors' && (
                        <Text fontSize="sm" color="red.500">{customer.errorReason}</Text>
                      )}
                    </VStack>
                    <VStack align="end" spacing={1}>
                      <Badge colorScheme={customer.status === 'Pending' ? 'orange' : customer.status === 'Done' ? 'green' : 'red'}>{customer.status}</Badge>
                      <Text fontSize="xs" color="gray.500">{customer.date}</Text>
                    </VStack>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Flex
        justify="space-between"
        align="center"
        bg={cardBg}
        p={2}
        position={{ base: 'fixed', md: 'static' }}
        bottom={0}
        left={0}
        right={0}
        boxShadow="md"
        zIndex={10}
      >
        <Text fontSize="sm" color="gray.500">Customers Verified Today: 5</Text>
        <Button size="sm" variant="ghost" colorScheme="blue">Need Help?</Button>
      </Flex>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isMenuOpen} placement="left" onClose={onMenuClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={4}>
              <Button variant="ghost" colorScheme="blue" isActive>Accounts</Button>
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
              <Button variant="ghost" onClick={() => navigate('/customers')}>Customers</Button>
              <Button variant="ghost" onClick={() => navigate('/reports')}>Reports</Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Verification Modal */}
      <Modal isOpen={isVerifyOpen} onClose={onVerifyClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verify </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
             <Text>
              Are you sure u wanna verify the customer
             </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
          <Button colorScheme="red"  mr={4} onClick={handleCancelVerify}>No</Button>
            <Button colorScheme="blue"  onClick={handleVerify}>Yes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Report Customer Modal */}
      <Modal isOpen={isReportOpen} onClose={onReportClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={textColor}>Report Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <RadioGroup value={reportMessage} onChange={setReportMessage}>
                <VStack align="start" spacing={2}>
                  <Radio value="Payment Pending">Payment Pending</Radio>
                  <Radio value="Can’t Confirm Payment">Can’t Confirm Payment</Radio>
                  <Radio value="Wrong Transaction ID">Wrong Transaction ID</Radio>
                  <Radio value="Payment Not Received">Payment Not Received</Radio>
                </VStack>
              </RadioGroup>
              <Input
                placeholder="Or type a custom message..."
                value={customReport}
                onChange={e => setCustomReport(e.target.value)}
                bg={useColorModeValue('gray.100', 'gray.700')}
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                _focus={{ borderColor: accentColor }}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="orange" onClick={handleReportSubmit}>Submit</Button>
            <Button variant="ghost" ml={2} onClick={onReportClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

            {/* delet Customer Modal */}
            <Modal isOpen={isDeletOpen} onClose={onDeletClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={textColor}>Delete Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>            <VStack spacing={4} align="stretch">

            <Text>Why deleting customer?</Text>
              <RadioGroup value={deleteMessage} onChange={setDeleteMessage}>
                <VStack align="start" spacing={2}>
                  <Radio value="Payment Not Received">Payment Not Received</Radio>
                  <Radio value="Canceled Booking">Canceled Booking</Radio>
                  <Radio value="Customer dosnt ecist">Customer dosnt exist</Radio>
                </VStack>
              </RadioGroup>
              <Input
                placeholder="Or type a custom message..."
                value={customDelete}
                onChange={e => setCustomReport(e.target.value)}
                bg={useColorModeValue('gray.100', 'gray.700')}
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                _focus={{ borderColor: accentColor }}
              />
            </VStack>
            

          </ModalBody>
          <ModalFooter>
  <Text fontSize="sm" color="gray.500">
    Once deleted, only admin can restore the customer
  </Text>
  <Button colorScheme="red" onClick={handleDelete} ml={4}>
    Delete
  </Button>
  <Button variant="ghost" ml={2} onClick={onDeletClose}>
    Cancel
  </Button>
</ModalFooter>

        </ModalContent>
      </Modal>

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={2000} style={{ zIndex: 1500 }} />
    </Box>
  );
};

export default Accounts;