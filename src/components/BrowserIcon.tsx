// Composant pour l'icône du navigateur avec react-icons

import { 
  FaChrome,
  FaFirefox,
  FaSafari,
  FaEdge,
  FaOpera,
  FaInternetExplorer,
  FaAndroid,
  FaApple,
  FaGlobe,
  FaDownload
} from 'react-icons/fa';

interface BrowserIconProps {
  browser: string;
  isPWA?: boolean;
}

export function BrowserIcon({ browser, isPWA = false }: BrowserIconProps) {
  const getBrowserIcon = (browserName: string) => {
    const normalizedBrowser = browserName.toLowerCase();
    
    // Handle Umami's specific browser values
    switch (normalizedBrowser) {
      case 'chrome':
        return <FaChrome className="w-4 h-4 text-green-500" />;
      case 'firefox':
        return <FaFirefox className="w-4 h-4 text-orange-500" />;
      case 'safari':
        return <FaSafari className="w-4 h-4 text-blue-500" />;
      case 'edge':
        return <FaEdge className="w-4 h-4 text-blue-600" />;
      case 'opera':
        return <FaOpera className="w-4 h-4 text-red-500" />;
      case 'brave':
        return <FaChrome className="w-4 h-4 text-orange-600" />; // Brave is Chromium-based
      case 'ie':
      case 'internet explorer':
        return <FaInternetExplorer className="w-4 h-4 text-blue-700" />;
      case 'ios':
        // iOS typically uses Safari, so show Apple icon
        return <FaApple className="w-4 h-4 text-gray-600" />;
      case 'android':
        // Android typically uses Chrome, so show Android icon
        return <FaAndroid className="w-4 h-4 text-green-600" />;
      default:
        // Fallback for unknown browsers
        return <FaGlobe className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-1 text-gray-400">
      {getBrowserIcon(browser)}
      {isPWA && (
        <div className="flex items-center gap-1 text-xs text-purple-500">
          <FaDownload className="w-3 h-3" />
          <span>PWA</span>
        </div>
      )}
    </div>
  );
}
