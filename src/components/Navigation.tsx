// Composant de navigation pour l'interface Umami

import { Moon, Translate, User } from '@phosphor-icons/react';

interface NavigationProps {
  activeTab: 'dashboard' | 'websites' | 'reports' | 'settings';
  onTabChange: (tab: 'dashboard' | 'websites' | 'reports' | 'settings') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'websites', label: 'Websites' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
  ] as const;

  return (
    <div className="bg-gray-800 border-b border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-white">umami</h1>
            
            {/* Navigation tabs */}
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400 pb-1'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button 
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              aria-label="Toggle dark mode"
            >
              <Moon className="w-5 h-5" />
            </button>

            {/* Language/Globe */}
            <button 
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              aria-label="Change language"
            >
              <Translate className="w-5 h-5" />
            </button>

            {/* User profile */}
            <button 
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              aria-label="User profile"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
