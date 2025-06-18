import { LeaderboardHeader } from "@/components/leaderboard/leaderboard-header"

export default function OverallLeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 py-4 sm:py-8 lg:py-12">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <LeaderboardHeader title="Overall Leaderboard" subtitle="Combined Rankings" />
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Overall Rankings Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              The comprehensive overall leaderboard will combine results from all rounds and competitions. Stay tuned
              for the complete performance overview!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Will include:</strong>
                <br />• Multi-round aggregated scores
                <br />• Historical performance trends
                <br />• Cross-competition rankings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
