// Environment configuration with TypeScript support
// This provides type safety and better IDE support for environment variables

export interface EnvironmentConfig {
  VITE_UMAMI_API_URL: string;
  VITE_UMAMI_API_KEY: string;
  VITE_UMAMI_WEBSITE_ID: string;
  VITE_USE_MOCK_DATA: boolean;
}

// Validate that all required environment variables are present
function validateEnv(): EnvironmentConfig {
  const requiredVars = [
    'VITE_UMAMI_API_URL',
    'VITE_UMAMI_API_KEY', 
    'VITE_UMAMI_WEBSITE_ID'
  ] as const;

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file or environment configuration.'
    );
  }

  return {
    VITE_UMAMI_API_URL: import.meta.env.VITE_UMAMI_API_URL,
    VITE_UMAMI_API_KEY: import.meta.env.VITE_UMAMI_API_KEY,
    VITE_UMAMI_WEBSITE_ID: import.meta.env.VITE_UMAMI_WEBSITE_ID,
    VITE_USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  };
}

// Export validated environment configuration
export const env = validateEnv();

// Helper functions for common environment checks
export const isMockMode = () => env.VITE_USE_MOCK_DATA;
export const getApiUrl = () => env.VITE_UMAMI_API_URL;
export const getApiKey = () => env.VITE_UMAMI_API_KEY;
export const getWebsiteId = () => env.VITE_UMAMI_WEBSITE_ID;

// Log configuration in development (without sensitive data)
if (import.meta.env.DEV) {
  console.log('🔧 Environment Configuration:', {
    apiUrl: env.VITE_UMAMI_API_URL,
    hasApiKey: !!env.VITE_UMAMI_API_KEY,
    apiKeyLength: env.VITE_UMAMI_API_KEY?.length || 0,
    apiKeyPrefix: env.VITE_UMAMI_API_KEY?.substring(0, 10) || 'none',
    websiteId: env.VITE_UMAMI_WEBSITE_ID,
    useMockData: env.VITE_USE_MOCK_DATA,
  });
  
  console.log('🔍 Raw Environment Variables:');
  console.log('  VITE_UMAMI_API_URL:', import.meta.env.VITE_UMAMI_API_URL);
  console.log('  VITE_UMAMI_API_KEY:', import.meta.env.VITE_UMAMI_API_KEY ? '***' : 'undefined');
  console.log('  VITE_UMAMI_WEBSITE_ID:', import.meta.env.VITE_UMAMI_WEBSITE_ID);
  console.log('  VITE_USE_MOCK_DATA:', import.meta.env.VITE_USE_MOCK_DATA);
}
