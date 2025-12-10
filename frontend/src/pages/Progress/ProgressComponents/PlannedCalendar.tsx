import { useMemo, useState, useEffect } from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { useNextPlannedWorkout } from "@/api/workouts";
import { profileService } from "@/lib/api";
import { Card, CardContent, CardFooter } from "@/components/card";

function toKey(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
}

export default function PlannedCalendar() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [completedDates, setCompletedDates] = useState<Set<string>>(new Set());
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(true);

    // Get planned workouts for the next 60 days (to cover a full calendar month)
    // Using the same data fetching method as "Upcoming Schedule"
    const { upcomingWorkouts, isLoading: isLoadingPlanned } = useNextPlannedWorkout(new Date(), 60);

    // Fetch completed workouts from profile API
    useEffect(() => {
        let mounted = true;
        profileService.getProfile()
            .then((profile) => {
                if (!mounted) return;
                const worked = new Set<string>();
                (profile.workoutGrid ?? []).flat().forEach((day) => {
                    if (day.state === "worked") {
                        const key = toKey(new Date(day.date));
                        worked.add(key);
                    }
                });
                setCompletedDates(worked);
            })
            .catch((err) => {
                console.error('Failed to load completed workouts:', err);
            })
            .finally(() => {
                if (mounted) {
                    setIsLoadingCompleted(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, []);

    // Extract planned dates from upcomingWorkouts (same logic as Upcoming Schedule)
    const plannedDates = useMemo(() => {
        const planned = new Set<string>();
        upcomingWorkouts?.forEach(({ date, workout }) => {
            if (workout?.workoutId) {
                const key = toKey(date);
                planned.add(key);
            }
        });
        return planned;
    }, [upcomingWorkouts]);

    const isLoading = isLoadingPlanned || isLoadingCompleted;

    // Check if today is completed or planned
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = toKey(today);
    const isTodayCompleted = completedDates.has(todayKey);
    const isTodayPlanned = plannedDates.has(todayKey);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center space-y-4">
                <Card className="w-fit py-4 mx-auto hover:scale-none">
                    <CardContent className="px-4">
                        <div className="h-64 w-64 rounded-lg border bg-muted animate-pulse" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <Card className="w-fit py-4 mx-auto hover:scale-none">
                <CardContent className="px-4">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        defaultMonth={selectedDate}
                        className="rounded-lg border shadow-sm [--cell-size:theme(spacing.10)] sm:[--cell-size:theme(spacing.12)]"
                        components={{
                            DayButton: ({ children, modifiers, day, ...props }) => {
                                const dayDate = day.date;
                                const key = toKey(dayDate);
                                const isWorked = completedDates.has(key);
                                const isPlanned = plannedDates.has(key);
                                const isCurrent = key === todayKey;

                                return (
                                    <CalendarDayButton
                                        day={day}
                                        modifiers={modifiers}
                                        className="relative"
                                        {...props}
                                    >
                                        {children}
                                        {!modifiers.outside && (
                                            <>
                                                {isWorked && (
                                                    <div className="h-2 w-2 rounded-full bg-[var(--color-primary-pressed)] absolute bottom-1 left-1/2 -translate-x-1/2" />
                                                )}
                                                {!isWorked && isPlanned && (
                                                    <div className="h-2 w-2 rounded-full bg-[var(--color-primary-hover)] absolute bottom-1 left-1/2 -translate-x-1/2" />
                                                )}
                                                {isCurrent && (
                                                    <div className="size-4 rounded-full border border-background absolute inset-0 m-auto" />
                                                )}
                                            </>
                                        )}
                                    </CalendarDayButton>
                                );
                            },
                        }}
                    />
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-3 border-t px-4 !pt-4">
                    <div className="flex items-center gap-4 text-sm text-[var(--color-text)]">
                        <div className="flex items-center gap-2">
                            <div className="size-4 rounded-md bg-[var(--color-primary-pressed)]" />
                            Completed
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="size-4 rounded-md bg-[var(--color-primary-hover)]" />
                            Planned / Upcoming
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

