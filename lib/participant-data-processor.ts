import {
    ParticipantData,
    LeaderboardEntry,
    TeamEntry,
    MockDataConfig,
    MockScoreRange,
} from '@/types/leaderboard';

/**
 * Utility class for processing participant data from CSV/Excel files
 * and transforming it into the required TypeScript interfaces
 */
export class ParticipantDataProcessor {
    private static instance: ParticipantDataProcessor;
    private participantData: ParticipantData[] = [];

    private constructor() {}

    public static getInstance(): ParticipantDataProcessor {
        if (!ParticipantDataProcessor.instance) {
            ParticipantDataProcessor.instance = new ParticipantDataProcessor();
        }
        return ParticipantDataProcessor.instance;
    }

    /**
     * Parse CSV data into ParticipantData array
     */
    public parseCSVData(csvContent: string): ParticipantData[] {
        const lines = csvContent.trim().split('\n');
        const participants: ParticipantData[] = [];

        // Skip header row
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const [name, email, group] = line
                .split(',')
                .map((field) => field.trim());

            if (name && email && group) {
                participants.push({
                    name: this.cleanName(name),
                    email: this.cleanEmail(email),
                    group: parseInt(group, 10),
                });
            }
        }

        this.participantData = participants;
        return participants;
    }

    /**
     * Clean and format participant names
     */
    private cleanName(name: string): string {
        return name
            .replace(/['"]/g, '') // Remove quotes
            .trim()
            .split(' ')
            .map(
                (part) =>
                    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join(' ');
    }

    /**
     * Clean and validate email addresses
     */
    private cleanEmail(email: string): string {
        return email
            .replace(/['"]/g, '') // Remove quotes
            .trim()
            .toLowerCase();
    }

    /**
     * Generate HackerRank-style usernames from email addresses
     */
    public generateHackerRankId(email: string): string {
        const username = email.split('@')[0];
        return username.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    }

    /**
     * Transform participant data into LeaderboardEntry format
     */
    public transformToLeaderboardEntries(
        participants: ParticipantData[],
        config: MockDataConfig = {
            useRealParticipants: true,
            generateTeams: false,
            scoreVariation: 'medium',
            includeBonus: true,
            includeEnergizer: true,
        }
    ): LeaderboardEntry[] {
        return participants.map((participant, index) => ({
            id: index + 1,
            rank: 0, // Will be calculated after scoring
            fullName: participant.name,
            hackerRankId: this.generateHackerRankId(participant.email),
            group: `G${participant.group}`,
            scores: this.generateMockScores(config.scoreVariation),
            totalPoints: 0, // Will be calculated from scores
            bonus: config.includeBonus ? this.generateBonusScore() : 0,
            energizer: config.includeEnergizer
                ? this.generateEnergizerScore()
                : 0,
            avatar: this.generateAvatarUrl(participant.name),
        }));
    }

    /**
     * Generate realistic mock scores based on variation level
     */
    private generateMockScores(variation: 'low' | 'medium' | 'high'): number[] {
        const scoreRanges: Record<string, MockScoreRange> = {
            low: { min: 15, max: 25, problemCount: 6 },
            medium: { min: 10, max: 25, problemCount: 6 },
            high: { min: 0, max: 25, problemCount: 6 },
        };

        const range = scoreRanges[variation];
        const scores: number[] = [];

        for (let i = 0; i < range.problemCount; i++) {
            // Generate scores with some realistic distribution
            const baseScore =
                Math.random() * (range.max - range.min) + range.min;
            const roundedScore = Math.round(baseScore);
            scores.push(Math.max(0, roundedScore));
        }

        return scores;
    }

    /**
     * Generate realistic competitive programming scores with proper distribution
     * This creates more realistic score patterns for competitive programming contests
     */
    public generateRealisticCompetitiveProgrammingScores(
        participantName: string,
        round: number = 1,
        difficulty: 'easy' | 'medium' | 'hard' = 'medium'
    ): { [key: string]: number } {
        // Seed random number generator based on participant name and round for consistency
        const seed = this.hashString(participantName + round.toString());
        const rng = this.seededRandom(seed);

        // Define problem difficulty and max scores
        const problemConfigs = [
            {
                id: 'problem_1',
                name: 'Algorithm 1',
                maxScore: 40,
                difficulty: 0.7,
            }, // Easier
            {
                id: 'problem_2',
                name: 'Algorithm 2',
                maxScore: 35,
                difficulty: 0.6,
            }, // Easier
            {
                id: 'problem_3',
                name: 'Data Structure',
                maxScore: 45,
                difficulty: 0.5,
            }, // Medium
            {
                id: 'problem_4',
                name: 'Dynamic Programming',
                maxScore: 50,
                difficulty: 0.4,
            }, // Harder
            {
                id: 'problem_5',
                name: 'Graph Theory',
                maxScore: 30,
                difficulty: 0.3,
            }, // Harder
            {
                id: 'problem_6',
                name: 'Advanced Problem',
                maxScore: 60,
                difficulty: 0.2,
            }, // Hardest
        ];

        const scores: { [key: string]: number } = {};

        // Determine participant skill level based on name hash (consistent per participant)
        const skillLevel = (this.hashString(participantName) % 100) / 100; // 0-1

        // Adjust skill level based on difficulty setting
        const difficultyMultiplier = {
            easy: 1.3,
            medium: 1.0,
            hard: 0.7,
        }[difficulty];

        const adjustedSkillLevel = Math.min(
            1,
            skillLevel * difficultyMultiplier
        );

        problemConfigs.forEach((problem, index) => {
            // Calculate success probability based on skill level and problem difficulty
            const successProbability = Math.min(
                0.95,
                adjustedSkillLevel * problem.difficulty + 0.1
            );

            // Determine if participant attempts this problem (harder problems less likely to be attempted)
            const attemptProbability = Math.max(0.3, successProbability * 1.2);

            if (rng() < attemptProbability) {
                if (rng() < successProbability) {
                    // Full or partial success
                    const completionRate = 0.6 + rng() * 0.4; // 60-100% completion
                    const baseScore = Math.floor(
                        problem.maxScore * completionRate
                    );

                    // Add some randomness for partial credit scenarios
                    const variation = Math.floor((rng() - 0.5) * 10);
                    scores[problem.id] = Math.max(
                        0,
                        Math.min(problem.maxScore, baseScore + variation)
                    );
                } else {
                    // Partial credit for attempt
                    const partialCredit = rng() * 0.3; // 0-30% of max score
                    scores[problem.id] = Math.floor(
                        problem.maxScore * partialCredit
                    );
                }
            }
            // If not attempted, score remains undefined (not included in scores object)
        });

        return scores;
    }

    /**
     * Simple hash function for consistent randomization
     */
    private hashString(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    /**
     * Seeded random number generator for consistent results
     */
    private seededRandom(seed: number): () => number {
        let currentSeed = seed;
        return () => {
            currentSeed = (currentSeed * 9301 + 49297) % 233280;
            return currentSeed / 233280;
        };
    }

    /**
     * Generate bonus scores (0-15 points)
     */
    private generateBonusScore(): number {
        return Math.floor(Math.random() * 16); // 0-15
    }

    /**
     * Generate energizer scores (0-10 points)
     */
    private generateEnergizerScore(): number {
        return Math.floor(Math.random() * 11); // 0-10
    }

    /**
     * Generate avatar URL based on participant name
     */
    private generateAvatarUrl(name: string): string {
        const initials = name
            .split(' ')
            .map((part) => part.charAt(0))
            .join('')
            .toUpperCase();

        // Using a placeholder avatar service
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(
            initials
        )}&background=random&color=fff&size=128`;
    }

    /**
     * Calculate total points and assign ranks
     */
    public calculateRankingsAndTotals(
        entries: LeaderboardEntry[]
    ): LeaderboardEntry[] {
        // Calculate total points for each entry
        const entriesWithTotals = entries.map((entry) => ({
            ...entry,
            totalPoints:
                entry.scores.reduce((sum, score) => sum + score, 0) +
                (entry.bonus || 0) +
                (entry.energizer || 0),
        }));

        // Sort by total points (descending) and assign ranks
        const sortedEntries = entriesWithTotals
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((entry, index) => ({
                ...entry,
                rank: index + 1,
            }));

        return sortedEntries;
    }

    /**
     * Generate team assignments from participants
     */
    public generateTeamEntries(participants: LeaderboardEntry[]): TeamEntry[] {
        const teams: TeamEntry[] = [];
        const shuffledParticipants = [...participants].sort(
            () => Math.random() - 0.5
        );

        for (let i = 0; i < shuffledParticipants.length - 1; i += 2) {
            const member1 = shuffledParticipants[i];
            const member2 = shuffledParticipants[i + 1];

            if (member1 && member2) {
                const combinedScores = member1.scores.map(
                    (score, index) => score + (member2.scores[index] || 0)
                );

                teams.push({
                    id: Math.floor(i / 2) + 1,
                    rank: 0, // Will be calculated later
                    teamName: `Team ${Math.floor(i / 2) + 1}`,
                    member1,
                    member2,
                    totalPoints: member1.totalPoints + member2.totalPoints,
                    combinedScores,
                });
            }
        }

        // Sort teams by total points and assign ranks
        return teams
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((team, index) => ({
                ...team,
                rank: index + 1,
            }));
    }

    /**
     * Get participants by group
     */
    public getParticipantsByGroup(
        participants: ParticipantData[]
    ): Map<number, ParticipantData[]> {
        const groupMap = new Map<number, ParticipantData[]>();

        participants.forEach((participant) => {
            if (!groupMap.has(participant.group)) {
                groupMap.set(participant.group, []);
            }
            groupMap.get(participant.group)!.push(participant);
        });

        return groupMap;
    }

    /**
     * Validate participant data
     */
    public validateParticipantData(participants: ParticipantData[]): {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    } {
        const errors: string[] = [];
        const warnings: string[] = [];
        const emailSet = new Set<string>();
        const nameSet = new Set<string>();

        participants.forEach((participant, index) => {
            // Check for required fields
            if (!participant.name) {
                errors.push(`Row ${index + 1}: Missing name`);
            }
            if (!participant.email) {
                errors.push(`Row ${index + 1}: Missing email`);
            }
            if (
                !participant.group ||
                participant.group < 1 ||
                participant.group > 10
            ) {
                errors.push(`Row ${index + 1}: Invalid group (must be 1-10)`);
            }

            // Check for duplicates
            if (participant.email) {
                if (emailSet.has(participant.email)) {
                    warnings.push(
                        `Duplicate email found: ${participant.email}`
                    );
                }
                emailSet.add(participant.email);
            }

            if (participant.name) {
                if (nameSet.has(participant.name)) {
                    warnings.push(`Duplicate name found: ${participant.name}`);
                }
                nameSet.add(participant.name);
            }

            // Validate email format
            if (participant.email && !participant.email.includes('@')) {
                errors.push(`Row ${index + 1}: Invalid email format`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }

    /**
     * Get current participant data
     */
    public getParticipantData(): ParticipantData[] {
        return this.participantData;
    }

    /**
     * Get statistics about the participant data
     */
    public getDataStatistics(participants: ParticipantData[]): {
        totalParticipants: number;
        groupDistribution: Record<number, number>;
        emailDomains: Record<string, number>;
    } {
        const groupDistribution: Record<number, number> = {};
        const emailDomains: Record<string, number> = {};

        participants.forEach((participant) => {
            // Group distribution
            groupDistribution[participant.group] =
                (groupDistribution[participant.group] || 0) + 1;

            // Email domain distribution
            const domain = participant.email.split('@')[1];
            if (domain) {
                emailDomains[domain] = (emailDomains[domain] || 0) + 1;
            }
        });

        return {
            totalParticipants: participants.length,
            groupDistribution,
            emailDomains,
        };
    }
}

// Export singleton instance
export const participantProcessor = ParticipantDataProcessor.getInstance();
