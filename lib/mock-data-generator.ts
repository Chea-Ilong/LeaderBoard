import {
    LeaderboardEntry,
    TeamEntry,
    GroupEntry,
    OverallEntry,
    MockDataConfig,
    HackerRankApiResponse,
} from '@/types/leaderboard';
import { participantLoader } from './participant-data-loader';
import { participantProcessor } from './participant-data-processor';

/**
 * Comprehensive mock data generator that creates realistic competition data
 * using real participant information while maintaining HackerRank API compatibility
 */
export class MockDataGenerator {
    private static instance: MockDataGenerator;
    private generatedData: {
        round1: LeaderboardEntry[];
        round2: LeaderboardEntry[];
        team: TeamEntry[];
        overall: OverallEntry[];
        groups: GroupEntry[];
    } | null = null;

    private constructor() {}

    public static getInstance(): MockDataGenerator {
        if (!MockDataGenerator.instance) {
            MockDataGenerator.instance = new MockDataGenerator();
        }
        return MockDataGenerator.instance;
    }

    /**
     * Generate complete mock data for all competition rounds
     */
    public async generateAllMockData(
        config: MockDataConfig = {
            useRealParticipants: true,
            generateTeams: true,
            scoreVariation: 'medium',
            includeBonus: true,
            includeEnergizer: true,
        }
    ): Promise<{
        round1: LeaderboardEntry[];
        round2: LeaderboardEntry[];
        team: TeamEntry[];
        overall: OverallEntry[];
        groups: GroupEntry[];
    }> {
        // Check if we have cached data first
        if (this.generatedData && !this.shouldRegenerateData()) {
            return this.generatedData;
        }

        // Try to load from localStorage cache
        const cachedData = this.loadDataFromCache();
        if (cachedData && !this.shouldRegenerateData()) {
            this.generatedData = cachedData;
            return this.generatedData;
        }

        try {
            // Load real participant data
            const participants = await participantLoader.loadParticipantData();

            // Generate Round 1 data
            const round1Data = this.generateRoundData(participants, 1, config);

            // Generate Round 2 data (different scores)
            const round2Data = this.generateRoundData(participants, 2, config);

            // Generate team data
            const teamData = config.generateTeams
                ? this.generateTeamData(round1Data, round2Data)
                : [];

            // Generate overall rankings
            const overallData = this.generateOverallData(
                round1Data,
                round2Data,
                teamData
            );

            // Generate group rankings
            const groupData = this.generateGroupData(overallData);

            this.generatedData = {
                round1: round1Data,
                round2: round2Data,
                team: teamData,
                overall: overallData,
                groups: groupData,
            };

            // Save to cache for persistence
            this.saveDataToCache(this.generatedData);

            return this.generatedData;
        } catch (error) {
            console.error('Failed to generate mock data:', error);
            throw error;
        }
    }

    /**
     * Generate data for a specific round
     */
    private generateRoundData(
        participants: any[],
        round: number,
        config: MockDataConfig
    ): LeaderboardEntry[] {
        const entries = participantProcessor.transformToLeaderboardEntries(
            participants,
            config
        );

        // Add some variation based on round
        const adjustedEntries = entries.map((entry) => ({
            ...entry,
            scores: this.adjustScoresForRound(entry.scores, round),
            bonus: config.includeBonus
                ? this.generateRoundSpecificBonus(round)
                : 0,
            energizer: config.includeEnergizer
                ? this.generateRoundSpecificEnergizer(round)
                : 0,
        }));

        return participantProcessor.calculateRankingsAndTotals(adjustedEntries);
    }

    /**
     * Adjust scores based on round characteristics
     */
    private adjustScoresForRound(
        baseScores: number[],
        round: number
    ): number[] {
        return baseScores.map((score) => {
            let adjustedScore = score;

            // Round 1: Generally easier, higher scores
            if (round === 1) {
                adjustedScore = Math.min(
                    25,
                    score + Math.floor(Math.random() * 5)
                );
            }
            // Round 2: More challenging, lower scores
            else if (round === 2) {
                adjustedScore = Math.max(
                    0,
                    score - Math.floor(Math.random() * 8)
                );
            }

            return adjustedScore;
        });
    }

    /**
     * Generate round-specific bonus scores
     */
    private generateRoundSpecificBonus(round: number): number {
        const baseBonus = Math.floor(Math.random() * 16);

        // Round 1 tends to have higher bonuses
        if (round === 1) {
            return Math.min(15, baseBonus + Math.floor(Math.random() * 3));
        }

        return baseBonus;
    }

    /**
     * Generate round-specific energizer scores
     */
    private generateRoundSpecificEnergizer(round: number): number {
        const baseEnergizer = Math.floor(Math.random() * 11);

        // Round 2 might have more energizer opportunities
        if (round === 2) {
            return Math.min(10, baseEnergizer + Math.floor(Math.random() * 2));
        }

        return baseEnergizer;
    }

    /**
     * Generate team competition data
     */
    private generateTeamData(
        round1Data: LeaderboardEntry[],
        round2Data: LeaderboardEntry[]
    ): TeamEntry[] {
        // Create a map for quick lookup of round 2 scores
        const round2Map = new Map(
            round2Data.map((entry) => [entry.hackerRankId, entry])
        );

        // Generate teams from round 1 data
        const teams = participantProcessor.generateTeamEntries(round1Data);

        // Enhance teams with round 2 data and team-specific scores
        const enhancedTeams = teams.map((team) => {
            const member1Round2 = round2Map.get(team.member1.hackerRankId);
            const member2Round2 = round2Map.get(team.member2.hackerRankId);

            // Calculate team score as combination of both rounds
            const teamTotalPoints =
                team.member1.totalPoints +
                team.member2.totalPoints +
                (member1Round2?.totalPoints || 0) +
                (member2Round2?.totalPoints || 0);

            return {
                ...team,
                totalPoints: teamTotalPoints,
                combinedScores: team.combinedScores.map(
                    (score, index) =>
                        score +
                        (member1Round2?.scores[index] || 0) +
                        (member2Round2?.scores[index] || 0)
                ),
            };
        });

        // Re-rank teams based on updated scores
        return enhancedTeams
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((team, index) => ({
                ...team,
                rank: index + 1,
            }));
    }

    /**
     * Generate overall competition rankings
     */
    private generateOverallData(
        round1Data: LeaderboardEntry[],
        round2Data: LeaderboardEntry[],
        teamData: TeamEntry[]
    ): OverallEntry[] {
        const round2Map = new Map(
            round2Data.map((entry) => [entry.hackerRankId, entry])
        );
        const teamScoreMap = new Map<string, number>();

        // Calculate team scores for each participant
        teamData.forEach((team) => {
            const teamScore = Math.floor(team.totalPoints / 2); // Divide team score between members
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
                rank: 0, // Will be calculated after sorting
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

        // Sort by total points and assign ranks
        return overallEntries
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((entry, index) => ({
                ...entry,
                rank: index + 1,
            }));
    }

    /**
     * Generate group competition rankings
     */
    private generateGroupData(overallData: OverallEntry[]): GroupEntry[] {
        const groupMap = new Map<string, OverallEntry[]>();

        // Group participants by their group
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

            // Convert OverallEntry to LeaderboardEntry for compatibility
            const leaderboardMembers: LeaderboardEntry[] = members.map(
                (member) => ({
                    id: member.id,
                    rank: member.rank,
                    fullName: member.fullName,
                    hackerRankId: member.hackerRankId,
                    group: member.group,
                    scores: [], // Not needed for group view
                    totalPoints: member.totalPoints,
                    bonus: member.bonus,
                    energizer: member.energizer,
                })
            );

            groupEntries.push({
                id: groupId++,
                rank: 0, // Will be calculated after sorting
                groupId: group,
                totalScore: totalScore,
                memberCount: members.length,
                members: leaderboardMembers,
                averageScore: Math.round(averageScore * 100) / 100,
            });
        });

        // Sort groups by total score and assign ranks
        return groupEntries
            .sort((a, b) => b.totalScore - a.totalScore)
            .map((group, index) => ({
                ...group,
                rank: index + 1,
            }));
    }

    /**
     * Generate HackerRank API compatible response
     */
    public async generateHackerRankApiResponse(
        round: number
    ): Promise<HackerRankApiResponse> {
        const allData = await this.generateAllMockData();
        let roundData: LeaderboardEntry[] = [];

        switch (round) {
            case 1:
                roundData = allData.round1;
                break;
            case 2:
                roundData = allData.round2;
                break;
            default:
                roundData = allData.round1;
        }

        return {
            models: roundData.map((entry) => ({
                hacker: entry.hackerRankId,
                score: entry.totalPoints,
                rank: entry.rank,
            })),
        };
    }

    /**
     * Get mock data for a specific round
     */
    public async getRoundData(round: number): Promise<LeaderboardEntry[]> {
        const allData = await this.generateAllMockData();

        switch (round) {
            case 1:
                return allData.round1;
            case 2:
                return allData.round2;
            default:
                return allData.round1;
        }
    }

    /**
     * Get team data
     */
    public async getTeamData(): Promise<TeamEntry[]> {
        const allData = await this.generateAllMockData();
        return allData.team;
    }

    /**
     * Get overall rankings
     */
    public async getOverallData(): Promise<OverallEntry[]> {
        const allData = await this.generateAllMockData();
        return allData.overall;
    }

    /**
     * Get group rankings
     */
    public async getGroupData(): Promise<GroupEntry[]> {
        const allData = await this.generateAllMockData();
        return allData.groups;
    }

    /**
     * Check if data should be regenerated (for development purposes)
     */
    private shouldRegenerateData(): boolean {
        try {
            // Check if we're in browser environment
            if (typeof window === 'undefined') return true;

            // In development, regenerate data every 5 minutes to see variations
            const lastGenerated = localStorage.getItem(
                'cfcc_mockDataLastGenerated'
            );
            if (!lastGenerated) {
                localStorage.setItem(
                    'cfcc_mockDataLastGenerated',
                    Date.now().toString()
                );
                return true;
            }

            const fiveMinutes = 5 * 60 * 1000;
            return Date.now() - parseInt(lastGenerated) > fiveMinutes;
        } catch (error) {
            // localStorage might not be available (SSR)
            return true;
        }
    }

    /**
     * Save generated data to localStorage for persistence
     */
    private saveDataToCache(data: any): void {
        try {
            // Check if we're in browser environment
            if (typeof window === 'undefined') return;

            const cacheData = {
                data,
                timestamp: Date.now(),
                version: '1.0',
            };
            localStorage.setItem(
                'cfcc_mockDataCache',
                JSON.stringify(cacheData)
            );
            localStorage.setItem(
                'cfcc_mockDataLastGenerated',
                Date.now().toString()
            );
        } catch (error) {
            console.warn('Failed to save data to cache:', error);
        }
    }

    /**
     * Load generated data from localStorage
     */
    private loadDataFromCache(): any | null {
        try {
            // Check if we're in browser environment
            if (typeof window === 'undefined') return null;

            const cached = localStorage.getItem('cfcc_mockDataCache');
            if (!cached) return null;

            const cacheData = JSON.parse(cached);

            // Check if cache is still valid (24 hours)
            const twentyFourHours = 24 * 60 * 60 * 1000;
            if (Date.now() - cacheData.timestamp > twentyFourHours) {
                this.clearCache();
                return null;
            }

            return cacheData.data;
        } catch (error) {
            console.warn('Failed to load data from cache:', error);
            return null;
        }
    }

    /**
     * Clear generated data cache
     */
    public clearCache(): void {
        this.generatedData = null;
        try {
            // Check if we're in browser environment
            if (typeof window === 'undefined') return;

            localStorage.removeItem('cfcc_mockDataLastGenerated');
            localStorage.removeItem('cfcc_mockDataCache');
        } catch (error) {
            console.warn('Failed to clear cache:', error);
        }
    }

    /**
     * Get data statistics
     */
    public async getDataStatistics() {
        const allData = await this.generateAllMockData();

        return {
            totalParticipants: allData.round1.length,
            totalTeams: allData.team.length,
            totalGroups: allData.groups.length,
            averageRound1Score: Math.round(
                allData.round1.reduce(
                    (sum, entry) => sum + entry.totalPoints,
                    0
                ) / allData.round1.length
            ),
            averageRound2Score: Math.round(
                allData.round2.reduce(
                    (sum, entry) => sum + entry.totalPoints,
                    0
                ) / allData.round2.length
            ),
            topScore: Math.max(
                ...allData.overall.map((entry) => entry.totalPoints)
            ),
            groupDistribution: allData.groups.reduce((acc, group) => {
                acc[group.groupId] = group.memberCount;
                return acc;
            }, {} as Record<string, number>),
        };
    }
}

// Export singleton instance
export const mockDataGenerator = MockDataGenerator.getInstance();
