// Hook pour gérer les sessions

import { useState, useEffect, useCallback } from 'react';
import { mockSessions, generateMockSessions } from '../../utils/mockData';
import { shouldUseMockData, getWebsiteId } from '../../config/environment';
import { apiClient } from '../client';
import type { Session, ApiResponse, PaginatedResponse } from '../types';
import type { ProcessingOptions, ProcessedResponse } from '../processors/types';

// Session data from API already includes visits, views, city, and lastAt
type SessionWithStats = Session;

interface UseSessionsOptions {
  websiteId: string;
  startDate: string; // Can be epoch timestamp or date string
  endDate: string;   // Can be epoch timestamp or date string
  page?: number;
  pageSize?: number;
  processingOptions?: ProcessingOptions; // Options for filtering sessions
}

interface UseSessionsState {
  sessions: SessionWithStats[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  processingStats?: ProcessedResponse<PaginatedResponse<Session>>['stats'];
}

interface UseSessionsActions {
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  setPage: (page: number) => void;
  clearError: () => void;
}

export function useSessions(options: UseSessionsOptions): UseSessionsState & UseSessionsActions {
  const [state, setState] = useState<UseSessionsState>({
    sessions: [],
    loading: false,
    error: null,
    total: 0,
    page: options.page || 1,
    pageSize: options.pageSize || 10,
    hasMore: false,
  });

  const fetchSessions = useCallback(async (page: number = state.page) => {
    if (!options.websiteId) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      if (shouldUseMockData()) {
        // Utiliser les données de test
        const mockData = page === 1 ? mockSessions : generateMockSessions(10);
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 500));

        // Convertir les données mock en SessionWithStats
        const convertedSessions: SessionWithStats[] = mockData.map(mock => ({
          id: mock.id,
          websiteId: '1', // Mock website ID
          browser: mock.browser,
          os: mock.os,
          device: mock.device,
          screen: '1920x1080', // Mock screen resolution
          language: 'en-US', // Mock language
          country: mock.country,
          city: mock.city,
          visits: mock.visits,
          views: mock.views,
          firstAt: mock.lastSeen,
          lastAt: mock.lastSeen,
          createdAt: new Date().toISOString(),
        }));

        setState(prev => ({
          ...prev,
          sessions: page === 1 ? convertedSessions : [...prev.sessions, ...convertedSessions],
          total: mockData.length * 2, // Simuler plus de données
          page,
          hasMore: page < 3, // Simuler 3 pages de données
          loading: false,
        }));
      } else {
        // Utiliser l'API réelle avec traitement des données
        const websiteId = options.websiteId || getWebsiteId() || undefined;
        
        // Use the new processing method if custom options are provided
        if (options.processingOptions) {
          const processedResponse: ProcessedResponse<PaginatedResponse<Session>> = await apiClient.getSessionsWithProcessing(
            websiteId,
            options.startDate,
            options.endDate,
            page,
            options.pageSize || 10,
            options.processingOptions
          );

          console.log('🔍 Processed Sessions Response:', processedResponse);
          console.log('📊 Processing Stats:', processedResponse.stats);
          
          const sessionsData = processedResponse.data.data || [];
          
          // Enrich sessions with properties
          console.log(`🚀 Starting processed session enrichment for ${sessionsData.length} sessions...`);
          const enrichedSessions: SessionWithStats[] = await apiClient.enrichSessionsWithProperties(
            sessionsData,
            websiteId
          );
          console.log(`✨ Processed enriched sessions result:`, enrichedSessions.map(s => ({ 
            id: s.id, 
            browser: s.browser, 
            isPWA: s.properties?.isPWA 
          })));

          setState(prev => ({
            ...prev,
            sessions: page === 1 ? enrichedSessions : [...prev.sessions, ...enrichedSessions],
            total: processedResponse.data.count || sessionsData.length,
            page,
            hasMore: page * (options.pageSize || 10) < (processedResponse.data.count || 0),
            processingStats: processedResponse.stats,
            loading: false,
          }));
        } else {
          // Use the standard method with default processing
          const response: ApiResponse<PaginatedResponse<Session>> = await apiClient.getSessions(
            websiteId,
            options.startDate,
            options.endDate,
            page,
            options.pageSize || 10
          );

          if (response.data) {
            console.log('🔍 Sessions API Response:', response.data);
            
            // Handle real sessions data
            const sessionsData = response.data.data || [];
            
            // Enrich sessions with properties
            console.log(`🚀 Starting session enrichment for ${sessionsData.length} sessions...`);
            const enrichedSessions: SessionWithStats[] = await apiClient.enrichSessionsWithProperties(
              sessionsData,
              websiteId
            );
            console.log(`✨ Enriched sessions result:`, enrichedSessions.map(s => ({ 
              id: s.id, 
              browser: s.browser, 
              isPWA: s.properties?.isPWA 
            })));

            setState(prev => ({
              ...prev,
              sessions: page === 1 ? enrichedSessions : [...prev.sessions, ...enrichedSessions],
              total: response.data.count || sessionsData.length,
              page,
              hasMore: page * (options.pageSize || 10) < (response.data.count || 0),
              loading: false,
            }));
          } else {
            setState(prev => ({
              ...prev,
              error: 'Erreur lors du chargement des sessions',
              loading: false,
            }));
          }
        }
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        loading: false,
      }));
    }
  }, [options.websiteId, options.startDate, options.endDate, options.pageSize, options.processingOptions, state.page]);

  const refetch = useCallback(async () => {
    await fetchSessions(1);
  }, [fetchSessions]);

  const loadMore = useCallback(async () => {
    if (state.hasMore && !state.loading) {
      await fetchSessions(state.page + 1);
    }
  }, [fetchSessions, state.hasMore, state.loading, state.page]);

  const setPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, page }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    ...state,
    refetch,
    loadMore,
    setPage,
    clearError,
  };
}

