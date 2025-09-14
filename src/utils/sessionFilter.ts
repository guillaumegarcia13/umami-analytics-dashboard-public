// Session filtering utilities for excluding specific sessions from display

// Interface for excluded session information
interface ExcludedSession {
  sessionId: string;
  name: string;
  description: string;
}

// Exclusion list: Sessions that should be hidden from the sessions table
// These are specific sessions that should not be displayed to the user
const EXCLUDED_SESSIONS: ExcludedSession[] = [
  { 
    sessionId: '7c0981bc-8991-52c6-b879-b5a0f85fd664', 
    name: 'Favicone', 
    description: 'Web service for favicon retrieval' 
  },
  { 
    sessionId: '107d7aef-bcf5-5f52-87c9-604c635318f8', 
    name: 'Guillaume', 
    description: 'Desktop' 
  },
  // Add more sessions that should be hidden from the table
];

// Set of excluded session IDs for quick lookup
const EXCLUDED_SESSION_IDS = new Set<string>(
  EXCLUDED_SESSIONS.map(session => session.sessionId)
);

/**
 * Check if a session ID should be excluded from display
 */
export function isSessionExcluded(sessionId: string): boolean {
  return EXCLUDED_SESSION_IDS.has(sessionId);
}

/**
 * Add a session to the exclusion list
 */
export function addSessionToExclusionList(sessionId: string, name?: string, description?: string): void {
  if (!EXCLUDED_SESSION_IDS.has(sessionId)) {
    EXCLUDED_SESSIONS.push({
      sessionId,
      name: name || 'Unknown',
      description: description || 'No description'
    });
    EXCLUDED_SESSION_IDS.add(sessionId);
    console.log(`Session ${sessionId} (${name || 'Unknown'}) added to exclusion list`);
  }
}

/**
 * Remove a session from the exclusion list
 */
export function removeSessionFromExclusionList(sessionId: string): void {
  const sessionIndex = EXCLUDED_SESSIONS.findIndex(session => session.sessionId === sessionId);
  if (sessionIndex !== -1) {
    const session = EXCLUDED_SESSIONS[sessionIndex];
    EXCLUDED_SESSIONS.splice(sessionIndex, 1);
    EXCLUDED_SESSION_IDS.delete(sessionId);
    console.log(`Session ${sessionId} (${session.name}) removed from exclusion list`);
  }
}

/**
 * Get all excluded session IDs
 */
export function getExcludedSessionIds(): string[] {
  return Array.from(EXCLUDED_SESSION_IDS);
}

/**
 * Get all excluded sessions with their information
 */
export function getExcludedSessions(): ExcludedSession[] {
  return [...EXCLUDED_SESSIONS];
}

/**
 * Get excluded session information by ID
 */
export function getExcludedSessionInfo(sessionId: string): ExcludedSession | undefined {
  return EXCLUDED_SESSIONS.find(session => session.sessionId === sessionId);
}

/**
 * Check if a session ID is in the excluded sessions list (for debugging)
 */
export function isSessionInExcludedList(sessionId: string): boolean {
  return EXCLUDED_SESSIONS.some(session => session.sessionId === sessionId);
}

/**
 * Get the count of excluded sessions
 */
export function getExcludedSessionCount(): number {
  return EXCLUDED_SESSION_IDS.size;
}

/**
 * Filter sessions array to exclude specific session IDs
 */
export function filterExcludedSessions<T extends { id: string }>(sessions: T[]): T[] {
  return sessions.filter(session => !isSessionExcluded(session.id));
}

/**
 * Get session exclusion status
 */
export function getSessionExclusionStatus(): {
  excludedSessions: string[];
  excludedSessionsInfo: ExcludedSession[];
  totalExcluded: number;
} {
  return {
    excludedSessions: Array.from(EXCLUDED_SESSION_IDS),
    excludedSessionsInfo: [...EXCLUDED_SESSIONS],
    totalExcluded: EXCLUDED_SESSION_IDS.size,
  };
}

/**
 * Add the specific problematic session to exclusion list
 */
export function excludeProblematicSession(): void {
  addSessionToExclusionList('7c0981bc-8991-52c6-b879-b5a0f85fd664');
  console.log(`Problematic session 7c0981bc-8991-52c6-b879-b5a0f85fd664 added to exclusion list`);
}

/**
 * Clear all session exclusions
 */
export function clearAllSessionExclusions(): void {
  EXCLUDED_SESSIONS.length = 0;
  EXCLUDED_SESSION_IDS.clear();
  console.log('All session exclusions cleared');
}