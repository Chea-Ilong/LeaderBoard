export interface LeaderboardEntry {
    id: number;
    rank: number;
    fullName: string;
    hackerRankId: string;
    group: string;
    scores: number[];
    totalPoints: number;
    bonus?: number;
    energizer?: number;
    avatar?: string;
}

export interface OverallEntry {
    id: number;
    rank: number;
    fullName: string;
    hackerRankId: string;
    group: string;
    round1Score: number;
    round2Score: number;
    teamScore: number;
    bonus: number;
    energizer: number;
    totalPoints: number;
}

export interface TeamEntry {
    id: number;
    rank: number;
    teamName: string;
    member1: LeaderboardEntry;
    member2: LeaderboardEntry;
    totalPoints: number;
    combinedScores: number[];
}

export interface GroupEntry {
    id: number;
    rank: number;
    groupId: string; // G1, G2, G3, etc.
    totalScore: number;
    memberCount: number;
    members: LeaderboardEntry[];
    averageScore: number;
}

export interface LeaderboardResponse {
    success: boolean;
    round: number;
    data: LeaderboardEntry[];
    timestamp: string;
    error?: string;
    message?: string;
    totalCount: number;
    hasMore: boolean;
}

export interface HackerRankApiResponse {
    models: Array<{
        hacker: string;
        score: number;
        rank: number;
    }>;
}

export type LeaderboardType = 'individual' | 'team' | 'overall' | 'group';

export interface LeaderboardFilters {
    search: string;
    group: string;
    participantsPerPage: number; // Added participants per page filter
}

export interface PaginationState {
    currentTab: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
}

export interface AdminUser {
    name: string;
    password: string;
}

export interface AdminData {
    participants: LeaderboardEntry[];
    teams: TeamEntry[];
}

// Participant data from CSV/Excel files
export interface ParticipantData {
    name: string;
    email: string;
    group: number;
}

// Mock data generation interfaces
export interface MockDataConfig {
    useRealParticipants: boolean;
    generateTeams: boolean;
    scoreVariation: 'low' | 'medium' | 'high';
    includeBonus: boolean;
    includeEnergizer: boolean;
}

export interface MockScoreRange {
    min: number;
    max: number;
    problemCount: number;
}
