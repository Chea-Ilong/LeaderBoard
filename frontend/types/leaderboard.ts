export interface LeaderboardEntry {
  id: number
  rank: number
  fullName: string
  hackerRankId: string
  group: string
  scores: number[]
  bonus: number
  totalPoints: number
  avatar?: string
}

export interface LeaderboardResponse {
  success: boolean
  round: number
  data: LeaderboardEntry[]
  timestamp: string
  error?: string
  message?: string
}

export interface HackerRankApiResponse {
  models: Array<{
    hacker: string
    score: number
    rank: number
  }>
}

export type LeaderboardType = "individual" | "team" | "overall"
