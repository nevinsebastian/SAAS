import axios from 'axios';
import { API_URL } from '../config';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const rtoApi = {
  // Get pending customers
  getPendingCustomers: async () => {
    try {
      console.log('Fetching pending customers from:', `${API_URL}/rto/customers/pending`);
      const response = await api.get('/rto/customers/pending');
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response || error);
      throw error;
    }
  },

  // Get verified customers
  getVerifiedCustomers: async () => {
    try {
      console.log('Fetching verified customers from:', `${API_URL}/rto/customers/verified`);
      const response = await api.get('/rto/customers/verified');
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response || error);
      throw error;
    }
  },

  // Get customer by chassis number
  getCustomerByChassis: async (chassisNumber) => {
    try {
      const response = await api.get(`/rto/customers/chassis/${chassisNumber}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response || error);
      throw error;
    }
  },

  // Update customer status
  updateCustomerStatus: async (customerId, status) => {
    try {
      const response = await api.put(`/rto/customers/${customerId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response || error);
      throw error;
    }
  },

  // Get chassis image
  getChassisImage: async (customerId) => {
    try {
      const response = await api.get(`/rto/customers/${customerId}/chassis-image`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response || error);
      throw error;
    }
  }
}; 