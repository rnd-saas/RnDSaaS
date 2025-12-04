import {MoodOptions} from "@/utils/MoodOptions.tsx";
import {CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from "recharts";
import {useState, useEffect} from "react";
import {progressService} from "@/lib/api";

export default function Moods(){
    const moodEmojis: Record<number, string> = {
        [MoodOptions.anxious]: "😰",
        [MoodOptions.insecure]: "😟",
        [MoodOptions.nervous]: "😐",
        [MoodOptions.fine]: "🙂",
        [MoodOptions.comfortable]: "😄",
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
            const moodData = response.moods.map((d) => ({
                x: new Date(d.date).getTime(),
                y: d.mood,
            }));
            setData(moodData);
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

    const minDate = data.length > 0 ? new Date(Math.min(...data.map(d => d.x))) : new Date();
    const maxDate = data.length > 0 ? new Date(Math.max(...data.map(d => d.x))) : new Date();
    const dayTicks = [];
    const current = new Date(minDate);
    current.setHours(0, 0, 0, 0);
    while (current <= maxDate) {
        dayTicks.push(current.getTime());
        current.setDate(current.getDate() + 1);
    }

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
                        domain={["dataMin", "dataMax"]}
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