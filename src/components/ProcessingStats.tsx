// Component to display processing statistics

import type { ProcessingStats } from '../api/processors';

interface ProcessingStatsProps {
  stats?: ProcessingStats;
  className?: string;
}

export function ProcessingStats({ stats, className = '' }: ProcessingStatsProps) {
  if (!stats) return null;

  const filterRate = stats.totalRecords > 0 ? (stats.filteredRecords / stats.totalRecords * 100).toFixed(1) : '0';

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-3">Data Processing Stats</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-gray-700 rounded p-3">
          <div className="text-gray-300">Total Records</div>
          <div className="text-white font-semibold text-lg">{stats.totalRecords}</div>
        </div>
        
        <div className="bg-gray-700 rounded p-3">
          <div className="text-gray-300">Valid Records</div>
          <div className="text-green-400 font-semibold text-lg">{stats.validRecords}</div>
        </div>
        
        <div className="bg-gray-700 rounded p-3">
          <div className="text-gray-300">Filtered Out</div>
          <div className="text-red-400 font-semibold text-lg">{stats.filteredRecords}</div>
        </div>
        
        <div className="bg-gray-700 rounded p-3">
          <div className="text-gray-300">Filter Rate</div>
          <div className="text-yellow-400 font-semibold text-lg">{filterRate}%</div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="text-gray-400">
          <span className="text-red-400">•</span> Bots: {stats.botRecords}
        </div>
        <div className="text-gray-400">
          <span className="text-orange-400">•</span> Short Sessions: {stats.shortSessionRecords}
        </div>
        <div className="text-gray-400">
          <span className="text-purple-400">•</span> Invalid: {stats.invalidRecords}
        </div>
        <div className="text-gray-400">
          <span className="text-blue-400">•</span> Time: {stats.processingTimeMs.toFixed(2)}ms
        </div>
      </div>
    </div>
  );
}
