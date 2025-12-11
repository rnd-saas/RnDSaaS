import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {useState, useEffect} from "react";
import {progressService} from "@/lib/api";

export default function Workouts(){
    const [data, setData] = useState<Array<{time: number; duration: number}>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWorkouts();
    }, []);

    const loadWorkouts = async () => {
        try {
            setLoading(true);
            const response = await progressService.getWeekWorkouts();
            
            // Create a map of date -> duration for quick lookup
            const workoutMap = new Map<number, number>();
            response.workouts.forEach((d) => {
                const date = new Date(d.date);
                date.setHours(0, 0, 0, 0);
                workoutMap.set(date.getTime(), d.length);
            });
            
            // Calculate start of week (Monday)
            const today = new Date();
            const dayOfWeek = today.getDay();
            const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - daysToMonday);
            startOfWeek.setHours(0, 0, 0, 0);
            
            // Fill all 7 days of the week with data (0 for days without workouts)
            const weekData: Array<{time: number; duration: number}> = [];
            for (let i = 0; i < 7; i++) {
                const currentDate = new Date(startOfWeek);
                currentDate.setDate(startOfWeek.getDate() + i);
                currentDate.setHours(0, 0, 0, 0);
                const time = currentDate.getTime();
                weekData.push({
                    time,
                    duration: workoutMap.get(time) || 0
                });
            }
            
            setData(weekData);
        } catch (error) {
            console.error('Failed to load workouts:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="h-[25vh] w-full flex items-center justify-center">Loading...</div>;
    }

    if (data.length === 0) {
        return <div className="h-[25vh] w-full flex items-center justify-center text-muted-foreground">No workout data available</div>;
    }

    const minDate = data.length > 0 ? new Date(Math.min(...data.map(d => d.time))) : new Date();
    const maxDate = data.length > 0 ? new Date(Math.max(...data.map(d => d.time))) : new Date();
    const dayTicks: number[] = [];
    const current = new Date(minDate);
    current.setHours(0, 0, 0, 0);
    while (current <= maxDate) {
        dayTicks.push(current.getTime());
        current.setDate(current.getDate() + 1);
    }

    return(
        <div className="h-[25vh] w-full">
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <XAxis
                        dataKey="time"
                        name="Day"
                        ticks={dayTicks}
                        tickFormatter={(ts: number) => new Date(ts).toLocaleDateString(undefined, { weekday: "short" })}
                        type="number"
                        domain={["dataMin", "dataMax"]}
                    />
                    <YAxis
                        dataKey="duration"
                        name="Length"
                        domain={[0, 'dataMax+10']}
                    />
                    <Tooltip
                        labelFormatter={(ts: number) => new Date(ts).toLocaleDateString()}
                    />
                    <Bar dataKey="duration" barSize={15}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}