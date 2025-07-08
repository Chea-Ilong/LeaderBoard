'use client';

import { useState } from 'react';
import { ChevronLeft, Users } from 'lucide-react';
import { COLORS } from '@/lib/constants';
import type { GroupEntry, LeaderboardEntry } from '@/types/leaderboard';
import Image from 'next/image';

interface GroupDetailViewProps {
    group: GroupEntry;
    onBack: () => void;
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
                    width={20}
                    height={20}
                />
            </div>
        );
    }

    return (
        <span
            className="font-feather-bold font-bold text-lg"
            style={{ color: COLORS.SECONDARY }}
        >
            {rank}
        </span>
    );
}

function ParticipantRow({
    participant,
    rank,
}: {
    participant: LeaderboardEntry;
    rank: number;
}) {
    return (
        <>
            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 mb-4">
                <div className="col-span-1">
                    <div className="bg-white rounded-xl px-3 py-3 h-14 flex items-center justify-center shadow-sm">
                        <RankDisplay rank={rank} />
                    </div>
                </div>
                <div className="col-span-4 min-w-0">
                    <div className="bg-white rounded-xl px-4 py-3 h-14 flex items-center shadow-sm">
                        <span
                            className="font-feather-bold font-semibold text-lg truncate"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            {participant.fullName}
                        </span>
                    </div>
                </div>
                <div className="col-span-5">
                    <div className="bg-white rounded-xl px-3 py-3 h-14 flex items-center shadow-sm">
                        <div className="grid grid-cols-6 gap-2 w-full">
                            {participant.scores?.map((score, scoreIndex) => (
                                <div key={scoreIndex} className="text-center">
                                    <span
                                        className="font-feather-bold font-bold text-base"
                                        style={{ color: COLORS.SECONDARY }}
                                    >
                                        {score}
                                    </span>
                                </div>
                            )) || (
                                <div className="col-span-6 text-center">
                                    <span className="text-gray-500 text-sm">
                                        No question scores available
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="bg-white rounded-xl px-4 py-3 h-14 flex items-center justify-center shadow-sm">
                        <span className="font-feather-bold font-bold text-red-500 text-xl">
                            {participant.totalPoints}
                        </span>
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden bg-white rounded-xl p-4 shadow-lg mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center min-w-0 flex-1">
                        <div
                            className="flex items-center justify-center w-10 h-10 rounded-full mr-3 text-white flex-shrink-0"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            {getMedalIcon(rank) ? (
                                <Image
                                    src={getMedalIcon(rank)!}
                                    alt={`${rank} place medal`}
                                    width={16}
                                    height={16}
                                />
                            ) : (
                                <span className="font-feather-bold font-bold text-white text-sm">
                                    {rank}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div
                                className="font-feather-bold font-bold text-lg truncate"
                                style={{ color: COLORS.SECONDARY }}
                            >
                                {participant.fullName}
                            </div>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="font-feather-bold font-bold text-red-500 text-xl">
                            {participant.totalPoints}
                        </div>
                    </div>
                </div>

                {/* Question Scores */}
                {participant.scores && participant.scores.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div
                            className="font-feather-bold text-sm font-bold mb-2 text-center"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            Question Scores
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {participant.scores.map((score, scoreIndex) => (
                                <div
                                    key={scoreIndex}
                                    className="text-center bg-white rounded-md py-1"
                                >
                                    <div
                                        className="font-feather-bold font-bold text-sm"
                                        style={{ color: COLORS.SECONDARY }}
                                    >
                                        {score}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export function GroupDetailView({ group, onBack }: GroupDetailViewProps) {
    // Sort participants by total points (highest to lowest)
    const sortedParticipants = [...group.members].sort(
        (a, b) => (b.totalPoints || 0) - (a.totalPoints || 0)
    );

    return (
        <div className="w-full mx-auto p-4 sm:p-6 lg:p-8">
            <div
                className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 overflow-hidden"
                style={{ backgroundColor: COLORS.SECONDARY }}
            >
                {/* Header with Back Button */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={onBack}
                        className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200 mr-4"
                    >
                        <ChevronLeft
                            className="w-5 h-5 mr-2"
                            style={{ color: COLORS.SECONDARY }}
                        />
                        <span
                            className="font-feather-bold font-medium"
                            style={{ color: COLORS.SECONDARY }}
                        >
                            Back to Groups
                        </span>
                    </button>

                    <div className="flex items-center">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white mr-4"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-feather-bold font-bold text-white">
                                Group {group.groupId}
                            </h1>
                            <p className="text-gray-300 font-feather-bold">
                                {group.memberCount} Members • Total Score:{' '}
                                {group.totalScore} • Avg: {group.averageScore}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Desktop Header */}
                <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 mb-6">
                    <div className="col-span-1">
                        <div
                            className="rounded-xl px-3 py-2 text-center text-white font-feather-bold font-bold text-base"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            RANK
                        </div>
                    </div>
                    <div className="col-span-4">
                        <div
                            className="rounded-xl px-4 py-2 text-center text-white font-feather-bold font-bold text-base"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            PARTICIPANT NAME
                        </div>
                    </div>
                    <div className="col-span-5">
                        <div
                            className="rounded-xl px-3 py-2 text-center text-white font-feather-bold font-bold text-base"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            QUESTION SCORES
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div
                            className="rounded-xl px-4 py-2 text-center text-white font-feather-bold font-bold text-base"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            TOTAL
                        </div>
                    </div>
                </div>

                {/* Mobile Header */}
                <div className="lg:hidden mb-6">
                    <div
                        className="rounded-xl px-4 py-3 text-center text-white font-feather-bold font-bold text-lg"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        GROUP {group.groupId} PARTICIPANTS
                    </div>
                </div>

                {/* Participants List */}
                <div className="space-y-4">
                    {sortedParticipants.map((participant, index) => (
                        <ParticipantRow
                            key={participant.id}
                            participant={participant}
                            rank={index + 1}
                        />
                    ))}
                </div>

                {/* Summary Stats */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                        <div
                            className="font-feather-bold font-bold text-2xl"
                            style={{ color: COLORS.PRIMARY }}
                        >
                            {group.memberCount}
                        </div>
                        <div className="font-feather-bold text-sm text-gray-600">
                            Total Members
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                        <div className="font-feather-bold font-bold text-2xl text-green-600">
                            {Math.max(
                                ...sortedParticipants.map(
                                    (p) => p.totalPoints || 0
                                )
                            )}
                        </div>
                        <div className="font-feather-bold text-sm text-gray-600">
                            Highest Score
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                        <div className="font-feather-bold font-bold text-2xl text-blue-600">
                            {group.averageScore}
                        </div>
                        <div className="font-feather-bold text-sm text-gray-600">
                            Average Score
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                        <div className="font-feather-bold font-bold text-2xl text-red-600">
                            {group.totalScore}
                        </div>
                        <div className="font-feather-bold text-sm text-gray-600">
                            Total Score
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
