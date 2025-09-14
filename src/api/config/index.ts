// Configuration de l'API Umami

export interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  websiteId?: string;
  timeout: number;
  retries: number;
}

const defaultConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_UMAMI_API_URL || 'http://localhost:3000/api',
  apiKey: import.meta.env.VITE_UMAMI_API_KEY,
  websiteId: import.meta.env.VITE_UMAMI_WEBSITE_ID,
  timeout: 10000, // 10 secondes
  retries: 3,
};

export const apiConfig = defaultConfig;

// Endpoints de l'API
export const API_ENDPOINTS = {
  // Authentification
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  
  // Utilisateurs
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  
  // Sites web
  WEBSITES: {
    LIST: '/websites',
    CREATE: '/websites',
    GET: (id: string) => `/websites/${id}`,
    UPDATE: (id: string) => `/websites/${id}`,
    DELETE: (id: string) => `/websites/${id}`,
    STATS: (id: string) => `/websites/${id}/stats`,
    REALTIME: (id: string) => `/websites/${id}/realtime`,
  },
  
  // Équipes
  TEAMS: {
    LIST: '/teams',
    CREATE: '/teams',
    GET: (id: string) => `/teams/${id}`,
    UPDATE: (id: string) => `/teams/${id}`,
    DELETE: (id: string) => `/teams/${id}`,
    USERS: (id: string) => `/teams/${id}/users`,
    ADD_USER: (id: string) => `/teams/${id}/users`,
    REMOVE_USER: (teamId: string, userId: string) => `/teams/${teamId}/users/${userId}`,
  },
  
  // Événements
  EVENTS: {
    LIST: '/events',
    CREATE: '/events',
    GET: (id: string) => `/events/${id}`,
    STATS: '/events/stats',
  },
  
  // Sessions
  SESSIONS: {
    LIST: '/sessions',
    GET: (id: string) => `/sessions/${id}`,
    STATS: '/sessions/stats',
  },
  
  // Statistiques
  STATS: {
    OVERVIEW: '/stats/overview',
    WEBSITE: (id: string) => `/stats/website/${id}`,
    REALTIME: '/stats/realtime',
  },
} as const;

// Codes de statut HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Messages d'erreur par défaut
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion réseau',
  TIMEOUT: 'La requête a expiré',
  UNAUTHORIZED: 'Non autorisé',
  FORBIDDEN: 'Accès refusé',
  NOT_FOUND: 'Ressource non trouvée',
  SERVER_ERROR: 'Erreur serveur',
  UNKNOWN_ERROR: 'Erreur inconnue',
} as const;
