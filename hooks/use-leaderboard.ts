'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
    LeaderboardEntry,
    LeaderboardType,
    LeaderboardFilters,
    PaginationState,
} from '@/types/leaderboard';
import { useIndividualLeaderboard } from './use-leaderboard-data';

/**
 * React hook for fetching, filtering and paginating individual- or team-type
 * leaderboards.
 *
 * Filters:
 *   • search (string)
 *   • group (string | "All")
 *   • participantsPerPage (number)  ← NEW
 *
 * Pagination is page-based (no infinite scroll).
 */
export function useLeaderboard(
    roundId: number,
    type: LeaderboardType = 'individual'
) {
    /* ---------- STATE ---------- */
    const [filters, setFilters] = useState<LeaderboardFilters>({
        search: '',
        group: '',
        participantsPerPage: 50,
    });

    const [pagination, setPagination] = useState<PaginationState>({
        currentPage: 1,
        totalPages: 1,
        hasMore: false,
        currentTab: 0,
    });

    // Use our new data hook
    const {
        data: leaderboardData,
        loading,
        error,
        refresh,
    } = useIndividualLeaderboard(roundId, filters);
    const [filteredData, setFilteredData] = useState<LeaderboardEntry[]>([]);

    // Update filtered data when leaderboard data changes
    useEffect(() => {
        setFilteredData(leaderboardData);
        // Update pagination
        const totalPages = Math.max(
            1,
            Math.ceil(leaderboardData.length / filters.participantsPerPage)
        );
        setPagination((prev) => ({
            ...prev,
            totalPages,
            currentPage: Math.min(prev.currentPage, totalPages),
        }));
    }, [leaderboardData, filters.participantsPerPage]);

    /* ---------- HELPERS ---------- */
    const updateFilters = (patch: Partial<LeaderboardFilters>) => {
        setFilters((prev) => ({ ...prev, ...patch }));
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
    };

    const changePage = (page: number) =>
        setPagination((p) => ({ ...p, currentPage: page }));

    // slice data for the current page
    const paginatedData = filteredData.slice(
        (pagination.currentPage - 1) * filters.participantsPerPage,
        pagination.currentPage * filters.participantsPerPage
    );

    return {
        leaderboardData: paginatedData,
        loading,
        error,
        filters,
        pagination,
        updateFilters,
        changePage,
        refetch: refresh,
    };
}
