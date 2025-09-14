// Session filtering utilities

import type { Session } from '../types';
import type { SessionProcessingData, ProcessingOptions } from './types';

// Common bot and crawler patterns
const BOT_PATTERNS = [
  // Search engine bots
  /googlebot/i,
  /bingbot/i,
  /slurp/i, // Yahoo
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegrambot/i,
  
  // Generic bot patterns
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /scanner/i,
  /monitor/i,
  /checker/i,
  /validator/i,
  /test/i,
  /headless/i,
  /phantom/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
  
  // Analytics and monitoring tools
  /pingdom/i,
  /uptimerobot/i,
  /statuscake/i,
  /newrelic/i,
  /datadog/i,
  /sentry/i,
  
  // Social media crawlers
  /facebook/i,
  /twitter/i,
  /linkedin/i,
  /pinterest/i,
  /instagram/i,
  /tiktok/i,
  
  // Other common bots
  /curl/i,
  /wget/i,
  /python-requests/i,
  /go-http-client/i,
  /java/i,
  /okhttp/i,
  /apache-httpclient/i,
];

// Known crawler user agents
const CRAWLER_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'pingdom',
  'uptimerobot',
  'statuscake',
];

/**
* Calculate session duration in seconds
*/
export function calculateSessionDuration(session: Session): number {
  const firstAt = new Date(session.firstAt).getTime();
  const lastAt = new Date(session.lastAt).getTime();
  return Math.max(0, (lastAt - firstAt) / 1000);
}

/**
* Check if a user agent string indicates a bot
*/
export function isBotUserAgent(userAgent?: string): boolean {
  if (!userAgent) return false;
  
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

/**
* Check if a user agent string indicates a crawler
*/
export function isCrawlerUserAgent(userAgent?: string): boolean {
  if (!userAgent) return false;
  
  const lowerUserAgent = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(crawler => lowerUserAgent.includes(crawler));
}

/**
* Check if a session is likely from a bot based on various indicators
*/
export function isBotSession(session: Session): boolean {
  // Check user agent
  if (isBotUserAgent(session.browser) || isBotUserAgent(session.os)) {
    return true;
  }
  
  // Check for suspicious patterns
  const duration = calculateSessionDuration(session);
  
  // Very short sessions with high view counts (typical bot behavior)
  if (duration < 2 && session.views > 10) {
    return true;
  }
  
  // Sessions with no country (often bots)
  if (!session.country || session.country === 'Unknown') {
    return true;
  }
  
  // Sessions with suspicious browser/OS combinations
  const suspiciousPatterns = [
    /headless/i,
    /phantom/i,
    /selenium/i,
    /puppeteer/i,
    /playwright/i,
  ];
  
  const browserOs = `${session.browser || ''} ${session.os || ''}`.toLowerCase();
  if (suspiciousPatterns.some(pattern => pattern.test(browserOs))) {
    return true;
  }
  
  return false;
}

/**
* Check if a session is a crawler
*/
export function isCrawlerSession(session: Session): boolean {
  return isCrawlerUserAgent(session.browser) || isCrawlerUserAgent(session.os);
}

/**
* Validate if a session has required fields and valid data
*/
export function isValidSession(session: Session): boolean {
  // Check required fields
  if (!session.id || !session.websiteId) {
    return false;
  }
  
  // Check for valid dates
  const firstAt = new Date(session.firstAt);
  const lastAt = new Date(session.lastAt);
  
  if (isNaN(firstAt.getTime()) || isNaN(lastAt.getTime())) {
    return false;
  }
  
  // Check for logical consistency
  if (firstAt > lastAt) {
    return false;
  }
  
  // Check for reasonable values
  if (session.visits < 0 || session.views < 0) {
    return false;
  }
  
  // Check for suspiciously high values (likely data corruption)
  if (session.visits > 10000 || session.views > 100000) {
    return false;
  }
  
  return true;
}

/**
* Process session data for filtering decisions
*/
export function processSessionData(session: Session): SessionProcessingData {
  const duration = calculateSessionDuration(session);
  const isBot = isBotSession(session);
  const isCrawler = isCrawlerSession(session);
  const isValid = isValidSession(session);
  
  return {
    id: session.id,
    duration,
    userAgent: session.browser,
    browser: session.browser,
    os: session.os,
    country: session.country,
    visits: session.visits,
    views: session.views,
    isBot,
    isCrawler,
    isValid,
  };
}

/**
* Check if a session should be filtered out
*/
export function shouldFilterSession(
  session: Session, 
  options: ProcessingOptions = {}
): { filter: boolean; reason?: string } {
  const {
    minSessionDuration = 1,
    filterBots = true,
    filterCrawlers = true,
    validateRequiredFields = true,
  } = options;
  
  const processedData = processSessionData(session);
  
  // Filter invalid sessions
  if (validateRequiredFields && !processedData.isValid) {
    return { filter: true, reason: 'Invalid session data' };
  }
  
  // Filter short sessions
  if (processedData.duration <= minSessionDuration) {
    return { filter: true, reason: `Session too short (${processedData.duration.toFixed(2)}s ≤ ${minSessionDuration}s)` };
  }
  
  // Filter bots
  if (filterBots && processedData.isBot) {
    return { filter: true, reason: 'Bot session detected' };
  }
  
  // Filter crawlers
  if (filterCrawlers && processedData.isCrawler) {
    return { filter: true, reason: 'Crawler session detected' };
  }
  
  return { filter: false };
}
