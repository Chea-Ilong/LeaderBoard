import {
    LeaderboardEntry,
    TeamEntry,
    GroupEntry,
    OverallEntry,
    LeaderboardResponse,
    HackerRankApiResponse,
    LeaderboardFilters,
} from '@/types/leaderboard';
import { mockDataGenerator } from './mock-data-generator';
import { cacheManager, CACHE_KEYS } from './cache-manager';

/**
 * Unified data service that seamlessly switches between mock data and real HackerRank API data
 * This service provides a consistent interface for the frontend components
 */
export class DataService {
    private static instance: DataService;
    private useMockData: boolean;
    private apiToken: string;
    private baseUrls: {
        round1: string;
        round2: string;
        team: string;
        firebase: string;
    };

    private constructor() {
        // Read configuration from environment variables
        // Default to mock data if not explicitly set to false
        this.useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';
        this.apiToken = process.env.NEXT_PUBLIC_TOKEN || '';
        this.baseUrls = {
            round1: process.env.NEXT_PUBLIC_HACKERRANK_ROUND1_URL || '',
            round2: process.env.NEXT_PUBLIC_HACKERRANK_ROUND2_URL || '',
            team: process.env.NEXT_PUBLIC_HACKERRANK_ROUND_TEAM_URL || '',
            firebase: process.env.NEXT_PUBLIC_FIREBASE_URL || '',
        };
    }

    public static getInstance(): DataService {
        if (!DataService.instance) {
            DataService.instance = new DataService();
        }
        return DataService.instance;
    }

    /**
     * Get leaderboard data for a specific round
     */
    public async getLeaderboardData(
        round: number,
        filters?: LeaderboardFilters
    ): Promise<LeaderboardResponse> {
        const cacheKey = `${
            CACHE_KEYS.LEADERBOARD_ROUND1
        }_${round}_${JSON.stringify(filters || {})}`;

        try {
            // Try cache first for better performance
            const cachedData = cacheManager.get<LeaderboardResponse>(cacheKey, {
                ttl: 5 * 60 * 1000,
            }); // 5 minutes cache
            if (cachedData) {
                return cachedData;
            }

            let data: LeaderboardEntry[] = [];

            if (this.useMockData) {
                data = await this.getMockLeaderboardData(round);
            } else {
                data = await this.getRealLeaderboardData(round);
            }

            // Apply filters if provided
            if (filters) {
                data = this.applyFilters(data, filters);
            }

            const response: LeaderboardResponse = {
                success: true,
                round: round,
                data: data,
                timestamp: new Date().toISOString(),
                totalCount: data.length,
                hasMore: false, // For now, we load all data at once
            };

            // Cache the response
            cacheManager.set(cacheKey, response, { ttl: 5 * 60 * 1000 });

            return response;
        } catch (error) {
            console.error(
                `Failed to get leaderboard data for round ${round}:`,
                error
            );

            // Fallback to mock data if real API fails
            if (!this.useMockData) {
                console.log('Falling back to mock data...');
                try {
                    const mockData = await this.getMockLeaderboardData(round);
                    return {
                        success: true,
                        round: round,
                        data: this.applyFilters(
                            mockData,
                            filters || ({} as LeaderboardFilters)
                        ),
                        timestamp: new Date().toISOString(),
                        totalCount: mockData.length,
                        hasMore: false,
                        message: 'Using mock data due to API failure',
                    };
                } catch (mockError) {
                    console.error('Mock data fallback also failed:', mockError);
                }
            }

            return {
                success: false,
                round: round,
                data: [],
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error',
                totalCount: 0,
                hasMore: false,
            };
        }
    }

    /**
     * Get team competition data
     */
    public async getTeamData(
        filters?: LeaderboardFilters
    ): Promise<TeamEntry[]> {
        try {
            if (this.useMockData) {
                return await mockDataGenerator.getTeamData();
            } else {
                return await this.getRealTeamData();
            }
        } catch (error) {
            console.error('Failed to get team data:', error);

            // Fallback to mock data
            if (!this.useMockData) {
                console.log('Falling back to mock team data...');
                return await mockDataGenerator.getTeamData();
            }

            throw error;
        }
    }

    /**
     * Get overall competition rankings
     */
    public async getOverallData(
        filters?: LeaderboardFilters
    ): Promise<OverallEntry[]> {
        try {
            if (this.useMockData) {
                return await mockDataGenerator.getOverallData();
            } else {
                return await this.getRealOverallData();
            }
        } catch (error) {
            console.error('Failed to get overall data:', error);

            // Fallback to mock data
            if (!this.useMockData) {
                console.log('Falling back to mock overall data...');
                return await mockDataGenerator.getOverallData();
            }

            throw error;
        }
    }

    /**
     * Get group competition rankings
     */
    public async getGroupData(
        filters?: LeaderboardFilters
    ): Promise<GroupEntry[]> {
        try {
            if (this.useMockData) {
                return await mockDataGenerator.getGroupData();
            } else {
                return await this.getRealGroupData();
            }
        } catch (error) {
            console.error('Failed to get group data:', error);

            // Fallback to mock data
            if (!this.useMockData) {
                console.log('Falling back to mock group data...');
                return await mockDataGenerator.getGroupData();
            }

            throw error;
        }
    }

    /**
     * Get mock data for a specific round
     */
    private async getMockLeaderboardData(
        round: number
    ): Promise<LeaderboardEntry[]> {
        return await mockDataGenerator.getRoundData(round);
    }

    /**
     * Get real data from HackerRank API
     */
    private async getRealLeaderboardData(
        round: number
    ): Promise<LeaderboardEntry[]> {
        const url = round === 1 ? this.baseUrls.round1 : this.baseUrls.round2;

        if (!url || !this.apiToken) {
            throw new Error('HackerRank API configuration is missing');
        }

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${this.apiToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(
                `HackerRank API error: ${response.status} ${response.statusText}`
            );
        }

        const apiData: HackerRankApiResponse = await response.json();

        // Transform HackerRank API response to our format
        return await this.transformHackerRankData(apiData);
    }

    /**
     * Get real team data (placeholder - implement based on your team API)
     */
    private async getRealTeamData(): Promise<TeamEntry[]> {
        // This would typically combine individual round data to create team rankings
        // For now, we'll use the mock data structure but with real individual data
        const round1Data = await this.getRealLeaderboardData(1);
        const round2Data = await this.getRealLeaderboardData(2);

        // Generate teams from real data (you might have a separate team API)
        return this.generateTeamsFromRealData(round1Data, round2Data);
    }

    /**
     * Get real overall data by combining all rounds
     */
    private async getRealOverallData(): Promise<OverallEntry[]> {
        const round1Data = await this.getRealLeaderboardData(1);
        const round2Data = await this.getRealLeaderboardData(2);
        const teamData = await this.getRealTeamData();

        return this.combineRealDataForOverall(round1Data, round2Data, teamData);
    }

    /**
     * Get real group data by aggregating individual results
     */
    private async getRealGroupData(): Promise<GroupEntry[]> {
        const overallData = await this.getRealOverallData();
        return this.aggregateRealDataForGroups(overallData);
    }

    /**
     * Transform HackerRank API response to our LeaderboardEntry format
     */
    private async transformHackerRankData(
        apiData: HackerRankApiResponse
    ): Promise<LeaderboardEntry[]> {
        const entries = await Promise.all(
            apiData.models.map(async (model, index) => ({
                id: index + 1,
                rank: model.rank,
                fullName: await this.getFullNameFromHackerId(model.hacker),
                hackerRankId: model.hacker,
                group: await this.getGroupFromHackerId(model.hacker),
                scores: this.extractScoresFromApiData(model),
                totalPoints: model.score,
                bonus: 0, // Extract from API if available
                energizer: 0, // Extract from API if available
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    model.hacker
                )}&background=random&color=fff&size=128`,
            }))
        );

        return entries;
    }

    /**
     * Apply filters to leaderboard data
     */
    private applyFilters(
        data: LeaderboardEntry[],
        filters: LeaderboardFilters
    ): LeaderboardEntry[] {
        let filteredData = [...data];

        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredData = filteredData.filter(
                (entry) =>
                    entry.fullName.toLowerCase().includes(searchTerm) ||
                    entry.hackerRankId.toLowerCase().includes(searchTerm)
            );
        }

        // Group filter
        if (filters.group && filters.group !== 'all') {
            filteredData = filteredData.filter(
                (entry) => entry.group === filters.group
            );
        }

        return filteredData;
    }

    /**
     * Helper methods for real data processing (implement based on your needs)
     */
    private async getFullNameFromHackerId(hackerId: string): Promise<string> {
        // Try to get from participant data first
        try {
            const participants = await import('./participant-data-loader').then(
                (m) => m.participantLoader.loadParticipantData()
            );
            const participant = participants.find(
                (p) => this.generateHackerRankIdFromEmail(p.email) === hackerId
            );
            if (participant) {
                return participant.name;
            }
        } catch (error) {
            console.warn(
                'Could not load participant data for name lookup:',
                error
            );
        }

        // Fallback: return a formatted version of the hacker ID
        return hackerId
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
    }

    private async getGroupFromHackerId(hackerId: string): Promise<string> {
        // Try to get from participant data first
        try {
            const participants = await import('./participant-data-loader').then(
                (m) => m.participantLoader.loadParticipantData()
            );
            const participant = participants.find(
                (p) => this.generateHackerRankIdFromEmail(p.email) === hackerId
            );
            if (participant) {
                return `G${participant.group}`;
            }
        } catch (error) {
            console.warn(
                'Could not load participant data for group lookup:',
                error
            );
        }

        // Fallback: assign groups based on hash of hacker ID
        const hash = hackerId.split('').reduce((a, b) => {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
        }, 0);
        return `G${(Math.abs(hash) % 10) + 1}`;
    }

    private generateHackerRankIdFromEmail(email: string): string {
        const username = email.split('@')[0];
        return username.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    }

    private extractScoresFromApiData(model: any): number[] {
        // Extract individual problem scores from the API response
        // This depends on your HackerRank API response format
        if (model.questions) {
            return Object.values(model.questions) as number[];
        }

        // Fallback: distribute total score across 6 problems
        const totalScore = model.score;
        const problemCount = 6;
        const baseScore = Math.floor(totalScore / problemCount);
        const remainder = totalScore % problemCount;

        const scores = new Array(problemCount).fill(baseScore);
        for (let i = 0; i < remainder; i++) {
            scores[i]++;
        }

        return scores;
    }

    private generateTeamsFromRealData(
        round1Data: LeaderboardEntry[],
        round2Data: LeaderboardEntry[]
    ): TeamEntry[] {
        // Use the same team generation logic as mock data
        const {
            participantProcessor,
        } = require('./participant-data-processor');
        return participantProcessor.generateTeamEntries(round1Data);
    }

    private combineRealDataForOverall(
        round1Data: LeaderboardEntry[],
        round2Data: LeaderboardEntry[],
        teamData: TeamEntry[]
    ): OverallEntry[] {
        // Similar logic to mock data generator
        const round2Map = new Map(
            round2Data.map((entry) => [entry.hackerRankId, entry])
        );
        const teamScoreMap = new Map<string, number>();

        // Calculate team scores for each participant
        teamData.forEach((team) => {
            const teamScore = Math.floor(team.totalPoints / 2);
            teamScoreMap.set(team.member1.hackerRankId, teamScore);
            teamScoreMap.set(team.member2.hackerRankId, teamScore);
        });

        const overallEntries = round1Data.map((round1Entry) => {
            const round2Entry = round2Map.get(round1Entry.hackerRankId);
            const teamScore = teamScoreMap.get(round1Entry.hackerRankId) || 0;

            const totalPoints =
                round1Entry.totalPoints +
                (round2Entry?.totalPoints || 0) +
                teamScore;

            return {
                id: round1Entry.id,
                rank: 0,
                fullName: round1Entry.fullName,
                hackerRankId: round1Entry.hackerRankId,
                group: round1Entry.group,
                round1Score: round1Entry.totalPoints,
                round2Score: round2Entry?.totalPoints || 0,
                teamScore: teamScore,
                bonus: (round1Entry.bonus || 0) + (round2Entry?.bonus || 0),
                energizer:
                    (round1Entry.energizer || 0) +
                    (round2Entry?.energizer || 0),
                totalPoints: totalPoints,
            };
        });

        return overallEntries
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((entry, index) => ({ ...entry, rank: index + 1 }));
    }

    private aggregateRealDataForGroups(
        overallData: OverallEntry[]
    ): GroupEntry[] {
        // Similar logic to mock data generator
        const groupMap = new Map<string, OverallEntry[]>();

        overallData.forEach((entry) => {
            if (!groupMap.has(entry.group)) {
                groupMap.set(entry.group, []);
            }
            groupMap.get(entry.group)!.push(entry);
        });

        const groupEntries: GroupEntry[] = [];
        let groupId = 1;

        groupMap.forEach((members, group) => {
            const totalScore = members.reduce(
                (sum, member) => sum + member.totalPoints,
                0
            );
            const averageScore = totalScore / members.length;

            const leaderboardMembers: LeaderboardEntry[] = members.map(
                (member) => ({
                    id: member.id,
                    rank: member.rank,
                    fullName: member.fullName,
                    hackerRankId: member.hackerRankId,
                    group: member.group,
                    scores: [],
                    totalPoints: member.totalPoints,
                    bonus: member.bonus,
                    energizer: member.energizer,
                })
            );

            groupEntries.push({
                id: groupId++,
                rank: 0,
                groupId: group,
                totalScore: totalScore,
                memberCount: members.length,
                members: leaderboardMembers,
                averageScore: Math.round(averageScore * 100) / 100,
            });
        });

        return groupEntries
            .sort((a, b) => b.totalScore - a.totalScore)
            .map((group, index) => ({ ...group, rank: index + 1 }));
    }

    /**
     * Test API connections
     */
    public async testApiConnections(): Promise<{
        hackerrank: { success: boolean; message: string };
        firebase: { success: boolean; message: string };
    }> {
        const results = {
            hackerrank: { success: false, message: '' },
            firebase: { success: false, message: '' },
        };

        // Test HackerRank API
        try {
            if (this.baseUrls.round1 && this.apiToken) {
                const response = await fetch(this.baseUrls.round1, {
                    headers: {
                        Authorization: `Bearer ${this.apiToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    results.hackerrank = {
                        success: true,
                        message: 'HackerRank API connection successful',
                    };
                } else {
                    results.hackerrank = {
                        success: false,
                        message: `HackerRank API error: ${response.status}`,
                    };
                }
            } else {
                results.hackerrank = {
                    success: false,
                    message: 'HackerRank API configuration missing',
                };
            }
        } catch (error) {
            results.hackerrank = {
                success: false,
                message: `HackerRank API error: ${error}`,
            };
        }

        // Test Firebase connection
        try {
            if (this.baseUrls.firebase) {
                const response = await fetch(
                    `${this.baseUrls.firebase}/participants.json`
                );

                if (response.ok) {
                    results.firebase = {
                        success: true,
                        message: 'Firebase connection successful',
                    };
                } else {
                    results.firebase = {
                        success: false,
                        message: `Firebase error: ${response.status}`,
                    };
                }
            } else {
                results.firebase = {
                    success: false,
                    message: 'Firebase configuration missing',
                };
            }
        } catch (error) {
            results.firebase = {
                success: false,
                message: `Firebase error: ${error}`,
            };
        }

        return results;
    }

    /**
     * Get current configuration
     */
    public getConfiguration(): {
        useMockData: boolean;
        hasApiToken: boolean;
        hasApiUrls: boolean;
    } {
        return {
            useMockData: this.useMockData,
            hasApiToken: !!this.apiToken,
            hasApiUrls: !!(this.baseUrls.round1 && this.baseUrls.round2),
        };
    }

    /**
     * Switch between mock and real data (for testing)
     */
    public setUseMockData(useMock: boolean): void {
        this.useMockData = useMock;
    }
}

// Export singleton instance
export const dataService = DataService.getInstance();
