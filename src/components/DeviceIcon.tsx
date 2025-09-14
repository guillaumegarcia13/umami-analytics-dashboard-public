// Composant pour l'icône du type d'appareil avec react-icons

import { 
  FaMobile,
  FaTablet,
  FaLaptop,
  FaDesktop,
  FaTv,
  FaDesktop as FaMonitor
} from 'react-icons/fa';

interface DeviceIconProps {
  device: string;
}

export function DeviceIcon({ device }: DeviceIconProps) {
  const getDeviceIcon = (deviceType: string) => {
    const normalizedDevice = deviceType.toLowerCase();
    
    // Handle Umami's specific device values
    switch (normalizedDevice) {
      case 'mobile':
      case 'phone':
        return <FaMobile className="w-4 h-4 text-blue-500" />;
      case 'tablet':
        return <FaTablet className="w-4 h-4 text-purple-500" />;
      case 'laptop':
        return <FaLaptop className="w-4 h-4 text-gray-500" />;
      case 'desktop':
        return <FaDesktop className="w-4 h-4 text-gray-600" />;
      case 'watch':
        return <FaMobile className="w-4 h-4 text-pink-500" />; // Use mobile icon for watch
      case 'tv':
        return <FaTv className="w-4 h-4 text-indigo-500" />;
      default:
        return <FaMonitor className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="text-gray-400">
      {getDeviceIcon(device)}
    </div>
  );
}
