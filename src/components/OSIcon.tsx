// Composant pour l'icône du système d'exploitation avec react-icons

import { 
  FaWindows,
  FaApple,
  FaLinux,
  FaAndroid,
  FaDesktop
} from 'react-icons/fa';

interface OSIconProps {
  os: string;
}

export function OSIcon({ os }: OSIconProps) {
  const getOSIcon = (osName: string) => {
    const normalizedOS = osName.toLowerCase();
    
    // Handle Umami's specific OS values
    if (normalizedOS.includes('windows')) {
      return <FaWindows className="w-4 h-4 text-blue-500" />;
    } else if (normalizedOS.includes('macos') || normalizedOS.includes('mac')) {
      return <FaApple className="w-4 h-4 text-gray-600" />;
    } else if (normalizedOS.includes('linux') || normalizedOS.includes('ubuntu')) {
      return <FaLinux className="w-4 h-4 text-orange-500" />;
    } else if (normalizedOS.includes('android')) {
      return <FaAndroid className="w-4 h-4 text-green-500" />;
    } else if (normalizedOS.includes('ios')) {
      return <FaApple className="w-4 h-4 text-gray-600" />;
    } else {
      return <FaDesktop className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="text-gray-400">
      {getOSIcon(os)}
    </div>
  );
}
