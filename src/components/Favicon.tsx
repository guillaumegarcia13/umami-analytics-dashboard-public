// Favicon component with fallback handling

import { useState, useEffect } from 'react';
import { getBestFaviconUrlForWebsite, getGoogleFaviconUrl, getFallbackFaviconUrl } from '../utils/favicon';

interface FaviconProps {
  domain: string;
  websiteId?: string; // Website ID for exclusion list checking
  className?: string;
  size?: number;
  alt?: string;
}

export function Favicon({ 
  domain, 
  websiteId,
  className = '', 
  size = 16, 
  alt = 'Website favicon' 
}: FaviconProps) {
  const [faviconUrl, setFaviconUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadFavicon = async () => {
      if (!domain) return;

      setIsLoading(true);
      setHasError(false);

      try {
        // Use website-aware favicon loading (respects exclusion lists)
        const url = await getBestFaviconUrlForWebsite(domain, websiteId);
        if (isMounted) {
          setFaviconUrl(url);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          // Final fallback to Google's service
          const fallbackUrl = getGoogleFaviconUrl(domain);
          setFaviconUrl(fallbackUrl);
          setIsLoading(false);
        }
      }
    };

    loadFavicon();

    return () => {
      isMounted = false;
    };
  }, [domain]);

  const handleError = () => {
    setHasError(true);
    setFaviconUrl(getFallbackFaviconUrl(domain));
  };

  // Get size class based on common sizes
  const getSizeClass = (size: number) => {
    if (size <= 16) return 'w-4 h-4';
    if (size <= 20) return 'w-5 h-5';
    if (size <= 24) return 'w-6 h-6';
    if (size <= 32) return 'w-8 h-8';
    if (size <= 40) return 'w-10 h-10';
    if (size <= 48) return 'w-12 h-12';
    return 'w-16 h-16';
  };

  const sizeClass = getSizeClass(size);

  if (isLoading) {
    return (
      <div 
        className={`bg-gray-600 rounded animate-pulse ${sizeClass} ${className}`}
      />
    );
  }

  if (hasError || !faviconUrl) {
    return (
      <div 
        className={`bg-gray-700 rounded flex items-center justify-center text-gray-400 text-xs ${sizeClass} ${className}`}
        title={alt}
      >
        🌐
      </div>
    );
  }

  return (
    <img
      src={faviconUrl}
      alt={alt}
      className={`rounded ${sizeClass} ${className}`}
      onError={handleError}
      title={alt}
    />
  );
}
