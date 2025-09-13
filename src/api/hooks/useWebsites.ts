// Hook pour la gestion des sites web

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../client';
import type { 
  Website, 
  CreateWebsiteRequest, 
  UpdateWebsiteRequest, 
  Stats, 
  RealtimeStats,
  StatsQuery 
} from '../types';

interface WebsitesState {
  websites: Website[];
  isLoading: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
}

interface WebsiteStatsState {
  stats: Stats | null;
  realtimeStats: RealtimeStats | null;
  isLoading: boolean;
  error: string | null;
}

export function useWebsites() {
  const [state, setState] = useState<WebsitesState>({
    websites: [],
    isLoading: false,
    error: null,
    total: 0,
    hasMore: false,
  });

  const fetchWebsites = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiClient.getWebsites();
      setState(prev => ({
        ...prev,
        websites: response.data.data,
        total: response.data.total,
        hasMore: response.data.hasMore,
        isLoading: false,
      }));
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des sites',
      }));
    }
  }, []);

  const createWebsite = useCallback(async (websiteData: CreateWebsiteRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiClient.createWebsite(websiteData);
      setState(prev => ({
        ...prev,
        websites: [...prev.websites, response.data],
        isLoading: false,
      }));
      return response.data;
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la création du site',
      }));
      throw error;
    }
  }, []);

  const updateWebsite = useCallback(async (id: string, websiteData: UpdateWebsiteRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiClient.updateWebsite(id, websiteData);
      setState(prev => ({
        ...prev,
        websites: prev.websites.map(website => 
          website.id === id ? response.data : website
        ),
        isLoading: false,
      }));
      return response.data;
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du site',
      }));
      throw error;
    }
  }, []);

  const deleteWebsite = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await apiClient.deleteWebsite(id);
      setState(prev => ({
        ...prev,
        websites: prev.websites.filter(website => website.id !== id),
        isLoading: false,
      }));
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression du site',
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Charger les sites au montage
  useEffect(() => {
    fetchWebsites();
  }, [fetchWebsites]);

  return {
    ...state,
    fetchWebsites,
    createWebsite,
    updateWebsite,
    deleteWebsite,
    clearError,
  };
}

export function useWebsiteStats(websiteId: string | null, query?: StatsQuery) {
  const [state, setState] = useState<WebsiteStatsState>({
    stats: null,
    realtimeStats: null,
    isLoading: false,
    error: null,
  });

  const fetchStats = useCallback(async () => {
    if (!websiteId || !query) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const [statsResponse, realtimeResponse] = await Promise.all([
        apiClient.getWebsiteStats(websiteId, query),
        apiClient.getWebsiteRealtime(websiteId),
      ]);
      
      setState(prev => ({
        ...prev,
        stats: statsResponse.data,
        realtimeStats: realtimeResponse.data,
        isLoading: false,
      }));
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des statistiques',
      }));
    }
  }, [websiteId, query]);

  const fetchRealtimeStats = useCallback(async () => {
    if (!websiteId) return;
    
    try {
      const response = await apiClient.getWebsiteRealtime(websiteId);
      setState(prev => ({
        ...prev,
        realtimeStats: response.data,
      }));
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des stats temps réel',
      }));
    }
  }, [websiteId]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Charger les stats quand les paramètres changent
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Mise à jour périodique des stats temps réel
  useEffect(() => {
    if (!websiteId) return;
    
    const interval = setInterval(fetchRealtimeStats, 30000); // Toutes les 30 secondes
    return () => clearInterval(interval);
  }, [websiteId, fetchRealtimeStats]);

  return {
    ...state,
    fetchStats,
    fetchRealtimeStats,
    clearError,
  };
}
