import { LeaderboardHeader } from "@/components/leaderboard/leaderboard-header"
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table"

export default function IndividualLeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 py-4 sm:py-8 lg:py-12">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <LeaderboardHeader title="Individual Leaderboard" subtitle="Live Rankings" />
        <LeaderboardTable type="individual" />
       
      </div>
    </div>
  )
}
