import { COLORS, LEADERBOARD_CONFIG } from "@/lib/constants"

export function TeamLeaderboardHeader() {
  const questions = Array.from({ length: LEADERBOARD_CONFIG.QUESTIONS_COUNT }, (_, i) => i + 1)

  return (
    <div className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-6 mb-8">
      {/* Rank Header */}
      <div className="flex-shrink-0 w-20 xl:w-24">
        <div
          className="rounded-2xl px-4 py-4 text-center h-16 flex items-center justify-center text-white font-bold text-lg xl:text-xl"
          style={{ backgroundColor: COLORS.PRIMARY }}
        >
          Rank
        </div>
      </div>

      {/* Team Name Header */}
      <div className="flex-shrink-0 w-48 xl:w-56">
        <div
          className="rounded-2xl px-4 py-4 text-center h-16 flex items-center justify-center text-white font-bold text-lg xl:text-xl"
          style={{ backgroundColor: COLORS.PRIMARY }}
        >
          Team Name
        </div>
      </div>

      {/* Team Members Header */}
      <div className="flex-1 min-w-0">
        <div
          className="rounded-2xl px-4 py-4 text-center h-16 flex items-center justify-center text-white font-bold text-lg xl:text-xl"
          style={{ backgroundColor: COLORS.PRIMARY }}
        >
          Team Members
        </div>
      </div>

      {/* Combined Scores Header */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl px-2 py-1 h-16 flex flex-col justify-center overflow-hidden">
          <div className="font-bold text-lg xl:text-xl text-center mb-1" style={{ color: COLORS.SECONDARY }}>
            Combined Scores
          </div>
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.PRIMARY }}>
            <div className="grid grid-cols-6 h-6">
              {questions.map((num) => (
                <div
                  key={num}
                  className="flex items-center justify-center text-white  text-sm xl:text-base border-r border-white/20 last:border-r-0"
                >
                  Q{num}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Total Points Header */}
      <div className="flex-shrink-0 w-24 xl:w-28">
        <div
          className="rounded-2xl px-4 py-4 text-center h-16 flex items-center justify-center text-white font-bold text-lg xl:text-xl leading-tight"
          style={{ backgroundColor: COLORS.PRIMARY }}
        >
          Total
        </div>
      </div>
    </div>
  )
}
