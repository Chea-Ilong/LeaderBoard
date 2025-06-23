import { Users } from "lucide-react"
import { COLORS } from "@/lib/constants"
import type { TeamEntry } from "@/types/leaderboard"

interface TeamLeaderboardRowProps {
  team: TeamEntry
}

export function TeamLeaderboardRow({ team }: TeamLeaderboardRowProps) {
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-6">
        {/* Rank - Removed icon */}
        <div className="flex-shrink-0 w-20 xl:w-24">
          <div className="bg-white rounded-2xl px-4 py-4 h-20 flex items-center justify-center">
            <span className="font-bold text-lg xl:text-xl" style={{ color: COLORS.SECONDARY }}>
              {team.rank}
            </span>
          </div>
        </div>

        {/* Team Name */}
        <div className="flex-shrink-0 w-48 xl:w-56">
          <div className="bg-white rounded-2xl px-4 py-4 h-20 flex items-center justify-center">
            <div className="text-center">
              <div className="font-bold text-base xl:text-lg" style={{ color: COLORS.SECONDARY }}>
                {team.teamName}
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl px-6 py-4 h-20 flex items-center justify-center">
            <div className="flex items-center justify-center w-full space-x-8">
              <div className="flex-1 text-center">
                <div className="font-semibold text-base xl:text-lg truncate" style={{ color: COLORS.SECONDARY }}>
                  {team.member1.fullName}
                </div>
              </div>
              <div className="text-gray-400 text-xl font-bold">+</div>
              <div className="flex-1 text-center">
                <div className="font-semibold text-base xl:text-lg truncate" style={{ color: COLORS.SECONDARY }}>
                  {team.member2.fullName}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Combined Question Scores */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl px-6 py-4 h-20 flex items-center">
            <div className="grid grid-cols-6 gap-2 w-full">
              {team.combinedScores.map((score, scoreIndex) => (
                <div key={scoreIndex} className="text-center">
                  <span className="font-bold text-lg xl:text-xl" style={{ color: COLORS.SECONDARY }}>
                    {score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Total Points */}
        <div className="flex-shrink-0 w-24 xl:w-28">
          <div className="bg-white rounded-2xl px-4 py-4 h-20 flex items-center justify-center">
            <span className="font-bold text-red-500 text-xl xl:text-2xl">{team.totalPoints}</span>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
        {/* Header Row - Removed icon from mobile rank display */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full mr-4 text-white"
              style={{ backgroundColor: COLORS.PRIMARY }}
            >
              <span className="font-bold text-white text-lg sm:text-xl">{team.rank}</span>
            </div>
            <div>
              <div className="font-bold text-lg sm:text-xl" style={{ color: COLORS.SECONDARY }}>
                {team.teamName}
              </div>
              <div className="text-sm sm:text-base text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Team of 2
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-red-500 text-2xl sm:text-3xl">{team.totalPoints}</div>
            <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">Total Points</div>
          </div>
        </div>

        {/* Team Members */}
        <div className="mb-4 p-4 bg-gray-50 rounded-xl">
          <div className="text-sm font-semibold mb-3 flex items-center" style={{ color: COLORS.SECONDARY }}>
            <Users className="w-4 h-4 mr-2" />
            Team Members
          </div>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3">
              <div className="font-medium text-sm" style={{ color: COLORS.SECONDARY }}>
                {team.member1.fullName}
              </div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="font-medium text-sm" style={{ color: COLORS.SECONDARY }}>
                {team.member2.fullName}
              </div>
            </div>
          </div>
        </div>

        {/* Combined Scores */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm font-semibold mb-3" style={{ color: COLORS.SECONDARY }}>
            Combined Scores
          </div>
          <div className="grid grid-cols-3 gap-2">
            {team.combinedScores.map((score, index) => (
              <div key={index} className="bg-white rounded-lg py-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Q{index + 1}</div>
                <div className="font-bold text-lg" style={{ color: COLORS.SECONDARY }}>
                  {score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
