import { COLORS } from '@/lib/constants';

export function GroupLeaderboardHeader() {
    return (
        <>
            {/* Desktop Header - Extra Large screens */}
            <div className="hidden xl:grid xl:grid-cols-12 xl:gap-4 mb-4 sm:mb-6">
                <div className="col-span-1">
                    <div
                        className="rounded-2xl px-3 py-3 text-center text-white font-feather-bold font-bold text-lg"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        RANK
                    </div>
                </div>
                <div className="col-span-2">
                    <div
                        className="rounded-2xl px-4 py-3 text-center text-white font-feather-bold font-bold text-lg"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        GROUP
                    </div>
                </div>
                <div className="col-span-2">
                    <div
                        className="rounded-2xl px-4 py-3 text-center text-white font-feather-bold font-bold text-lg"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        MEMBERS
                    </div>
                </div>
                <div className="col-span-2">
                    <div
                        className="rounded-2xl px-4 py-3 text-center text-white font-feather-bold font-bold text-lg"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        AVG SCORE
                    </div>
                </div>
                <div className="col-span-3">
                    <div
                        className="rounded-2xl px-4 py-3 text-center text-white font-feather-bold font-bold text-lg"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        TOTAL SCORE
                    </div>
                </div>
                <div className="col-span-2">
                    <div
                        className="rounded-2xl px-4 py-3 text-center text-white font-feather-bold font-bold text-lg"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        ACTIONS
                    </div>
                </div>
            </div>

            {/* Tablet Header - Large screens */}
            <div className="hidden lg:grid xl:hidden lg:grid-cols-12 lg:gap-3 mb-4 sm:mb-6">
                <div className="col-span-1">
                    <div
                        className="rounded-xl px-2 py-2 text-center text-white font-feather-bold font-bold text-base"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        RANK
                    </div>
                </div>
                <div className="col-span-2">
                    <div
                        className="rounded-xl px-3 py-2 text-center text-white font-feather-bold font-bold text-base"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        GROUP
                    </div>
                </div>
                <div className="col-span-2">
                    <div
                        className="rounded-xl px-3 py-2 text-center text-white font-feather-bold font-bold text-base"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        MEMBERS
                    </div>
                </div>
                <div className="col-span-2">
                    <div
                        className="rounded-xl px-3 py-2 text-center text-white font-feather-bold font-bold text-base"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        AVG
                    </div>
                </div>
                <div className="col-span-3">
                    <div
                        className="rounded-xl px-3 py-2 text-center text-white font-feather-bold font-bold text-base"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        TOTAL SCORE
                    </div>
                </div>
                <div className="col-span-2">
                    <div
                        className="rounded-xl px-3 py-2 text-center text-white font-feather-bold font-bold text-base"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                        ACTIONS
                    </div>
                </div>
            </div>

            {/* Mobile Header - Hidden on mobile as we use card layout */}
            <div className="lg:hidden mb-4 sm:mb-6">
                <div
                    className="rounded-2xl px-4 py-3 text-center text-white font-feather-bold font-bold text-xl sm:text-2xl"
                    style={{ backgroundColor: COLORS.PRIMARY }}
                >
                    GROUP RANKINGS
                </div>
            </div>
        </>
    );
}
