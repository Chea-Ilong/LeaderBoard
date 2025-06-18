"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "./button"
import { COLORS } from "@/constants/leaderboard"

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-red-600">
      <AlertCircle className="w-8 h-8 mb-2" />
      <span className="mb-4">Error: {message}</span>
      {onRetry && (
        <Button onClick={onRetry} style={{ backgroundColor: COLORS.PRIMARY }} className="text-white hover:opacity-90">
          Retry
        </Button>
      )}
    </div>
  )
}
