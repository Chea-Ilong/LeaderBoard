"use client"

import { useState } from "react"
import { SearchAndFilters } from "@/components/leaderboard/search-and-filters"
import { TeamLeaderboardRow } from "@/components/leaderboard/team-leaderboard-row"
import { TeamLeaderboardHeader } from "@/components/leaderboard/team-leaderboard-header"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { Pagination } from "@/components/leaderboard/pagination"
import { useTeamLeaderboard } from "@/hooks/use-team-leaderboard"
import { COLORS } from "@/constants/leaderboard"

export default function TeamLeaderboardPage() {
  const { teamData, loading, error, filters, pagination, updateFilters, changePage, refetch } = useTeamLeaderboard()

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  if (loading && teamData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 py-8 lg:py-12">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 py-8 lg:py-12">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-8">
          <ErrorMessage message={error} onRetry={refetch} />
        </div>
      </div>
    )
  }

  const startIndex = (pagination.currentPage - 1) * filters.participantsPerPage
  const endIndex = startIndex + filters.participantsPerPage
  const paginatedData = teamData.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 py-8 lg:py-12">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl lg:text-6xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6 leading-tight">
            CADT Freshman Coding Competition
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 font-medium mb-6">Team Leaderboard - Team Competition</p>

          {/* Status Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8 text-gray-500 text-base">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="font-medium">Live Updates</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">{teamData.length} Teams</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">Team Competition</span>
            </div>
          </div>

          <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Search and Filters */}
        <SearchAndFilters
          filters={filters}
          onFiltersChange={updateFilters}
          onRefresh={handleRefresh}
          totalResults={teamData.length}
          isRefreshing={isRefreshing}
          showScoreFilter={false}
        />

        {/* Leaderboard Table */}
        <div className="rounded-2xl p-6 lg:p-8 overflow-hidden shadow-lg" style={{ backgroundColor: COLORS.SECONDARY }}>
          <TeamLeaderboardHeader />

          {/* Mobile Header */}
          <div className="lg:hidden mb-6">
            <div
              className="rounded-2xl px-4 py-3 text-center text-white font-medium text-xl"
              style={{ backgroundColor: COLORS.PRIMARY }}
            >
              CADT Team Leaderboard
            </div>
          </div>

          {/* Data Rows */}
          <div className="space-y-4 lg:space-y-6">
            {paginatedData.map((team) => (
              <TeamLeaderboardRow key={team.id} team={team} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={changePage}
            className="mt-8"
          />
        </div>
      </div>
    </div>
  )
}
