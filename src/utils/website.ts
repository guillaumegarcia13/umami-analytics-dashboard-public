// Utility functions for website data processing

import type { Website } from '../api/types';

/**
 * Extract full domain from website name
 * Handles formats like "Coque & Cook (https://coque-cook.jsonborn.org)"
 */
export function extractFullDomain(website: Website): string {
  // Check if fullDomain is already computed
  if (website.fullDomain) {
    return website.fullDomain;
  }
  
  // Extract URL from name field using regex
  const urlMatch = website.name.match(/https?:\/\/([^)]+)/);
  if (urlMatch) {
    return urlMatch[1]; // Return domain without protocol
  }
  
  // Fallback to base domain if no URL found in name
  return website.domain;
}

/**
 * Enhance website object with full domain
 */
export function enhanceWebsiteWithFullDomain(website: Website): Website {
  return {
    ...website,
    fullDomain: extractFullDomain(website)
  };
}

/**
 * Enhance array of websites with full domains
 */
export function enhanceWebsitesWithFullDomains(websites: Website[]): Website[] {
  return websites.map(enhanceWebsiteWithFullDomain);
}
