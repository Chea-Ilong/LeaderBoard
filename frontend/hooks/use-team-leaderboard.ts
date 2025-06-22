"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { TeamEntry, LeaderboardFilters, PaginationState } from "@/types/leaderboard"
import { fetchTeamLeaderboardData } from "@/services/api"
import { transformApiDataToTeams } from "@/lib/utils"
import { LEADERBOARD_CONFIG } from "@/constants/leaderboard"

export function useTeamLeaderboard() {
  const [teamData, setTeamData] = useState<TeamEntry[]>([])
  const [filteredData, setFilteredData] = useState<TeamEntry[]>([])
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

      console.log("Fetching team leaderboard data...")

      // Fetch the raw candidate data
      const candidateData = await fetchTeamLeaderboardData()
      console.log("Raw team candidate data:", candidateData)

      // Transform candidates into team entries
      const transformedTeams = transformApiDataToTeams(candidateData)
      console.log("Transformed team data:", transformedTeams)

      setTeamData(transformedTeams)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching team data"
      setError(errorMessage)
      console.error("Team leaderboard fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const applyFilters = useCallback(() => {
    let filtered = [...teamData]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(
        (team) =>
          team.teamName.toLowerCase().includes(searchTerm) ||
          team.member1.fullName.toLowerCase().includes(searchTerm) ||
          team.member2.fullName.toLowerCase().includes(searchTerm) ||
          team.member1.hackerRankId.toLowerCase().includes(searchTerm) ||
          team.member2.hackerRankId.toLowerCase().includes(searchTerm),
      )
    }

    // Group filter
    if (filters.group !== "All") {
      filtered = filtered.filter((team) => team.member1.group === filters.group || team.member2.group === filters.group)
    }

    setFilteredData(filtered)

    // Update pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / filters.participantsPerPage))
    setPagination((prev) => ({
      ...prev,
      totalPages,
      currentPage: Math.min(prev.currentPage, totalPages),
    }))
  }, [teamData, filters])

  const updateFilters = useCallback((newFilters: Partial<LeaderboardFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }, [])

  const changePage = useCallback((page: number) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, prev.totalPages)),
    }))
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Apply filters when data or filters change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Set up live updates
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
    teamData: filteredData,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    changePage,
    refetch: fetchData,
  }
}
