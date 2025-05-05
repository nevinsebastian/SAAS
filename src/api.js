import axios from 'axios';
import { API_URL } from './config';

const api = axios.create({
  baseURL: 'https://13.201.192.142:3443', // Explicitly set the backend URL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Don't add authorization header for login request
    if (!config.url.includes('/auth/login')) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
        // Only redirect and show message if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          // Clear auth data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete api.defaults.headers.common['Authorization'];
          window.location.href = '/login';
          return Promise.reject(new Error('Session expired. Please login again.'));
        }
      }
      
      // Handle 403 Forbidden
      if (error.response.status === 403) {
        return Promise.reject(new Error('You do not have permission to access this resource.'));
      }
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authApi = {
  login: async (email, password) => {
    try {
      console.log('Attempting login with:', { email }); // Log login attempt
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data); // Log successful response
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Set default authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      console.error('Login Error Details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Remove authorization header
      delete api.defaults.headers.common['Authorization'];
      // Call logout endpoint if needed
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout Error:', error.response?.data || error.message);
      // Even if the API call fails, we still want to clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
    }
  },
};

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
  updateCustomerStatus: async (customerId, status) => {
    try {
      const response = await api.put(`/rto/customers/${customerId}/status`, { status });
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

// Customer API endpoints
export const customerApi = {
  // Create a new customer
  createCustomer: async (customerData) => {
    try {
      const response = await api.post('/customers', customerData);
      return response.data;
    } catch (error) {
      console.error('Create Customer Error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get all customers
  getCustomers: async () => {
    try {
      const response = await api.get('/customers');
      return response.data;
    } catch (error) {
      console.error('Get Customers Error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get Customer Error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      console.error('Update Customer Error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete Customer Error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get customer image
  getCustomerImage: async (id, imageType) => {
    try {
      const response = await api.get(`/customers/${id}/${imageType}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Get Customer Image Error (${imageType}):`, error.response?.data || error.message);
      throw error;
    }
  },

  // Update customer payment
  updateCustomerPayment: async (id, amount) => {
    try {
      const response = await api.put(`/customers/${id}/payments`, { amount });
      return response.data;
    } catch (error) {
      console.error('Update Customer Payment Error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Verify customer
  verifyCustomer: async (id) => {
    try {
      const response = await api.put(`/customers/${id}/verify`);
      return response.data;
    } catch (error) {
      console.error('Verify Customer Error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Mark customer as delivered
  markCustomerAsDelivered: async (id, deliveryPhotos) => {
    try {
      const formData = new FormData();
      Object.entries(deliveryPhotos).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      const response = await api.put(`/customers/${id}/delivered`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Mark Customer as Delivered Error:', error.response?.data || error.message);
      throw error;
    }
  },
};

// Analytics API endpoints
export const analyticsApi = {
  // Get analytics data
  getAnalytics: async () => {
    try {
      const response = await api.get('/analytics');
      return response.data;
    } catch (error) {
      console.error('Get Analytics Error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get admin analytics
  getAdminAnalytics: async () => {
    try {
      const response = await api.get('/admin/analytics');
      return response.data;
    } catch (error) {
      console.error('Get Admin Analytics Error:', error.response?.data || error.message);
      throw error;
    }
  },
};

// Notification API endpoints
export const notificationApi = {
  // Get notifications for an employee
  getEmployeeNotifications: async (employeeId) => {
    try {
      const response = await api.get(`/notifications/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Get Employee Notifications Error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark Notification as Read Error:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default api;