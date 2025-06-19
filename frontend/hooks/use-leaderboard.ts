"use client"

import { useState, useEffect } from "react"
import type { LeaderboardEntry, LeaderboardType } from "@/types/leaderboard"
import { fetchLeaderboardData } from "@/services/api"
import { transformApiDataToLeaderboard } from "@/lib/utils"

export function useLeaderboard(round: number, type: LeaderboardType = "individual") {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch real data from API
      const candidates = await fetchLeaderboardData()

      // Transform API data to leaderboard format
      const transformedData = transformApiDataToLeaderboard(candidates)

      setLeaderboardData(transformedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching data")
      console.error("Leaderboard fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [round, type])

  return {
    leaderboardData,
    loading,
    error,
    refetch: fetchData,
  }
}
