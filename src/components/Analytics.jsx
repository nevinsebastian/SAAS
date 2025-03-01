import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  CircularProgress,
  CircularProgressLabel,
  SimpleGrid,
} from '@chakra-ui/react';
import { HamburgerIcon, StarIcon } from '@chakra-ui/icons';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Analytics = ({ onClose, stats, user, onMenuOpen }) => {
  const bgGradient = useColorModeValue('linear(to-br, purple.50, blue.50)', 'linear(to-br, purple.900, blue.900)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accentColor = 'purple.500';
  const highlightBg = useColorModeValue('purple.50', 'purple.800');
  const userHighlightBg = useColorModeValue('purple.100', 'purple.700');

  // Sample leaderboard data
  const leaderboard = [
    { rank: 1, name: 'Alex Carter', rating: 4.8, vehiclesDelivered: 35, totalCustomers: 40, bonus: 1200 },
    { rank: 2, name: 'Sam Wilson', rating: 4.5, vehiclesDelivered: 28, totalCustomers: 32, bonus: 800 },
    { rank: 3, name: user.username, rating: 4.2, vehiclesDelivered: 20, totalCustomers: 25, bonus: 500 },
    { rank: 4, name: 'Emma Davis', rating: 4.0, vehiclesDelivered: 15, totalCustomers: 18, bonus: 300 },
  ];

  // Trends data
  const trendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Vehicles Delivered',
      data: [10, 15, 20, 25, 30],
      borderColor: accentColor,
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      tension: 0.4,
    }],
  };

  // Customer satisfaction data
  const satisfaction = {
    averageRating: 4.2,
    totalReviews: 18,
    reviews: [
      { id: 1, customer: 'John Doe', rating: 4, comment: 'Great service, but delivery was late.' },
      { id: 2, customer: 'Jane Smith', rating: 5, comment: 'Excellent experience!' },
    ],
  };

  return (
    <Box bg={bgGradient} minH="100vh" overflowY="auto" pb={{ base: 20, md: 8 }}>
      {/* Header */}
      <Flex justify="space-between" align="center" bg={cardBg} borderRadius="lg" p={3} mb={6} boxShadow="lg" position="sticky" top={0} zIndex={10}>
        <HStack spacing={3}>
          <IconButton icon={<HamburgerIcon />} variant="ghost" onClick={onMenuOpen} aria-label="Open menu" />
          <Heading size="md" color={accentColor}>Analytics</Heading>
        </HStack>
        <Menu>
          <MenuButton>
            <Avatar name={user.username} size="sm" />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={onClose}>Back to Dashboard</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* Main Content */}
      <VStack spacing={6} maxW="1200px" mx="auto" px={{ base: 2, md: 4 }} align="stretch">
        {/* Dashboard Overview */}
        <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md">
          <Heading size="md" mb={4} color={textColor}>Dashboard Overview</Heading>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
            {Object.entries(stats).map(([key, value]) => (
              <VStack
                key={key}
                p={4}
                bg={highlightBg}
                borderRadius="md"
                minW="100px"
                h="100px"
                justify="center"
              >
                <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500" textAlign="center" isTruncated>{key.replace(/([A-Z])/g, ' $1').trim()}</Text>
                <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color={accentColor}>{value}</Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Box>

        {/* Sales Leaderboard */}
        <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md">
          <Heading size="md" mb={4} color={textColor}>Sales Leaderboard</Heading>
          <VStack spacing={1} align="stretch">
            {leaderboard.map((employee) => (
              <Flex
                key={employee.rank}
                p={{ base: 2, md: 3 }}
                bg={employee.name === user.username ? userHighlightBg : cardBg}
                borderRadius="md"
                align="center"
                justify="space-between"
                fontSize={{ base: 'sm', md: 'md' }}
              >
                <HStack spacing={{ base: 2, md: 4 }} flex="1" overflow="hidden">
                  <Text fontWeight="bold" color={textColor} minW="20px">#{employee.rank}</Text>
                  <Text color={textColor} isTruncated>{employee.name}</Text>
                  <Text color="gray.600" whiteSpace="nowrap">{employee.rating}/5</Text>
                  <Text color={accentColor} whiteSpace="nowrap">{employee.vehiclesDelivered} Del.</Text>
                  <Text color={accentColor} whiteSpace="nowrap">{employee.totalCustomers} Cust.</Text>
                  <Text color="green.600" whiteSpace="nowrap">${employee.bonus}</Text>
                </HStack>
              </Flex>
            ))}
          </VStack>
        </Box>

        {/* Delivery Trends */}
        <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md">
          <Heading size="md" mb={4} color={textColor}>Delivery Trends</Heading>
          <Box h={{ base: '250px', md: '350px' }}>
            <Line data={trendsData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }} />
          </Box>
        </Box>

        {/* Customer Satisfaction */}
        <Box bg={cardBg} borderRadius="lg" p={6} boxShadow="md">
          <Heading size="md" mb={4} color={textColor}>Customer Satisfaction</Heading>
          <HStack spacing={6} wrap="wrap" justify="center" mb={6}>
            <VStack>
              <CircularProgress value={satisfaction.averageRating * 20} color={accentColor} size="120px" thickness="12px" capIsRound>
                <CircularProgressLabel fontSize="xl" fontWeight="bold" color={textColor}>{satisfaction.averageRating}/5</CircularProgressLabel>
              </CircularProgress>
              <Text fontSize="sm" color="gray.600">Avg. Rating</Text>
            </VStack>
            <VStack>
              <Text fontSize="2xl" fontWeight="bold" color={accentColor}>{satisfaction.totalReviews}</Text>
              <Text fontSize="sm" color="gray.600">Total Reviews</Text>
            </VStack>
          </HStack>
          <VStack spacing={4} align="stretch">
            {satisfaction.reviews.map(review => (
              <Box key={review.id} p={4} bg={highlightBg} borderRadius="md">
                <HStack justify="space-between" flexWrap="wrap">
                  <Text fontWeight="medium" color={textColor} isTruncated maxW={{ base: '150px', md: 'none' }}>{review.customer}</Text>
                  <HStack>
                    <StarIcon color="yellow.400" />
                    <Text color={accentColor}>{review.rating}/5</Text>
                  </HStack>
                </HStack>
                <Text fontSize="sm" color="gray.600" mt={1}>{review.comment}</Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Analytics;