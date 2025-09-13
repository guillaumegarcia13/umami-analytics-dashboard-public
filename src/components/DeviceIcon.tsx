// Composant pour l'icône du type d'appareil avec Phosphor Icons

import { 
  DeviceMobile, 
  DeviceTablet, 
  Laptop, 
  Desktop, 
  Watch, 
  Television,
  Monitor
} from '@phosphor-icons/react';

interface DeviceIconProps {
  device: string;
}

export function DeviceIcon({ device }: DeviceIconProps) {
  const getDeviceIcon = (deviceType: string) => {
    const normalizedDevice = deviceType.toLowerCase();
    
    if (normalizedDevice.includes('mobile') || normalizedDevice.includes('phone')) {
      return <DeviceMobile className="w-4 h-4 text-blue-500" />;
    } else if (normalizedDevice.includes('tablet')) {
      return <DeviceTablet className="w-4 h-4 text-purple-500" />;
    } else if (normalizedDevice.includes('laptop')) {
      return <Laptop className="w-4 h-4 text-gray-500" />;
    } else if (normalizedDevice.includes('desktop')) {
      return <Desktop className="w-4 h-4 text-gray-600" />;
    } else if (normalizedDevice.includes('watch')) {
      return <Watch className="w-4 h-4 text-pink-500" />;
    } else if (normalizedDevice.includes('tv')) {
      return <Television className="w-4 h-4 text-indigo-500" />;
    } else {
      return <Monitor className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="text-gray-400">
      {getDeviceIcon(device)}
    </div>
  );
}
