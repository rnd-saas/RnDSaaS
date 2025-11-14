import BackButton from "@/components/backButton.tsx";
import {Calendar, CalendarDayButton} from "@/components/ui/calendar.tsx";
import {useState} from "react";
import {Card, CardContent, CardFooter} from "@/components/card.tsx";
import {PlusIcon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

export default function CalendarPage(){
    const [date, setDate] = useState<Date | undefined>(new Date())
    const workouts = [
        {
            title: "Simple legs",
            from: "2025-11-02T09:00:00",
            to: "2025-11-02T10:00:00",
        },
        {
            title: "Intermediate core",
            from: "2025-11-12T11:30:00",
            to: "2025-11-12T12:30:00",
        },
        {
            title: "Simple arms",
            from: "2025-11-15T14:00:00",
            to: "2025-11-15T15:00:00",
        },
    ]

    const workoutDates = () => {
        return workouts.map(workout => new Date(workout.from));
    };

    const selectedDateWorkouts = ()=> {
        if (!date) return [];
        return workouts.filter(workout => {
            const workoutDate = new Date(workout.from);
            return date==workoutDate;
        });
    };

    return(
        <div>
            <BackButton/>
            <Card className="w-fit py-4">
                <CardContent className="px-4">
                    <Calendar
                        mode="single"
                        defaultMonth={date}
                        selected={date}
                        onSelect={setDate}
                        className="rounded-lg border shadow-sm [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
                        components={{
                            DayButton: ({ children, modifiers, day, ...props }) => {
                                const date = day.date;
                                const isWorkoutPlanned = workoutDates().includes(date);
                                return (
                                    <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                                        {children}
                                        {!modifiers.outside && isWorkoutPlanned && (
                                            <div className="h-2 w-2 rounded bg-[var(--color-primary)]"/>
                                        )}
                                    </CalendarDayButton>
                                )
                            },
                        }}
                    />
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">
                    <div className="flex w-full items-center justify-between px-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-6"
                            title="Add Event"
                        >
                            <PlusIcon />
                            <span className="sr-only">Add Event</span>
                        </Button>
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        {selectedDateWorkouts.length > 0 ? (
                            selectedDateWorkouts().map((event) => (
                                <div
                                    key={event.title}
                                    className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
                                >
                                    <div className="font-medium">{event.title}</div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No workouts planned for this day.</p>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}