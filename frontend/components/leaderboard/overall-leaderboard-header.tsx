import { COLORS } from "@/constants/leaderboard"

export function OverallLeaderboardHeader() {
  const headerItems = [
    { label: "Rank", width: "w-20 xl:w-24" },
    { label: "Full Name", width: "flex-1 min-w-0 max-w-xs" },
    { label: "Group", width: "w-20 xl:w-24" },
    { label: "Round 1", width: "w-24 xl:w-28" },
    { label: "Round 2", width: "w-24 xl:w-28" },
    { label: "Team", width: "w-20 xl:w-24" },
    { label: "Bonus", width: "w-20 xl:w-24" },
    { label: "Energizer", width: "w-24 xl:w-28" },
    { label: "Total", width: "w-24 xl:w-28" },
  ]

  return (
    <div className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-6 mb-8">
      {headerItems.map((item) => (
        <div key={item.label} className={`flex-shrink-0 ${item.width}`}>
          <div
            className="rounded-2xl px-4 py-4 text-center h-16 flex items-center justify-center text-white font-bold text-lg xl:text-xl"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
