// Composant pour l'icône du système d'exploitation avec Phosphor Icons

import { 
  WindowsLogo, 
  AppleLogo, 
  LinuxLogo, 
  AndroidLogo, 
  DeviceMobile,
  Monitor
} from '@phosphor-icons/react';

interface OSIconProps {
  os: string;
}

export function OSIcon({ os }: OSIconProps) {
  const getOSIcon = (osName: string) => {
    const normalizedOS = osName.toLowerCase();
    
    if (normalizedOS.includes('windows')) {
      return <WindowsLogo className="w-4 h-4 text-blue-500" />;
    } else if (normalizedOS.includes('macos') || normalizedOS.includes('mac')) {
      return <AppleLogo className="w-4 h-4 text-gray-600" />;
    } else if (normalizedOS.includes('linux') || normalizedOS.includes('ubuntu')) {
      return <LinuxLogo className="w-4 h-4 text-orange-500" />;
    } else if (normalizedOS.includes('android')) {
      return <AndroidLogo className="w-4 h-4 text-green-500" />;
    } else if (normalizedOS.includes('ios')) {
      return <DeviceMobile className="w-4 h-4 text-gray-500" />;
    } else {
      return <Monitor className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="text-gray-400">
      {getOSIcon(os)}
    </div>
  );
}
