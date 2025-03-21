import api from '../api';

// RTO API endpoints
export const rtoApi = {
  // Get pending customers (verified by sales and accounts but not by RTO)
  getPendingCustomers: async () => {
    try {
      console.log('Fetching pending customers...');
      const response = await api.get('/rto/customers/pending');
      console.log('Pending customers response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending customers:', error);
      throw error;
    }
  },

  // Get verified customers (verified by sales, accounts, and RTO)
  getVerifiedCustomers: async () => {
    try {
      console.log('Fetching verified customers...');
      const response = await api.get('/rto/customers/verified');
      console.log('Verified customers response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching verified customers:', error);
      throw error;
    }
  },
  
  // Get customer by chassis number
  getCustomerByChassis: async (chassisNumber) => {
    try {
      const response = await api.get(`/rto/customers/chassis/${chassisNumber}`);
      console.log('RTO Chassis Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('RTO Chassis Error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Update customer status
  updateCustomerStatus: async (customerId) => {
    try {
      const response = await api.put(`/rto/customers/${customerId}/status`, {});
      console.log('RTO Status Update Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('RTO Status Update Error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get chassis image
  getChassisImage: async (customerId) => {
    try {
      const response = await api.get(`/rto/customers/${customerId}/chassis-image`);
      console.log('RTO Chassis Image Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('RTO Chassis Image Error:', error.response?.data || error.message);
      throw error;
    }
  },
}; 