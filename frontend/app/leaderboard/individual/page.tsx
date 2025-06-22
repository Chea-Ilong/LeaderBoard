"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function IndividualLeaderboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to round 1 by default using environment variable
    const defaultRoundId = process.env.NEXT_PUBLIC_ROUND_1_ID || "tests/2154916"
    router.replace(`/leaderboard/individual/${defaultRoundId}`)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 py-4 sm:py-8 lg:py-12">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Redirecting to Individual Leaderboard...</h1>
        </div>
      </div>
    </div>
  )
}
