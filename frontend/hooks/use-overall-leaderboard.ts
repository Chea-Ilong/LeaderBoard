"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { OverallEntry, LeaderboardFilters, PaginationState } from "@/types/leaderboard"
import { fetchRound1Data, fetchRound2Data, fetchTeamLeaderboardData } from "@/services/api"
import { transformApiDataToOverall } from "@/lib/utils"
import { LEADERBOARD_CONFIG } from "@/constants/leaderboard"

export function useOverallLeaderboard() {
  const [overallData, setOverallData] = useState<OverallEntry[]>([])
  const [filteredData, setFilteredData] = useState<OverallEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<LeaderboardFilters>({
    search: "",
    group: "All",
    participantsPerPage: LEADERBOARD_CONFIG.DEFAULT_PARTICIPANTS_PER_PAGE,
  })
  const [pagination, setPagination] = useState<PaginationState>({
    currentTab: 1,
    currentPage: 1,
    totalPages: 1,
    hasMore: false,
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch from all sources: Round 1, Round 2, and Team
      // Team data is crucial for calculating team scores for each member
      const [round1, round2, team] = await Promise.all([
        fetchRound1Data(), // returns CandidateData[]
        fetchRound2Data(), // returns CandidateData[]
        fetchTeamLeaderboardData(), // returns CandidateData[]
      ])

      // Transform data with proper team score integration
      const transformedData = transformApiDataToOverall(round1, round2, team)

      setOverallData(transformedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching data")
      console.error("Overall leaderboard fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const applyFilters = useCallback(() => {
    let filtered = [...overallData]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.fullName.toLowerCase().includes(searchTerm) || entry.hackerRankId.toLowerCase().includes(searchTerm),
      )
    }

    // Group filter
    if (filters.group !== "All") {
      filtered = filtered.filter((entry) => entry.group === filters.group)
    }

    setFilteredData(filtered)

    // Update pagination
    const totalPages = Math.ceil(filtered.length / filters.participantsPerPage)
    setPagination((prev) => ({
      ...prev,
      totalPages,
      currentPage: Math.min(prev.currentPage, totalPages || 1),
    }))
  }, [overallData, filters])

  const updateFilters = useCallback((newFilters: Partial<LeaderboardFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }, [])

  const changePage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Apply filters when data or filters change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Set up live updates to keep team scores synchronized
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      fetchData()
    }, LEADERBOARD_CONFIG.LIVE_UPDATE_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchData])

  return {
    overallData: filteredData,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    changePage,
    refetch: fetchData,
  }
}
