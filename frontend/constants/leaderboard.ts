export const LEADERBOARD_CONFIG = {
  ROUNDS: [1, 2] as const,
  QUESTIONS_COUNT: 6,
  GROUPS: ["G1", "G2", "G3"] as const,
  REFRESH_INTERVAL: 30000,
  MAX_PARTICIPANTS: 100,
} as const

export const COLORS = {
  PRIMARY: "#F58C29",
  SECONDARY: "#15284C",
  SUCCESS: "#10B981",
  ERROR: "#EF4444",
  WARNING: "#F59E0B",
} as const
