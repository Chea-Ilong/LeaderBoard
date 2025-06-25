"use client"

import { useState } from "react"
import { LeaderboardHeader } from "@/components/leaderboard/leaderboard-header"
import { SearchAndFilters } from "@/components/leaderboard/search-and-filters"
import { OverallLeaderboardTable } from "@/components/leaderboard/overall-leaderboard-table"
import { useOverallLeaderboard } from "@/hooks/use-overall-leaderboard"

export default function OverallLeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const { leaderboardData, loading, error, refetch, refreshing } = useOverallLeaderboard()

  const filteredData = leaderboardData.filter((entry) => {
    const matchesSearch = entry.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGroup = selectedGroup === "all" || entry.group === selectedGroup
    return matchesSearch && matchesGroup
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 py-4 sm:py-8 lg:py-12">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <LeaderboardHeader title="Overall Leaderboard" subtitle="Combined Rankings from All Rounds" />

        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedGroup={selectedGroup}
          onGroupChange={setSelectedGroup}
          onRefresh={refetch}
          isRefreshing={refreshing}
          totalParticipants={leaderboardData.length}
          filteredCount={filteredData.length}
        />

        <OverallLeaderboardTable data={filteredData} loading={loading} error={error} onRetry={refetch} />
      </div>
    </div>
  )
}
