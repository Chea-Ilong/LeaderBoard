"use client"

import { useState, useEffect } from "react"
import type { LeaderboardEntry, LeaderboardType } from "@/types/leaderboard"
import { MOCK_LEADERBOARD_DATA } from "@/constants/mock-data"

export function useLeaderboard(round: number, type: LeaderboardType = "individual") {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // TODO: Replace with actual API integration
      // const response = await leaderboardService.getLeaderboard(round, type)
      setLeaderboardData(MOCK_LEADERBOARD_DATA)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboardData()
  }, [round, type])

  return {
    leaderboardData,
    loading,
    error,
    refetch: fetchLeaderboardData,
  }
}
