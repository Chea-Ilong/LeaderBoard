import Link from "next/link"

export default function HomePage() {
  return (
    <main className="flex min-h-screen justify-center items-center text-2xl bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Welcome to CADT Freshman Coding Competition</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Navigate to the Individual Leaderboard to see the competition results
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/leaderboard/individual"
            className="bg-orange-400 text-white px-6 py-3 rounded-lg hover:bg-orange-500 transition-colors font-semibold"
          >
            View Individual Leaderboard
          </Link>
          <Link
            href="/leaderboard/team"
            className="border-2 border-orange-400 text-orange-400 px-6 py-3 rounded-lg hover:bg-orange-400 hover:text-white transition-colors font-semibold"
          >
            View Team Leaderboard
          </Link>
        </div>
      </div>
    </main>
  )
}
