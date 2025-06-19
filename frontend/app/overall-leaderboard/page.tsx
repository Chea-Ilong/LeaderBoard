"use client"

import { fetchLeaderboardData, type CandidateData } from "@/services/api"
import { useState } from "react"

export default function OverallLeaderboard() {
  const [candidates, setCandidates] = useState<CandidateData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const testApi = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await fetchLeaderboardData()
      setCandidates(data)
    } catch (err) {
      setError("Something went wrong")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Overall Leaderboard page</h1>
      <p>This is where the Overall Leaderboard interface will be.</p>

      <button
        onClick={testApi}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Data"}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="space-y-4">
        {candidates.map((candidate, index) => (
          <div key={index} className="mb-4 p-4 border rounded bg-white shadow">
            <p>
              <strong>Email:</strong> {candidate.email}
            </p>
            <p>
              <strong>Score:</strong> {candidate.score}
            </p>
            {candidate.questions && Object.keys(candidate.questions).length > 0 ? (
              <div className="mt-2">
                <p className="font-semibold">Questions:</p>
                <ul className="list-disc list-inside">
                  {Object.entries(candidate.questions).map(([questionId, score]) => (
                    <li key={questionId}>
                      Question ID: <strong>{questionId}</strong> - Score: <strong>{score}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 italic">No questions</p>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
