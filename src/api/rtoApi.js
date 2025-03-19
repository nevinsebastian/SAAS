import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const rtoApi = {
  // Get all customers
  getCustomers: async () => {
    try {
      console.log('Fetching customers from:', `${API_URL}/rto/customers`);
      const response = await api.get('/rto/customers');
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response || error);
      throw error;
    }
  }
}; 