'use client';

import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { GroupLeaderboardRow } from './group-leaderboard-row';
import { GroupLeaderboardHeader } from './group-leaderboard-header';
import { COLORS } from '@/lib/constants';
import type { GroupEntry } from '@/types/leaderboard';

interface GroupLeaderboardTableProps {
    data: GroupEntry[];
    loading: boolean;
    error: string | null;
    onRetry: () => void;
    onGroupClick?: (group: GroupEntry) => void;
}

export function GroupLeaderboardTable({
    data,
    loading,
    error,
    onRetry,
    onGroupClick,
}: GroupLeaderboardTableProps) {
    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={onRetry} />;
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 text-lg font-feather-bold">
                    No group data available
                </div>
                <p className="text-gray-400 mt-2">
                    Groups will appear here once students are assigned to
                    groups.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto p-4 sm:p-6 lg:p-8">
            <div
                className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 overflow-hidden"
                style={{ backgroundColor: COLORS.SECONDARY }}
            >
                <GroupLeaderboardHeader />

                {/* Data Rows */}
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                    {data.map((group) => (
                        <GroupLeaderboardRow
                            key={group.id}
                            group={group}
                            onGroupClick={onGroupClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
