import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/backButton.tsx";
import {Calendar, CalendarDayButton} from "@/components/ui/calendar.tsx";
import {Card, CardContent, CardFooter} from "@/components/card.tsx";
import { profileService, type WorkoutHistoryEntry, ApiError } from "@/lib/api";
import { format } from 'date-fns';

export default function CalendarPage(){
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [workouts, setWorkouts] = useState<WorkoutHistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        const loadWorkouts = async () => {
            try {
                setError(null);
                setIsLoading(true);
                const data = await profileService.getWorkoutHistory();
                if (!active) return;
                setWorkouts(data.workouts);
            } catch (err) {
                if (!active) return;
                if (err instanceof ApiError) {
                    setError(err.message);
                } else {
                    setError("cannot load history workouts");
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        loadWorkouts();

        return () => {
            active = false;
        };
    }, []);

    const isSameDay = (a: Date, b: Date) => {
        if (!a || !b) return false;
        const dateA = new Date(a);
        const dateB = new Date(b);
        dateA.setHours(0, 0, 0, 0);
        dateB.setHours(0, 0, 0, 0);
        return dateA.getTime() === dateB.getTime();
    };

    const workoutDates = useMemo(() => {
        return workouts.map(w => {
            const date = new Date(w.from);
            date.setHours(0, 0, 0, 0);
            return date;
        });
    }, [workouts]);

    const selectedDateWorkouts = useMemo(() => {
        if (!date) return [];
        const normalizedSelectedDate = new Date(date);
        normalizedSelectedDate.setHours(0, 0, 0, 0);

        return workouts.filter(w => {
            const workoutDate = new Date(w.from);
            workoutDate.setHours(0, 0, 0, 0);
            return isSameDay(workoutDate, normalizedSelectedDate);
        });
    }, [date, workouts, isSameDay]);

    // const createNewWorkout=() => alert('Tried to make new workout');

    return(
        <div>
            <header className="px-6 pt-11 pb-4">
                <div className="flex items-center justify-between">
                    <BackButton/>
                </div>
            </header>
            <Card className="max-w-[90vw] w-fit py-4 mx-auto hover:scale-none">
                <CardContent className="px-4">
                    <Calendar mode="single" defaultMonth={date} selected={date} onSelect={setDate}
                              className="rounded-lg border shadow-sm [--cell-size:theme(spacing.8)] sm:[--cell-size:theme(spacing.10)] md:[--cell-size:theme(spacing.12)]"
                              components={{
                            DayButton: ({ children, modifiers, day, ...props }) => {
                                const dayDate = day.date;
                                const isWorkoutPlanned = workoutDates.some(workoutDate => isSameDay(workoutDate, dayDate));
                                return (
                                    <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                                        {children}
                                        {!modifiers.outside && isWorkoutPlanned && (
                                            <div className="h-2 w-2 rounded-full bg-[var(--color-primary)] absolute bottom-1 left-1/2 -translate-x-1/2"/>
                                        )}
                                    </CalendarDayButton>
                                )
                            },
                        }}
                    />
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">
                    {error && (
                        <p className="text-sm text-red-500 w-full">{error}</p>
                    )}
                    {isLoading ? (
                        <p className="text-sm text-muted-foreground">加载中...</p>
                    ) : (
                        <div className="flex w-full flex-col gap-2">
                            {selectedDateWorkouts.length > 0 ? (
                                selectedDateWorkouts.map((event) => (
                                    <div
                                        key={event.id || event.title}
                                        className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
                                    >
                                        <div className="font-medium">{event.title}</div>
                                        {event.to && (
                                            <div className="text-xs text-muted-foreground">
                                                {format(new Date(event.from), 'HH:mm')} - {format(new Date(event.to), 'HH:mm')}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No workouts planned for this day.</p>
                            )}
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}