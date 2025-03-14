import React, { useState, useEffect } from 'react';
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
  Spinner,
  useToast,
  Button,
} from '@chakra-ui/react';
import { HamburgerIcon, StarIcon } from '@chakra-ui/icons';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Analytics = ({ onClose, user, onMenuOpen }) => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast();

  const bgGradient = useColorModeValue('linear(to-br, purple.50, blue.50)', 'linear(to-br, purple.900, blue.900)');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accentColor = 'purple.500';
  const highlightBg = useColorModeValue('purple.50', 'purple.800');
  const userHighlightBg = useColorModeValue('purple.100', 'purple.700');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/analytics');
        setAnalyticsData(response.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError(err.response?.data?.error || 'Failed to load analytics data');
        toast({
          title: 'Error',
          description: err.response?.data?.error || 'Failed to load analytics data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [toast]);

  if (loading) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner size="xl" color={accentColor} />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex height="100vh" align="center" justify="center" direction="column" gap={4}>
        <Text color="red.500">{error}</Text>
        <Button colorScheme="purple" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Flex>
    );
  }

  if (!analyticsData?.current) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Text>No analytics data available</Text>
      </Flex>
    );
  }

  const { current, trends, topSales } = analyticsData;

  // Format trends data for chart
  const trendsData = {
    labels: trends.map(t => new Date(t.month).toLocaleDateString('default', { month: 'short', year: 'numeric' })),
    datasets: [
      {
        label: 'Total Customers',
        data: trends.map(t => t.total_customers),
        borderColor: accentColor,
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Verified Customers',
        data: trends.map(t => t.verified_customers),
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        tension: 0.4,
      }
    ],
  };

  return (
    <Box 
      minH="100vh" 
      bg={bgGradient} 
      position="relative"
      overflowY="auto"
      maxH="100vh"
    >
      {/* Fixed Header */}
      <Flex 
        justify="space-between" 
        align="center" 
        p={4}
        bg={cardBg}
        position="sticky"
        top={0}
        zIndex={10}
        boxShadow="sm"
      >
        <IconButton
          icon={<HamburgerIcon />}
          variant="ghost"
          onClick={onMenuOpen}
          aria-label="Open menu"
        />
        <Heading size={{ base: "md", md: "lg" }} color={textColor}>Analytics Dashboard</Heading>
        <Menu>
          <MenuButton>
            <Avatar name={user.username} size="sm" />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={onClose}>Close Analytics</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* Scrollable Content */}
      <Box p={4} pb={{ base: 20, md: 4 }}>
        {/* Stats Cards */}
        <SimpleGrid 
          columns={{ base: 2, md: 2, lg: 4 }} 
          spacing={{ base: 3, md: 6 }} 
          mb={8}
        >
          <Box bg={cardBg} p={{ base: 3, md: 6 }} borderRadius="xl" boxShadow="md">
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">Total Customers</Text>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color={textColor}>
              {current.total_customers}
            </Text>
          </Box>
          <Box bg={cardBg} p={{ base: 3, md: 6 }} borderRadius="xl" boxShadow="md">
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">Pending</Text>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="orange.500">
              {current.pending_customers}
            </Text>
          </Box>
          <Box bg={cardBg} p={{ base: 3, md: 6 }} borderRadius="xl" boxShadow="md">
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">Submitted</Text>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="blue.500">
              {current.submitted_customers}
            </Text>
          </Box>
          <Box bg={cardBg} p={{ base: 3, md: 6 }} borderRadius="xl" boxShadow="md">
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">Verified</Text>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="green.500">
              {current.verified_customers}
            </Text>
          </Box>
        </SimpleGrid>

        {/* Charts and Tables */}
        <SimpleGrid 
          columns={{ base: 1, lg: 2 }} 
          spacing={{ base: 4, md: 6 }}
          mb={{ base: 4, md: 0 }}
        >
          {/* Trends Chart */}
          <Box 
            bg={cardBg} 
            p={{ base: 3, md: 6 }} 
            borderRadius="xl" 
            boxShadow="md"
            h={{ base: "350px", md: "400px" }}
          >
            <Heading size={{ base: "sm", md: "md" }} mb={4}>Customer Trends</Heading>
            <Box height={{ base: "280px", md: "330px" }}>
              <Line 
                data={trendsData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  scales: {
                    y: { beginAtZero: true },
                    x: {
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        boxWidth: 10,
                        padding: 10,
                        font: {
                          size: 10
                        }
                      }
                    }
                  }
                }} 
              />
            </Box>
          </Box>

          {/* Top Sales Executives */}
          <Box 
            bg={cardBg} 
            p={{ base: 3, md: 6 }} 
            borderRadius="xl" 
            boxShadow="md"
            overflowY="auto"
            maxH={{ base: "350px", md: "400px" }}
          >
            <Heading size={{ base: "sm", md: "md" }} mb={4}>Top Performing Sales Executives</Heading>
            <VStack spacing={3} align="stretch">
              {topSales.map((exec) => (
                <Box
                  key={exec.sales_executive_id}
                  bg={highlightBg}
                  p={3}
                  borderRadius="lg"
                  _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
                >
                  <Flex 
                    justify="space-between" 
                    align="center"
                    flexDir={{ base: "column", sm: "row" }}
                    gap={2}
                  >
                    <VStack align="start" spacing={0.5} flex={1}>
                      <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                        {exec.sales_executive_name || `Sales Executive #${exec.sales_executive_id}`}
                      </Text>
                      <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                        {exec.verified_customers} verified out of {exec.total_customers} customers
                      </Text>
                      <Text fontSize={{ base: "xs", md: "sm" }} color="green.500">
                        Revenue: ₹{exec.total_revenue.toLocaleString()}
                      </Text>
                    </VStack>
                    <CircularProgress 
                      value={(exec.verified_customers / exec.total_customers) * 100} 
                      color={accentColor} 
                      size={{ base: "40px", md: "50px" }}
                      thickness="8px"
                    >
                      <CircularProgressLabel fontSize={{ base: "xs", md: "sm" }}>
                        {Math.round((exec.verified_customers / exec.total_customers) * 100)}%
                      </CircularProgressLabel>
                    </CircularProgress>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Analytics;