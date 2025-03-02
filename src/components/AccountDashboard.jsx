import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  IconButton,
  useColorModeValue,
  
} from '@chakra-ui/react';
import { HamburgerIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { Pie, Bar, Line } from 'react-chartjs-2';

const Dashboard = ({ onClose, user, onMenuOpen }) => {
  const bgGradient = useColorModeValue('linear(to-br, gray.50, gray.100)', 'linear(to-br, gray.900, gray.800)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accentColor = 'blue.500';
  const highlightBg = useColorModeValue('blue.50', 'blue.900');

  // Dummy data for the logged-in user
  const metrics = {
    totalReviewsDone: 25,
    verifiedOnce: 20,
    declinedOnce: 5,
    onTime: 18,
    hasError: 2,
    timeSpent: { totalMinutes: 300, avgPerCustomer: 12 }, // Total 5 hours, avg 12 min/customer
  };

  // Processed data for insights
  const verificationRate = (metrics.verifiedOnce / metrics.totalReviewsDone) * 100;
  const errorRate = (metrics.hasError / metrics.totalReviewsDone) * 100;
  const onTimeRate = (metrics.onTime / metrics.totalReviewsDone) * 100;
  const predictedErrors = metrics.hasError > 0 ? Math.round(metrics.hasError * 1.2) : 0; // Simple prediction: 20% increase

  // Chart data
  const pieData = {
    labels: ['Verified', 'Declined', 'Errors'],
    datasets: [{
      data: [metrics.verifiedOnce, metrics.declinedOnce, metrics.hasError],
      backgroundColor: ['#28A745', '#DC3545', '#FF9800'],
    }],
  };

  const barData = {
    labels: ['Last Week', 'This Week'],
    datasets: [{
      label: 'Reviews Done',
      data: [15, metrics.totalReviewsDone], // Example progression
      backgroundColor: accentColor,
    }],
  };

  const lineData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
    datasets: [{
      label: 'Time Spent (min)',
      data: [10, 15, 12, 14, metrics.timeSpent.avgPerCustomer],
      borderColor: accentColor,
      fill: false,
    }],
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
          <IconButton icon={<HamburgerIcon />} variant="ghost" onClick={onMenuOpen} aria-label="Open menu" />
          <Heading size="md" color={accentColor}>Dashboard</Heading>
        </HStack>
        <IconButton icon={<ArrowBackIcon />} variant="ghost" onClick={onClose} aria-label="Back to Accounts" />
      </Flex>

      {/* Main Content */}
      <Box maxW="1400px" mx="auto" mt={4} px={{ base: 2, md: 4 }} pb={{ base: 16, md: 8 }}>
        <VStack spacing={6} align="stretch">
          {/* Key Metrics */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Box bg={cardBg} borderRadius="lg" p={4} boxShadow="md">
              <Text fontWeight="bold" color={textColor}>Total Reviews Done</Text>
              <Text fontSize="2xl" color={accentColor}>{metrics.totalReviewsDone}</Text>
            </Box>
            <Box bg={cardBg} borderRadius="lg" p={4} boxShadow="md">
              <Text fontWeight="bold" color={textColor}>Verified Once</Text>
              <Text fontSize="2xl" color="green.500">{metrics.verifiedOnce}</Text>
            </Box>
            <Box bg={cardBg} borderRadius="lg" p={4} boxShadow="md">
              <Text fontWeight="bold" color={textColor}>Declined Once</Text>
              <Text fontSize="2xl" color="red.500">{metrics.declinedOnce}</Text>
            </Box>
            <Box bg={cardBg} borderRadius="lg" p={4} boxShadow="md">
              <Text fontWeight="bold" color={textColor}>On Time</Text>
              <Text fontSize="2xl" color="blue.500">{metrics.onTime}</Text>
            </Box>
            <Box bg={cardBg} borderRadius="lg" p={4} boxShadow="md">
              <Text fontWeight="bold" color={textColor}>Has Error</Text>
              <Text fontSize="2xl" color="orange.500">{metrics.hasError}</Text>
            </Box>
          </SimpleGrid>

          {/* Time Spent */}
          <Box bg={cardBg} borderRadius="lg" p={4} boxShadow="md">
            <Text fontWeight="bold" mb={2} color={textColor}>Your Time Stats</Text>
            <HStack spacing={4}>
              <Text>Total: <strong>{Math.floor(metrics.timeSpent.totalMinutes / 60)}h {metrics.timeSpent.totalMinutes % 60}m</strong></Text>
              <Text>Avg per Customer: <strong>{metrics.timeSpent.avgPerCustomer} min</strong></Text>
            </HStack>
          </Box>

          {/* Insights & Predictions */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box bg={highlightBg} borderRadius="lg" p={4}>
              <Text fontWeight="bold" mb={2} color={textColor}>Insights</Text>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm">Verification Rate: <strong>{verificationRate.toFixed(1)}%</strong> - {verificationRate > 80 ? 'Excellent consistency!' : 'Room to improve verification speed.'}</Text>
                <Text fontSize="sm">Error Rate: <strong>{errorRate.toFixed(1)}%</strong> - {errorRate < 10 ? 'Great accuracy!' : 'Focus on reducing errors.'}</Text>
                <Text fontSize="sm">On-Time Rate: <strong>{onTimeRate.toFixed(1)}%</strong> - {onTimeRate > 75 ? 'Strong punctuality!' : 'Prioritize timely reviews.'}</Text>
              </VStack>
            </Box>
            <Box bg={highlightBg} borderRadius="lg" p={4}>
              <Text fontWeight="bold" mb={2} color={textColor}>Predictions</Text>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm">Potential Errors Next Week: <strong>{predictedErrors}</strong> - Review high-risk cases early.</Text>
                <Text fontSize="sm">Expected Time: <strong>{Math.round(metrics.timeSpent.avgPerCustomer * (metrics.totalReviewsDone + 5) / 60)}h</strong> - Plan for upcoming workload.</Text>
              </VStack>
            </Box>
          </SimpleGrid>

          {/* Charts */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box bg={cardBg} borderRadius="lg" p={4} boxShadow="md">
              <Text fontWeight="bold" mb={2} color={textColor}>Review Breakdown</Text>
              <Pie data={pieData} options={{ responsive: true }} />
            </Box>
            <Box bg={cardBg} borderRadius="lg" p={4} boxShadow="md">
              <Text fontWeight="bold" mb={2} color={textColor}>Weekly Progress</Text>
              <Bar data={barData} options={{ responsive: true }} />
            </Box>
            <Box bg={cardBg} borderRadius="lg" p={4} boxShadow="md" gridColumn={{ base: 'span 1', md: 'span 2' }}>
              <Text fontWeight="bold" mb={2} color={textColor}>Time Spent Trend</Text>
              <Line data={lineData} options={{ responsive: true }} />
            </Box>
          </SimpleGrid>

          {/* Actionable Suggestions */}
          <Box bg={highlightBg} borderRadius="lg" p={4}>
            <Text fontWeight="bold" mb={2} color={textColor}>Actionable Suggestions</Text>
            <VStack align="start" spacing={2}>
              {errorRate > 10 && <Text fontSize="sm">Double-check payment details to reduce errors.</Text>}
              {onTimeRate < 75 && <Text fontSize="sm">Schedule reviews earlier to improve on-time rate.</Text>}
              <Text fontSize="sm">Focus on {metrics.hasError > 0 ? 'error-prone customers' : 'maintaining accuracy'} this week.</Text>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default Dashboard;