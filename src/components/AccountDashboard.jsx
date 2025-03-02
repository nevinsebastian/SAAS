import React from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  SimpleGrid,
  IconButton,
  useColorModeValue,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import {  ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { toast } from 'react-toastify';

const Dashboard = ({ onClose, user, onMenuOpen }) => {
  const bgGradient = useColorModeValue('linear(to-br, gray.50, gray.100)', 'linear(to-br, gray.900, gray.800)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accentColor = 'blue.500';
  const successColor = 'green.500';
  const errorColor = 'red.500';
  const warningColor = 'orange.500';

  const { isOpen: isInsightsOpen, onToggle: toggleInsights } = useDisclosure({ defaultIsOpen: true });

  // Dummy data for the logged-in user
  const metrics = {
    totalReviewsDone: 25,
    verifiedOnce: 20,
    declinedOnce: 5,
    onTime: 18,
    hasError: 2,
    pendingTasks: 3,
    timeSpent: { totalMinutes: 300, avgPerCustomer: 12, todayMinutes: 45 },
    overdueTasks: 1,
  };

  // Processed data for insights
  const verificationRate = (metrics.verifiedOnce / metrics.totalReviewsDone) * 100;
  const errorRate = (metrics.hasError / metrics.totalReviewsDone) * 100;
  const onTimeRate = (metrics.onTime / metrics.totalReviewsDone) * 100;

  // Chart data
  const pieData = {
    labels: ['Verified', 'Declined', 'Errors'],
    datasets: [{
      data: [metrics.verifiedOnce, metrics.declinedOnce, metrics.hasError],
      backgroundColor: [successColor, errorColor, warningColor],
      borderWidth: 1,
      borderColor: cardBg,
    }],
  };

  const barData = {
    labels: ['Last Week', 'This Week'],
    datasets: [{
      label: 'Reviews Done',
      data: [15, metrics.totalReviewsDone],
      backgroundColor: accentColor,
      borderRadius: 4,
    }],
  };

  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Time Spent (min)',
      data: [10, 15, 12, 14, metrics.timeSpent.avgPerCustomer],
      borderColor: accentColor,
      backgroundColor: `${accentColor}33`, // 20% opacity fill
      fill: true,
      tension: 0.4,
    }],
  };

  return (
    <Box minH="100vh" bg={bgGradient} position="relative">
   

      {/* Main Content */}
      <Box maxW="1400px" mx="auto" mt={6} px={{ base: 4, md: 6 }} pb={{ base: 16, md: 8 }}>
        <VStack spacing={8} align="stretch">
          {/* Welcome & Overview */}
          <Box>
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>Welcome, {user.username}!</Text>
            <Text fontSize="sm" color="gray.500">Here’s your performance overview for today, {new Date().toLocaleDateString()}.</Text>
          </Box>

          {/* Key Metrics */}
          <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} spacing={6}>
            <Stat bg={cardBg} borderRadius="xl" p={4} boxShadow="md" _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
              <StatLabel color={textColor}>Total Reviews Done</StatLabel>
              <StatNumber color={accentColor}>{metrics.totalReviewsDone}</StatNumber>
              <StatHelpText color="gray.500">All-time</StatHelpText>
            </Stat>
            <Stat bg={cardBg} borderRadius="xl" p={4} boxShadow="md" _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
              <StatLabel color={textColor}>Verified</StatLabel>
              <StatNumber color={successColor}>{metrics.verifiedOnce}</StatNumber>
              <StatHelpText color="gray.500">{verificationRate.toFixed(1)}% Rate</StatHelpText>
            </Stat>
            <Stat bg={cardBg} borderRadius="xl" p={4} boxShadow="md" _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
              <StatLabel color={textColor}>Declined</StatLabel>
              <StatNumber color={errorColor}>{metrics.declinedOnce}</StatNumber>
              <StatHelpText color="gray.500">{(100 - verificationRate).toFixed(1)}% Rate</StatHelpText>
            </Stat>
            <Stat bg={cardBg} borderRadius="xl" p={4} boxShadow="md" _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
              <StatLabel color={textColor}>Pending Tasks</StatLabel>
              <StatNumber color={warningColor}>{metrics.pendingTasks}</StatNumber>
              <StatHelpText color="gray.500">Awaiting Action</StatHelpText>
            </Stat>
            <Stat bg={cardBg} borderRadius="xl" p={4} boxShadow="md" _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
              <StatLabel color={textColor}>Errors</StatLabel>
              <StatNumber color={errorColor}>{metrics.hasError}</StatNumber>
              <StatHelpText color="gray.500">{errorRate.toFixed(1)}% Rate</StatHelpText>
            </Stat>
          </SimpleGrid>

          {/* Productivity & Time Stats */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={0}>
         
              <Divider my={4} />
         
            <Box bg={cardBg} borderRadius="xl" p={6} boxShadow="md">
              <Text fontWeight="bold" mb={4} color={textColor}>Quick Actions</Text>
              <VStack spacing={3} align="stretch">
                <Button colorScheme="blue" variant="outline" size="sm" onClick={onClose}>Review Pending Tasks</Button>
                <Button colorScheme="orange" variant="outline" size="sm" onClick={() => toast.info('Feature coming soon!')}>View Error Reports</Button>
              </VStack>
            </Box>
          </SimpleGrid>

          {/* Insights & Trends */}
          <Box bg={cardBg} borderRadius="xl" p={6} boxShadow="md">
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontWeight="bold" color={textColor}>Insights & Trends</Text>
              <IconButton
                icon={isInsightsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                variant="ghost"
                onClick={toggleInsights}
                aria-label="Toggle Insights"
              />
            </Flex>
            <Collapse in={isInsightsOpen}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                  <Text fontSize="sm" fontWeight="semibold" mb={2} color={textColor}>Performance Insights</Text>
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" color={verificationRate > 80 ? successColor : warningColor}>
                      Verification Rate: <strong>{verificationRate.toFixed(1)}%</strong> - {verificationRate > 80 ? 'Top-tier efficiency!' : 'Boost verification speed.'}
                    </Text>
                    <Text fontSize="sm" color={errorRate < 10 ? successColor : warningColor}>
                      Error Rate: <strong>{errorRate.toFixed(1)}%</strong> - {errorRate < 10 ? 'High accuracy!' : 'Review error-prone cases.'}
                    </Text>
                    <Text fontSize="sm" color={onTimeRate > 75 ? successColor : warningColor}>
                      On-Time Rate: <strong>{(metrics.onTime / metrics.totalReviewsDone * 100).toFixed(1)}%</strong> - {onTimeRate > 75 ? 'Great punctuality!' : 'Prioritize deadlines.'}
                    </Text>
                  </VStack>
                </Box>
              
              </SimpleGrid>
            </Collapse>
          </Box>

          {/* Visualizations */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box bg={cardBg} borderRadius="xl" p={6} boxShadow="md">
              <Text fontWeight="bold" mb={4} color={textColor}>Review Status</Text>
              <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </Box>
            <Box bg={cardBg} borderRadius="xl" p={6} boxShadow="md">
              <Text fontWeight="bold" mb={4} color={textColor}>Weekly Progress</Text>
              <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </Box>
            <Box bg={cardBg} borderRadius="xl" p={6} boxShadow="md" gridColumn={{ base: 'span 1', md: 'span 2' }}>
              <Text fontWeight="bold" mb={4} color={textColor}>Time Efficiency Trend</Text>
              <Line data={lineData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
            </Box>
          </SimpleGrid>
        </VStack>
      </Box>
    </Box>
  );
};

export default Dashboard;