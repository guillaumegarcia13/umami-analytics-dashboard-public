// Popover component for displaying excluded session information

import { useEffect, useRef } from 'react';

interface ExcludedSessionPopoverProps {
  isVisible: boolean;
  position: { x: number; y: number };
  sessionInfo: {
    sessionId: string;
    name: string;
    description: string;
  };
  onClose: () => void;
}

export function ExcludedSessionPopover({ 
  isVisible, 
  position, 
  sessionInfo, 
  onClose 
}: ExcludedSessionPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, onClose]);

  // Close popover on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  // Calculate position to avoid going off-screen
  const adjustedPosition = {
    x: Math.max(10, Math.min(position.x, window.innerWidth - 320)), // 320px for max width
    y: Math.max(10, Math.min(position.y, window.innerHeight - 200)) // Keep some space from bottom
  };

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4 max-w-sm"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        transform: 'translateY(-50%)', // Center vertically
      }}
    >
      {/* Arrow pointing left */}
      <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-600"></div>
      
      <div className="space-y-3">
        <div>
          <h3 className="text-white font-semibold text-sm">{sessionInfo.name}</h3>
          <p className="text-gray-300 text-xs mt-1">{sessionInfo.description}</p>
        </div>
        
        <div className="pt-2 border-t border-gray-600">
          <div className="text-gray-400 text-xs mb-2">Session ID:</div>
          <code className="text-gray-300 text-xs bg-gray-700 px-2 py-1 rounded block break-all">
            {sessionInfo.sessionId}
          </code>
        </div>
        
        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
          >
            Close
          </button>
          <a
            href={`https://favicone.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded transition-colors"
          >
            Visit Service
          </a>
        </div>
      </div>
    </div>
  );
}
