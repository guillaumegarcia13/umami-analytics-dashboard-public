// Composant pour afficher le tableau des sessions
import { useSessions } from '../api/hooks/useSessions';
import { SessionAvatar } from './SessionAvatar';
import { CountryFlag } from './CountryFlag';
import { BrowserIcon } from './BrowserIcon';
import { OSIcon } from './OSIcon';
import { DeviceIcon } from './DeviceIcon';
import { SessionStats } from './SessionStats';
import { MoonIcon, TranslateIcon, UserIcon } from '@phosphor-icons/react';

interface SessionsTableProps {
  websiteId: string;
  startDate: string;
  endDate: string;
}

export function SessionsTable({ websiteId, startDate, endDate }: SessionsTableProps) {
  const { sessions, loading, error, refetch } = useSessions({
    websiteId,
    startDate,
    endDate,
    pageSize: 20,
  });

  // Calculer les statistiques
  const totalSessions = sessions.length;
  const activeSessions = sessions.filter(session => {
    const lastSeen = new Date(session.lastSeen);
    const now = new Date();
    const diffInMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
    return diffInMinutes < 30; // Sessions actives dans les 30 dernières minutes
  }).length;
  const totalVisits = sessions.reduce((sum, session) => sum + session.visits, 0);
  const totalViews = sessions.reduce((sum, session) => sum + session.views, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Sessions</h1>
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 hover:bg-gray-700 rounded"
              aria-label="Toggle dark mode"
            >
              <MoonIcon className="w-5 h-5" />
            </button>
            <button 
              className="p-2 hover:bg-gray-700 rounded"
              aria-label="Change language"
            >
              <TranslateIcon className="w-5 h-5" />
            </button>
            <button 
              className="p-2 hover:bg-gray-700 rounded"
              aria-label="User profile"
            >
              <UserIcon className="w-5 h-5" />
            </button>
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Session</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Visits</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Views</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Country</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">City</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Browser</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">OS</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Device</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Last seen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4">
                  <SessionAvatar sessionId={session.sessionId} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">{session.visits}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{session.views}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <CountryFlag country={session.country} />
                    <span className="text-sm text-gray-300">{session.country}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">{session.city}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <BrowserIcon browser={session.browser} />
                    <span className="text-sm text-gray-300">{session.browser}</span>
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
                  {formatLastSeen(session.lastSeen)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
