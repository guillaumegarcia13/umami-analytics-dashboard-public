// Client API principal pour Umami

import { apiConfig, API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES } from '../config';
import { processSessionsResponse } from '../processors/responseProcessor';
import type { 
    ApiResponse, 
    PaginatedResponse, 
    User, 
    Website, 
    Team, 
    Event, 
    Session, 
    SessionProperty,
    Stats, 
    RealtimeStats,
    CreateWebsiteRequest,
    UpdateWebsiteRequest,
    CreateUserRequest,
    UpdateUserRequest,
    LoginRequest,
    LoginResponse,
    StatsQuery,
    EventQuery
} from '../types';
import type { ProcessingOptions, ProcessedResponse } from '../processors/types';

class ApiError extends Error {
    public status: number;
    public response?: unknown;
    
    constructor(message: string, status: number, response?: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.response = response;
    }
}

class UmamiApiClient {
    private baseUrl: string;
    private apiKey?: string;
    private websiteId?: string;
    private timeout: number;
    private retries: number;
    private processingOptions: ProcessingOptions;
    
    constructor(config = apiConfig, processingOptions: ProcessingOptions = {}) {
        this.baseUrl = config.baseUrl;
        this.apiKey = config.apiKey;
        this.websiteId = config.websiteId;
        this.timeout = config.timeout;
        this.retries = config.retries;
        this.processingOptions = {
            minSessionDuration: 1,
            filterBots: true,
            filterCrawlers: true,
            validateRequiredFields: true,
            logProcessingStats: true,
            logFilteredRecords: false,
            ...processingOptions,
        };
    }
    
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;
        
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        
        if (this.apiKey) {
            (headers as Record<string, string>)['x-umami-api-key'] = this.apiKey;
        }
        
        
        const config: RequestInit = {
            ...options,
            headers,
            signal: AbortSignal.timeout(this.timeout),
        };
        
        let lastError: Error | null = null;
        
        for (let attempt = 0; attempt <= this.retries; attempt++) {
            try {
                const response = await fetch(url, config);
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new ApiError(
                        errorData.message || this.getErrorMessage(response.status),
                        response.status,
                        errorData
                    );
                }
                
                const data = await response.json();
                console.log('📊 API Response Data:', data);
                console.log('📊 Data Type:', typeof data);
                console.log('📊 Data Keys:', Object.keys(data));
                
                return {
                    data,
                    status: response.status,
                };
            } catch (error) {
                lastError = error as Error;
                
                if (attempt < this.retries && this.isRetryableError(error as Error)) {
                    // Attendre avant de réessayer (backoff exponentiel)
                    await this.delay(Math.pow(2, attempt) * 1000);
                    continue;
                }
                
                throw error;
            }
        }
        
        throw lastError || new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
    }
    
    private isRetryableError(error: Error): boolean {
        if (error instanceof ApiError) {
            return error.status >= 500 || error.status === 429;
        }
        return error.name === 'TypeError' || error.name === 'AbortError';
    }
    
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Processing options management
    setProcessingOptions(options: Partial<ProcessingOptions>): void {
        this.processingOptions = { ...this.processingOptions, ...options };
    }
    
    getProcessingOptions(): ProcessingOptions {
        return { ...this.processingOptions };
    }
    
    private getErrorMessage(status: number): string {
        switch (status) {
            case HTTP_STATUS.UNAUTHORIZED:
            return ERROR_MESSAGES.UNAUTHORIZED;
            case HTTP_STATUS.FORBIDDEN:
            return ERROR_MESSAGES.FORBIDDEN;
            case HTTP_STATUS.NOT_FOUND:
            return ERROR_MESSAGES.NOT_FOUND;
            case HTTP_STATUS.INTERNAL_SERVER_ERROR:
            return ERROR_MESSAGES.SERVER_ERROR;
            default:
            return ERROR_MESSAGES.UNKNOWN_ERROR;
        }
    }
    
    // Méthodes d'authentification
    async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        return this.request<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }
    
    async logout(): Promise<ApiResponse<void>> {
        return this.request<void>(API_ENDPOINTS.AUTH.LOGOUT, {
            method: 'POST',
        });
    }
    
    async getCurrentUser(): Promise<ApiResponse<User>> {
        return this.request<User>(API_ENDPOINTS.AUTH.ME);
    }
    
    // Méthodes pour les utilisateurs
    async getUsers(): Promise<ApiResponse<PaginatedResponse<User>>> {
        return this.request<PaginatedResponse<User>>(API_ENDPOINTS.USERS.LIST);
    }
    
    async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
        return this.request<User>(API_ENDPOINTS.USERS.CREATE, {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }
    
    async getUser(id: string): Promise<ApiResponse<User>> {
        return this.request<User>(API_ENDPOINTS.USERS.GET(id));
    }
    
    async updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
        return this.request<User>(API_ENDPOINTS.USERS.UPDATE(id), {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }
    
    async deleteUser(id: string): Promise<ApiResponse<void>> {
        return this.request<void>(API_ENDPOINTS.USERS.DELETE(id), {
            method: 'DELETE',
        });
    }
    
    // Méthodes pour les sites web
    async getWebsites(): Promise<ApiResponse<PaginatedResponse<Website>>> {
        return this.request<PaginatedResponse<Website>>(API_ENDPOINTS.WEBSITES.LIST);
    }
    
    async createWebsite(websiteData: CreateWebsiteRequest): Promise<ApiResponse<Website>> {
        return this.request<Website>(API_ENDPOINTS.WEBSITES.CREATE, {
            method: 'POST',
            body: JSON.stringify(websiteData),
        });
    }
    
    async getWebsite(id: string): Promise<ApiResponse<Website>> {
        
        return this.request<Website>(API_ENDPOINTS.WEBSITES.GET(id));
    }
    
    async updateWebsite(id: string, websiteData: UpdateWebsiteRequest): Promise<ApiResponse<Website>> {
        return this.request<Website>(API_ENDPOINTS.WEBSITES.UPDATE(id), {
            method: 'PUT',
            body: JSON.stringify(websiteData),
        });
    }
    
    async deleteWebsite(id: string): Promise<ApiResponse<void>> {
        return this.request<void>(API_ENDPOINTS.WEBSITES.DELETE(id), {
            method: 'DELETE',
        });
    }
    
    async getWebsiteStats(id: string, query: StatsQuery): Promise<ApiResponse<Stats>> {
        const siteId = id || this.websiteId;
        if (!siteId) {
            throw new Error('Website ID is required. Please provide it as parameter or set VITE_UMAMI_WEBSITE_ID environment variable.');
        }
        
        // Convert dates to epoch timestamps if they're in string format
        const startAt = query.startDate && typeof query.startDate === 'string' && !query.startDate.match(/^\d+$/) ? 
        new Date(query.startDate).getTime().toString() : 
        query.startDate;
        
        const endAt = query.endDate && typeof query.endDate === 'string' && !query.endDate.match(/^\d+$/) ? 
        new Date(query.endDate).getTime().toString() : 
        query.endDate;
        
        const params = new URLSearchParams({
            startAt,
            endAt,
            ...(query.timezone && { timezone: query.timezone }),
            ...(query.unit && { unit: query.unit }),
        });
        
        const endpoint = `${API_ENDPOINTS.WEBSITES.STATS(siteId)}?${params}`;
        return this.request<Stats>(endpoint);
    }
    
    async getWebsiteRealtime(id: string): Promise<ApiResponse<RealtimeStats>> {
        const siteId = id || this.websiteId;
        if (!siteId) {
            throw new Error('Website ID is required. Please provide it as parameter or set VITE_UMAMI_WEBSITE_ID environment variable.');
        }
        return this.request<RealtimeStats>(API_ENDPOINTS.WEBSITES.REALTIME(siteId));
    }
    
    // Méthodes pour les équipes
    async getTeams(): Promise<ApiResponse<PaginatedResponse<Team>>> {
        return this.request<PaginatedResponse<Team>>(API_ENDPOINTS.TEAMS.LIST);
    }
    
    async createTeam(name: string): Promise<ApiResponse<Team>> {
        return this.request<Team>(API_ENDPOINTS.TEAMS.CREATE, {
            method: 'POST',
            body: JSON.stringify({ name }),
        });
    }
    
    async getTeam(id: string): Promise<ApiResponse<Team>> {
        return this.request<Team>(API_ENDPOINTS.TEAMS.GET(id));
    }
    
    async updateTeam(id: string, name: string): Promise<ApiResponse<Team>> {
        return this.request<Team>(API_ENDPOINTS.TEAMS.UPDATE(id), {
            method: 'PUT',
            body: JSON.stringify({ name }),
        });
    }
    
    async deleteTeam(id: string): Promise<ApiResponse<void>> {
        return this.request<void>(API_ENDPOINTS.TEAMS.DELETE(id), {
            method: 'DELETE',
        });
    }
    
    // Méthodes pour les événements
    async getEvents(query: EventQuery): Promise<ApiResponse<PaginatedResponse<Event>>> {
        const params = new URLSearchParams({
            websiteId: query.websiteId,
            startDate: query.startDate,
            endDate: query.endDate,
            ...(query.eventName && { eventName: query.eventName }),
            ...(query.limit && { limit: query.limit.toString() }),
            ...(query.offset && { offset: query.offset.toString() }),
        });
        
        return this.request<PaginatedResponse<Event>>(`${API_ENDPOINTS.EVENTS.LIST}?${params}`);
    }
    
    async createEvent(eventData: Partial<Event>): Promise<ApiResponse<Event>> {
        return this.request<Event>(API_ENDPOINTS.EVENTS.CREATE, {
            method: 'POST',
            body: JSON.stringify(eventData),
        });
    }
    
    async getEvent(id: string): Promise<ApiResponse<Event>> {
        return this.request<Event>(API_ENDPOINTS.EVENTS.GET(id));
    }
    
    // Méthodes pour les sessions
    async getSessions(websiteId?: string, startDate?: string, endDate?: string, page?: number, pageSize?: number): Promise<ApiResponse<PaginatedResponse<Session>>> {
        const siteId = websiteId || this.websiteId;
        if (!siteId) {
            throw new Error('Website ID is required. Please provide it as parameter or set VITE_UMAMI_WEBSITE_ID environment variable.');
        }
        
        // Convert dates to epoch timestamps if they're in string format
        const startAt = startDate ? 
        (typeof startDate === 'string' && !startDate.match(/^\d+$/)) ? 
        // For date strings, set to start of day (00:00:00) to include the full day
        new Date(startDate + 'T00:00:00.000Z').getTime().toString() : 
        startDate : 
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime().toString(); // 30 days ago
        
        const endAt = endDate ? 
        (typeof endDate === 'string' && !endDate.match(/^\d+$/)) ? 
        // For date strings, set to end of day (23:59:59.999) to include the full day
        new Date(endDate + 'T23:59:59.999Z').getTime().toString() : 
        endDate : 
        new Date().getTime().toString(); // now
        
        const params = new URLSearchParams({
            startAt,
            endAt,
            ...(page && { page: page.toString() }),
            ...(pageSize && { pageSize: pageSize.toString() }),
        });
        
        const endpoint = `${API_ENDPOINTS.WEBSITES.SESSIONS(siteId)}?${params}`;
        const response = await this.request<PaginatedResponse<Session>>(endpoint);
        
        // Process the response to filter out irrelevant records
        const processedResponse = processSessionsResponse(response, this.processingOptions);
        
        return {
            data: processedResponse.data,
            status: response.status,
        };
    }
    
    // Méthode pour obtenir les sessions avec options de traitement personnalisées
    async getSessionsWithProcessing(
        websiteId?: string, 
        startDate?: string, 
        endDate?: string, 
        page?: number, 
        pageSize?: number,
        processingOptions?: ProcessingOptions
    ): Promise<ProcessedResponse<PaginatedResponse<Session>>> {
        const siteId = websiteId || this.websiteId;
        if (!siteId) {
            throw new Error('Website ID is required. Please provide it as parameter or set VITE_UMAMI_WEBSITE_ID environment variable.');
        }
        
        // Convert dates to epoch timestamps if they're in string format
        const startAt = startDate ? 
        (typeof startDate === 'string' && !startDate.match(/^\d+$/)) ? 
        // For date strings, set to start of day (00:00:00) to include the full day
        new Date(startDate + 'T00:00:00.000Z').getTime().toString() : 
        startDate : 
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime().toString(); // 30 days ago
        
        const endAt = endDate ? 
        (typeof endDate === 'string' && !endDate.match(/^\d+$/)) ? 
        // For date strings, set to end of day (23:59:59.999) to include the full day
        new Date(endDate + 'T23:59:59.999Z').getTime().toString() : 
        endDate : 
        new Date().getTime().toString(); // now
        
        const params = new URLSearchParams({
            startAt,
            endAt,
            ...(page && { page: page.toString() }),
            ...(pageSize && { pageSize: pageSize.toString() }),
        });
        
        const endpoint = `${API_ENDPOINTS.WEBSITES.SESSIONS(siteId)}?${params}`;
        const response = await this.request<PaginatedResponse<Session>>(endpoint);
        
        // Process the response with custom options
        const options = { ...this.processingOptions, ...processingOptions };
        return processSessionsResponse(response, options);
    }
    
    async getSession(id: string): Promise<ApiResponse<Session>> {
        return this.request<Session>(API_ENDPOINTS.SESSIONS.GET(id));
    }
    
    async getSessionProperties(websiteId: string, sessionId: string): Promise<ApiResponse<SessionProperty[]>> {
        const siteId = websiteId || this.websiteId;
        if (!siteId) {
            throw new Error('Website ID is required. Please provide it as parameter or set VITE_UMAMI_WEBSITE_ID environment variable.');
        }
        return this.request<SessionProperty[]>(API_ENDPOINTS.SESSIONS.PROPERTIES(siteId, sessionId));
    }
    
    /**
    * Enrich sessions with their properties
    */
    async enrichSessionsWithProperties(sessions: Session[], websiteId?: string): Promise<Session[]> {
        const siteId = websiteId || this.websiteId;
        if (!siteId) {
            throw new Error('Website ID is required. Please provide it as parameter or set VITE_UMAMI_WEBSITE_ID environment variable.');
        }
        
        console.log(`🔍 ===== SESSION PROPERTIES ENRICHMENT START =====`);
        console.log(`📊 Input: ${sessions.length} sessions to process`);
        console.log(`🌐 Website ID: ${siteId}`);
        console.log(`🔗 API Base URL: ${this.baseUrl}`);
        console.log(`📋 Session IDs:`, sessions.map(s => s.id));
        
        const enrichedSessions = await Promise.all(
            sessions.map(async (session, index) => {
                console.log(`\n📡 [${index + 1}/${sessions.length}] Processing session: ${session.id}`);
                console.log(`   Browser: ${session.browser}, Device: ${session.device}`);
                
                try {
                    const apiUrl = API_ENDPOINTS.SESSIONS.PROPERTIES(siteId, session.id);
                    console.log(`   🔗 API URL: ${this.baseUrl}${apiUrl}`);
                    
                    const propertiesResponse = await this.getSessionProperties(siteId, session.id);
                    console.log(`   ✅ API Response Status: ${propertiesResponse.status}`);
                    console.log(`   📦 Raw API Response:`, JSON.stringify(propertiesResponse, null, 2));
                    
                    if (propertiesResponse.data && Array.isArray(propertiesResponse.data)) {
                        console.log(`   📋 Properties array length: ${propertiesResponse.data.length}`);
                        
                        // Process the properties array to extract key-value pairs
                        const processedProperties: Record<string, any> = {};
                        propertiesResponse.data
                        .filter(prop => prop.dataKey)
                        .forEach((prop: any, propIndex: number) => {
                            console.log(`   🔧 Processing property ${propIndex + 1}:`, {
                                dataKey: prop.dataKey,
                                dataType: prop.dataType,
                                stringValue: prop.stringValue,
                                numberValue: prop.numberValue,
                                dateValue: prop.dateValue
                            });
                            
                            if (prop.stringValue !== null) {
                                // Only convert "true"/"false" to boolean for specific properties like isPWA
                                switch(prop.stringValue) {
                                    case "true" : 
                                    processedProperties[prop.dataKey] = true;
                                    console.log(`     ✅ Converted "${prop.stringValue}" to boolean true`);
                                    break;
                                    case "false": 
                                    processedProperties[prop.dataKey] = false;
                                    console.log(`     ✅ Converted "${prop.stringValue}" to boolean false`);
                                    break;
                                    default:
                                    processedProperties[prop.dataKey] = prop.stringValue;
                                    console.log(`     📝 Kept as string: "${prop.stringValue}"`);
                                }
                            } else if (prop.numberValue !== null) {
                                processedProperties[prop.dataKey] = prop.numberValue;
                                console.log(`     🔢 Number value: ${prop.numberValue}`);
                            } else if (prop.dateValue !== null) {
                                processedProperties[prop.dataKey] = prop.dateValue;
                                console.log(`     📅 Date value: ${prop.dateValue}`);
                            }
                        });
                        
                        console.log(`   🎯 Final processed properties:`, processedProperties);
                        
                        // Debug: Check if isPWA is being set correctly
                        console.log(`   🔍 All processed properties keys:`, Object.keys(processedProperties));
                        console.log(`   🔍 All processed properties values:`, processedProperties);
                        
                        if (processedProperties.isPWA !== undefined) {
                            console.log(`   📱 PWA DETECTED! Value: ${processedProperties.isPWA} (type: ${typeof processedProperties.isPWA})`);
                        } else {
                            console.log(`   ❌ No PWA property found for this session`);
                            console.log(`   🔍 Available properties:`, Object.keys(processedProperties));
                            
                            // Check for variations of PWA property names
                            const pwaVariations = ['isPWA', 'isPwa', 'pwa', 'PWA', 'is_pwa', 'is_pwa_installed'];
                            const foundPwaProperty = pwaVariations.find(key => processedProperties[key] !== undefined);
                            if (foundPwaProperty) {
                                console.log(`   🎯 Found PWA property with different name: "${foundPwaProperty}" = ${processedProperties[foundPwaProperty]}`);
                            }
                        }
                        
                        const enrichedSession = { ...session, properties: processedProperties };
                        console.log(`   ✅ Session enriched successfully`);
                        return enrichedSession;
                    } else {
                        console.log(`   ⚠️ No properties data array in response`);
                    }
                } catch (error) {
                    console.error(`   ❌ ERROR fetching properties for session ${session.id}:`, error);
                    if (error instanceof Error) {
                        console.error(`   📝 Error message: ${error.message}`);
                        console.error(`   📝 Error stack: ${error.stack}`);
                    }
                }
                console.log(`   🔄 Returning session without properties`);
                return session; // Return session without properties if fetch fails
            })
        );
        
        console.log(`\n🎉 ===== ENRICHMENT COMPLETE =====`);
        console.log(`📊 Processed ${enrichedSessions.length} sessions`, enrichedSessions);
        
        // Summary of PWA sessions
        const pwaSessions = enrichedSessions.filter(s => s.properties?.isPWA === true);
        console.log(`📱 PWA Sessions found: ${pwaSessions.length}`);
        pwaSessions.forEach(s => {
            console.log(`   - ${s.id} (${s.browser}): PWA = ${s.properties?.isPWA}`);
        });
        
        console.log(`🔍 ===== SESSION PROPERTIES ENRICHMENT END =====\n`);
        return enrichedSessions;
    }
    
    
    // Méthodes pour les statistiques
    async getOverviewStats(): Promise<ApiResponse<Stats>> {
        return this.request<Stats>(API_ENDPOINTS.STATS.OVERVIEW);
    }
    
    async getWebsiteStatsOverview(id: string, query: StatsQuery): Promise<ApiResponse<Stats>> {
        const siteId = id || this.websiteId;
        if (!siteId) {
            throw new Error('Website ID is required. Please provide it as parameter or set VITE_UMAMI_WEBSITE_ID environment variable.');
        }
        
        // Convert dates to epoch timestamps if they're in string format
        const startAt = query.startDate && typeof query.startDate === 'string' && !query.startDate.match(/^\d+$/) ? 
        new Date(query.startDate).getTime().toString() : 
        query.startDate;
        
        const endAt = query.endDate && typeof query.endDate === 'string' && !query.endDate.match(/^\d+$/) ? 
        new Date(query.endDate).getTime().toString() : 
        query.endDate;
        
        const params = new URLSearchParams({
            startAt,
            endAt,
            ...(query.timezone && { timezone: query.timezone }),
            ...(query.unit && { unit: query.unit }),
        });
        
        return this.request<Stats>(`${API_ENDPOINTS.STATS.WEBSITE(siteId)}?${params}`);
    }
    
    async getRealtimeStats(): Promise<ApiResponse<RealtimeStats>> {
        return this.request<RealtimeStats>(API_ENDPOINTS.STATS.REALTIME);
    }
}

// Instance singleton du client API
export const apiClient = new UmamiApiClient();

// Export des types et classes
export { ApiError, UmamiApiClient };
export type { UmamiApiConfig as ApiConfig };

// Définir le type UmamiApiConfig
export interface UmamiApiConfig {
    baseUrl: string;
    apiKey?: string;
    websiteId?: string;
    timeout: number;
    retries: number;
}
