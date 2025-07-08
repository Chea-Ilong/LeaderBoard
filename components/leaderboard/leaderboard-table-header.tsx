import { COLORS, LEADERBOARD_CONFIG } from '@/lib/constants';

export function LeaderboardTableHeader() {
    const questions = Array.from(
        { length: LEADERBOARD_CONFIG.QUESTIONS_COUNT },
        (_, i) => i + 1
    );

    return (
        <>
            {/* Desktop Header - Large screens */}
            <div className="hidden xl:block mb-6 lg:mb-8">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-1">
                        <div
                            className="rounded-2xl px-3 py-4 text-center h-16 flex items-center justify-center text-white font-feather-bold font-bold text-lg"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            RANK
                        </div>
                    </div>
                    <div className="col-span-3">
                        <div
                            className="rounded-2xl px-4 py-4 text-center h-16 flex items-center justify-center text-white font-feather-bold font-bold text-lg"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            NAME
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div
                            className="rounded-2xl px-3 py-4 text-center h-16 flex items-center justify-center text-white font-feather-bold font-bold text-lg"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            GROUP
                        </div>
                    </div>
                    <div className="col-span-5">
                        <div className="bg-white rounded-2xl px-2 py-1 h-16 flex flex-col justify-center overflow-hidden">
                            <div
                                className="font-feather-bold font-bold text-lg text-center mb-1"
                                style={{ color: COLORS.SECONDARY }}
                            >
                                QUESTIONS
                            </div>
                            <div
                                className="rounded-lg overflow-hidden"
                                style={{ backgroundColor: COLORS.PRIMARY }}
                            >
                                <div className="grid grid-cols-6 h-6">
                                    {questions.map((num) => (
                                        <div
                                            key={num}
                                            className="flex items-center justify-center text-white font-feather-bold font-bold text-sm border-r border-white/20 last:border-r-0"
                                        >
                                            {num}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div
                            className="rounded-2xl px-4 py-4 text-center h-16 flex items-center justify-center text-white font-feather-bold font-bold text-lg leading-tight"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            TOTAL
                        </div>
                    </div>
                </div>
            </div>

            {/* Tablet Header - Medium screens */}
            <div className="hidden lg:block xl:hidden mb-6">
                <div className="grid grid-cols-10 gap-3">
                    <div className="col-span-1">
                        <div
                            className="rounded-xl px-2 py-3 text-center h-14 flex items-center justify-center text-white font-feather-bold font-bold text-sm"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            RANK
                        </div>
                    </div>
                    <div className="col-span-3">
                        <div
                            className="rounded-xl px-3 py-3 text-center h-14 flex items-center justify-center text-white font-feather-bold font-bold text-sm"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            NAME
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div
                            className="rounded-xl px-2 py-3 text-center h-14 flex items-center justify-center text-white font-feather-bold font-bold text-sm"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            GROUP
                        </div>
                    </div>
                    <div className="col-span-4">
                        <div className="bg-white rounded-xl px-3 py-2 h-14 flex flex-col justify-center overflow-hidden">
                            <div
                                className="font-feather-bold font-bold text-sm text-center mb-1"
                                style={{ color: COLORS.SECONDARY }}
                            >
                                QUESTIONS
                            </div>
                            <div
                                className="rounded-md overflow-hidden"
                                style={{ backgroundColor: COLORS.PRIMARY }}
                            >
                                <div className="grid grid-cols-6 h-5">
                                    {questions.map((num) => (
                                        <div
                                            key={num}
                                            className="flex items-center justify-center text-white font-feather-bold font-bold text-xs border-r border-white/20 last:border-r-0"
                                        >
                                            {num}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div
                            className="rounded-xl px-2 py-3 text-center h-14 flex items-center justify-center text-white font-feather-bold font-bold text-sm leading-tight"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            TOTAL
                        </div>
                    </div>
                </div>
            </div>

            {/* Small Tablet Header - Small to medium screens */}
            <div className="hidden md:block lg:hidden mb-4">
                <div className="grid grid-cols-8 gap-2">
                    <div className="col-span-1">
                        <div
                            className="rounded-lg px-2 py-2 text-center h-12 flex items-center justify-center text-white font-feather-bold font-bold text-xs"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            #
                        </div>
                    </div>
                    <div className="col-span-3">
                        <div
                            className="rounded-lg px-3 py-2 text-center h-12 flex items-center justify-center text-white font-feather-bold font-bold text-xs"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            NAME
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div
                            className="rounded-lg px-2 py-2 text-center h-12 flex items-center justify-center text-white font-feather-bold font-bold text-xs"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            GRP
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div
                            className="rounded-lg px-2 py-2 text-center h-12 flex items-center justify-center text-white font-feather-bold font-bold text-xs"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            Q'S
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div
                            className="rounded-lg px-2 py-2 text-center h-12 flex items-center justify-center text-white font-feather-bold font-bold text-xs"
                            style={{ backgroundColor: COLORS.PRIMARY }}
                        >
                            TOTAL
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
