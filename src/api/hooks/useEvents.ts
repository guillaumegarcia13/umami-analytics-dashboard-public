// Hook pour la gestion des événements

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../client';
import type { Event, EventQuery } from '../types';

interface EventsState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
}

export function useEvents(query: EventQuery) {
  const [state, setState] = useState<EventsState>({
    events: [],
    isLoading: false,
    error: null,
    total: 0,
    hasMore: false,
  });

  const fetchEvents = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiClient.getEvents(query);
      setState(prev => ({
        ...prev,
        events: response.data.data,
        total: response.data.count,
        hasMore: false,
        isLoading: false,
      }));
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des événements',
      }));
    }
  }, [query]);

  const createEvent = useCallback(async (eventData: Partial<Event>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiClient.createEvent(eventData);
      setState(prev => ({
        ...prev,
        events: [response.data, ...prev.events],
        isLoading: false,
      }));
      return response.data;
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la création de l\'événement',
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Charger les événements quand la query change
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    ...state,
    fetchEvents,
    createEvent,
    clearError,
  };
}
