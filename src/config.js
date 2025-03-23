// Get the current hostname
const hostname = window.location.hostname;

// Determine the API URL based on the hostname
export const API_URL = hostname === 'localhost' 
  ? 'http://localhost:3000'
  : `http://${hostname}:3000`;

// Export other configuration values
export const config = {
  API_URL,
  FRONTEND_URL: window.location.origin,
}; 