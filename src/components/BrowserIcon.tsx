// Composant pour l'icône du navigateur avec Phosphor Icons

import { 
  Globe, 
  GlobeSimple, 
  GlobeHemisphereWest, 
  GlobeHemisphereEast,
  GlobeStand,
  GlobeStand as OperaIcon,
  GlobeStand as BraveIcon,
  DeviceMobile
} from '@phosphor-icons/react';

interface BrowserIconProps {
  browser: string;
}

export function BrowserIcon({ browser }: BrowserIconProps) {
  const getBrowserIcon = (browserName: string) => {
    const normalizedBrowser = browserName.toLowerCase();
    
    if (normalizedBrowser.includes('chrome')) {
      return <Globe className="w-4 h-4 text-green-500" />;
    } else if (normalizedBrowser.includes('firefox')) {
      return <GlobeSimple className="w-4 h-4 text-orange-500" />;
    } else if (normalizedBrowser.includes('safari')) {
      return <GlobeHemisphereWest className="w-4 h-4 text-blue-500" />;
    } else if (normalizedBrowser.includes('edge')) {
      return <GlobeHemisphereEast className="w-4 h-4 text-blue-600" />;
    } else if (normalizedBrowser.includes('opera')) {
      return <OperaIcon className="w-4 h-4 text-red-500" />;
    } else if (normalizedBrowser.includes('brave')) {
      return <BraveIcon className="w-4 h-4 text-orange-600" />;
    } else if (normalizedBrowser.includes('ios')) {
      return <DeviceMobile className="w-4 h-4 text-gray-500" />;
    } else {
      return <GlobeStand className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="text-gray-400">
      {getBrowserIcon(browser)}
    </div>
  );
}
