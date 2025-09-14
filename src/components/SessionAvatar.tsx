// Composant pour l'avatar de session avec DiceBear Lorelei

import { useState, useRef } from 'react';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { getExcludedSessionInfo } from '../utils/sessionFilter';
import { ExcludedSessionPopover } from './ExcludedSessionPopover';

interface SessionAvatarProps {
  sessionId: string;
}

export function SessionAvatar({ sessionId }: SessionAvatarProps) {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const avatarRef = useRef<HTMLDivElement>(null);
  
  // Vérifier si cette session est exclue
  const excludedSessionInfo = getExcludedSessionInfo(sessionId);
  
  const handleAvatarClick = (event: React.MouseEvent) => {
    if (excludedSessionInfo) {
      event.preventDefault();
      event.stopPropagation();
      
      const rect = avatarRef.current?.getBoundingClientRect();
      if (rect) {
        setPopoverPosition({
          x: rect.right + 10, // Position to the right with 10px gap
          y: rect.top + rect.height / 2 // Center vertically
        });
        setShowPopover(true);
      }
    }
  };
  
  // Si la session est exclue, afficher le nom au lieu de l'avatar
  if (excludedSessionInfo) {
    return (
      <>
        <div 
          ref={avatarRef}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-gray-500 transition-colors"
          onClick={handleAvatarClick}
          title={`Click to view details: ${excludedSessionInfo.name}`}
        >
          <span className="text-white text-xs font-medium text-center px-1">
            {excludedSessionInfo.name}
          </span>
        </div>
        
        <ExcludedSessionPopover
          isVisible={showPopover}
          position={popoverPosition}
          sessionInfo={excludedSessionInfo}
          onClose={() => setShowPopover(false)}
        />
      </>
    );
  }

  // Créer un avatar Lorelei basé sur l'ID de session
  // Le même ID générera toujours le même avatar
  const avatar = createAvatar(lorelei, {
    seed: sessionId, // Utiliser l'ID de session comme seed pour la cohérence
    size: 32, // Taille de 32px pour s'adapter au design
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'], // Couleurs pastel
    radius: 50, // Avatar circulaire
  });

  return (
    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
      <img 
        src={avatar.toDataUri()} 
        alt={`Avatar for session ${sessionId}`}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
