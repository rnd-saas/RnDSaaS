import { cn } from "@/lib/utils.ts";
import type { ProfileWorkoutDay } from "@/lib/api";

type WorkoutDisplayProps = {
    weeks?: ProfileWorkoutDay[][];
    isLoading?: boolean;
};

const FALLBACK_WEEKS: ProfileWorkoutDay[][] = [
    [
        { date: "2024-01-01", state: "worked", isCurrent: false },
        { date: "2024-01-02", state: "worked", isCurrent: false },
        { date: "2024-01-03", state: "rest", isCurrent: false },
        { date: "2024-01-04", state: "rest", isCurrent: false },
        { date: "2024-01-05", state: "rest", isCurrent: false },
        { date: "2024-01-06", state: "worked", isCurrent: false },
        { date: "2024-01-07", state: "rest", isCurrent: false },
    ],
    [
        { date: "2024-01-08", state: "worked", isCurrent: false },
        { date: "2024-01-09", state: "worked", isCurrent: false },
        { date: "2024-01-10", state: "rest", isCurrent: false },
        { date: "2024-01-11", state: "rest", isCurrent: false },
        { date: "2024-01-12", state: "rest", isCurrent: false },
        { date: "2024-01-13", state: "worked", isCurrent: false },
        { date: "2024-01-14", state: "rest", isCurrent: false },
    ],
    [
        { date: "2024-01-15", state: "rest", isCurrent: false },
        { date: "2024-01-16", state: "rest", isCurrent: false },
        { date: "2024-01-17", state: "rest", isCurrent: false },
        { date: "2024-01-18", state: "rest", isCurrent: false },
        { date: "2024-01-19", state: "rest", isCurrent: true },
        { date: "2024-01-20", state: "future", isCurrent: false },
        { date: "2024-01-21", state: "future", isCurrent: false },
    ],
];

export default function WorkoutDisplay({ weeks, isLoading }: WorkoutDisplayProps) {
    const displayWeeks = weeks && weeks.length > 0 ? weeks : FALLBACK_WEEKS;

    return (
        <div className="space-y-4">
            {isLoading && (!weeks || weeks.length === 0) ? (
                <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, rowIndex) => (
                        <div key={rowIndex} className="grid grid-cols-7 gap-2">
                            {Array.from({ length: 7 }).map((__, colIndex) => (
                                <div
                                    key={colIndex}
                                    className="size-8 rounded-xl border bg-muted animate-pulse"
                                />
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-7 text-xs gap-2 font-semibold text-[var(--color-text)] mb-1">
                        {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
                            <div key={d} className="text-left p-2">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        {displayWeeks.map((row, rIndex) => (
                            <div key={rIndex} className="grid grid-cols-7 gap-2">
                                {row.map((day) => (
                                    <DaySquare key={day.date} day={day} />
                                ))}
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div className="flex items-center gap-4 text-sm text-[var(--color-text)]">
                <div className="flex items-center gap-2">
                    <div className="size-4 rounded-md bg-[var(--color-primary-pressed)]" />
                    Worked out
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-4 rounded-md bg-[var(--color-primary-hover)]" />
                    Rest day
                </div>
            </div>
        </div>
    );
}

function DaySquare({ day }: { day: ProfileWorkoutDay }) {
    return (
        <div
            className={cn(
                "size-8 rounded-xl border transition-all flex items-center justify-center",
                day.state === "worked" && "bg-[var(--color-primary-pressed)]",
                day.state === "rest" && "bg-[var(--color-primary-hover)]",
                day.state === "future" && "bg-[var(--color-background)]"
            )}
        >
            {day.isCurrent && (
                <div className="size-4 rounded-full border border-[var(--color-grey-background)]" />
            )}
        </div>
    );
}
