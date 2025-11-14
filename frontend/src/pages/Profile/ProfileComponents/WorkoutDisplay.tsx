import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";


export default function WorkoutDisplay() {
    type DayState = "future" | "worked" | "rest" | "current";

    interface Day {
        state: DayState;
        isCurrent?: boolean;
    }

    const weekData: Day[][] = [ //todo:get from somewhere
        [
            { state: "worked" },
            { state: "worked" },
            { state: "rest" },
            { state: "rest" },
            { state: "rest" },
            { state: "worked" },
            { state: "rest" },
        ],
        [
            { state: "worked" },
            { state: "worked" },
            { state: "rest" },
            { state: "rest" },
            { state: "rest" },
            { state: "worked" },
            { state: "rest" },
        ],
        [
            { state: "rest" },
            { state: "rest" },
            { state: "rest" },
            { state: "rest" },
            { state: "rest", isCurrent: true },
            { state: "future" },
            { state: "future" },
        ],
    ];

    function DaySquare({ day }: {day: Day }) {
        return (
            <div
                className={cn(
                    "size-8 rounded-xl border transition-all flex items-center justify-center",
                    day.state === "worked" && "bg-[var(--color-primary-pressed)]",
                    day.state === "rest" && "bg-[var(--color-primary-hover)]",
                    day.state === "future" && "bg-[var(--color-background)]",
                )}
            >
                {day.isCurrent && <div className="size-4 rounded-full border border-[var(--color-grey-background)]" />}
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
                        {row.map((day, cIndex) => (
                            <DaySquare key={cIndex} day={day} />
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