import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.20.10.8:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.url, config.method); // Debug log
    return config;
  },
  (error) => {
    console.error('Request Error:', error); // Debug log
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status); // Debug log
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.data || error.message); // Debug log
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
      
      // Handle 403 Forbidden
      if (error.response.status === 403) {
        return Promise.reject(new Error('You do not have permission to access this resource.'));
      }
    }
    return Promise.reject(error);
  }
);

// RTO API endpoints
export const rtoApi = {
  // Get all customers
  getCustomers: async () => {
    try {
      const response = await api.get('/rto/customers');
      console.log('RTO Customers Response:', response.data); // Debug log
      return response;
    } catch (error) {
      console.error('RTO Customers Error:', error.response?.data || error.message); // Debug log
      throw error;
    }
  },
  
  // Get customer by chassis number
  getCustomerByChassis: async (chassisNumber) => {
    try {
      const response = await api.get(`/rto/customers/chassis/${chassisNumber}`);
      console.log('RTO Chassis Response:', response.data); // Debug log
      return response;
    } catch (error) {
      console.error('RTO Chassis Error:', error.response?.data || error.message); // Debug log
      throw error;
    }
  },
  
  // Update customer status
  updateCustomerStatus: async (customerId, status) => {
    try {
      const response = await api.put(`/rto/customers/${customerId}/status`, { status });
      console.log('RTO Status Update Response:', response.data); // Debug log
      return response;
    } catch (error) {
      console.error('RTO Status Update Error:', error.response?.data || error.message); // Debug log
      throw error;
    }
  },
  
  // Get chassis image
  getChassisImage: async (customerId) => {
    try {
      const response = await api.get(`/rto/customers/${customerId}/chassis-image`);
      console.log('RTO Chassis Image Response:', response.data); // Debug log
      return response;
    } catch (error) {
      console.error('RTO Chassis Image Error:', error.response?.data || error.message); // Debug log
      throw error;
    }
  },
};

export default api;