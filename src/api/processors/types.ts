// Types for response processing

export interface ProcessingOptions {
  // Session filtering options
  minSessionDuration?: number; // in seconds, default 1
  filterBots?: boolean; // default true
  filterCrawlers?: boolean; // default true
  
  // Data validation options
  validateRequiredFields?: boolean; // default true
  sanitizeData?: boolean; // default true
  
  // Logging options
  logFilteredRecords?: boolean; // default false
  logProcessingStats?: boolean; // default true
}

export interface ProcessingStats {
  totalRecords: number;
  filteredRecords: number;
  validRecords: number;
  botRecords: number;
  shortSessionRecords: number;
  invalidRecords: number;
  processingTimeMs: number;
}

export interface ProcessedResponse<T> {
  data: T;
  stats: ProcessingStats;
  originalCount: number;
  filteredCount: number;
}

export interface SessionProcessingData {
  id: string;
  duration: number; // calculated from firstAt and lastAt
  userAgent?: string;
  browser?: string;
  os?: string;
  country?: string;
  visits: number;
  views: number;
  isBot: boolean;
  isCrawler: boolean;
  isValid: boolean;
}
