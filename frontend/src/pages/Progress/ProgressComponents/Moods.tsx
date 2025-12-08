import {MoodOptions} from "@/utils/MoodOptions";
import {CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from "recharts";
import {useState, useEffect} from "react";
import {progressService} from "@/lib/api";

export default function Moods(){
    const moodEmojis: Record<number, string> = {
        [MoodOptions.anxious]: "😣",
        [MoodOptions.insecure]: "😬",
        [MoodOptions.nervous]: "🙂",
        [MoodOptions.fine]: "😌",
        [MoodOptions.comfortable]: "🤩",
    };
    const [data, setData] = useState<Array<{x: number; y: number}>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMoods();
    }, []);

    const loadMoods = async () => {
        try {
            setLoading(true);
            const response = await progressService.getWeekMoods();
            
            // Create a map of date -> mood for quick lookup
            const moodMap = new Map<number, number>();
            response.moods.forEach((d) => {
                const date = new Date(d.date);
                date.setHours(0, 0, 0, 0);
                moodMap.set(date.getTime(), d.mood);
            });
            
            // Calculate start of week (Monday)
            const today = new Date();
            const dayOfWeek = today.getDay();
            const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - daysToMonday);
            startOfWeek.setHours(0, 0, 0, 0);
            
            // Fill all 7 days of the week with data (only include days with mood data)
            const weekData: Array<{x: number; y: number}> = [];
            for (let i = 0; i < 7; i++) {
                const currentDate = new Date(startOfWeek);
                currentDate.setDate(startOfWeek.getDate() + i);
                currentDate.setHours(0, 0, 0, 0);
                const time = currentDate.getTime();
                
                // Only include days that have mood data
                const mood = moodMap.get(time);
                if (mood !== undefined) {
                    weekData.push({
                        x: time,
                        y: mood
                    });
                }
            }
            
            setData(weekData);
        } catch (error) {
            console.error('Failed to load moods:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="h-[25vh] w-full flex items-center justify-center">Loading...</div>;
    }

    if (data.length === 0) {
        return <div className="h-[25vh] w-full flex items-center justify-center text-gray-500">No mood data available</div>;
    }

    // Calculate start of week (Monday) for consistent X-axis ticks
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Generate ticks for all 7 days of the week
    const dayTicks: number[] = [];
    const current = new Date(startOfWeek);
    current.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
        dayTicks.push(current.getTime());
        current.setDate(current.getDate() + 1);
    }
    
    const minDate = startOfWeek;
    const maxDate = new Date(startOfWeek);
    maxDate.setDate(startOfWeek.getDate() + 6);

    return(
        <div className="h-[25vh] w-full">
            <ResponsiveContainer>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis
                        dataKey="x"
                        name="Day"
                        ticks={dayTicks}
                        tickFormatter={(ts: number) => new Date(ts).toLocaleDateString(undefined, { weekday: "short" })}
                        type="number"
                        domain={[minDate.getTime(), maxDate.getTime()]}
                    />
                    <YAxis
                        dataKey="y"
                        name="Mood"
                        domain={[0, 4]}
                        tickFormatter={(val: number) => moodEmojis[val]}
                    />
                    <Scatter name="Mood" data={data} />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    )
}