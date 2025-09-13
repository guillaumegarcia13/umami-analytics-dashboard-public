// Export principal de l'API Umami

// Client API
export { apiClient, ApiError } from './client';
export type { ApiConfig } from './client';

// Configuration
export { apiConfig, API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES } from './config';

// Types
export type {
  User,
  Website,
  Team,
  TeamUser,
  Event,
  Session,
  Pageview,
  Stats,
  RealtimeStats,
  ApiResponse,
  PaginatedResponse,
  DateRange,
  WebsiteStats,
  CreateWebsiteRequest,
  UpdateWebsiteRequest,
  CreateUserRequest,
  UpdateUserRequest,
  LoginRequest,
  LoginResponse,
  StatsQuery,
  EventQuery,
} from './types';

// Hooks
export {
  useAuth,
  useWebsites,
  useWebsiteStats,
  useEvents,
} from './hooks';
