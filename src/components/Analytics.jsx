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
import { keyframes } from '@emotion/react';
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

  // Move all useColorModeValue hooks to the top
  const gridLightColor = useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)');
  const mainBgGradient = useColorModeValue(
    'linear-gradient(135deg, #f6f8ff 0%, #f0e7ff 100%)',
    'linear-gradient(135deg, #0f1729 0%, #1a1f35 100%)'
  );

  // Define animations
  const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `;

  // Modern styling
  const bgGradient = useColorModeValue(
    'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.4) 100%)',
    'linear-gradient(135deg, rgba(13,15,25,0.9) 0%, rgba(27,32,52,0.95) 100%)'
  );
  const glassEffect = {
    backgroundColor: useColorModeValue('rgba(255, 255, 255, 0.1)', 'rgba(13, 15, 25, 0.3)'),
    backdropFilter: 'blur(10px)',
    boxShadow: useColorModeValue(
      '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
    ),
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(26, 32, 44, 0.7)');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accentGradient = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
  const highlightBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(45, 55, 72, 0.8)');

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
        <Spinner size="xl" color={accentGradient.split(' ')[2]} />
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
        borderColor: accentGradient.split(' ')[2],
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
      bgGradient={mainBgGradient}
      position="relative"
      overflowY="auto"
      maxH="100vh"
      sx={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: accentGradient,
          borderRadius: '24px',
        },
      }}
    >
      {/* Fixed Header */}
      <Flex 
        justify="space-between" 
        align="center" 
        p={4}
        {...glassEffect}
        position="sticky"
        top={0}
        zIndex={10}
        backdropFilter="blur(10px)"
        animation={`${fadeIn} 0.5s ease-out`}
      >
        <IconButton
          icon={<HamburgerIcon />}
          variant="ghost"
          onClick={onMenuOpen}
          aria-label="Open menu"
          _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
        />
        <Heading 
          size={{ base: "md", md: "lg" }} 
          bgGradient={accentGradient}
          bgClip="text"
          letterSpacing="tight"
        >
          Analytics Dashboard
        </Heading>
        <Menu>
          <MenuButton>
            <Avatar 
              name={user.username} 
              size="sm" 
              bg={accentGradient}
              _hover={{ transform: 'scale(1.1)', transition: '0.2s' }}
            />
          </MenuButton>
          <MenuList {...glassEffect}>
            <MenuItem _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }} onClick={onClose}>
              Close Analytics
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* Scrollable Content */}
      <Box p={{ base: 3, md: 6 }} pb={{ base: 20, md: 6 }}>
        {/* Stats Cards */}
        <SimpleGrid 
          columns={{ base: 2, md: 4 }} 
          spacing={{ base: 3, md: 6 }} 
          mb={8}
        >
          {[
            { label: 'Total Customers', value: current.total_customers, color: accentGradient },
            { label: 'Pending', value: current.pending_customers, color: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)' },
            { label: 'Submitted', value: current.submitted_customers, color: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)' },
            { label: 'Verified', value: current.verified_customers, color: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }
          ].map((stat, index) => (
            <Box
              key={stat.label}
              {...glassEffect}
              p={{ base: 4, md: 6 }}
              borderRadius="2xl"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-5px)' }}
              animation={`${fadeIn} ${0.2 + index * 0.1}s ease-out`}
            >
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mb={2}>
                {stat.label}
              </Text>
              <Text 
                fontSize={{ base: "2xl", md: "3xl" }} 
                fontWeight="bold"
                bgGradient={stat.color}
                bgClip="text"
              >
                {stat.value}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* Charts and Tables */}
        <SimpleGrid 
          columns={{ base: 1, lg: 2 }} 
          spacing={{ base: 4, md: 6 }}
          mb={{ base: 4, md: 0 }}
        >
          {/* Trends Chart */}
          <Box 
            {...glassEffect}
            p={{ base: 4, md: 6 }} 
            borderRadius="2xl"
            h={{ base: "350px", md: "400px" }}
            animation={`${fadeIn} 0.6s ease-out`}
          >
            <Heading 
              size={{ base: "sm", md: "md" }} 
              mb={4}
              bgGradient={accentGradient}
              bgClip="text"
            >
              Customer Trends
            </Heading>
            <Box height={{ base: "280px", md: "330px" }}>
              <Line 
                data={trendsData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  scales: {
                    y: { 
                      beginAtZero: true,
                      grid: {
                        color: gridLightColor
                      }
                    },
                    x: {
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45
                      },
                      grid: {
                        color: gridLightColor
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
                        },
                        usePointStyle: true
                      }
                    }
                  }
                }} 
              />
            </Box>
          </Box>

          {/* Top Sales Executives */}
          <Box 
            {...glassEffect}
            p={{ base: 4, md: 6 }} 
            borderRadius="2xl"
            overflowY="auto"
            maxH={{ base: "350px", md: "400px" }}
            animation={`${fadeIn} 0.7s ease-out`}
            sx={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: accentGradient,
                borderRadius: '24px',
              },
            }}
          >
            <Heading 
              size={{ base: "sm", md: "md" }} 
              mb={4}
              bgGradient={accentGradient}
              bgClip="text"
            >
              Top Performing Sales Executives
            </Heading>
            <VStack spacing={4} align="stretch">
              {topSales.map((exec, index) => (
                <Box
                  key={exec.sales_executive_id}
                  {...glassEffect}
                  p={4}
                  borderRadius="xl"
                  transition="all 0.3s"
                  _hover={{ transform: 'scale(1.02)' }}
                  animation={`${fadeIn} ${0.8 + index * 0.1}s ease-out`}
                >
                  <Flex 
                    justify="space-between" 
                    align="center"
                    flexDir={{ base: "row", sm: "row" }}
                    gap={4}
                  >
                    <VStack align="start" spacing={1} flex={1}>
                      <Text 
                        fontWeight="bold" 
                        fontSize={{ base: "sm", md: "md" }}
                        bgGradient={accentGradient}
                        bgClip="text"
                      >
                        {exec.sales_executive_name || `Sales Executive #${exec.sales_executive_id}`}
                      </Text>
                      <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                        {exec.verified_customers} verified out of {exec.total_customers} customers
                      </Text>
                      <Text 
                        fontSize={{ base: "xs", md: "sm" }} 
                        bgGradient="linear(to-r, green.400, teal.400)"
                        bgClip="text"
                        fontWeight="bold"
                      >
                        Revenue: ₹{exec.total_revenue.toLocaleString()}
                      </Text>
                    </VStack>
                    <CircularProgress 
                      value={(exec.verified_customers / exec.total_customers) * 100} 
                      size={{ base: "50px", md: "60px" }}
                      thickness="8px"
                      capIsRound
                      color={accentGradient.split(' ')[2]}
                    >
                      <CircularProgressLabel 
                        fontSize={{ base: "xs", md: "sm" }}
                        fontWeight="bold"
                      >
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