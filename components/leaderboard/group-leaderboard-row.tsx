import { COLORS } from '@/lib/constants';
import type { GroupEntry } from '@/types/leaderboard';
import Image from 'next/image';
import { Users, Eye } from 'lucide-react';

interface GroupLeaderboardRowProps {
    group: GroupEntry;
    onGroupClick?: (group: GroupEntry) => void;
}

function getMedalIcon(rank: number): string | null {
    switch (rank) {
        case 1:
            return '/gold-medal.svg';
        case 2:
            return '/silver-medal.svg';
        case 3:
            return '/bronze-medal.svg';
        default:
            return null;
    }
}

function RankDisplay({ rank }: { rank: number }) {
    const medalIcon = getMedalIcon(rank);

    if (medalIcon) {
        return (
            <div className="flex items-center justify-center">
                <Image
                    src={medalIcon}
                    alt={`${rank} place medal`}
                    width={24}
                    height={24}
                />
            </div>
        );
    }

    return (
        <span
            className="font-feather-bold font-bold text-xl"
            style={{ color: COLORS.SECONDARY }}
        >
            {rank}
        </span>
    );
}

function ViewMembersButton({
    onClick,
    className = '',
}: {
    onClick: (e: React.MouseEvent) => void;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`
                inline-flex items-center justify-center gap-2 px-3 py-2
                bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                transition-colors duration-200 shadow-sm hover:shadow-md
                font-feather-bold font-medium text-sm
                ${className}
            `}
            title="View group members"
        >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Show Members</span>
            <span className="sm:hidden">Members</span>
        </button>
    );
}

export function GroupLeaderboardRow({
    group,
    onGroupClick,
}: GroupLeaderboardRowProps) {
    const handleViewMembers = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onGroupClick) {
            onGroupClick(group);
        }
    };

    return (
        <>
            {/* Desktop Layout - Extra Large screens */}
            <div className="hidden xl:grid xl:grid-cols-12 xl:gap-4 rounded-2xl p-2">
                <div className="col-span-1">
                    <div className="bg-white rounded-2xl px-3 py-4 h-16 flex items-center justify-center shadow-sm">
                        <RankDisplay rank={group.rank} />
                    </div>
                </div>
                <div className="col-span-2">
                    <div
                        className="rounded-2xl px-4 py-4 h-16 flex items-center justify-center text-white font-feather-bold font-bold text-2xl"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        {group.groupId}
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center justify-center shadow-sm">
                        <span
                            className="font-feather-bold font-bold text-xl"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            {group.memberCount}
                        </span>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center justify-center shadow-sm">
                        <span
                            className="font-feather-bold font-bold text-xl"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            {group.averageScore}
                        </span>
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center justify-center shadow-sm">
                        <span className="font-feather-bold font-bold text-red-500 text-3xl">
                            {group.totalScore}
                        </span>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="flex items-center justify-center h-16">
                        <ViewMembersButton onClick={handleViewMembers} />
                    </div>
                </div>
            </div>

            {/* Tablet Layout - Large screens */}
            <div className="hidden lg:grid xl:hidden lg:grid-cols-12 lg:gap-3 rounded-xl p-2">
                <div className="col-span-1">
                    <div className="bg-white rounded-xl px-2 py-3 h-14 flex items-center justify-center shadow-sm">
                        <RankDisplay rank={group.rank} />
                    </div>
                </div>
                <div className="col-span-2">
                    <div
                        className="rounded-xl px-3 py-3 h-14 flex items-center justify-center text-white font-feather-bold font-bold text-xl"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        {group.groupId}
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="bg-white rounded-xl px-3 py-3 h-14 flex items-center justify-center shadow-sm">
                        <span
                            className="font-feather-bold font-bold text-base"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            {group.memberCount} Members
                        </span>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="bg-white rounded-xl px-3 py-3 h-14 flex items-center justify-center shadow-sm">
                        <span
                            className="font-feather-bold font-bold text-base"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            Avg: {group.averageScore}
                        </span>
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="bg-white rounded-xl px-3 py-3 h-14 flex items-center justify-center shadow-sm">
                        <span className="font-feather-bold font-bold text-red-500 text-xl">
                            {group.totalScore}
                        </span>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="flex items-center justify-center h-14">
                        <ViewMembersButton
                            onClick={handleViewMembers}
                            className="text-xs px-2 py-1"
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Layout - Small screens */}
            <div className="lg:hidden bg-white rounded-xl p-3 sm:p-4 shadow-lg">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center min-w-0 flex-1">
                        <div
                            className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full mr-3 text-white flex-shrink-0"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            {getMedalIcon(group.rank) ? (
                                <Image
                                    src={getMedalIcon(group.rank)!}
                                    alt={`${group.rank} place medal`}
                                    width={24}
                                    height={24}
                                />
                            ) : (
                                <span className="font-feather-bold font-bold text-white text-lg sm:text-xl">
                                    {group.rank}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div
                                className="font-feather-bold font-bold text-2xl sm:text-3xl"
                                style={{ color: COLORS.PRIMARY }}
                            >
                                {group.groupId}
                            </div>
                            <div className="font-feather-bold text-sm sm:text-base text-gray-600 font-medium">
                                {group.memberCount} Members • Avg:{' '}
                                {group.averageScore}
                            </div>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="font-feather-bold font-bold text-red-500 text-3xl sm:text-4xl">
                            {group.totalScore}
                        </div>
                        <div className="font-feather-bold text-xs text-gray-500 uppercase tracking-wide font-medium">
                            Total Score
                        </div>
                    </div>
                </div>

                {/* Top Members Preview */}
                <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                    <div
                        className="font-feather-bold text-sm sm:text-base font-bold mb-2 text-center"
                        style={{ color: COLORS.SECONDARY }}
                    >
                        Top Members
                    </div>
                    <div className="space-y-1">
                        {group.members.slice(0, 3).map((member, index) => (
                            <div
                                key={member.id}
                                className="flex justify-between items-center bg-white rounded-md px-2 py-1 text-xs sm:text-sm"
                            >
                                <span
                                    className="font-feather-bold font-medium"
                                    style={{ color: COLORS.SECONDARY }}
                                >
                                    {member.fullName}
                                </span>
                                <span className="font-feather-bold font-bold text-red-500">
                                    {member.totalPoints}
                                </span>
                            </div>
                        ))}
                        {group.memberCount > 3 && (
                            <div className="text-center text-xs text-gray-500 mt-1">
                                +{group.memberCount - 3} more members
                            </div>
                        )}
                    </div>
                </div>

                {/* View Members Button */}
                <div className="mt-4 flex justify-center">
                    <ViewMembersButton
                        onClick={handleViewMembers}
                        className="w-full sm:w-auto"
                    />
                </div>
            </div>
        </>
    );
}
