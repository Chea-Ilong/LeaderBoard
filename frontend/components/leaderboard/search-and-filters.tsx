"use client"

import { useState, useEffect } from "react"
import { Search, RefreshCw, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchAndFiltersProps {
  filters: {
    search: string
    group: string
    participantsPerPage: number
  }
  onFiltersChange: (filters: any) => void
  onRefresh: () => void
  totalResults: number
  isRefreshing: boolean
  showScoreFilter?: boolean
}

export function SearchAndFilters({
  filters,
  onFiltersChange,
  onRefresh,
  totalResults,
  isRefreshing,
  showScoreFilter = true,
}: SearchAndFiltersProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(filters.search || "")

  // Update local search term when filters change
  useEffect(() => {
    setLocalSearchTerm(filters.search || "")
  }, [filters.search])

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value)
    onFiltersChange({ ...filters, search: value })
  }

  const handleGroupChange = (value: string) => {
    onFiltersChange({ ...filters, group: value })
  }

  const handlePageSizeChange = (value: string) => {
    onFiltersChange({ ...filters, participantsPerPage: Number.parseInt(value) })
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white rounded-2xl p-6 shadow-lg">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search by name or group..."
            value={localSearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-12 border-2 rounded-xl font-medium text-base"
          />
        </div>

        {/* Group Filter */}
        <div className="w-full sm:w-48">
          <Select value={filters.group || "All"} onValueChange={handleGroupChange}>
            <SelectTrigger className="h-12 border-2 rounded-xl font-medium text-base">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Groups</SelectItem>
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i + 1} value={`G${i + 1}`}>
                  Group {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page Size Selector */}
        <div className="w-full sm:w-32">
          <Select value={(filters.participantsPerPage || 25).toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-12 border-2 rounded-xl font-medium text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Refresh Button */}
        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-12 px-6 bg-orange-400 hover:bg-orange-500 text-white rounded-xl font-medium text-base"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-gray-600">
        <span className="font-medium">
          Showing {totalResults} {totalResults === 1 ? "participant" : "participants"}
        </span>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Live Updates</span>
        </div>
      </div>
    </div>
  )
}
