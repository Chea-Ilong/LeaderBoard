"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LegacyIndividualLeaderboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Default to Round 1 identifier from env (falls back to tests/2154916)
    const round1 = process.env.NEXT_PUBLIC_ROUND_1_ID || "tests/2154916"
    router.replace(`/leaderboard/individual/${round1}`)
  }, [router])

  return null
}
