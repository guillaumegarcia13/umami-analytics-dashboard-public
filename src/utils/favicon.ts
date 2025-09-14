// Utility functions for retrieving website favicons using Favicone API
// Primary service: https://favicone.com/ - Lightning fast, reliable favicon API
// WARNING: External favicon requests may trigger visits to monitored websites

// Long-term cache to minimize external requests (1 month TTL)
const faviconCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

// Exclusion list: Website IDs that should NOT use external favicon services
// These are typically the websites being monitored to avoid feedback loops
const EXCLUDED_WEBSITE_IDS = new Set<string>([
  // Add website IDs that should be excluded from external favicon requests
  // Example: 'website-id-1', 'website-id-2'
  // To add your current website: excludeCurrentWebsite('your-website-id')
]);

// Note: Session ID exclusions are now handled in src/utils/sessionFilter.ts
// This file only handles website-level exclusions for favicon requests

// Whitelist: Website IDs that are safe to use with Favicone API
// These are external websites that won't create feedback loops
const FAVICONE_WHITELIST = new Set<string>([
  // Add website IDs that are safe to use with Favicone
  // These should be external websites, not the ones being monitored
]);

// Default favicon for excluded websites (to avoid external requests)
const DEFAULT_FAVICON = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzM3NDE1MSIvPgo8cGF0aCBkPSJNOCAxMkgxNlYyMEg4VjEyWiIgZmlsbD0iIzk5QTNBRiIvPgo8cGF0aCBkPSJNMTYgOEgyNFYxNkgxNlY4WiIgZmlsbD0iIzk5QTNBRiIvPgo8L3N2Zz4K';

/**
 * Check if cached favicon data is still valid
 */
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL;
}

/**
 * Get cached favicon URL if valid
 */
function getCachedFavicon(domain: string): string | null {
  const cached = faviconCache.get(domain);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.url;
  }
  return null;
}

/**
 * Cache a favicon URL with current timestamp
 */
function cacheFavicon(domain: string, url: string): void {
  faviconCache.set(domain, { url, timestamp: Date.now() });
}

/**
 * Clear expired cache entries to prevent memory leaks
 */
function clearExpiredCache(): void {
  for (const [domain, cached] of faviconCache.entries()) {
    if (!isCacheValid(cached.timestamp)) {
      faviconCache.delete(domain);
    }
  }
}

/**
 * Get cache statistics for debugging
 */
export function getCacheStats(): { size: number; domains: string[] } {
  clearExpiredCache(); // Clean up expired entries
  return {
    size: faviconCache.size,
    domains: Array.from(faviconCache.keys())
  };
}

/**
 * Check if a website ID should be excluded from external favicon requests
 */
export function isWebsiteExcluded(websiteId: string): boolean {
  return EXCLUDED_WEBSITE_IDS.has(websiteId);
}


/**
 * Check if a website ID is whitelisted for Favicone API
 */
export function isWebsiteWhitelisted(websiteId: string): boolean {
  return FAVICONE_WHITELIST.has(websiteId);
}

/**
 * Add a website ID to the exclusion list
 */
export function addToExclusionList(websiteId: string): void {
  EXCLUDED_WEBSITE_IDS.add(websiteId);
}

/**
 * Remove a website ID from the exclusion list
 */
export function removeFromExclusionList(websiteId: string): void {
  EXCLUDED_WEBSITE_IDS.delete(websiteId);
}


/**
 * Add a website ID to the Favicone whitelist
 */
export function addToFaviconeWhitelist(websiteId: string): void {
  FAVICONE_WHITELIST.add(websiteId);
}

/**
 * Remove a website ID from the Favicone whitelist
 */
export function removeFromFaviconeWhitelist(websiteId: string): void {
  FAVICONE_WHITELIST.delete(websiteId);
}

/**
 * Get the current exclusion and whitelist status
 */
export function getExclusionStatus(): {
  excludedWebsites: string[];
  whitelisted: string[];
  totalExcludedWebsites: number;
  totalWhitelisted: number;
} {
  return {
    excludedWebsites: Array.from(EXCLUDED_WEBSITE_IDS),
    whitelisted: Array.from(FAVICONE_WHITELIST),
    totalExcludedWebsites: EXCLUDED_WEBSITE_IDS.size,
    totalWhitelisted: FAVICONE_WHITELIST.size,
  };
}

/**
 * Add current website to exclusion list (for debugging/management)
 * This should be called when you want to prevent a specific website from triggering external favicon requests
 */
export function excludeCurrentWebsite(websiteId: string): void {
  addToExclusionList(websiteId);
  console.log(`Website ${websiteId} added to favicon exclusion list`);
}

/**
 * Remove current website from exclusion list
 */
export function allowCurrentWebsite(websiteId: string): void {
  removeFromExclusionList(websiteId);
  console.log(`Website ${websiteId} removed from favicon exclusion list`);
}


/**
 * Get favicon URL using Favicone API
 * This is the primary method as it's optimized and reliable
 * Uses full domain including subdomains (e.g., coque-cook.jsonborn.org)
 */
export function getFaviconeUrl(domain: string): string {
  // Remove protocol but keep full domain including subdomains
  const fullDomain = domain.replace(/^https?:\/\//, '');
  
  return `https://favicone.com/${fullDomain}`;
}

/**
 * Get possible favicon paths for a domain (fallback method)
 */
export function getPossibleFaviconPaths(domain: string): string[] {
  // Ensure domain has protocol
  const fullDomain = domain.startsWith('http') ? domain : `https://${domain}`;
  
  const possiblePaths = [
    '/favicon.ico',
    '/favicon.png',
    '/apple-touch-icon.png',
  ];
  
  return possiblePaths.map(path => `${fullDomain}${path}`);
}

/**
 * Check if a favicon URL is accessible
 */
export function checkFaviconExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Get the best available favicon URL for a domain with website ID context
 * Uses exclusion lists to prevent feedback loops for monitored websites
 * Strategy: Check exclusions → Cache → Safe favicon methods only
 */
export async function getBestFaviconUrlForWebsite(domain: string, websiteId?: string): Promise<string> {
  // If website is excluded, return default favicon immediately
  if (websiteId && isWebsiteExcluded(websiteId)) {
    return DEFAULT_FAVICON;
  }

  // Periodically clean up expired cache entries (every 100th call)
  if (Math.random() < 0.01) {
    clearExpiredCache();
  }

  // Check cache first (1 month TTL)
  const cachedUrl = getCachedFavicon(domain);
  if (cachedUrl) {
    return cachedUrl;
  }

  // For excluded websites, only use safe methods (no external APIs)
  if (websiteId && isWebsiteExcluded(websiteId)) {
    // Try direct favicon paths only (no external API calls)
    const possibleUrls = getPossibleFaviconPaths(domain);
    
    for (const url of possibleUrls) {
      try {
        const exists = await checkFaviconExists(url);
        if (exists) {
          cacheFavicon(domain, url);
          return url;
        }
      } catch {
        continue;
      }
    }
    
    // Return default favicon if no direct paths work
    cacheFavicon(domain, DEFAULT_FAVICON);
    return DEFAULT_FAVICON;
  }

  // For whitelisted websites, use Favicone API first
  if (websiteId && isWebsiteWhitelisted(websiteId)) {
    const faviconeUrl = getFaviconeUrl(domain);
    
    try {
      const exists = await checkFaviconExists(faviconeUrl);
      if (exists) {
        cacheFavicon(domain, faviconeUrl);
        return faviconeUrl;
      }
    } catch {
      // Continue to fallback methods
    }
  }

  // For other websites, try direct paths first, then Google service
  const possibleUrls = getPossibleFaviconPaths(domain);
  
  for (const url of possibleUrls) {
    try {
      const exists = await checkFaviconExists(url);
      if (exists) {
        cacheFavicon(domain, url);
        return url;
      }
    } catch {
      continue;
    }
  }
  
  // Final fallback to Google's favicon service
  const googleUrl = getGoogleFaviconUrl(domain);
  cacheFavicon(domain, googleUrl);
  return googleUrl;
}

/**
 * Get the best available favicon URL for a domain (legacy function)
 * Uses long-term caching (1 month) to minimize external requests and reduce feedback loops
 * Strategy: Cache first, then Favicone API, then direct paths, then Google service
 */
export async function getBestFaviconUrl(domain: string): Promise<string> {
  return getBestFaviconUrlForWebsite(domain);
}

/**
 * Get favicon URL using Google's favicon service
 * This is used as a fallback when direct favicon retrieval fails
 */
export function getGoogleFaviconUrl(domain: string): string {
  const cleanDomain = domain.replace(/^https?:\/\//, '');
  return `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=32`;
}

/**
 * Get fallback favicon URL using DuckDuckGo's favicon service
 * Alternative service if Google's doesn't work
 */
export function getFallbackFaviconUrl(domain: string): string {
  const cleanDomain = domain.replace(/^https?:\/\//, '');
  return `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`;
}

/**
 * Get favicon URL (legacy function for backward compatibility)
 * Now uses the async getBestFaviconUrl internally
 */
export function getFaviconUrl(domain: string): string {
  // Return Google's service immediately for synchronous calls
  return getGoogleFaviconUrl(domain);
}
