import { Loader2 } from "lucide-react"
import { COLORS } from "@/constants/leaderboard"

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: COLORS.PRIMARY }} />
      <span className="ml-2 text-gray-600">Loading leaderboard...</span>
    </div>
  )
}
