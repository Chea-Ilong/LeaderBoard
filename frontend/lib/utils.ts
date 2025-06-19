import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { LeaderboardEntry } from "@/types/leaderboard"
import type { CandidateData } from "@/services/api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(score: number): string {
  return score.toString()
}

export function getRankSuffix(rank: number): string {
  if (rank % 100 >= 11 && rank % 100 <= 13) {
    return "th"
  }
  switch (rank % 10) {
    case 1:
      return "st"
    case 2:
      return "nd"
    case 3:
      return "rd"
    default:
      return "th"
  }
}

export function calculateTotalPoints(scores: number[], bonus: number): number {
  return scores.reduce((sum, score) => sum + score, 0) + bonus
}

export function getInitials(name: string | undefined): string {
  if (!name) return "??"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString()
}

export function transformCandidateToLeaderboardEntry(candidate: CandidateData, index: number): LeaderboardEntry {
  // Extract question scores and pad to 6 questions if needed
  const questionScores = Object.values(candidate.questions || {})
  const scores = Array(6)
    .fill(0)
    .map((_, i) => questionScores[i] || 0)

  // Extract name from email (before @)
  const fullName = candidate.email.split("@")[0].replace(/[._]/g, " ")

  // Assign group based on index (cycling through G1, G2, G3)
  const groups = ["G1", "G2", "G3"]
  const group = groups[index % 3]

  return {
    id: index + 1,
    rank: index + 1,
    fullName: fullName,
    hackerRankId: candidate.email,
    group: group,
    scores: scores,
    bonus: 0, // You can calculate bonus based on your logic
    totalPoints: candidate.score,
  }
}

export function transformApiDataToLeaderboard(candidates: CandidateData[]): LeaderboardEntry[] {
  // Sort candidates by score in descending order
  const sortedCandidates = [...candidates].sort((a, b) => b.score - a.score)

  // Transform to leaderboard entries with proper ranking
  return sortedCandidates.map((candidate, index) => transformCandidateToLeaderboardEntry(candidate, index))
}
