import {cn} from "@/lib/utils";
import type { ProfileWorkoutDay } from "@/lib/api";

type WorkoutDisplayProps = {
    weeks?: ProfileWorkoutDay[][];
    isLoading?: boolean;
};

export default function WorkoutDisplay({ weeks, isLoading }: WorkoutDisplayProps) {
    // Debug: Log received data
    console.log('[WorkoutDisplay] Received weeks data:', weeks);
    console.log('[WorkoutDisplay] Weeks length:', weeks?.length);
    
    // Use the data directly from the API, no need for local type conversion
    const weekData: ProfileWorkoutDay[][] = weeks && weeks.length > 0
        ? weeks
        : [
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

    function DaySquare({ day }: {day: ProfileWorkoutDay}) {
        // Debug: Log day data for worked days
        if (day.state === "worked") {
            console.log('[WorkoutDisplay] Rendering worked day:', day);
        }
        
        return (
            <div
                className={cn(
                    "size-8 rounded-2xl transition-all flex items-center border-0 justify-center",
                    day.state === "worked" && "bg-primary-pressed",
                    day.state === "rest" && "bg-primary-hover",
                    day.state === "future" && "bg-background",
                )}
            >
                {day.isCurrent && <div className="size-4 rounded-full border border-background" />}
            </div>
        );
    }

    if (isLoading) {
        return (
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
        );
    }

    return (
        <div className="space-y-4">
            {/* Labels */}
            <div className="grid grid-cols-7 text-xs gap-2 font-semibold text-[var(--color-text)] mb-1">
                {["M", "T", "W", "T", "F", "S", "S"].map(d => (
                    <div key={d} className="text-left p-2">{d}</div>
                ))}
            </div>

            {/* Grid */}
            <div className="space-y-2">
                {weekData.map((row, rIndex) => (
                    <div key={rIndex} className="grid grid-cols-7 gap-2">
                        {row.map((day) => (
                            <DaySquare key={day.date} day={day} />
                        ))}
                    </div>
                ))}
            </div>

            {/* Legend */}
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