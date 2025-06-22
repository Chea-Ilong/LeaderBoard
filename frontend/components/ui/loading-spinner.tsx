import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: number // Tailwind width/height value in px (defaults to 24)
}

/**
 * A minimal tailwind-based spinner.
 * Usage: <LoadingSpinner />  or  <LoadingSpinner size={32} />
 */
export function LoadingSpinner({ className, size = 24 }: LoadingSpinnerProps) {
  const dim = `${size}px`
  return (
    <div role="status" aria-label="Loading" className={cn("flex items-center justify-center", className)}>
      <span
        className="animate-spin rounded-full border-4 border-t-transparent border-gray-300"
        style={{ width: dim, height: dim }}
      />
    </div>
  )
}
