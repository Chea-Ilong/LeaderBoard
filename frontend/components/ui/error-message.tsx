"use client"

import { AlertTriangle, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
}

/**
 * Generic error feedback block with an optional retry button.
 */
export function ErrorMessage({ message = "Something went wrong", onRetry }: ErrorMessageProps) {
  return (
    <div className="w-full flex flex-col items-center gap-4 py-10">
      <AlertTriangle className="h-8 w-8 text-red-500" />
      <p className="text-red-600 font-medium">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RotateCw className="w-4 h-4" /> Retry
        </Button>
      )}
    </div>
  )
}
