// Main response processor for filtering and cleaning API responses

import type { Session, PaginatedResponse, ApiResponse } from '../types';
import type { ProcessingOptions, ProcessingStats, ProcessedResponse } from './types';
import { shouldFilterSession, processSessionData } from './sessionFilter';

/**
 * Process sessions array to filter out irrelevant records
 */
export function processSessionsResponse(
  response: ApiResponse<PaginatedResponse<Session>>,
  options: ProcessingOptions = {}
): ProcessedResponse<PaginatedResponse<Session>> {
  const startTime = performance.now();
  
  const {
    minSessionDuration = 1,
    logFilteredRecords = false,
    logProcessingStats = true,
  } = options;
  
  const originalSessions = response.data.data || [];
  const originalCount = originalSessions.length;
  
  const stats: ProcessingStats = {
    totalRecords: originalCount,
    filteredRecords: 0,
    validRecords: 0,
    botRecords: 0,
    shortSessionRecords: 0,
    invalidRecords: 0,
    processingTimeMs: 0,
  };
  
  const filteredSessions: Session[] = [];
  const filteredReasons: string[] = [];
  
  // Process each session
  for (const session of originalSessions) {
    const processedData = processSessionData(session);
    const filterResult = shouldFilterSession(session, options);
    
    if (filterResult.filter) {
      stats.filteredRecords++;
      filteredReasons.push(`${session.id}: ${filterResult.reason}`);
      
      // Categorize the filtered record
      if (!processedData.isValid) {
        stats.invalidRecords++;
      } else if (processedData.duration <= minSessionDuration) {
        stats.shortSessionRecords++;
      } else if (processedData.isBot) {
        stats.botRecords++;
      }
    } else {
      filteredSessions.push(session);
      stats.validRecords++;
    }
  }
  
  const endTime = performance.now();
  stats.processingTimeMs = endTime - startTime;
  
  // Log processing results
  if (logProcessingStats) {
    console.log('🔍 Session Processing Stats:', {
      original: originalCount,
      filtered: stats.filteredRecords,
      valid: stats.validRecords,
      bots: stats.botRecords,
      shortSessions: stats.shortSessionRecords,
      invalid: stats.invalidRecords,
      processingTime: `${stats.processingTimeMs.toFixed(2)}ms`,
    });
  }
  
  if (logFilteredRecords && filteredReasons.length > 0) {
    console.log('🚫 Filtered Sessions:', filteredReasons.slice(0, 10)); // Log first 10
    if (filteredReasons.length > 10) {
      console.log(`... and ${filteredReasons.length - 10} more`);
    }
  }
  
  // Create processed response
  const processedResponse: ProcessedResponse<PaginatedResponse<Session>> = {
    data: {
      ...response.data,
      data: filteredSessions,
      count: filteredSessions.length,
    },
    stats,
    originalCount,
    filteredCount: stats.filteredRecords,
  };
  
  return processedResponse;
}

/**
 * Process a single session
 */
export function processSingleSession(
  session: Session,
  options: ProcessingOptions = {}
): { session: Session | null; shouldInclude: boolean; reason?: string } {
  const filterResult = shouldFilterSession(session, options);
  
  return {
    session: filterResult.filter ? null : session,
    shouldInclude: !filterResult.filter,
    reason: filterResult.reason,
  };
}

/**
 * Process any API response that contains sessions
 */
export function processApiResponse<T extends PaginatedResponse<Session>>(
  response: ApiResponse<T>,
  options: ProcessingOptions = {}
): ProcessedResponse<T> {
  const startTime = performance.now();
  
  const originalSessions = response.data.data || [];
  const originalCount = originalSessions.length;
  
  const stats: ProcessingStats = {
    totalRecords: originalCount,
    filteredRecords: 0,
    validRecords: 0,
    botRecords: 0,
    shortSessionRecords: 0,
    invalidRecords: 0,
    processingTimeMs: 0,
  };
  
  const filteredSessions: Session[] = [];
  
  // Process each session
  for (const session of originalSessions) {
    const filterResult = shouldFilterSession(session, options);
    
    if (filterResult.filter) {
      stats.filteredRecords++;
      
      const processedData = processSessionData(session);
      if (!processedData.isValid) {
        stats.invalidRecords++;
      } else if (processedData.duration <= (options.minSessionDuration || 1)) {
        stats.shortSessionRecords++;
      } else if (processedData.isBot) {
        stats.botRecords++;
      }
    } else {
      filteredSessions.push(session);
      stats.validRecords++;
    }
  }
  
  const endTime = performance.now();
  stats.processingTimeMs = endTime - startTime;
  
  // Create processed response
  const processedResponse: ProcessedResponse<T> = {
    data: {
      ...response.data,
      data: filteredSessions as T['data'],
      count: filteredSessions.length,
    } as T,
    stats,
    originalCount,
    filteredCount: stats.filteredRecords,
  };
  
  return processedResponse;
}

/**
 * Get processing statistics summary
 */
export function getProcessingSummary(stats: ProcessingStats): string {
  const filterRate = stats.totalRecords > 0 ? (stats.filteredRecords / stats.totalRecords * 100).toFixed(1) : '0';
  
  return `Processed ${stats.totalRecords} records: ${stats.validRecords} valid, ${stats.filteredRecords} filtered (${filterRate}% filter rate) in ${stats.processingTimeMs.toFixed(2)}ms`;
}
