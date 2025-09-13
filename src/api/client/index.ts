// Client API principal pour Umami

import { apiConfig, API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES } from '../config';
import type { 
  ApiResponse, 
  PaginatedResponse, 
  User, 
  Website, 
  Team, 
  Event, 
  Session, 
  Stats, 
  RealtimeStats,
  CreateWebsiteRequest,
  UpdateWebsiteRequest,
  CreateUserRequest,
  UpdateUserRequest,
  LoginRequest,
  LoginResponse,
  StatsQuery,
  EventQuery
} from '../types';

class ApiError extends Error {
  public status: number;
  public response?: unknown;

  constructor(message: string, status: number, response?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

class UmamiApiClient {
  private baseUrl: string;
  private apiKey?: string;
  private timeout: number;
  private retries: number;

  constructor(config = apiConfig) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.timeout = config.timeout;
    this.retries = config.retries;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.apiKey) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            errorData.message || this.getErrorMessage(response.status),
            response.status,
            errorData
          );
        }

        const data = await response.json();
        return {
          data,
          status: response.status,
        };
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < this.retries && this.isRetryableError(error as Error)) {
          // Attendre avant de réessayer (backoff exponentiel)
          await this.delay(Math.pow(2, attempt) * 1000);
          continue;
        }
        
        throw error;
      }
    }

    throw lastError || new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
  }

  private isRetryableError(error: Error): boolean {
    if (error instanceof ApiError) {
      return error.status >= 500 || error.status === 429;
    }
    return error.name === 'TypeError' || error.name === 'AbortError';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getErrorMessage(status: number): string {
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case HTTP_STATUS.FORBIDDEN:
        return ERROR_MESSAGES.FORBIDDEN;
      case HTTP_STATUS.NOT_FOUND:
        return ERROR_MESSAGES.NOT_FOUND;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }

  // Méthodes d'authentification
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.AUTH.ME);
  }

  // Méthodes pour les utilisateurs
  async getUsers(): Promise<ApiResponse<PaginatedResponse<User>>> {
    return this.request<PaginatedResponse<User>>(API_ENDPOINTS.USERS.LIST);
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.USERS.CREATE, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.USERS.GET(id));
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.USERS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(API_ENDPOINTS.USERS.DELETE(id), {
      method: 'DELETE',
    });
  }

  // Méthodes pour les sites web
  async getWebsites(): Promise<ApiResponse<PaginatedResponse<Website>>> {
    return this.request<PaginatedResponse<Website>>(API_ENDPOINTS.WEBSITES.LIST);
  }

  async createWebsite(websiteData: CreateWebsiteRequest): Promise<ApiResponse<Website>> {
    return this.request<Website>(API_ENDPOINTS.WEBSITES.CREATE, {
      method: 'POST',
      body: JSON.stringify(websiteData),
    });
  }

  async getWebsite(id: string): Promise<ApiResponse<Website>> {
    return this.request<Website>(API_ENDPOINTS.WEBSITES.GET(id));
  }

  async updateWebsite(id: string, websiteData: UpdateWebsiteRequest): Promise<ApiResponse<Website>> {
    return this.request<Website>(API_ENDPOINTS.WEBSITES.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(websiteData),
    });
  }

  async deleteWebsite(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(API_ENDPOINTS.WEBSITES.DELETE(id), {
      method: 'DELETE',
    });
  }

  async getWebsiteStats(id: string, query: StatsQuery): Promise<ApiResponse<Stats>> {
    const params = new URLSearchParams({
      startDate: query.startDate,
      endDate: query.endDate,
      ...(query.timezone && { timezone: query.timezone }),
      ...(query.unit && { unit: query.unit }),
    });
    
    return this.request<Stats>(`${API_ENDPOINTS.WEBSITES.STATS(id)}?${params}`);
  }

  async getWebsiteRealtime(id: string): Promise<ApiResponse<RealtimeStats>> {
    return this.request<RealtimeStats>(API_ENDPOINTS.WEBSITES.REALTIME(id));
  }

  // Méthodes pour les équipes
  async getTeams(): Promise<ApiResponse<PaginatedResponse<Team>>> {
    return this.request<PaginatedResponse<Team>>(API_ENDPOINTS.TEAMS.LIST);
  }

  async createTeam(name: string): Promise<ApiResponse<Team>> {
    return this.request<Team>(API_ENDPOINTS.TEAMS.CREATE, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async getTeam(id: string): Promise<ApiResponse<Team>> {
    return this.request<Team>(API_ENDPOINTS.TEAMS.GET(id));
  }

  async updateTeam(id: string, name: string): Promise<ApiResponse<Team>> {
    return this.request<Team>(API_ENDPOINTS.TEAMS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async deleteTeam(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(API_ENDPOINTS.TEAMS.DELETE(id), {
      method: 'DELETE',
    });
  }

  // Méthodes pour les événements
  async getEvents(query: EventQuery): Promise<ApiResponse<PaginatedResponse<Event>>> {
    const params = new URLSearchParams({
      websiteId: query.websiteId,
      startDate: query.startDate,
      endDate: query.endDate,
      ...(query.eventName && { eventName: query.eventName }),
      ...(query.limit && { limit: query.limit.toString() }),
      ...(query.offset && { offset: query.offset.toString() }),
    });
    
    return this.request<PaginatedResponse<Event>>(`${API_ENDPOINTS.EVENTS.LIST}?${params}`);
  }

  async createEvent(eventData: Partial<Event>): Promise<ApiResponse<Event>> {
    return this.request<Event>(API_ENDPOINTS.EVENTS.CREATE, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async getEvent(id: string): Promise<ApiResponse<Event>> {
    return this.request<Event>(API_ENDPOINTS.EVENTS.GET(id));
  }

  // Méthodes pour les sessions
  async getSessions(websiteId: string, startDate: string, endDate: string): Promise<ApiResponse<PaginatedResponse<Session>>> {
    const params = new URLSearchParams({
      websiteId,
      startDate,
      endDate,
    });
    
    return this.request<PaginatedResponse<Session>>(`${API_ENDPOINTS.SESSIONS.LIST}?${params}`);
  }

  async getSession(id: string): Promise<ApiResponse<Session>> {
    return this.request<Session>(API_ENDPOINTS.SESSIONS.GET(id));
  }

  // Méthodes pour les statistiques
  async getOverviewStats(): Promise<ApiResponse<Stats>> {
    return this.request<Stats>(API_ENDPOINTS.STATS.OVERVIEW);
  }

  async getWebsiteStatsOverview(id: string, query: StatsQuery): Promise<ApiResponse<Stats>> {
    const params = new URLSearchParams({
      startDate: query.startDate,
      endDate: query.endDate,
      ...(query.timezone && { timezone: query.timezone }),
      ...(query.unit && { unit: query.unit }),
    });
    
    return this.request<Stats>(`${API_ENDPOINTS.STATS.WEBSITE(id)}?${params}`);
  }

  async getRealtimeStats(): Promise<ApiResponse<RealtimeStats>> {
    return this.request<RealtimeStats>(API_ENDPOINTS.STATS.REALTIME);
  }
}

// Instance singleton du client API
export const apiClient = new UmamiApiClient();

// Export des types et classes
export { ApiError, UmamiApiClient };
export type { UmamiApiConfig as ApiConfig };

// Définir le type UmamiApiConfig
export interface UmamiApiConfig {
  baseUrl: string;
  apiKey?: string;
  timeout: number;
  retries: number;
}
