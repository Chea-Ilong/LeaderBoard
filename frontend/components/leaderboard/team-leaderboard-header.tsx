import { COLORS, LEADERBOARD_CONFIG } from "@/constants/leaderboard"

export function TeamLeaderboardHeader() {
  const headerItems = [
    { label: "Rank", width: "w-20 xl:w-24" },
    { label: "Team Members", width: "flex-1 min-w-0" },
    { label: "Total", width: "w-24 xl:w-28" },
  ]

  const questions = Array.from({ length: LEADERBOARD_CONFIG.QUESTIONS_COUNT }, (_, i) => i + 1)

  return (
    <div className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-6 mb-8">
      {headerItems.slice(0, 2).map((item) => (
        <div key={item.label} className={`flex-shrink-0 ${item.width}`}>
          <div
            className="rounded-2xl px-4 py-4 text-center h-16 flex items-center justify-center text-white font-bold text-lg xl:text-xl"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            {item.label}
          </div>
        </div>
      ))}

      {/* Question Header */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl px-4 py-2 h-16 flex flex-col justify-center overflow-hidden">
          <div className="font-bold text-lg xl:text-xl text-center mb-1" style={{ color: COLORS.SECONDARY }}>
            Combined Scores
          </div>
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.PRIMARY }}>
            <div className="grid grid-cols-6 h-6">
              {questions.map((num) => (
                <div
                  key={num}
                  className="flex items-center justify-center text-white font-bold text-sm xl:text-base border-r border-white/20 last:border-r-0"
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
