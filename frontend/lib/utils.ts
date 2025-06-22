import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { LeaderboardEntry, TeamEntry, OverallEntry } from "@/types/leaderboard"
import type { CandidateData } from "@/services/api"

/* -------------------------------------------------------------------------- */
/*  Generic helpers                                                           */
/* -------------------------------------------------------------------------- */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(score: number) {
  if (isNaN(score) || score === null || score === undefined) {
    return "0"
  }
  return Math.round(score).toString()
}

export function getRankSuffix(rank: number) {
  if (isNaN(rank) || rank === null || rank === undefined) {
    return "th"
  }
  if (rank % 100 >= 11 && rank % 100 <= 13) return "th"
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

export function calculateTotalPoints(scores: number[], bonus = 0, energizer = 0) {
  const validScores = scores.filter((score) => !isNaN(score) && score !== null && score !== undefined)
  const scoresSum = validScores.reduce((sum, s) => sum + s, 0)
  const validBonus = isNaN(bonus) ? 0 : bonus
  const validEnergizer = isNaN(energizer) ? 0 : energizer
  return scoresSum + validBonus + validEnergizer
}

export function formatTimestamp(timestamp: string) {
  try {
    return new Date(timestamp).toLocaleString()
  } catch {
    return "Invalid Date"
  }
}

/* -------------------------------------------------------------------------- */
/*  Group assignment helper                                                   */
/* -------------------------------------------------------------------------- */

function generateGroup(email: string, index: number): string {
  // Try to extract group from email if it contains group info
  const emailLower = email.toLowerCase()

  // Check for group patterns in email
  const groupMatch = emailLower.match(/[._-]?g(\d+)[._-]?/) || emailLower.match(/group[._-]?(\d+)/)
  if (groupMatch) {
    const groupNum = Number.parseInt(groupMatch[1])
    if (groupNum >= 1 && groupNum <= 20) {
      return `G${groupNum}`
    }
  }

  // Check for class/section patterns
  const classMatch = emailLower.match(/[._-]?(class|section|sec)[._-]?([a-z]|\d+)/)
  if (classMatch) {
    const classId = classMatch[2].toUpperCase()
    // Convert to group number (A=1, B=2, etc.)
    if (classId.match(/[A-Z]/)) {
      const groupNum = classId.charCodeAt(0) - 64 // A=1, B=2, etc.
      if (groupNum >= 1 && groupNum <= 20) {
        return `G${groupNum}`
      }
    }
  }

  // Fallback: distribute evenly across groups based on index
  const groupNum = (index % 20) + 1
  return `G${groupNum}`
}

/* -------------------------------------------------------------------------- */
/*  INDIVIDUAL leaderboard helpers                                            */
/* -------------------------------------------------------------------------- */

/**
 * Turn a single Candidate record into a LeaderboardEntry
 */
export function transformCandidateToLeaderboardEntry(candidate: CandidateData, index: number): LeaderboardEntry {
  // Ensure candidate data is valid
  if (!candidate || typeof candidate !== "object") {
    console.warn("Invalid candidate data:", candidate)
    return createDefaultLeaderboardEntry(index)
  }

  // Extract and validate question scores - they should already be in q1, q2, q3 format from the API service
  const questionScores = candidate.questions || {}
  const scores = Array.from({ length: 6 }, (_, i) => {
    const questionKey = `q${i + 1}`
    const score = questionScores[questionKey]
    const numericScore = Number.parseFloat(score as any)
    return isNaN(numericScore) ? 0 : Math.round(numericScore)
  })

  // Derive name from email with validation
  const email = candidate.email || `participant${index + 1}@example.com`
  const fullName = email
    .split("@")[0]
    .replace(/\./g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())

  // Validate and parse total score
  const totalScore = Number.parseFloat(candidate.score as any)
  const validTotalScore = isNaN(totalScore) ? 0 : Math.round(totalScore)

  // Generate group assignment
  const group = generateGroup(email, index)

  return {
    id: index + 1,
    rank: index + 1,
    fullName,
    hackerRankId: email,
    group,
    scores,
    totalPoints: validTotalScore,
    bonus: 0,
    energizer: 0,
  }
}

function createDefaultLeaderboardEntry(index: number): LeaderboardEntry {
  return {
    id: index + 1,
    rank: index + 1,
    fullName: `Participant ${index + 1}`,
    hackerRankId: `participant${index + 1}@example.com`,
    group: generateGroup(`participant${index + 1}@example.com`, index),
    scores: [0, 0, 0, 0, 0, 0],
    totalPoints: 0,
    bonus: 0,
    energizer: 0,
  }
}

/**
 * Convert an array of Candidates into ranked LeaderboardEntries
 */
export function transformApiDataToLeaderboard(candidates: CandidateData[]): LeaderboardEntry[] {
  if (!Array.isArray(candidates)) {
    console.warn("Invalid candidates array:", candidates)
    return []
  }

  // Filter out invalid candidates and sort by score
  const validCandidates = candidates.filter((c) => c && typeof c === "object")
  const sorted = [...validCandidates].sort((a, b) => {
    const scoreA = Number.parseFloat(a.score as any) || 0
    const scoreB = Number.parseFloat(b.score as any) || 0
    return scoreB - scoreA
  })

  return sorted.map((c, i) => transformCandidateToLeaderboardEntry(c, i))
}

/* -------------------------------------------------------------------------- */
/*  TEAM leaderboard helpers                                                  */
/* -------------------------------------------------------------------------- */

export function transformApiDataToTeams(candidates: CandidateData[]): TeamEntry[] {
  console.log("transformApiDataToTeams input:", candidates)

  if (!Array.isArray(candidates)) {
    console.warn("Invalid candidates array for teams:", candidates)
    return []
  }

  if (candidates.length === 0) {
    console.warn("Empty candidates array for teams")
    return []
  }

  // Check if this is already team data (emails contain "team.")
  const isTeamData = candidates.some((c) => c.email && c.email.includes("team."))

  if (isTeamData) {
    console.log("Processing team-specific data")
    // Transform team candidates directly into team entries
    return candidates
      .map((candidate, index) => {
        const teamName = candidate.email
          .split("@")[0]
          .replace("team.", "")
          .replace(/\b\w/g, (l) => l.toUpperCase())

        // Create mock team members from the team data
        const member1: LeaderboardEntry = {
          id: index * 2 + 1,
          rank: index + 1,
          fullName: `${teamName} Member 1`,
          hackerRankId: `${candidate.email.split("@")[0]}.member1@${candidate.email.split("@")[1]}`,
          group: generateGroup(candidate.email, index * 2),
          scores: Object.values(candidate.questions || {}).map((score) => Math.round((score as number) / 2)),
          totalPoints: Math.round(candidate.score / 2),
          bonus: 0,
          energizer: 0,
        }

        const member2: LeaderboardEntry = {
          id: index * 2 + 2,
          rank: index + 1,
          fullName: `${teamName} Member 2`,
          hackerRankId: `${candidate.email.split("@")[0]}.member2@${candidate.email.split("@")[1]}`,
          group: generateGroup(candidate.email, index * 2 + 1),
          scores: Object.values(candidate.questions || {}).map((score) => Math.round((score as number) / 2)),
          totalPoints: Math.round(candidate.score / 2),
          bonus: 0,
          energizer: 0,
        }

        const combinedScores = Object.values(candidate.questions || {}).map((score) =>
          isNaN(score as number) ? 0 : Math.round(score as number),
        )

        return {
          id: index + 1,
          rank: index + 1,
          teamName: `Team ${teamName}`,
          member1,
          member2,
          combinedScores,
          totalPoints: isNaN(candidate.score) ? 0 : Math.round(candidate.score),
        }
      })
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((team, idx) => ({ ...team, rank: idx + 1 }))
  }

  // Otherwise, treat as individual participants and pair them
  const participants = transformApiDataToLeaderboard(candidates)
  const teams: TeamEntry[] = []

  console.log("Pairing individual participants into teams:", participants.length)

  // Simple pairing: 0&1, 2&3, ...
  for (let i = 0; i < participants.length - 1; i += 2) {
    const member1 = participants[i]
    const member2 = participants[i + 1]

    if (!member1 || !member2) continue

    const combinedScores = member1.scores.map((s, idx) => {
      const score1 = isNaN(s) ? 0 : s
      const score2 = isNaN(member2.scores[idx]) ? 0 : member2.scores[idx]
      return score1 + score2
    })

    const totalPoints =
      (isNaN(member1.totalPoints) ? 0 : member1.totalPoints) + (isNaN(member2.totalPoints) ? 0 : member2.totalPoints)

    teams.push({
      id: teams.length + 1,
      rank: teams.length + 1,
      teamName: `Team ${teams.length + 1}`,
      member1,
      member2,
      combinedScores,
      totalPoints,
    })
  }

  console.log("Generated teams:", teams)

  // Sort & re-rank by total
  return teams
    .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
    .map((team, idx) => ({ ...team, rank: idx + 1 }))
}

/* -------------------------------------------------------------------------- */
/*  OVERALL leaderboard helper                                                */
/* -------------------------------------------------------------------------- */

export function transformApiDataToOverall(
  round1: CandidateData[],
  round2: CandidateData[],
  team: CandidateData[],
): OverallEntry[] {
  // Validate inputs
  const validRound1 = Array.isArray(round1) ? round1 : []
  const validRound2 = Array.isArray(round2) ? round2 : []
  const validTeam = Array.isArray(team) ? team : []

  type PartialOverall = Omit<OverallEntry, "rank" | "totalPoints">
  const map = new Map<string, PartialOverall>()

  const nameFromEmail = (email: string) => {
    if (!email || typeof email !== "string") {
      return "Unknown Participant"
    }
    return email
      .split("@")[0]
      .replace(/\./g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const upsert = (source: CandidateData[], key: "round1Score" | "round2Score" | "teamScore") => {
    source.forEach((c, index) => {
      if (!c || typeof c !== "object" || !c.email) {
        console.warn("Invalid candidate in overall data:", c)
        return
      }

      const existing =
        map.get(c.email) ||
        ({
          id: map.size + 1,
          fullName: nameFromEmail(c.email),
          hackerRankId: c.email,
          group: generateGroup(c.email, index),
          round1Score: 0,
          round2Score: 0,
          teamScore: 0,
          bonus: 0,
          energizer: 0,
        } as PartialOverall)

      const score = Number.parseFloat(c.score as any)
      existing[key] = isNaN(score) ? 0 : Math.round(score)
      map.set(c.email, existing)
    })
  }

  upsert(validRound1, "round1Score")
  upsert(validRound2, "round2Score")
  upsert(validTeam, "teamScore")

  const overall: OverallEntry[] = Array.from(map.values()).map((p) => {
    const totalPoints =
      (p.round1Score || 0) + (p.round2Score || 0) + (p.teamScore || 0) + (p.bonus || 0) + (p.energizer || 0)
    return {
      ...p,
      totalPoints: isNaN(totalPoints) ? 0 : totalPoints,
    }
  })

  overall.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
  overall.forEach((p, i) => (p.rank = i + 1))

  return overall
}
