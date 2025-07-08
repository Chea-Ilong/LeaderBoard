'use client';

import { useState } from 'react';
import { SearchAndFilters } from '@/components/leaderboard/search-and-filters';
import { GroupLeaderboardTable } from '@/components/leaderboard/group-leaderboard-table';
import { GroupDetailView } from '@/components/leaderboard/group-detail-view';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { Pagination } from '@/components/leaderboard/pagination';
import { useGroupLeaderboard } from '@/hooks/use-group-leaderboard';
import { COLORS } from '@/lib/constants';
import type { GroupEntry } from '@/types/leaderboard';

export default function GroupLeaderboardPage() {
    const [roundId] = useState('1'); // For now, we'll use round 1 data
    const [selectedGroup, setSelectedGroup] = useState<GroupEntry | null>(null);

    const {
        groupData,
        allGroupData,
        loading,
        error,
        filters,
        updateFilters,
        pagination,
        changePage,
        refetch,
    } = useGroupLeaderboard(roundId);

    const handleGroupClick = (group: GroupEntry) => {
        setSelectedGroup(group);
    };

    const handleBackToGroups = () => {
        setSelectedGroup(null);
    };

    // If a group is selected, show the detail view
    if (selectedGroup) {
        return (
            <div className="min-h-screen bg-gray-50 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <GroupDetailView
                        group={selectedGroup}
                        onBack={handleBackToGroups}
                    />
                </div>
            </div>
        );
    }

    const GroupLeaderboardContent = () => (
        <div
            className="rounded-2xl p-6 lg:p-8 overflow-hidden shadow-lg"
            style={{ backgroundColor: COLORS.SECONDARY }}
        >
            {/* Mobile Header */}
            <div className="lg:hidden mb-6">
                <div
                    className="rounded-2xl px-4 py-3 text-center text-white font-feather-bold font-bold text-xl"
                    style={{ backgroundColor: COLORS.PRIMARY }}
                >
                    CADT Group Rankings
                </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-6">
                <div
                    className="rounded-2xl px-6 py-4 text-center text-white font-feather-bold font-bold text-2xl"
                    style={{ backgroundColor: COLORS.PRIMARY }}
                >
                    CADT Group Rankings
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div
                        className="font-feather-bold font-bold text-2xl"
                        style={{ color: COLORS.PRIMARY }}
                    >
                        {allGroupData.length}
                    </div>
                    <div className="font-feather-bold text-sm text-gray-600">
                        Total Groups
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div
                        className="font-feather-bold font-bold text-2xl"
                        style={{ color: COLORS.SECONDARY }}
                    >
                        {allGroupData.reduce(
                            (sum, group) => sum + group.memberCount,
                            0
                        )}
                    </div>
                    <div className="font-feather-bold text-sm text-gray-600">
                        Total Members
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div className="font-feather-bold font-bold text-2xl text-green-600">
                        {allGroupData.length > 0
                            ? Math.max(...allGroupData.map((g) => g.totalScore))
                            : 0}
                    </div>
                    <div className="font-feather-bold text-sm text-gray-600">
                        Highest Score
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div className="font-feather-bold font-bold text-2xl text-blue-600">
                        {allGroupData.length > 0
                            ? Math.round(
                                  (allGroupData.reduce(
                                      (sum, g) => sum + g.averageScore,
                                      0
                                  ) /
                                      allGroupData.length) *
                                      100
                              ) / 100
                            : 0}
                    </div>
                    <div className="font-feather-bold text-sm text-gray-600">
                        Overall Avg
                    </div>
                </div>
            </div>

            {/* Unified Groups Table */}
            <GroupLeaderboardTable
                data={groupData}
                loading={loading}
                error={error}
                onRetry={refetch}
                onGroupClick={handleGroupClick}
            />

            {/* Pagination */}
            {!loading && !error && groupData.length > 0 && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={changePage}
                    className="mt-8"
                />
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search and Filters */}
                <div className="mb-6">
                    <SearchAndFilters
                        filters={filters}
                        onFiltersChange={updateFilters}
                        totalCount={allGroupData.length}
                        showGroupFilter={true}
                        placeholder="Search groups (e.g., G1, G2)..."
                    />
                </div>

                {/* Main Content */}
                <GroupLeaderboardContent />
            </div>
        </div>
    );
}
