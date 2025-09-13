// Types de base pour l'API Umami

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Website {
  id: string;
  name: string;
  domain: string;
  shareId: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Team {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface TeamUser {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'member';
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  websiteId: string;
  sessionId: string;
  eventName: string;
  eventData?: Record<string, unknown>;
  timestamp: string;
  url: string;
  referrer?: string;
  userAgent?: string;
  language?: string;
  country?: string;
  device?: string;
  browser?: string;
  os?: string;
}

export interface Session {
  id: string;
  websiteId: string;
  sessionId: string;
  hostname: string;
  browser: string;
  os: string;
  device: string;
  screen: string;
  language: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pageview {
  id: string;
  websiteId: string;
  sessionId: string;
  url: string;
  referrer?: string;
  timestamp: string;
}

export interface Stats {
  pageviews: number;
  visitors: number;
  sessions: number;
  bounceRate: number;
  avgDuration: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface WebsiteStats extends Stats {
  websiteId: string;
  websiteName: string;
  date: string;
}

export interface RealtimeStats {
  activeVisitors: number;
  pageviews: number;
  topPages: Array<{
    url: string;
    pageviews: number;
  }>;
  topReferrers: Array<{
    referrer: string;
    pageviews: number;
  }>;
  topCountries: Array<{
    country: string;
    visitors: number;
  }>;
}

// Types pour les requêtes API
export interface CreateWebsiteRequest {
  name: string;
  domain: string;
}

export interface UpdateWebsiteRequest {
  name?: string;
  domain?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  role?: 'admin' | 'user';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface StatsQuery {
  websiteId: string;
  startDate: string;
  endDate: string;
  timezone?: string;
  unit?: 'day' | 'month' | 'year';
}

export interface EventQuery {
  websiteId: string;
  startDate: string;
  endDate: string;
  eventName?: string;
  limit?: number;
  offset?: number;
}
