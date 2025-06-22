"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchRound2Data } from "@/services/api"
import type { LeaderboardEntry, LeaderboardFilters } from "@/types/leaderboard"
import { transformApiDataToLeaderboard } from "@/lib/utils"

interface UseRound2LeaderboardReturn {
  leaderboardData: LeaderboardEntry[]
  loading: boolean
  error: string | null
  filters: LeaderboardFilters
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
  updateFilters: (newFilters: Partial<LeaderboardFilters>) => void
  changePage: (page: number) => void
  refetch: () => Promise<void>
}

export function useRound2Leaderboard(): UseRound2LeaderboardReturn {
  const [allData, setAllData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<LeaderboardFilters>({
    search: "",
    group: "all",
    participantsPerPage: 25,
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  })

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching Round 2 data...")
      const data = await fetchRound2Data()
      console.log("Raw Round 2 data received:", data)

      // Transform API data to LeaderboardEntry format
      const convertedData = transformApiDataToLeaderboard(data)
      console.log("Converted Round 2 data:", convertedData)

      setAllData(convertedData)
    } catch (err) {
      console.error("Round 2 fetch error:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch Round 2 data")
      setAllData([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const updateFilters = useCallback((newFilters: Partial<LeaderboardFilters>) => {
    console.log("Updating filters:", newFilters)
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPagination((prev) => ({ ...prev, currentPage: 1 })) // Reset to first page when filters change
  }, [])

  const changePage = useCallback(
    (page: number) => {
      console.log("Changing to page:", page)
      if (page >= 1 && page <= pagination.totalPages) {
        setPagination((prev) => ({ ...prev, currentPage: page }))
      }
    },
    [pagination.totalPages],
  )

  const refetch = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  // Apply client-side filtering
  const filteredData = allData.filter((entry) => {
    if (!entry) return false

    const matchesSearch =
      !filters.search ||
      (entry.fullName && entry.fullName.toLowerCase().includes(filters.search.toLowerCase())) ||
      (entry.hackerRankId && entry.hackerRankId.toLowerCase().includes(filters.search.toLowerCase()))

    const matchesGroup = filters.group === "all" || entry.group === filters.group

    return matchesSearch && matchesGroup
  })

  // Apply pagination
  const totalItems = filteredData.length
  const totalPages = Math.max(1, Math.ceil(totalItems / filters.participantsPerPage))
  const currentPage = Math.min(pagination.currentPage, totalPages)

  const startIndex = (currentPage - 1) * filters.participantsPerPage
  const endIndex = startIndex + filters.participantsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  // Update pagination state if needed
  useEffect(() => {
    setPagination((prev) => ({
      currentPage: Math.min(prev.currentPage, totalPages),
      totalPages,
      totalItems,
    }))
  }, [totalItems, totalPages])

  return {
    leaderboardData: paginatedData,
    loading,
    error,
    filters,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
    },
    updateFilters,
    changePage,
    refetch,
  }
}
