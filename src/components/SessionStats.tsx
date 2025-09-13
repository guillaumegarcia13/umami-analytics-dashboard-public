// Composant pour afficher les statistiques des sessions

import { UsersIcon, LightningIcon, EyeIcon, ChartBarIcon } from '@phosphor-icons/react';

interface SessionStatsProps {
  totalSessions: number;
  activeSessions: number;
  totalVisits: number;
  totalViews: number;
}

export function SessionStats({ 
  totalSessions, 
  activeSessions, 
  totalVisits, 
  totalViews 
}: SessionStatsProps) {
  const stats = [
    {
      label: 'Total Sessions',
      value: totalSessions,
      icon: UsersIcon,
      color: 'blue',
      bgColor: 'bg-blue-500',
      textColor: 'text-white'
    },
    {
      label: 'Active Sessions',
      value: activeSessions,
      icon: LightningIcon,
      color: 'green',
      bgColor: 'bg-green-500',
      textColor: 'text-green-400'
    },
    {
      label: 'Total Visits',
      value: totalVisits,
      icon: EyeIcon,
      color: 'purple',
      bgColor: 'bg-purple-500',
      textColor: 'text-white'
    },
    {
      label: 'Total Views',
      value: totalViews,
      icon: ChartBarIcon,
      color: 'orange',
      bgColor: 'bg-orange-500',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex flex-wrap gap-3">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-gray-700 rounded-lg px-5 py-4 hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-4 min-w-0 flex-1">
              <div className={`p-3 ${stat.bgColor} rounded-lg shadow-sm flex-shrink-0`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-400 truncate">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.textColor} truncate`}>{stat.value.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
