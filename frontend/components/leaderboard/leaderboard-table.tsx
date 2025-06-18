"use client"

import { useState } from "react"
import { useLeaderboard } from "@/hooks/use-leaderboard"
import { RoundSelector } from "./round-selector"
import { LeaderboardRow } from "./leaderboard-row"
import { LeaderboardTableHeader } from "./leaderboard-table-header"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { COLORS } from "@/constants/leaderboard"
import type { LeaderboardType } from "@/types/leaderboard"

interface LeaderboardTableProps {
  type: LeaderboardType
}

export function LeaderboardTable({ type }: LeaderboardTableProps) {
  const [activeRound, setActiveRound] = useState(1)
  const { leaderboardData, loading, error, refetch } = useLeaderboard(activeRound, type)

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
      <RoundSelector activeRound={activeRound} onRoundChange={setActiveRound} />

      <div
        className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 overflow-hidden"
        style={{ backgroundColor: COLORS.SECONDARY }}
      >
        <LeaderboardTableHeader />

        {/* Mobile Header */}
        <div className="lg:hidden mb-4 sm:mb-6">
          <div
            className="rounded-2xl px-4 py-3 text-center text-white font-bold text-lg sm:text-xl"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            CADT Leaderboard
          </div>
        </div>

        {/* Data Rows */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {leaderboardData.map((entry) => (
            <LeaderboardRow key={entry.id} entry={entry} />
          ))}
        </div>

        {/* Stats Footer */}
        <div className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-white/20">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
              {leaderboardData.length}
            </div>
            <div className="text-gray-300 text-xs sm:text-sm lg:text-base font-medium">Participants</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-white/20">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">6</div>
            <div className="text-gray-300 text-xs sm:text-sm lg:text-base font-medium">Questions</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-white/20">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2" style={{ color: COLORS.PRIMARY }}>
              {Math.max(...leaderboardData.map((d) => d.totalPoints))}
            </div>
            <div className="text-gray-300 text-xs sm:text-sm lg:text-base font-medium">Highest Score</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-white/20 col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">R1</div>
            <div className="text-gray-300 text-xs sm:text-sm lg:text-base font-medium">Active Round</div>
          </div>
        </div>
      </div>
    </div>
  )
}
