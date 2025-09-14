// Website selector component with API integration and persistence

import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebsites } from '../api/hooks/useWebsites';
import { Favicon } from './Favicon';
import { extractFullDomain } from '../utils/website';

interface WebsiteSelectorProps {
  selectedWebsiteId?: string;
  onWebsiteChange: (websiteId: string) => void;
  className?: string;
}

const WEBSITE_STORAGE_KEY = 'umami-selected-website-id';

export function WebsiteSelector({ 
  selectedWebsiteId, 
  onWebsiteChange, 
  className = '' 
}: WebsiteSelectorProps) {
  const { websites, isLoading, error } = useWebsites();
  const [localSelectedId, setLocalSelectedId] = useState<string>(selectedWebsiteId || '');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load saved website ID from localStorage on mount
  useEffect(() => {
    const savedWebsiteId = localStorage.getItem(WEBSITE_STORAGE_KEY);
    if (savedWebsiteId && !selectedWebsiteId) {
      setLocalSelectedId(savedWebsiteId);
      onWebsiteChange(savedWebsiteId);
    }
  }, [selectedWebsiteId, onWebsiteChange]);

  // Update local state when prop changes
  useEffect(() => {
    if (selectedWebsiteId) {
      setLocalSelectedId(selectedWebsiteId);
    }
  }, [selectedWebsiteId]);

  const handleWebsiteChange = useCallback((websiteId: string) => {
    setLocalSelectedId(websiteId);
    setIsOpen(false);
    
    // Save to localStorage
    localStorage.setItem(WEBSITE_STORAGE_KEY, websiteId);
    
    // Notify parent component
    onWebsiteChange(websiteId);
  }, [onWebsiteChange]);

  const selectedWebsite = websites?.find(w => w.id === localSelectedId);
  

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <label htmlFor="website-select" className="text-sm text-gray-300 whitespace-nowrap">
          Website:
        </label>
        <div className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400 text-sm">
          Loading websites...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <label htmlFor="website-select" className="text-sm text-gray-300 whitespace-nowrap">
          Website:
        </label>
        <div className="px-3 py-2 bg-red-700 border border-red-600 rounded-md text-red-200 text-sm">
          Error loading websites
        </div>
      </div>
    );
  }

  if (!websites || websites.length === 0) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <label htmlFor="website-select" className="text-sm text-gray-300 whitespace-nowrap">
          Website:
        </label>
        <div className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400 text-sm">
          No websites available
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label className="text-sm text-gray-300 whitespace-nowrap">
        Website:
      </label>
      <div className="relative" ref={dropdownRef}>
        {/* Custom dropdown button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px] flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            {selectedWebsite ? (
              <>
                <Favicon 
                  domain={extractFullDomain(selectedWebsite)} 
                  websiteId={selectedWebsite.id}
                  size={20} 
                  alt={`${selectedWebsite.name} favicon`}
                />
                <span className="truncate">
                  {selectedWebsite.name}
                </span>
              </>
            ) : (
              <span className="text-gray-400">Select a website...</span>
            )}
          </div>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
            {websites.map((website) => (
              <button
                key={website.id}
                type="button"
                onClick={() => handleWebsiteChange(website.id)}
                className="w-full px-3 py-2 text-left text-white text-sm hover:bg-gray-600 focus:bg-gray-600 focus:outline-none flex items-center space-x-2"
              >
                <Favicon 
                  domain={extractFullDomain(website)} 
                  websiteId={website.id}
                  size={20} 
                  alt={`${website.name} favicon`}
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{website.name}</div>
                  <div className="truncate text-xs text-gray-400">{extractFullDomain(website)}</div>
                </div>
                {localSelectedId === website.id && (
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
