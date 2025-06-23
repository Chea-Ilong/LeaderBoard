import { Star, Zap } from "lucide-react"
import { COLORS } from "@/lib/constants"
import type { OverallEntry } from "@/types/leaderboard"

interface OverallLeaderboardRowProps {
  entry: OverallEntry
}

export function OverallLeaderboardRow({ entry }: OverallLeaderboardRowProps) {
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-6">
        {/* Rank - Removed icon */}
        <div className="flex-shrink-0 w-20 xl:w-24">
          <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center justify-center">
            <span className="font-bold text-lg xl:text-xl" style={{ color: COLORS.SECONDARY }}>
              {entry.rank}
            </span>
          </div>
        </div>

        {/* Full Name */}
        <div className="flex-1 min-w-0 max-w-xs">
          <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center">
            <span className="font-semibold text-lg xl:text-xl truncate" style={{ color: COLORS.SECONDARY }}>
              {entry.fullName}
            </span>
          </div>
        </div>

        {/* Group */}
        <div className="flex-shrink-0 w-20 xl:w-24">
          <div
            className="rounded-2xl px-4 py-4 h-16 flex items-center justify-center text-white font-bold text-lg xl:text-xl"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            {entry.group}
          </div>
        </div>

        {/* Round 1 Score */}
        <div className="flex-shrink-0 w-24 xl:w-28">
          <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center justify-center">
            <span className="font-bold text-lg xl:text-xl" style={{ color: COLORS.SECONDARY }}>
              {entry.round1Score}
            </span>
          </div>
        </div>

        {/* Round 2 Score */}
        <div className="flex-shrink-0 w-24 xl:w-28">
          <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center justify-center">
            <span className="font-bold text-lg xl:text-xl" style={{ color: COLORS.SECONDARY }}>
              {entry.round2Score}
            </span>
          </div>
        </div>

        {/* Team Score */}
        <div className="flex-shrink-0 w-24 xl:w-28">
          <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center justify-center">
            <span className="font-bold text-lg xl:text-xl" style={{ color: COLORS.SECONDARY }}>
              {entry.teamScore}
            </span>
          </div>
        </div>

        {/* Bonus */}
        <div className="flex-shrink-0 w-20 xl:w-24">
          <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center justify-center">
            <Star className="w-4 h-4 mr-1 text-yellow-500" />
            <span className="font-bold text-lg xl:text-xl text-yellow-600">{entry.bonus}</span>
          </div>
        </div>

        {/* Energizer */}
        <div className="flex-shrink-0 w-24 xl:w-28">
          <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center justify-center">
            <Zap className="w-4 h-4 mr-1 text-purple-500" />
            <span className="font-bold text-lg xl:text-xl text-purple-600">{entry.energizer}</span>
          </div>
        </div>

        {/* Total Points */}
        <div className="flex-shrink-0 w-24 xl:w-28">
          <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center justify-center">
            <span className="font-bold text-red-500 text-xl xl:text-2xl">{entry.totalPoints}</span>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
        {/* Header Row - Removed icon from mobile rank display */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center min-w-0 flex-1">
            <div
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full mr-4 text-white flex-shrink-0"
              style={{ backgroundColor: COLORS.PRIMARY }}
            >
              <span className="font-bold text-white text-lg sm:text-xl">{entry.rank}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-lg sm:text-xl truncate" style={{ color: COLORS.SECONDARY }}>
                {entry.fullName}
              </div>
              <div className="text-sm text-gray-600 truncate">Group {entry.group}</div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-bold text-red-500 text-2xl sm:text-3xl">{entry.totalPoints}</div>
            <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">Total Points</div>
          </div>
        </div>

        {/* Scores Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="text-sm font-semibold text-blue-700 mb-1">Round 1</div>
            <div className="font-bold text-xl text-blue-600">{entry.round1Score}</div>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <div className="text-sm font-semibold text-green-700 mb-1">Round 2</div>
            <div className="font-bold text-xl text-green-600">{entry.round2Score}</div>
          </div>
          <div className="bg-indigo-50 rounded-xl p-3 text-center">
            <div className="text-sm font-semibold text-indigo-700 mb-1">Team Score</div>
            <div className="font-bold text-xl text-indigo-600">{entry.teamScore}</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm font-semibold text-yellow-700">Bonus</span>
            </div>
            <div className="font-bold text-xl text-yellow-600">{entry.bonus}</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-sm font-semibold text-purple-700">Energizer</span>
            </div>
            <div className="font-bold text-xl text-purple-600">{entry.energizer}</div>
          </div>
        </div>
      </div>
    </>
  )
}
