// services/config.ts
// Configuration for connecting to Spring Boot backend

// Determine if we are in development mode
export const isDevelopment = import.meta.env.MODE === "development";

// Backend API URL Configuration
// In development: http://localhost:8080 (Spring Boot default)
// In production: Update this to your deployed backend URL
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Choose the base URL depending on MODE
export const apiBaseUrl: string = isDevelopment
  ? BACKEND_URL
  : import.meta.env.VITE_PROD_API_URL || "https://your-production-api.com"; // Update for production

// Helper for building endpoints
export const api = {
  baseUrl: apiBaseUrl,
  endpoint(path: string): string {
    // Ensure no double slashes and proper URL formation
    const cleanBase = apiBaseUrl.replace(/\/$/, "");
    const cleanPath = path.replace(/^\//, "");
    return `${cleanBase}/${cleanPath}`;
  },
};

// Common headers for API requests
export const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Configuration validation
if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    mode: import.meta.env.MODE,
    apiBaseUrl,
    backendUrl: BACKEND_URL
  });

  // Test backend connection on app start
  fetch(api.endpoint('api/v1/projects'))
    .then(() => console.log('✅ Backend connection successful'))
    .catch(() => console.warn('⚠️ Backend not responding. Make sure Spring Boot is running on port 8080'));
}

// Export environment variables for use in services
export const config = {
  api: {
    baseUrl: apiBaseUrl,
    timeout: 30000, // 30 seconds
  },
  defaults: {
    pageSize: 10,
    currency: 'AUD', // Australian Dollar for University of Melbourne
  },
  features: {
    caching: false, // Disabled by default
    retryOnError: false, // Disabled by default
  }
};
