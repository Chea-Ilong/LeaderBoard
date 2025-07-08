"use client"

import { useState, useEffect, useCallback } from "react"
import type { GroupEntry, LeaderboardFilters, PaginationState } from "@/types/leaderboard"
import { fetchLeaderboardData } from "@/lib/api"
import { transformApiDataToLeaderboard, transformApiDataToGroups } from "@/lib/utils"
import { LEADERBOARD_CONFIG } from "@/lib/constants"

/**
 * React hook for fetching, filtering and paginating group-based leaderboards.
 * Groups students by their group ID (G1, G2, G3, etc.) and aggregates their scores.
 */
export function useGroupLeaderboard(roundId: string = "1") {
  /* ---------- STATE ---------- */
  const [groupData, setGroupData] = useState<GroupEntry[]>([])
  const [filteredData, setFilteredData] = useState<GroupEntry[]>([])
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

  /* ---------- DATA FETCHING ---------- */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch individual leaderboard data
      const apiData = await fetchLeaderboardData()
      
      // Transform to individual entries first
      const individualEntries = transformApiDataToLeaderboard(apiData)
      
      // Then transform to group entries
      const groupEntries = transformApiDataToGroups(individualEntries)

      setGroupData(groupEntries)
    } catch (err) {
      console.error("Error fetching group leaderboard data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch group data")
    } finally {
      setLoading(false)
    }
  }, [])

  /* ---------- FILTERING ---------- */
  const applyFilters = useCallback(() => {
    let filtered = [...groupData]

    // Search filter (by group ID)
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim()
      filtered = filtered.filter((group) =>
        group.groupId.toLowerCase().includes(searchTerm)
      )
    }

    // Group filter (specific group)
    if (filters.group !== "All") {
      filtered = filtered.filter((group) => group.groupId === filters.group)
    }

    setFilteredData(filtered)

    // Update pagination
    const totalPages = Math.ceil(filtered.length / filters.participantsPerPage)
    setPagination((prev) => ({
      ...prev,
      totalPages,
      currentPage: Math.min(prev.currentPage, totalPages || 1),
      hasMore: filtered.length > filters.participantsPerPage,
    }))
  }, [groupData, filters])

  /* ---------- PAGINATION ---------- */
  const getPaginatedData = useCallback(() => {
    const startIndex = (pagination.currentPage - 1) * filters.participantsPerPage
    const endIndex = startIndex + filters.participantsPerPage
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, pagination.currentPage, filters.participantsPerPage])

  const changePage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }, [])

  const changeTab = useCallback((tab: number) => {
    setPagination((prev) => ({ ...prev, currentTab: tab, currentPage: 1 }))
  }, [])

  /* ---------- FILTER UPDATES ---------- */
  const updateFilters = useCallback((newFilters: Partial<LeaderboardFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPagination((prev) => ({ ...prev, currentPage: 1 })) // Reset to first page
  }, [])

  /* ---------- EFFECTS ---------- */
  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  /* ---------- RETURN ---------- */
  return {
    // Data
    groupData: getPaginatedData(),
    allGroupData: groupData,
    filteredData,
    
    // State
    loading,
    error,
    
    // Filters
    filters,
    updateFilters,
    
    // Pagination
    pagination,
    changePage,
    changeTab,
    
    // Actions
    refetch: fetchData,
  }
}
