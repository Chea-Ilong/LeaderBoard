export const LEADERBOARD_CONFIG = {
    ROUNDS: [1, 2] as const,
    QUESTIONS_COUNT: 6,
    GROUPS: [
        'G1',
        'G2',
        'G3',
        'G4',
        'G5',
        'G6',
        'G7',
        'G8',
        'G9',
        'G10',
    ] as const,
    REFRESH_INTERVAL: 300000, // 5 minutes in milliseconds
    MAX_PARTICIPANTS: 200, // Increased to support 156+ participants
    PARTICIPANTS_PER_PAGE_OPTIONS: [25, 50, 100, 200] as const, // Added option to show all
    DEFAULT_PARTICIPANTS_PER_PAGE: 200, // Show all participants by default
    PAGINATION_TABS: 4,
    LIVE_UPDATE_INTERVAL: 5 * 60 * 1000, // 5 minutes
} as const;

export const COLORS = {
    PRIMARY: '#F58C29',
    SECONDARY: '#15284C',
    SUCCESS: '#10B981',
    ERROR: '#EF4444',
    WARNING: '#F59E0B',
} as const;

export const FILTER_OPTIONS = {
    GROUPS: [
        'All',
        'G1',
        'G2',
        'G3',
        'G4',
        'G5',
        'G6',
        'G7',
        'G8',
        'G9',
        'G10',
    ] as const,
} as const;
