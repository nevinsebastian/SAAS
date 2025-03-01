import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  DrawerHeader,
  DrawerCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons'; // Replaced BarChartIcon
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Analytics = ({ onClose, stats }) => {
  const bgGradient = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const statCardBg = useColorModeValue('gray.100', 'gray.700'); // Moved outside map

  const barData = {
    labels: ['Total Customers', 'Pending', 'Submitted', 'Reviews Pending', 'Reviews Done'],
    datasets: [{
      label: 'Customer Stats',
      data: [stats.totalCustomers, stats.pending, stats.submitted, stats.reviewsPending, stats.reviewsDone],
      backgroundColor: 'rgba(99, 102, 241, 0.6)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 1,
    }],
  };

  const pieData = {
    labels: ['Pending', 'Submitted', 'Verified'],
    datasets: [{
      data: [stats.pending, stats.submitted, stats.totalCustomers - stats.pending - stats.submitted],
      backgroundColor: ['#ECC94B', '#805AD5', '#48BB78'],
    }],
  };

  return (
    <Box bg={bgGradient} minH="100vh">
      <DrawerHeader bg={cardBg} borderBottom="1px" borderColor="gray.200" position="sticky" top={0} zIndex={10}>
        <Flex justify="space-between" align="center">
          <HStack>
            <SettingsIcon color="purple.600" />
            <Heading size="md" color="purple.600">Analytics</Heading>
          </HStack>
          <DrawerCloseButton onClick={onClose} />
        </Flex>
      </DrawerHeader>
      <VStack spacing={6} p={4} align="stretch">
        <Box bg={cardBg} borderRadius="lg" p={4} boxShadow="sm">
          <Text fontSize="lg" fontWeight="bold" mb={4} color={textColor}>Customer Status Overview</Text>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </Box>
        <Box bg={cardBg} borderRadius="lg" p={4} boxShadow="sm">
          <Text fontSize="lg" fontWeight="bold" mb={4} color={textColor}>Status Distribution</Text>
          <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'right' } } }} />
        </Box>
        <Box bg={cardBg} borderRadius="lg" p={4} boxShadow="sm">
          <Text fontSize="lg" fontWeight="bold" mb={4} color={textColor}>Quick Stats</Text>
          <HStack spacing={4} wrap="wrap">
            {Object.entries(stats).map(([key, value]) => (
              <VStack key={key} p={2} bg={statCardBg} borderRadius="md">
                <Text fontSize="sm" color="gray.500">{key.replace(/([A-Z])/g, ' $1').trim()}</Text>
                <Text fontSize="lg" fontWeight="bold" color={textColor}>{value}</Text>
              </VStack>
            ))}
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Analytics;