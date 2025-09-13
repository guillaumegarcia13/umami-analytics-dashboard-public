// Composant pour l'avatar de session avec DiceBear Lorelei

import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

interface SessionAvatarProps {
  sessionId: string;
}

export function SessionAvatar({ sessionId }: SessionAvatarProps) {
  // Créer un avatar Lorelei basé sur l'ID de session
  // Le même ID générera toujours le même avatar
  const avatar = createAvatar(lorelei, {
    seed: sessionId, // Utiliser l'ID de session comme seed pour la cohérence
    size: 32, // Taille de 32px pour s'adapter au design
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'], // Couleurs pastel
    radius: 50, // Avatar circulaire
  });

  return (
    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
      <img 
        src={avatar.toDataUri()} 
        alt={`Avatar for session ${sessionId}`}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
