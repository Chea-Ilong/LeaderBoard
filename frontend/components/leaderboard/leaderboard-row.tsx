import { COLORS } from "@/lib/constants"
import type { LeaderboardEntry } from "@/types/leaderboard"

interface LeaderboardRowProps {
  entry: LeaderboardEntry
}

export function LeaderboardRow({ entry }: LeaderboardRowProps) {
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-6">
        {/* Rank - Removed icon */}
        <div className="flex-shrink-0 w-24 xl:w-28">
          <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center justify-center">
            <span className="font-semibold text-lg xl:text-xl" style={{ color: COLORS.SECONDARY }}>
              {entry.rank}
            </span>
          </div>
        </div>

        {/* Full Name */}
        <div className="flex-1 min-w-0 max-w-xs">
          <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center">
            <span className="font-medium text-lg xl:text-xl truncate" style={{ color: COLORS.SECONDARY }}>
              {entry.fullName}
            </span>
          </div>
        </div>

        {/* Group */}
        <div className="flex-shrink-0 w-24 xl:w-28">
          <div
            className="rounded-2xl px-4 py-4 h-16 flex items-center justify-center text-white font-medium text-lg xl:text-xl"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            {entry.group}
          </div>
        </div>

        {/* Question Scores */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl px-6 py-4 h-16 flex items-center">
            <div className="grid grid-cols-6 gap-2 w-full">
              {entry.scores.map((score, scoreIndex) => (
                <div key={scoreIndex} className="text-center">
                  <span className="font-semibold text-lg xl:text-xl" style={{ color: COLORS.SECONDARY }}>
                    {score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Total Points */}
        <div className="flex-shrink-0 w-28 xl:w-32">
          <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center justify-center">
            <span className="font-semibold text-red-500 text-xl xl:text-2xl">{entry.totalPoints}</span>
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
              <span className="font-semibold text-white text-lg sm:text-xl">{entry.rank}</span>
            </div>
            <div>
              <div className="font-semibold text-lg sm:text-xl" style={{ color: COLORS.SECONDARY }}>
                {entry.fullName}
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Group {entry.group}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-red-500 text-2xl sm:text-3xl">{entry.totalPoints}</div>
            <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium">Total Points</div>
          </div>
        </div>

        {/* Question Scores Row */}
        <div className="mb-4">
          <div className="text-sm sm:text-base font-medium mb-3" style={{ color: COLORS.SECONDARY }}>
            Question Scores
          </div>
          <div className="bg-gray-50 rounded-2xl p-3">
            <div className="text-center font-medium text-sm mb-2" style={{ color: COLORS.SECONDARY }}>
              Question
            </div>
            <div className="rounded-lg overflow-hidden mb-3" style={{ backgroundColor: COLORS.PRIMARY }}>
              <div className="grid grid-cols-6 h-8">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div
                    key={num}
                    className="flex items-center justify-center text-white font-medium text-sm border-r border-white/20 last:border-r-0"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {entry.scores.map((score, scoreIndex) => (
                <div key={scoreIndex} className="bg-white rounded-lg py-2 sm:py-3 text-center shadow-sm">
                  <div className="font-semibold text-lg sm:text-xl" style={{ color: COLORS.SECONDARY }}>
                    {score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
