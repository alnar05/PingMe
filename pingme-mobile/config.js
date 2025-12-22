// API Configuration for PingMe Backend

// IMPORTANT: For Android Emulator, use your computer's IP address instead of localhost
// To find your IP: 
// - Windows: ipconfig (look for IPv4)
// - Mac/Linux: ifconfig or ip addr (look for inet)
// Example: 'http://192.168.1.100:8080'

export const API_BASE_URL = 'http://10.0.2.2:8080'; // 10.0.2.2 is Android emulator's alias for localhost
export const WS_BASE_URL = 'ws://10.0.2.2:8080'; // WebSocket URL

// If testing on a physical device, replace with your actual IP:
// export const API_BASE_URL = 'http://192.168.1.XXX:8080';
// export const WS_BASE_URL = 'ws://192.168.1.XXX:8080';

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  CHATS: `${API_BASE_URL}/api/chats`,
  MESSAGES: `${API_BASE_URL}/api/messages`,
  USERS: `${API_BASE_URL}/api/users`,
  PROFILE: `${API_BASE_URL}/api/profile`,
};

// WebSocket endpoint
export const WS_ENDPOINT = `${WS_BASE_URL}/ws`;

// Keycloak Configuration (adjust based on your setup)
export const KEYCLOAK_CONFIG = {
  url: API_BASE_URL,
  realm: 'pingme', // Update with your realm name
  clientId: 'pingme-app', // Update with your client ID
};