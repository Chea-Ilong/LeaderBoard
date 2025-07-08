import { Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { COLORS } from '@/lib/constants';
import type { OverallEntry } from '@/types/leaderboard';
import Image from 'next/image';

interface OverallLeaderboardRowProps {
    entry: OverallEntry;
    previousRank?: number; // For rank change calculation
}

// Simulate rank changes for demo purposes
function getRankChange(
    currentRank: number,
    previousRank?: number
): 'up' | 'down' | 'same' | 'new' {
    if (!previousRank) return 'new';
    if (currentRank < previousRank) return 'up';
    if (currentRank > previousRank) return 'down';
    return 'same';
}

function RankChangeIndicator({
    currentRank,
    previousRank,
}: {
    currentRank: number;
    previousRank?: number;
}) {
    const change = getRankChange(currentRank, previousRank);

    if (change === 'new' || change === 'same') {
        return (
            <div className="flex items-center justify-center w-6 h-6">
                <Minus className="w-4 h-4 text-gray-400" />
            </div>
        );
    }

    if (change === 'up') {
        return (
            <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
            <TrendingDown className="w-4 h-4 text-red-600" />
        </div>
    );
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

export function OverallLeaderboardRow({
    entry,
    previousRank,
}: OverallLeaderboardRowProps) {
    // Simulate previous rank for demo (in real implementation, this would come from API)
    const simulatedPreviousRank =
        previousRank || entry.rank + Math.floor(Math.random() * 6) - 3;
    return (
        <>
            {/* Desktop Layout - Extra Large screens */}
            <div className="hidden xl:grid xl:grid-cols-11 xl:gap-4">
                <div className="col-span-1">
                    <div className="bg-white rounded-2xl px-3 py-4 h-16 flex items-center justify-center shadow-sm">
                        <RankDisplay rank={entry.rank} />
                    </div>
                </div>
                <div className="col-span-3 min-w-0">
                    <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center gap-3 shadow-sm">
                        <RankChangeIndicator
                            currentRank={entry.rank}
                            previousRank={simulatedPreviousRank}
                        />
                        <span
                            className="font-feather-bold font-semibold text-xl truncate"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            {entry.fullName}
                        </span>
                    </div>
                </div>
                <div className="col-span-1">
                    <div
                        className="rounded-2xl px-3 py-4 h-16 flex items-center justify-center text-white font-feather-bold font-bold text-xl"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        {entry.group}
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="bg-white rounded-2xl px-3 py-4 h-16 flex items-center justify-center shadow-sm">
                        <span
                            className="font-feather-bold font-bold text-xl"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            {entry.round1Score}
                        </span>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="bg-white rounded-2xl px-3 py-4 h-16 flex items-center justify-center shadow-sm">
                        <span
                            className="font-feather-bold font-bold text-xl"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            {entry.round2Score}
                        </span>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="bg-white rounded-2xl px-3 py-4 h-16 flex items-center justify-center shadow-sm">
                        <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            <span className="font-feather-bold font-bold text-xl text-yellow-600">
                                {entry.bonus}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="bg-white rounded-2xl px-3 py-4 h-16 flex items-center justify-center shadow-sm">
                        <span
                            className="font-feather-bold font-bold text-xl"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            {entry.teamScore}
                        </span>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="bg-white rounded-2xl px-4 py-4 h-16 flex items-center justify-center shadow-sm">
                        <span className="font-feather-bold font-bold text-red-500 text-2xl">
                            {entry.totalPoints}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tablet Layout - Large screens */}
            <div className="hidden lg:grid xl:hidden lg:grid-cols-9 lg:gap-3">
                <div className="col-span-1">
                    <div className="bg-white rounded-xl px-2 py-3 h-14 flex items-center justify-center shadow-sm">
                        <span
                            className="font-bold text-base"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            {entry.rank}
                        </span>
                    </div>
                </div>
                <div className="col-span-2 min-w-0">
                    <div className="bg-white rounded-xl px-3 py-3 h-14 flex items-center gap-2 shadow-sm">
                        <RankChangeIndicator
                            currentRank={entry.rank}
                            previousRank={simulatedPreviousRank}
                        />
                        <span
                            className="font-semibold text-base truncate"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            {entry.fullName}
                        </span>
                    </div>
                </div>
                <div className="col-span-1">
                    <div
                        className="rounded-xl px-2 py-3 h-14 flex items-center justify-center text-white font-bold text-base"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        {entry.group}
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="bg-white rounded-xl px-2 py-3 h-14 flex items-center justify-center shadow-sm">
                        <span
                            className="font-bold text-base"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            {entry.round1Score}
                        </span>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="bg-white rounded-xl px-2 py-3 h-14 flex items-center justify-center shadow-sm">
                        <span
                            className="font-bold text-base"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            {entry.round2Score}
                        </span>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="bg-white rounded-xl px-2 py-3 h-14 flex items-center justify-center shadow-sm">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="font-bold text-sm text-yellow-600 ml-1">
                            {entry.bonus}
                        </span>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="bg-white rounded-xl px-2 py-3 h-14 flex items-center justify-center shadow-sm">
                        <span
                            className="font-bold text-base"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            {entry.teamScore}
                        </span>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="bg-white rounded-xl px-2 py-3 h-14 flex items-center justify-center shadow-sm">
                        <span className="font-bold text-red-500 text-base">
                            {entry.totalPoints}
                        </span>
                    </div>
                </div>
            </div>

            {/* Small Tablet Layout - Medium screens */}
            <div className="hidden md:grid lg:hidden md:grid-cols-6 md:gap-2">
                <div className="col-span-1">
                    <div className="bg-white rounded-lg px-2 py-2 h-12 flex items-center justify-center shadow-sm">
                        <span
                            className="font-bold text-sm"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            {entry.rank}
                        </span>
                    </div>
                </div>
                <div className="col-span-2 min-w-0">
                    <div className="bg-white rounded-lg px-3 py-2 h-12 flex items-center gap-2 shadow-sm">
                        <RankChangeIndicator
                            currentRank={entry.rank}
                            previousRank={simulatedPreviousRank}
                        />
                        <span
                            className="font-semibold text-sm truncate"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            {entry.fullName}
                        </span>
                    </div>
                </div>
                <div className="col-span-1">
                    <div
                        className="rounded-lg px-2 py-2 h-12 flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        {entry.group}
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="bg-white rounded-lg px-2 py-2 h-12 flex items-center justify-center shadow-sm">
                        <div className="text-center">
                            <div className="text-xs text-gray-500">R1+R2+G</div>
                            <div
                                className="font-bold text-xs"
                                style={{ color: COLORS.SECONDARY }}
                            >
                                {entry.round1Score +
                                    entry.round2Score +
                                    entry.bonus}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="bg-white rounded-lg px-2 py-2 h-12 flex items-center justify-center shadow-sm">
                        <span className="font-bold text-red-500 text-sm">
                            {entry.totalPoints}
                        </span>
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden bg-white rounded-xl p-3 sm:p-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center min-w-0 flex-1">
                        <div
                            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 text-white flex-shrink-0"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            <span className="font-bold text-white text-base sm:text-lg">
                                {entry.rank}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <RankChangeIndicator
                                    currentRank={entry.rank}
                                    previousRank={simulatedPreviousRank}
                                />
                                <div
                                    className="font-bold text-base sm:text-lg truncate"
                                    style={{ color: COLORS.SECONDARY }}
                                >
                                    {entry.fullName}
                                </div>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">
                                Group {entry.group}
                            </div>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="font-bold text-red-500 text-xl sm:text-2xl">
                            {entry.totalPoints}
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                            Total
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                        <div className="text-xs font-semibold text-blue-700 mb-1">
                            Round 1
                        </div>
                        <div className="font-bold text-base text-blue-600">
                            {entry.round1Score}
                        </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2 text-center">
                        <div className="text-xs font-semibold text-green-700 mb-1">
                            Round 2
                        </div>
                        <div className="font-bold text-base text-green-600">
                            {entry.round2Score}
                        </div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-2 text-center">
                        <div className="flex items-center justify-center mb-1">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            <span className="text-xs font-semibold text-yellow-700">
                                Game
                            </span>
                        </div>
                        <div className="font-bold text-base text-yellow-600">
                            {entry.bonus}
                        </div>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-2 text-center">
                        <div className="text-xs font-semibold text-indigo-700 mb-1">
                            Team
                        </div>
                        <div className="font-bold text-base text-indigo-600">
                            {entry.teamScore}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
