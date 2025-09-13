// Hook pour gérer les sessions

import { useState, useEffect, useCallback } from 'react';
import { mockSessions, generateMockSessions } from '../../utils/mockData';
import type { Session } from '../types';

interface SessionWithStats extends Session {
  visits: number;
  views: number;
  city?: string;
  lastSeen: string;
}

interface UseSessionsOptions {
  websiteId: string;
  startDate: string;
  endDate: string;
  page?: number;
  pageSize?: number;
}

interface UseSessionsState {
  sessions: SessionWithStats[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
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
      // Utiliser les données de test pour la démonstration
      const mockData = page === 1 ? mockSessions : generateMockSessions(10);
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 500));

      // Convertir les données mock en SessionWithStats
      const convertedSessions: SessionWithStats[] = mockData.map(mock => ({
        id: mock.id,
        sessionId: mock.sessionId,
        websiteId: '1', // Mock website ID
        hostname: 'example.com', // Mock hostname
        browser: mock.browser,
        os: mock.os,
        device: mock.device,
        screen: '1920x1080', // Mock screen resolution
        language: 'en-US', // Mock language
        country: mock.country,
        city: mock.city,
        visits: mock.visits,
        views: mock.views,
        lastSeen: mock.lastSeen,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      setState(prev => ({
        ...prev,
        sessions: page === 1 ? convertedSessions : [...prev.sessions, ...convertedSessions],
        total: mockData.length * 2, // Simuler plus de données
        page,
        hasMore: page < 3, // Simuler 3 pages de données
        loading: false,
      }));

      // Code pour l'API réelle (commenté pour la démonstration)
      /*
      const response: ApiResponse<PaginatedResponse<Session>> = await apiClient.getSessions(
        options.websiteId,
        options.startDate,
        options.endDate
      );

      if (response.success && response.data) {
        const enrichedSessions: SessionWithStats[] = response.data.data.map(session => ({
          ...session,
          visits: Math.floor(Math.random() * 5) + 1,
          views: Math.floor(Math.random() * 50) + 1,
          city: getRandomCity(session.country),
          lastSeen: new Date().toISOString(),
        }));

        setState(prev => ({
          ...prev,
          sessions: page === 1 ? enrichedSessions : [...prev.sessions, ...enrichedSessions],
          total: response.data.total,
          page,
          hasMore: response.data.hasMore,
          loading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: response.error || 'Erreur lors du chargement des sessions',
          loading: false,
        }));
      }
      */
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        loading: false,
      }));
    }
  }, [options.websiteId, state.page]);

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

