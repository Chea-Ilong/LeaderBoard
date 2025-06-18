import { LeaderboardHeader } from "@/components/leaderboard/leaderboard-header"

export default function TeamLeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 py-4 sm:py-8 lg:py-12">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <LeaderboardHeader title="Team Leaderboard" subtitle="Team Rankings" />
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Team Leaderboard Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              We're working on bringing you comprehensive team rankings and statistics. Check back soon for team-based
              competition results!
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-orange-800 text-sm">
                <strong>Features in development:</strong>
                <br />• Team performance analytics
                <br />• Group collaboration metrics
                <br />• Inter-team comparisons
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
