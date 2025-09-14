// Composant pour afficher le tableau des sessions
import { useState, useMemo } from 'react';
import { useSessions } from '../api/hooks/useSessions';
import { SessionAvatar } from './SessionAvatar';
import { CountryFlag } from './CountryFlag';
import { BrowserIcon } from './BrowserIcon';
import { OSIcon } from './OSIcon';
import { DeviceIcon } from './DeviceIcon';
import { SessionStats } from './SessionStats';
import { WebsiteSelector } from './WebsiteSelector';
import { ProcessingStats } from './ProcessingStats';
import Switch from 'react-switch';
import { filterExcludedSessions, getSessionExclusionStatus, isSessionInExcludedList } from '../utils/sessionFilter';
import type { Session } from '../api/types';

interface SessionsTableProps {
  websiteId?: string;
  startDate?: string;
  endDate?: string;
}

type SortField = 'visits' | 'views' | 'country' | 'browser' | 'os' | 'device' | 'lastAt';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export function SessionsTable({ websiteId: initialWebsiteId, startDate: initialStartDate, endDate: initialEndDate }: SessionsTableProps) {
  // Website selection state
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>(initialWebsiteId || '');

  // Date filtering state
  const [startDate, setStartDate] = useState<string>(() => {
    if (initialStartDate) {
      // Convert epoch timestamp to date string if needed
      const timestamp = parseInt(initialStartDate);
      if (!isNaN(timestamp)) {
        return new Date(timestamp).toISOString().split('T')[0];
      }
      return initialStartDate;
    }
    // Default to 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return thirtyDaysAgo.toISOString().split('T')[0];
  });

  const [endDate, setEndDate] = useState<string>(() => {
    if (initialEndDate) {
      // Convert epoch timestamp to date string if needed
      const timestamp = parseInt(initialEndDate);
      if (!isNaN(timestamp)) {
        return new Date(timestamp).toISOString().split('T')[0];
      }
      return initialEndDate;
    }
    // Default to today (the API will handle the time range correctly)
    return new Date().toISOString().split('T')[0];
  });

  // Filtering state
  const [enableFiltering, setEnableFiltering] = useState<boolean>(true);

  const { sessions: allSessions, loading, error, refetch, loadMore, hasMore, processingStats } = useSessions({
    websiteId: selectedWebsiteId,
    startDate,
    endDate,
    pageSize: 20,
    // Always fetch unfiltered data, we'll filter on the client side
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'lastAt',
    direction: 'desc',
  });

  // Website selection functions
  const handleWebsiteChange = (websiteId: string) => {
    setSelectedWebsiteId(websiteId);
  };

  // Client-side filtering function
  const filterSessions = (sessions: Session[], enableFilter: boolean) => {
    if (!enableFilter) {
      return {
        filteredSessions: sessions,
        stats: {
          totalRecords: sessions.length,
          filteredRecords: 0,
          validRecords: sessions.length,
          botRecords: 0,
          shortSessionRecords: 0,
          invalidRecords: 0,
          processingTimeMs: 0,
        }
      };
    }

    const startTime = performance.now();
    let filteredRecords = 0;
    let botRecords = 0;
    let shortSessionRecords = 0;
    let invalidRecords = 0;

    const filteredSessions = sessions.filter(session => {
      // Debug specific session ID
      if (isSessionInExcludedList(session.id)) {
        console.log('Found target session:', {
          id: session.id,
          firstAt: session.firstAt,
          lastAt: session.lastAt,
          views: session.views,
          duration: session.firstAt && session.lastAt ? (new Date(session.lastAt).getTime() - new Date(session.firstAt).getTime()) / 1000 : 'N/A'
        });
      }

      // Filter out invalid sessions (missing required fields) first
      if (!session.id || !session.firstAt || !session.lastAt) {
        if (isSessionInExcludedList(session.id)) {
          console.log('Target session filtered: Missing required fields');
        }
        invalidRecords++;
        filteredRecords++;
        return false;
      }

      // Calculate session duration
      const firstAt = new Date(session.firstAt).getTime();
      const lastAt = new Date(session.lastAt).getTime();
      const duration = (lastAt - firstAt) / 1000; // in seconds

      // Filter out very short sessions (< 1 second)
      if (duration < 1) {
        if (isSessionInExcludedList(session.id)) {
          console.log('Target session filtered: Very short session (< 1 second)');
        }
        shortSessionRecords++;
        filteredRecords++;
        return false;
      }

      // Filter out potential bots (short sessions with very low views)
      if (duration < 5 && session.views < 2) {
        if (isSessionInExcludedList(session.id)) {
          console.log('Target session filtered: Potential bot (short session with low views)');
        }
        botRecords++;
        filteredRecords++;
        return false;
      }

      if (isSessionInExcludedList(session.id)) {
        console.log('Target session passed all filters');
      }

      return true;
    });

    const processingTime = performance.now() - startTime;

    // Debug logging
    console.log('Filtering stats:', {
      totalRecords: sessions.length,
      filteredRecords,
      validRecords: filteredSessions.length,
      botRecords,
      shortSessionRecords,
      invalidRecords,
      processingTimeMs: processingTime,
    });

    // Debug: Log all sessions with their durations and dates
    console.log('All sessions with durations and dates:', sessions.map(session => ({
      id: session.id,
      firstAt: session.firstAt,
      lastAt: session.lastAt,
      firstAtDate: session.firstAt ? new Date(session.firstAt).toISOString().split('T')[0] : 'N/A',
      lastAtDate: session.lastAt ? new Date(session.lastAt).toISOString().split('T')[0] : 'N/A',
      views: session.views,
      duration: session.firstAt && session.lastAt ? 
        ((new Date(session.lastAt).getTime() - new Date(session.firstAt).getTime()) / 1000).toFixed(2) + 's' : 
        'N/A'
    })));

    return {
      filteredSessions,
      stats: {
        totalRecords: sessions.length,
        filteredRecords,
        validRecords: filteredSessions.length,
        botRecords,
        shortSessionRecords,
        invalidRecords,
        processingTimeMs: processingTime,
      }
    };
  };

  // Debug: Check if target session exists in allSessions
  if (allSessions) {
    const targetSession = allSessions.find(s => isSessionInExcludedList(s.id));
    if (targetSession) {
      console.log('Target session found in allSessions:', targetSession);
    } else {
      console.log('Target session NOT found in allSessions');
      console.log('Available session IDs:', allSessions.map(s => s.id).slice(0, 10));
    }
  }

  // Apply client-side filtering
  const { filteredSessions: sessionsAfterFiltering, stats: clientProcessingStats } = filterSessions(allSessions || [], enableFiltering);

  // Apply session exclusion filtering only when filtering is enabled
  // When filtering is disabled, show all sessions including excluded ones
  const sessions = useMemo(() => {
    return enableFiltering ? filterExcludedSessions(sessionsAfterFiltering || []) : (sessionsAfterFiltering || []);
  }, [enableFiltering, sessionsAfterFiltering]);

  // Debug: Check if target session exists in filtered results
  if (sessions) {
    const targetSessionInFiltered = sessions.find(s => isSessionInExcludedList(s.id));
    if (targetSessionInFiltered) {
      console.log('Target session found in filtered sessions:', targetSessionInFiltered);
    } else {
      console.log('Target session NOT found in filtered sessions (may be excluded)');
    }
  }

  // Debug: Show session exclusion status and filtering state
  const exclusionStatus = getSessionExclusionStatus();
  console.log('Filtering state:', {
    enableFiltering,
    sessionExclusions: exclusionStatus,
    sessionsCount: sessions?.length || 0,
    allSessionsCount: allSessions?.length || 0
  });

  // Debug: Show PWA sessions
  const pwaSessions = sessions?.filter(s => s.properties?.isPWA === true) || [];
  console.log(`📱 PWA Sessions found: ${pwaSessions.length}`, pwaSessions.map(s => ({
    id: s.id,
    browser: s.browser,
    isPWA: s.properties?.isPWA
  })));

  // Use client-side stats when filtering is enabled, otherwise use server stats
  const displayProcessingStats = enableFiltering ? clientProcessingStats : processingStats;
  
  // Debug logging
  console.log('Display processing stats:', {
    enableFiltering,
    clientProcessingStats,
    processingStats,
    displayProcessingStats
  });

  // Debug: Show current filtering state
  console.log('Current filtering state:', {
    enableFiltering,
    allSessionsCount: allSessions?.length || 0,
    filteredSessionsCount: sessions?.length || 0,
    isFilteringActive: enableFiltering
  });

  // Debug: Show date range
  console.log('Date range:', {
    startDate,
    endDate,
    today: new Date().toISOString().split('T')[0],
    startDateObj: new Date(startDate),
    endDateObj: new Date(endDate)
  });

  // Filtering functions
  const handleFilteringToggle = (enabled: boolean) => {
    setEnableFiltering(enabled);
    // No need to refetch - filtering happens on the client side
  };

  // Date filtering functions
  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleDateFilter = () => {
    // The useSessions hook will automatically refetch when startDate or endDate changes
    refetch();
  };

  const resetDateFilter = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
  };

  // Sorting functions
  const handleSort = (field: SortField) => {
    setSortConfig(prevConfig => ({
      field,
      direction: prevConfig.field === field && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Sort sessions based on current configuration
  const sortedSessions = useMemo(() => {
    const sorted = [...sessions].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortConfig.field) {
        case 'visits':
        case 'views':
          aValue = a[sortConfig.field];
          bValue = b[sortConfig.field];
          break;
        case 'country':
        case 'browser':
        case 'os':
        case 'device':
          aValue = (a[sortConfig.field] || '').toLowerCase();
          bValue = (b[sortConfig.field] || '').toLowerCase();
          break;
        case 'lastAt':
          aValue = new Date(a.lastAt).getTime();
          bValue = new Date(b.lastAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [sessions, sortConfig]);

  // Sortable header component
  const SortableHeader = ({ field, children, className = '' }: { field: SortField; children: React.ReactNode; className?: string }) => {
    const isActive = sortConfig.field === field;
    
    return (
      <th 
        className={`px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:bg-gray-700 transition-colors select-none ${className}`}
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center space-x-1">
          <span>{children}</span>
          {isActive && (
            <div className="flex flex-col">
              <span className={`text-xs ${sortConfig.direction === 'asc' ? 'text-blue-400' : 'text-gray-500'}`}>
                ▲
              </span>
              <span className={`text-xs ${sortConfig.direction === 'desc' ? 'text-blue-400' : 'text-gray-500'}`}>
                ▼
              </span>
            </div>
          )}
        </div>
      </th>
    );
  };


  // Calculer les statistiques
  const totalSessions = sessions.length;
  const activeSessions = sessions.filter(session => {
    const lastSeen = new Date(session.lastAt);
    const now = new Date();
    const diffInMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
    return diffInMinutes < 30; // Sessions actives dans les 30 dernières minutes
  }).length;
  const totalVisits = sessions.reduce((sum, session) => sum + session.visits, 0);
  const totalViews = sessions.reduce((sum, session) => sum + session.views, 0);

  // Show message if no website is selected
  if (!selectedWebsiteId) {
    return (
      <div className="bg-gray-900 text-white min-h-screen w-full">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4 w-full">
          <div className="flex flex-col gap-4 w-full">
            {/* Title and Website Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">Sessions</h2>
              <WebsiteSelector
                selectedWebsiteId={selectedWebsiteId}
                onWebsiteChange={handleWebsiteChange}
              />
            </div>
          </div>
        </div>
        
        {/* No website selected message */}
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-400 text-lg mb-2">No website selected</p>
            <p className="text-gray-500 text-sm">Please select a website from the dropdown above to view sessions.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen w-full">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4 w-full">
          <div className="flex flex-col gap-4 w-full">
            {/* Title and Website Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">Sessions</h2>
              <WebsiteSelector
                selectedWebsiteId={selectedWebsiteId}
                onWebsiteChange={handleWebsiteChange}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-white min-h-screen w-full">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4 w-full">
          <div className="flex flex-col gap-4 w-full">
            {/* Title and Website Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">Sessions</h2>
              <WebsiteSelector
                selectedWebsiteId={selectedWebsiteId}
                onWebsiteChange={handleWebsiteChange}
              />
            </div>
          </div>
        </div>
        
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen w-full">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4 w-full">
        <div className="flex flex-col gap-4 w-full">
          {/* Title and Website Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-bold">Sessions</h2>
              {/* Filtered Sessions Info */}
              {displayProcessingStats && enableFiltering && (
                <div className="text-sm text-gray-400">
                  {displayProcessingStats.filteredRecords > 0 ? (
                    <>
                      <span className="text-red-400 font-medium">{displayProcessingStats.filteredRecords}</span> sessions filtered out 
                      <span className="text-gray-500"> ({((displayProcessingStats.filteredRecords / displayProcessingStats.totalRecords) * 100).toFixed(1)}%)</span>
                    </>
                  ) : (
                    <span className="text-green-400">No sessions filtered - all sessions are valid</span>
                  )}
                </div>
              )}
            </div>
            <WebsiteSelector
              selectedWebsiteId={selectedWebsiteId}
              onWebsiteChange={handleWebsiteChange}
            />
          </div>
          
          {/* Date Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label htmlFor="start-date" className="text-sm text-gray-300 whitespace-nowrap">
                From:
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label htmlFor="end-date" className="text-sm text-gray-300 whitespace-nowrap">
                To:
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleDateFilter}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Filter
              </button>
              <button
                onClick={resetDateFilter}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Filtering Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center space-x-3">
              <Switch
                checked={enableFiltering}
                onChange={handleFilteringToggle}
                onColor="#2563eb"
                offColor="#4b5563"
                checkedIcon={false}
                uncheckedIcon={false}
                height={24}
                width={48}
                handleDiameter={20}
                className="react-switch"
              />
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300">
                  Filter short sessions
                </label>
                <span className="text-xs text-gray-400">
                  {enableFiltering ? "Filters out sessions < 1 second (likely bots) and excluded sessions - Client-side filtering" : "Shows all sessions including excluded ones - No filtering"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <SessionStats 
        totalSessions={totalSessions}
        activeSessions={activeSessions}
        totalVisits={totalVisits}
        totalViews={totalViews}
      />

      {/* Processing Stats - Show filtered sessions info */}
      {displayProcessingStats && enableFiltering && (
        <div className="px-4 sm:px-6 py-4">
          <ProcessingStats stats={displayProcessingStats} />
        </div>
      )}


      {/* Tablet Table - Hidden on mobile and desktop */}
      <div className="hidden md:block lg:hidden table-container w-full">
        <table className="w-full min-w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Session</th>
              <SortableHeader field="visits">Stats</SortableHeader>
              <SortableHeader field="country">Location</SortableHeader>
              <SortableHeader field="device">Device</SortableHeader>
              <SortableHeader field="lastAt">Last seen</SortableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedSessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3">
                  <SessionAvatar sessionId={session.id} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400 font-semibold">{session.visits}</span>
                      <span className="text-gray-400">visits</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400 font-semibold">{session.views}</span>
                      <span className="text-gray-400">views</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <CountryFlag country={session.country} />
                    <div className="text-xs text-gray-400">{session.city || 'Unknown'}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <BrowserIcon 
                        browser={session.browser} 
                        isPWA={session.properties?.isPWA === true}
                      />
                      <span className="text-sm text-gray-300">
                        {session.browser}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DeviceIcon device={session.device} />
                      <span className="text-xs text-gray-400">{session.device}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {formatLastSeen(session.lastAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Desktop Table - Hidden on mobile and tablet */}
      <div className="hidden lg:block table-container w-full">
        <table className="w-full min-w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Session</th>
              <SortableHeader field="visits" className="px-6 py-4">Visits</SortableHeader>
              <SortableHeader field="views" className="px-6 py-4">Views</SortableHeader>
              <SortableHeader field="country" className="px-6 py-4">Location</SortableHeader>
              <SortableHeader field="browser" className="px-6 py-4">Browser</SortableHeader>
              <SortableHeader field="os" className="px-6 py-4">OS</SortableHeader>
              <SortableHeader field="device" className="px-6 py-4">Device</SortableHeader>
              <SortableHeader field="lastAt" className="px-6 py-4">Last seen</SortableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedSessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4">
                  <SessionAvatar sessionId={session.id} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">{session.visits}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{session.views}</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <CountryFlag country={session.country} />
                    <div className="text-xs text-gray-400">{session.city || 'Unknown'}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <BrowserIcon 
                      browser={session.browser} 
                      isPWA={session.properties?.isPWA === true}
                    />
                    <span className="text-sm text-gray-300">
                      {session.browser}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <OSIcon os={session.os} />
                    <span className="text-sm text-gray-300">{session.os}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <DeviceIcon device={session.device} />
                    <span className="text-sm text-gray-300">{session.device}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {formatLastSeen(session.lastAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - Visible on mobile and tablet */}
      <div className="lg:hidden p-4 space-y-4 w-full">
        {sortedSessions.map((session) => (
          <div key={session.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            {/* Session Header */}
            <div className="flex items-center justify-between mb-4">
              <SessionAvatar sessionId={session.id} />
              <div className="text-right">
                <div className="text-sm text-gray-400">Last seen</div>
                <div className="text-sm text-gray-300">{formatLastSeen(session.lastAt)}</div>
              </div>
            </div>

            {/* Session Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{session.visits}</div>
                <div className="text-xs text-gray-400">Visits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{session.views}</div>
                <div className="text-xs text-gray-400">Views</div>
              </div>
            </div>

            {/* Location Info */}
            <div className="flex items-center justify-between mb-4">
              <CountryFlag country={session.country} />
              <div className="text-sm text-gray-400">{session.city || 'Unknown'}</div>
            </div>

            {/* Device Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BrowserIcon 
                    browser={session.browser} 
                    isPWA={session.properties?.isPWA === true}
                  />
                  <span className="text-sm text-gray-300">
                    {session.browser}
                  </span>
                </div>
                <div className="text-xs text-gray-400">{session.screen}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <OSIcon os={session.os} />
                  <span className="text-sm text-gray-300">{session.os}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DeviceIcon device={session.device} />
                  <span className="text-sm text-gray-300">{session.device}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {sortedSessions.length > 0 && (
        <div className="p-4 w-full">
          <button
            onClick={loadMore}
            disabled={!hasMore || loading}
            className="w-full sm:w-auto sm:mx-auto sm:block py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {loading ? 'Loading...' : hasMore ? 'Load More Sessions' : 'No More Sessions'}
          </button>
        </div>
      )}
    </div>
  );
}

function formatLastSeen(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}
