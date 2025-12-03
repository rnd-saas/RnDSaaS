import {MoodOptions} from "@/utils/MoodOptions.tsx";
import {CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from "recharts";

export default function Moods(){
    const moodEmojis: Record<number, string> = {
        [MoodOptions.anxious]: "😰",
        [MoodOptions.insecure]: "😟",
        [MoodOptions.nervous]: "😐",
        [MoodOptions.fine]: "🙂",
        [MoodOptions.comfortable]: "😄",
    };
    const latestMoods = [
        {date: "2025-11-02T09:00:00", mood: MoodOptions.insecure},
        {date: "2025-11-02T11:00:00", mood: MoodOptions.fine},
        {date: "2025-11-04T15:00:00", mood: MoodOptions.anxious},
        {date: "2025-11-05T16:00:00", mood: MoodOptions.comfortable},
    ];
    const data = latestMoods.map((d) => ({
        x: new Date(d.date).getTime(),
        y: d.mood,
    }));

    const minDate = new Date(Math.min(...data.map(d => d.x)));
    const maxDate = new Date(Math.max(...data.map(d => d.x)));
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