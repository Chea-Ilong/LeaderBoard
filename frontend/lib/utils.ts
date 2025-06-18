import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
