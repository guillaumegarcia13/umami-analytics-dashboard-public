// Environment configuration for the application
import { env } from './env';

export const ENV_CONFIG = {
  // Whether to use mock data instead of real API calls
  USE_MOCK_DATA: env.VITE_USE_MOCK_DATA,
  
  // API configuration
  API_BASE_URL: env.VITE_UMAMI_API_URL,
  API_KEY: env.VITE_UMAMI_API_KEY,
  WEBSITE_ID: env.VITE_UMAMI_WEBSITE_ID || null,
  
  // Development mode
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const;

// Helper function to check if we should use mock data
export const shouldUseMockData = (): boolean => {
  return ENV_CONFIG.USE_MOCK_DATA;
};

// Helper function to get API configuration
export const getApiConfig = () => ({
  baseUrl: ENV_CONFIG.API_BASE_URL,
  apiKey: ENV_CONFIG.API_KEY,
  websiteId: ENV_CONFIG.WEBSITE_ID,
});

// Helper function to get website ID
export const getWebsiteId = (): string | null => {
  return ENV_CONFIG.WEBSITE_ID;
};

// Log current configuration in development
if (ENV_CONFIG.IS_DEVELOPMENT) {
  console.log('🔧 Environment Configuration:', {
    useMockData: ENV_CONFIG.USE_MOCK_DATA,
    apiBaseUrl: ENV_CONFIG.API_BASE_URL,
    hasApiKey: !!ENV_CONFIG.API_KEY,
    hasWebsiteId: !!ENV_CONFIG.WEBSITE_ID,
    websiteId: ENV_CONFIG.WEBSITE_ID || 'not set (using website selector)',
  });
}
