import { COLORS, LEADERBOARD_CONFIG } from "@/constants/leaderboard"

export function LeaderboardTableHeader() {
  const headerItems = [
    { label: "Rank", width: "w-24 xl:w-28" },
    { label: "Full Name", width: "flex-1 min-w-0 max-w-xs" },
    { label: "Group", width: "w-24 xl:w-28" },
    { label: "Bonus", width: "w-24 xl:w-28" },
    { label: "Total Points", width: "w-28 xl:w-32" },
  ]

  const questions = Array.from({ length: LEADERBOARD_CONFIG.QUESTIONS_COUNT }, (_, i) => i + 1)

  return (
    <div className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-6 mb-8">
      {headerItems.slice(0, 3).map((item) => (
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
            Question
          </div>
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.PRIMARY }}>
            <div className="grid grid-cols-6 h-6">
              {questions.map((num) => (
                <div
                  key={num}
                  className="flex items-center justify-center text-white font-bold text-sm xl:text-base border-r border-white/20 last:border-r-0"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {headerItems.slice(3).map((item) => (
        <div key={item.label} className={`flex-shrink-0 ${item.width}`}>
          <div
            className="rounded-2xl px-4 py-4 text-center h-16 flex items-center justify-center text-white font-bold text-lg xl:text-xl leading-tight"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
