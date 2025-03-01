import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for navigation
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
  TabPanels,
  TabPanel,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton, // Added import
  useColorMode,
} from '@chakra-ui/react';
import { ToastContainer, toast } from 'react-toastify';

import { HamburgerIcon, BellIcon, EditIcon } from '@chakra-ui/icons'; // Removed unused icons
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const Accounts = () => {
  const navigate = useNavigate(); // Initialized navigate
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isVerifyOpen, onOpen: onVerifyOpen, onClose: onVerifyClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgGradient = useColorModeValue('linear(to-br, gray.50, gray.100)', 'linear(to-br, gray.900, gray.800)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accentColor = 'blue.500';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [tabIndex, setTabIndex] = useState(0); // Done or Pending tabs
  const [customerData, setCustomerData] = useState({
    name: '', vehicle: '', variant: '', color: '', exShowroom: '', tax: '', onRoad: '', insurance: '',
    hasFinance: false, financeApproved: false, financeProvider: '', financeAmount: '', emi: '', tenure: '',
  });

  // Dummy customer data
  const customers = [
    { id: 'B001', name: 'John Doe', status: 'Pending', vehicle: 'Toyota Corolla', date: '2025-03-01', errors: 1 },
    { id: 'B002', name: 'Jane Smith', status: 'Done', vehicle: 'Honda City', date: '2025-02-28', errors: 0 },
    { id: 'B003', name: 'Mike Johnson', status: 'Pending', vehicle: 'Hyundai Creta', date: '2025-03-02', errors: 2 },
  ];

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (tabIndex === 0 ? c.status === 'Done' : c.status === 'Pending')
  );

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setCustomerData({ name: customer.name, vehicle: customer.vehicle, variant: '', color: '', exShowroom: '50000', tax: '5000', onRoad: '55000', insurance: '2000', hasFinance: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    toast.success('Customer details saved!', { position: 'top-center' });
  };

  const handleVerify = () => {
    setCustomerData(prev => ({ ...prev, status: 'Done' }));
    setSelectedCustomer(null);
    onVerifyClose();
    toast.success('Customer verified successfully!', { position: 'top-center' });
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
          <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} size="sm" w={{ base: '100px', md: '200px' }} />
          <IconButton icon={<BellIcon />} variant="ghost" aria-label="Notifications" position="relative">
            <Badge colorScheme="red" borderRadius="full" position="absolute" top="-1" right="-1">3</Badge>
          </IconButton>
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
      <Flex direction={{ base: 'column', md: 'row' }} maxW="1400px" mx="auto" mt={4} px={{ base: 0, md: 4 }} pb={{ base: 16, md: 0 }}>
        {/* Sidebar (Desktop) */}
        <Box
          w={{ base: 'full', md: '250px' }}
          bg={cardBg}
          borderRadius="lg"
          boxShadow="md"
          p={4}
          mr={{ md: 4 }}
          display={{ base: 'none', md: 'block' }}
        >
          <VStack align="stretch" spacing={4}>
            <Button variant="ghost" colorScheme="blue" isActive>Accounts</Button>
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
            <Button variant="ghost" onClick={() => navigate('/customers')}>Customers</Button>
            <Button variant="ghost" onClick={() => navigate('/reports')}>Reports</Button>
          </VStack>
        </Box>

        {/* Customer List (Left Panel) */}
        <Box w={{ base: 'full', md: '40%' }} bg={cardBg} borderRadius="lg" boxShadow="md" p={4} mb={{ base: 4, md: 0 }}>
          <Tabs variant="soft-rounded" colorScheme="blue" index={tabIndex} onChange={setTabIndex}>
            <TabList mb={4}>
              <Tab>Done</Tab>
              <Tab>Pending</Tab>
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
          <VStack spacing={2} align="stretch" maxH="70vh" overflowY="auto">
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
                  </VStack>
                  <VStack align="end" spacing={1}>
                    <Badge colorScheme={customer.status === 'Pending' ? 'orange' : 'green'}>{customer.status}</Badge>
                    <Text fontSize="xs" color="gray.500">{customer.date}</Text>
                  </VStack>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Customer Details (Right Panel) */}
        <Box w={{ base: 'full', md: '60%' }} bg={cardBg} borderRadius="lg" boxShadow="md" p={4}>
          {selectedCustomer ? (
            <VStack spacing={4} align="stretch">
              <Flex justify="space-between" align="center">
                <Heading size="md" color={textColor}>{selectedCustomer.name} - {selectedCustomer.id}</Heading>
                <HStack>
                  <Button size="sm" leftIcon={<EditIcon />} variant="outline" colorScheme="blue">Edit</Button>
                  <Button size="sm" variant="outline" colorScheme="red">Archive</Button>
                </HStack>
              </Flex>
              <Tabs variant="soft-rounded" colorScheme="blue">
                <TabList mb={4}>
                  <Tab>Booking & Finance</Tab>
                  <Tab>Verification</Tab>
                  <Tab>Errors</Tab>
                </TabList>
                <TabPanels>
                  {/* Booking & Finance */}
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <VStack align="start">
                          <Text fontWeight="bold">Vehicle Details</Text>
                          <Input name="vehicle" value={customerData.vehicle} onChange={handleInputChange} placeholder="Vehicle Name" />
                          <Input name="variant" value={customerData.variant} onChange={handleInputChange} placeholder="Variant" />
                          <Input name="color" value={customerData.color} onChange={handleInputChange} placeholder="Color" />
                        </VStack>
                        <VStack align="start">
                          <Text fontWeight="bold">Pricing</Text>
                          <Input name="exShowroom" value={customerData.exShowroom} onChange={handleInputChange} placeholder="Ex-Showroom Price" type="number" />
                          <Input name="tax" value={customerData.tax} onChange={handleInputChange} placeholder="Tax" type="number" />
                          <Input name="onRoad" value={customerData.onRoad} onChange={handleInputChange} placeholder="On-Road Price" type="number" />
                          <Input name="insurance" value={customerData.insurance} onChange={handleInputChange} placeholder="Insurance" type="number" />
                        </VStack>
                      </SimpleGrid>
                      <HStack justify="space-between">
                        <Text fontWeight="bold">Finance Options</Text>
                        <Checkbox isChecked={customerData.hasFinance} onChange={e => setCustomerData(prev => ({ ...prev, hasFinance: e.target.checked }))}>Has Loan/Finance?</Checkbox>
                      </HStack>
                      {customerData.hasFinance && (
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <Input name="financeProvider" value={customerData.financeProvider} onChange={handleInputChange} placeholder="Finance Provider" />
                          <Input name="financeAmount" value={customerData.financeAmount} onChange={handleInputChange} placeholder="Approved Finance Amount" type="number" />
                          <Input name="emi" value={customerData.emi} onChange={handleInputChange} placeholder="Monthly EMI" type="number" />
                          <Input name="tenure" value={customerData.tenure} onChange={handleInputChange} placeholder="Tenure (months)" type="number" />
                          <Checkbox isChecked={customerData.financeApproved} onChange={e => setCustomerData(prev => ({ ...prev, financeApproved: e.target.checked }))}>Approved</Checkbox>
                        </SimpleGrid>
                      )}
                      <HStack justify="flex-end" mt={4}>
                        <Button variant="outline" onClick={() => setSelectedCustomer(null)}>Cancel</Button>
                        <Button bg={accentColor} color="white" onClick={handleSave}>Save</Button>
                      </HStack>
                    </VStack>
                  </TabPanel>

                  {/* Verification */}
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <Text>Current Status: <Badge colorScheme={selectedCustomer.status === 'Pending' ? 'orange' : 'green'}>{selectedCustomer.status}</Badge></Text>
                      <Text fontWeight="bold">Verification History</Text>
                      <VStack align="start" spacing={2}>
                        <Text fontSize="sm" color="gray.500">Edited by John Doe - Feb 28, 2025</Text>
                      </VStack>
                      {selectedCustomer.status === 'Pending' && (
                        <Button colorScheme="blue" onClick={onVerifyOpen}>Verify Customer</Button>
                      )}
                    </VStack>
                  </TabPanel>

                  {/* Errors */}
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <Text fontWeight="bold">Reported Errors</Text>
                      {selectedCustomer.errors > 0 ? (
                        <VStack spacing={2} align="stretch">
                          <HStack justify="space-between" bg={cardBg} p={3} borderRadius="md" boxShadow="sm">
                            <Text color={textColor}>Incorrect Tax Entered - Reported by Jane Doe - Feb 25, 2025</Text>
                            <Checkbox />
                          </HStack>
                        </VStack>
                      ) : (
                        <Text color="gray.500">No errors reported</Text>
                      )}
                      <Text fontWeight="bold" mt={4}>Analytics</Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Pie data={{
                            labels: ['Correct', 'Wrong'],
                            datasets: [{ data: [90, 10], backgroundColor: ['#28A745', '#DC3545'] }],
                          }} options={{ responsive: true }} />
                          <Text textAlign="center" mt={2}>Success Rate</Text>
                        </Box>
                        <Box>
                          <Bar data={{
                            labels: ['Avg. Time'],
                            datasets: [{ label: 'Minutes', data: [5], backgroundColor: '#007BFF' }],
                          }} options={{ responsive: true }} />
                          <Text textAlign="center" mt={2}>Avg. Time to Verify</Text>
                        </Box>
                      </SimpleGrid>
                      <Box>
                        <Line data={{
                          labels: ['Feb 25', 'Feb 26', 'Feb 27', 'Feb 28', 'Mar 01'],
                          datasets: [{ label: 'Errors', data: [2, 1, 3, 0, 1], borderColor: '#DC3545' }],
                        }} options={{ responsive: true }} />
                        <Text textAlign="center" mt={2}>Errors Over Time</Text>
                      </Box>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          ) : (
            <Text color="gray.500" textAlign="center" py={10}>Select a customer to view details</Text>
          )}
        </Box>
      </Flex>

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
          <ModalHeader>Verify Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Checkbox>Docs Uploaded</Checkbox>
              <Checkbox>Finance Approved</Checkbox>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleVerify}>Confirm Verification</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={2000} style={{ zIndex: 1500 }} />
    </Box>
  );
};

export default Accounts;