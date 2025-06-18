import { Trophy, Medal, Settings } from "lucide-react"
import { getInitials } from "@/lib/utils"
import { COLORS } from "@/constants/leaderboard"
import type { LeaderboardEntry } from "@/types/leaderboard"

interface LeaderboardRowProps {
  entry: LeaderboardEntry
}

export function LeaderboardRow({ entry }: LeaderboardRowProps) {
  const getBonusIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 xl:w-6 xl:h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-5 h-5 xl:w-6 xl:h-6 text-gray-400" />
    if (rank === 3) return <Medal className="w-5 h-5 xl:w-6 xl:h-6 text-amber-600" />
    return <Settings className="w-5 h-5 xl:w-6 xl:h-6 text-blue-400" />
  }

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-6">
        {/* Rank */}
        <div className="flex-shrink-0 w-24 xl:w-28">
          <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center justify-center">
            <Trophy className="w-5 h-5 xl:w-6 xl:h-6 mr-2" style={{ color: COLORS.PRIMARY }} />
            <span className="font-bold text-lg xl:text-xl" style={{ color: COLORS.SECONDARY }}>
              {entry.rank}
            </span>
          </div>
        </div>

        {/* Full Name */}
        <div className="flex-1 min-w-0 max-w-xs">
          <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center">
            <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-gray-300 mr-3 flex-shrink-0 flex items-center justify-center">
              <span className="text-gray-600 text-sm xl:text-base font-bold">{getInitials(entry.fullName)}</span>
            </div>
            <span className="font-semibold text-lg xl:text-xl truncate" style={{ color: COLORS.SECONDARY }}>
              {entry.fullName}
            </span>
          </div>
        </div>

        {/* Group */}
        <div className="flex-shrink-0 w-24 xl:w-28">
          <div
            className="rounded-2xl px-4 py-4 h-16 flex items-center justify-center text-white font-bold text-lg xl:text-xl"
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
                  <span className="font-bold text-lg xl:text-xl" style={{ color: COLORS.SECONDARY }}>
                    {score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bonus Icon */}
        <div className="flex-shrink-0 w-24 xl:w-28">
          <div className="flex justify-center">
            <div className="w-12 h-12 xl:w-14 xl:h-14 bg-white rounded-2xl flex items-center justify-center">
              {getBonusIcon(entry.rank)}
            </div>
          </div>
        </div>

        {/* Total Points */}
        <div className="flex-shrink-0 w-28 xl:w-32">
          <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center justify-center">
            <span className="font-bold text-red-500 text-xl xl:text-2xl">{entry.totalPoints}</span>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full mr-4 text-white"
              style={{ backgroundColor: COLORS.PRIMARY }}
            >
              <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              <span className="ml-1 font-bold text-white text-lg sm:text-xl">{entry.rank}</span>
            </div>
            <div>
              <div className="font-bold text-lg sm:text-xl" style={{ color: COLORS.SECONDARY }}>
                {entry.fullName}
              </div>
              <div className="text-sm sm:text-base text-gray-600">Group {entry.group}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-red-500 text-2xl sm:text-3xl">{entry.totalPoints}</div>
            <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">Total Points</div>
          </div>
        </div>

        {/* Question Scores Row */}
        <div className="mb-4">
          <div className="text-sm sm:text-base font-semibold mb-3" style={{ color: COLORS.SECONDARY }}>
            Question Scores
          </div>
          <div className="bg-gray-50 rounded-2xl p-3">
            <div className="text-center font-bold text-sm mb-2" style={{ color: COLORS.SECONDARY }}>
              Question
            </div>
            <div className="rounded-lg overflow-hidden mb-3" style={{ backgroundColor: COLORS.PRIMARY }}>
              <div className="grid grid-cols-6 h-8">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div
                    key={num}
                    className="flex items-center justify-center text-white font-bold text-sm border-r border-white/20 last:border-r-0"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {entry.scores.map((score, scoreIndex) => (
                <div key={scoreIndex} className="bg-white rounded-lg py-2 sm:py-3 text-center shadow-sm">
                  <div className="font-bold text-lg sm:text-xl" style={{ color: COLORS.SECONDARY }}>
                    {score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bonus Row */}
        <div className="flex items-center justify-between">
          <div className="text-sm sm:text-base font-semibold" style={{ color: COLORS.SECONDARY }}>
            Bonus Achievement
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center">
            {getBonusIcon(entry.rank)}
          </div>
        </div>
      </div>
    </>
  )
}
